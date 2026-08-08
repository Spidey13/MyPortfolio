// Analytics utility for custom event tracking with dual GA4 + PostHog support

import posthog from 'posthog-js';

// Generate or retrieve persistent visitor ID
let sessionId: string = '';
if (typeof window !== 'undefined') {
  sessionId = localStorage.getItem('portfolio_visitor_id') || '';
  if (!sessionId) {
    sessionId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('portfolio_visitor_id', sessionId);
  }
}

export const getSessionId = () => sessionId;

// Generate hash for query anonymization (djb2 algorithm)
export const generateQueryHash = (query: string): string => {
  let hash = 5381;
  for (let i = 0; i < query.length; i++) {
    hash = ((hash << 5) + hash) + query.charCodeAt(i);
  }
  return Math.abs(hash).toString(36);
};

// Dual tracking: Send to both GA4 and PostHog
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  // Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
  
  // PostHog
  try {
    posthog.capture(eventName, {
      ...parameters,
      session_id: sessionId,
    });
  } catch (error) {
    console.error('PostHog tracking error:', error);
  }
};

// Page view tracking for SPA
export const trackPageView = (pagePath: string, pageTitle?: string) => {
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    const measurementId = import.meta.env.VITE_GA_ID || 'G-QNFSXQL1DX';
    window.gtag('config', measurementId, {
      page_path: pagePath,
      page_title: pageTitle || document.title
    });
  }
  
  // PostHog (automatically tracks pageviews if configured)
  try {
    posthog.capture('$pageview', {
      page_path: pagePath,
      page_title: pageTitle || document.title,
    });
  } catch (error) {
    console.error('PostHog pageview error:', error);
  }
};

// Portfolio-specific tracking functions with enhanced metadata

// NOTE: deliberately does NOT fire a $pageview. It used to emit one per section
// (page_path: "/contact", "/work", ...), which polluted real route pageviews with
// synthetic rows and inflated every traffic figure. Real pageviews come from App.tsx.
export const trackSectionView = (sectionName: string) => {
  trackEvent('section_viewed', {
    section: sectionName,
    timestamp: new Date().toISOString()
  });
};

export const trackBackendStatus = (status: 'offline' | 'warming' | 'ready', warmupTime?: number) => {
  trackEvent('backend_status_change', {
    status,
    warmup_time: warmupTime,
    timestamp: new Date().toISOString()
  });
};

export const trackFallbackResponse = (query: string) => {
  trackEvent('fallback_response_used', {
    query,
    timestamp: new Date().toISOString()
  });
};

// Single event per click. This previously fired 'contact_initiated' AND
// 'contact_link_clicked' for one click, double-counting every contact figure in history.
export const trackContactAction = (
  method: 'email' | 'linkedin' | 'github' | 'phone',
  source: string = 'contact_card'
) => {
  trackEvent('contact_link_clicked', {
    link_type: method,
    source,
    timestamp: new Date().toISOString()
  });
};

export type ProjectAction = 'view' | 'demo' | 'github' | 'case_study';

export const trackProjectInteraction = (projectName: string, action: ProjectAction) => {
  trackEvent('project_interaction', {
    project: projectName,
    action,
    timestamp: new Date().toISOString()
  });
};

// The contact card's "ask the AI assistant" nudge. Previously untracked, so the
// contact -> chat handoff was invisible.
export const trackAIChatNudge = () => {
  trackEvent('ai_chat_nudge_clicked', {
    source: 'contact_card',
    timestamp: new Date().toISOString()
  });
};

// Fired when the AI backend answered with a canned fallback because the LLM call
// failed. Without this a broken chat looks identical to a working one.
export const trackChatDegraded = (reason?: string) => {
  trackEvent('chat_degraded', {
    reason: reason ?? 'unknown',
    timestamp: new Date().toISOString()
  });
};

export const trackAnalysisExpanded = (section: string) => {
  trackEvent('analysis_section_expanded', {
    section,
    timestamp: new Date().toISOString()
  });
};

export const trackError = (errorType: string, errorMessage: string, context?: string) => {
  trackEvent('error_occurred', {
    error_type: errorType,
    error_message: errorMessage,
    context,
    timestamp: new Date().toISOString()
  });
  
  // Also send to PostHog as an exception
  try {
    posthog.capture('$exception', {
      error_type: errorType,
      error_message: errorMessage,
      context,
    });
  } catch (e) {
    console.error('Error tracking error:', e);
  }
};
