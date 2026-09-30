/**
 * leadService.js
 * 
 * Resilient lead capture engine:
 * - Packages quiz responses, contact details (Full Name, Phone, Email),
 *   Meta CAPI user matching data, attribution parameters, and device context.
 * - Dispatches payload to an automation webhook (n8n, Zapier, Make, Airtable API).
 * - Implements resilient failure recovery: if the webhook fails, is unreachable, or CORS fails,
 *   the lead is safely queued in localStorage ('offline_leads_vault') with retry capabilities.
 */

import { generateEventId, getOrConstructFbc, getOrConstructFbp, sha256 } from './analytics';
import { extractTrackingParams } from './urlParams';

const STORAGE_KEY_CONFIG = 'funnel_webhook_endpoint';
const STORAGE_KEY_VAULT = 'offline_leads_vault';
const STORAGE_KEY_HISTORY = 'funnel_submission_history';

/**
 * Get current configured webhook URL
 */
export function getWebhookUrl() {
  if (typeof window === 'undefined') return '';
  const stored = localStorage.getItem(STORAGE_KEY_CONFIG);
  if (stored) return stored;
  return import.meta.env.VITE_LEAD_WEBHOOK_URL || '';
}

/**
 * Set custom webhook URL
 */
export function setWebhookUrl(url) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_CONFIG, url.trim());
}

/**
 * Normalize phone number: keeps digits only
 */
export function normalizePhoneNumber(rawPhone) {
  if (!rawPhone) return '';
  const digits = rawPhone.replace(/\D/g, '');
  // Default to US +1 if 10 digits
  if (digits.length === 10) {
    return '1' + digits;
  }
  return digits;
}

/**
 * Split full name into first and last name components
 */
export function parseName(fullName) {
  const parts = (fullName || '').trim().split(/\s+/);
  const firstName = parts[0] || '';
  const lastName = parts.slice(1).join(' ') || '';
  return { firstName, lastName };
}

/**
 * Format and prepare lead payload for n8n / Airtable / Meta CAPI
 */
export async function prepareLeadPayload({ fullName, phone, email, answers, durationSeconds = 0 }) {
  const tracking = extractTrackingParams();
  const eventId = generateEventId();
  
  const { firstName, lastName } = parseName(fullName);
  const normalizedPhone = normalizePhoneNumber(phone);

  // Meta CAPI matching hashes (SHA-256)
  const hashedEmail = await sha256(email);
  const hashedPhone = await sha256(normalizedPhone);
  const hashedFirstName = await sha256(firstName);
  const hashedLastName = await sha256(lastName);

  const fbc = getOrConstructFbc(tracking.fbclid);
  const fbp = getOrConstructFbp();

  const payload = {
    // Unique Identifiers
    lead_id: 'lead_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8),
    meta_event_id: eventId, // Deduplication key for Meta Pixel & CAPI
    created_at: new Date().toISOString(),
    submission_duration_seconds: durationSeconds,

    // Lead Contact Info (Full Name, Phone, Email)
    lead: {
      full_name: fullName.trim(),
      first_name: firstName,
      last_name: lastName,
      phone: phone.trim(),
      normalized_phone: normalizedPhone,
      email: email.trim().toLowerCase(),
      hashed_email: hashedEmail,
      hashed_phone: hashedPhone,
      hashed_first_name: hashedFirstName,
      hashed_last_name: hashedLastName
    },

    // Funnel Responses (Mapped directly for Airtable columns)
    qualification_answers: { ...answers },

    // Attribution & Campaign Data
    attribution: {
      utm_source: tracking.utm_source,
      utm_medium: tracking.utm_medium,
      utm_campaign: tracking.utm_campaign,
      utm_content: tracking.utm_content,
      utm_term: tracking.utm_term,
      referrer: tracking.referrer,
      landing_page_url: tracking.landing_page_url
    },

    // Meta Conversion API (CAPI) Spec Parameters with High Event Match Quality
    meta_capi_data: {
      event_name: 'Lead',
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId,
      action_source: 'website',
      event_source_url: tracking.landing_page_url,
      user_data: {
        em: [hashedEmail],
        ph: hashedPhone ? [hashedPhone] : undefined,
        fn: hashedFirstName ? [hashedFirstName] : undefined,
        ln: hashedLastName ? [hashedLastName] : undefined,
        fbc: fbc || undefined,
        fbp: fbp || undefined,
        client_user_agent: tracking.user_agent
      },
      custom_data: {
        currency: 'USD',
        value: 4152.00,
        lead_type: 'disability_pre_qualification',
        status: 'pre_qualified'
      }
    },

    // Device / Technical Metadata
    device_info: {
      user_agent: tracking.user_agent,
      language: tracking.language,
      screen_resolution: tracking.screen_resolution,
      timezone: tracking.timezone
    }
  };

  return payload;
}

