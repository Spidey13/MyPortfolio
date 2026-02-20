/**
 * Analytics tracking for AI queries and agent usage.
 */

export interface TrackAIQueryParams {
  sessionId?: string;
  query: string;
  agent: string;
  responseTime: number;
  cached?: boolean;
  error?: string;
}

export async function trackAIQuery(params: TrackAIQueryParams): Promise<void> {
  // Stub: no-op; replace with real analytics (e.g. Vercel Analytics, PostHog).
  void params;
}

export async function trackAgentUsage(
  _agentType: string,
  _sessionId?: string
): Promise<void> {
  // Stub: no-op; replace with real usage tracking.
}
