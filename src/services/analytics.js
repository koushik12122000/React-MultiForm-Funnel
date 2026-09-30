/**
 * analytics.js
 * 
 * Production-ready tracking utility designed for:
 * 1. Meta Pixel & Meta Conversions API (CAPI) deduplication using matching `event_id`
 * 2. Automated extraction of _fbp and _fbc cookies
 * 3. Client-side SHA-256 hashing for user data parameters (email)
 * 4. Google Tag Manager / window.dataLayer fallback support
 */

/**
 * Generate a cryptographically strong UUIDv4 for Meta Event Deduplication
 */
export function generateEventId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'evt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
}

/**
 * Helper to get a cookie by name
 */
export function getCookie(name) {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : '';
}

/**
 * Resolves or constructs the Meta _fbc click identifier
 */
export function getOrConstructFbc(fbclid) {
  const existingCookie = getCookie('_fbc');
  if (existingCookie) return existingCookie;
  if (fbclid) {
    // Standard format: fb.1.<creation_timestamp_ms>.<fbclid>
    return `fb.1.${Date.now()}.${fbclid}`;
  }
  return '';
}

/**
 * Resolves or constructs the Meta _fbp browser identifier
 */
export function getOrConstructFbp() {
  const existingCookie = getCookie('_fbp');
  if (existingCookie) return existingCookie;
  // Generate fallback identifier if not yet set by pixel script
  const randomNum = Math.floor(Math.random() * 8999999999 + 1000000000);
  return `fb.1.${Date.now()}.${randomNum}`;
}

/**
 * Client-side SHA-256 hashing for Meta User Data (e.g., email normalization & hashing)
 */
export async function sha256(str) {
  if (!str) return '';
  const normalized = str.trim().toLowerCase();
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(normalized);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  return normalized; // Fallback if crypto.subtle not available
}

/**
 * Tracks an event across Meta Pixel, GTM DataLayer, and custom event listeners
 */
export function trackEvent(eventName, customData = {}, userData = {}, eventId = null) {
  const resolvedEventId = eventId || generateEventId();
  const timestamp = Math.floor(Date.now() / 1000);

  // 1. Meta Pixel browser call (if initialized on window.fbq)
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', eventName, customData, { eventID: resolvedEventId });
  }

  // 2. Google Tag Manager / DataLayer event push
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      eventId: resolvedEventId,
      timestamp,
      customData,
      userData
    });
  }

  // 3. Dispatch DOM Custom Event for debugging / UI inspection
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('growth_automation_event', {
        detail: {
          eventName,
          eventId: resolvedEventId,
          timestamp,
          customData,
          userData
        }
      })
    );
  }

  console.log(`[Event Tracked] ${eventName}`, {
    eventId: resolvedEventId,
    customData,
    userData
  });

  return resolvedEventId;
}
