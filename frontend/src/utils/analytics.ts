// Analytics utility for custom event tracking with dual GA4 + PostHog support

import posthog from 'posthog-js';

// Generate or retrieve session ID
let sessionId: string = '';
if (typeof window !== 'undefined') {
  sessionId = sessionStorage.getItem('portfolio_session_id') || '';
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('portfolio_session_id', sessionId);
  }
}

export const getSessionId = () => sessionId;

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
export const trackAIChat = (queryType: string, responseTime?: number, cached?: boolean) => {
  trackEvent('ai_chat_initiated', {
    query_type: queryType,
    response_time: responseTime,
    cached: cached,
    timestamp: new Date().toISOString()
  });
};

export const trackJobAnalysis = (matchScore?: number, processingTime?: number) => {
  trackEvent('job_analysis_started', {
    match_score: matchScore,
    processing_time: processingTime,
    timestamp: new Date().toISOString()
  });
};

export const trackSectionView = (sectionName: string) => {
  // Track as both page view and custom event for better analytics
  trackPageView(`/${sectionName}`, `${sectionName} - Prathamesh More Portfolio`);
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

export const trackContactAction = (method: 'email' | 'linkedin' | 'github') => {
  trackEvent('contact_initiated', {
    method,
    timestamp: new Date().toISOString()
  });
};

export const trackProjectInteraction = (projectName: string, action: 'view' | 'download' | 'demo' | 'github') => {
  trackEvent('project_interaction', {
    project: projectName,
    action,
    timestamp: new Date().toISOString()
  });
};

// New tracking functions for more detailed events
export const trackChatMessage = (messageLength: number, agentUsed?: string, isCached?: boolean) => {
  trackEvent('chat_message_sent', {
    message_length: messageLength,
    agent_used: agentUsed,
    is_cached: isCached,
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

// Send custom event to backend for database logging
export const sendAnalyticsToBackend = async (eventType: string, eventData: Record<string, any>) => {
  try {
    const backendUrl = import.meta.env.VITE_API_BASE_URL || '/api';
    await fetch(`${backendUrl}/api/v1/analytics/event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        event_type: eventType,
        event_data: eventData,
      }),
    });
  } catch (error) {
    // Silently fail - don't disrupt user experience
    console.error('Backend analytics error:', error);
  }
};
