/**
 * urlParams.js
 * 
 * Extracts UTM parameters, ad click IDs (fbclid, gclid), and referral metadata
 * from the browser window at runtime.
 */

export function extractTrackingParams() {
  if (typeof window === 'undefined') return {};

  const searchParams = new URLSearchParams(window.location.search);
  const params = {
    // Standard UTM parameters
    utm_source: searchParams.get('utm_source') || 'direct',
    utm_medium: searchParams.get('utm_medium') || 'organic',
    utm_campaign: searchParams.get('utm_campaign') || 'none',
    utm_content: searchParams.get('utm_content') || '',
    utm_term: searchParams.get('utm_term') || '',
    
    // Ad Platform Click IDs
    fbclid: searchParams.get('fbclid') || '',
    gclid: searchParams.get('gclid') || '',
    ttclid: searchParams.get('ttclid') || '', // TikTok
    msclkid: searchParams.get('msclkid') || '', // Bing/Microsoft

    // Page Context
    landing_page_url: window.location.href,
    referrer: document.referrer || 'direct',
    user_agent: navigator.userAgent,
    language: navigator.language,
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    captured_at: new Date().toISOString()
  };

  return params;
}
