// Analytics utility for custom event tracking
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// Portfolio-specific tracking functions
export const trackAIChat = (queryType: string, responseTime?: number) => {
  trackEvent('ai_chat_initiated', {
    query_type: queryType,
    response_time: responseTime,
    timestamp: new Date().toISOString()
  });
};

export const trackJobAnalysis = (matchScore?: number) => {
  trackEvent('job_analysis_started', {
    match_score: matchScore,
    timestamp: new Date().toISOString()
  });
};

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

export const trackContactAction = (method: 'email' | 'linkedin' | 'github') => {
  trackEvent('contact_initiated', {
    method,
    timestamp: new Date().toISOString()
  });
};

export const trackProjectInteraction = (projectName: string, action: 'view' | 'download' | 'demo') => {
  trackEvent('project_interaction', {
    project: projectName,
    action,
    timestamp: new Date().toISOString()
  });
};
