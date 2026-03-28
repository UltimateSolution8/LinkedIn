/**
 * Centralized GA4 Analytics Helper
 * 
 * All tracking calls go through this file.
 */

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-DGTN8BZW6W';

export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
}

export function setUserId(userId: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, { user_id: userId });
  }
}

// We no longer need trackPageView here since GA4 Enhanced Measurement handles React Router automatically!