/**
 * Save lead to local storage history
 */
function recordSubmissionHistory(leadPayload, status, error = null) {
  try {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY) || '[]');
    history.unshift({
      ...leadPayload,
      dispatch_status: status,
      dispatch_error: error,
      dispatched_at: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history.slice(0, 50)));
  } catch (err) {
    console.error('Failed to update submission history in storage:', err);
  }
}

/**
 * Add lead to resilient offline vault
 */
function queueInVault(leadPayload, errorReason) {
  try {
    const vault = JSON.parse(localStorage.getItem(STORAGE_KEY_VAULT) || '[]');
    vault.push({
      leadPayload,
      queued_at: new Date().toISOString(),
      retry_count: 0,
      last_error: errorReason
    });
    localStorage.setItem(STORAGE_KEY_VAULT, JSON.stringify(vault));
  } catch (err) {
    console.error('Failed to queue lead into vault:', err);
  }
}

/**
 * Dispatch lead to external automation layer (n8n / Airtable / webhook)
 */
export async function submitLead(payload) {
  const webhookUrl = getWebhookUrl();

  // If no webhook URL is configured, run in reliable simulation mode
  if (!webhookUrl) {
    console.info('[LeadService] No webhook URL configured. Simulated dispatch successful.');
    recordSubmissionHistory(payload, 'simulated_success');
    return {
      success: true,
      mode: 'simulation',
      message: 'Lead captured and saved to client vault. (Add an n8n webhook URL to dispatch live)',
      payload
    };
  }

  try {
    // Attempt webhook POST request
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Webhook returned status ${response.status}: ${response.statusText}`);
    }

    let responseData = {};
    try {
      responseData = await response.json();
    } catch {
      responseData = { status: 'received' };
    }

    recordSubmissionHistory(payload, 'live_webhook_delivered');

    return {
      success: true,
      mode: 'live',
      responseData,
      payload
    };
  } catch (error) {
    console.warn('[LeadService] Live webhook dispatch failed or blocked by CORS. Queuing to resilient vault...', error.message);
    
    // Save to resilient vault so the lead is NEVER lost
    queueInVault(payload, error.message);
    recordSubmissionHistory(payload, 'queued_in_vault', error.message);

    return {
      success: true,
      mode: 'vault_queued',
      warning: 'Webhook connection experienced an issue, but your lead was safely preserved in local resilience storage.',
      error: error.message,
      payload
    };
  }
}

/**
 * Retrieve all items in the offline lead vault
 */
export function getVaultedLeads() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_VAULT) || '[]');
  } catch {
    return [];
  }
}

/**
 * Retrieve all submission history
 */
export function getSubmissionHistory() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY) || '[]');
  } catch {
    return [];
  }
}

/**
 * Retry syncing vaulted leads
 */
export async function retryVaultedLeads() {
  const vault = getVaultedLeads();
  if (vault.length === 0) return { attempted: 0, succeeded: 0 };

  const webhookUrl = getWebhookUrl();
  if (!webhookUrl) return { error: 'No webhook URL configured to retry against.' };

  const remaining = [];
  let succeeded = 0;

  for (const item of vault) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item.leadPayload)
      });
      if (response.ok) {
        succeeded++;
      } else {
        remaining.push({ ...item, retry_count: item.retry_count + 1 });
      }
    } catch (err) {
      remaining.push({ ...item, retry_count: item.retry_count + 1, last_error: err.message });
    }
  }

  localStorage.setItem(STORAGE_KEY_VAULT, JSON.stringify(remaining));
  return { attempted: vault.length, succeeded, remaining: remaining.length };
}

/**
 * Clear local test data
 */
export function clearLeadData() {
  localStorage.removeItem(STORAGE_KEY_VAULT);
  localStorage.removeItem(STORAGE_KEY_HISTORY);
}
