/**
 * Server-side analytics for AI queries and agent usage.
 *
 * This file used to be a no-op stub, which is why PostHog reported zero
 * `$ai_generation` events for the lifetime of the project: the API had never sent
 * anything. "Nobody uses the AI feature" and "the AI feature is not instrumented"
 * look identical from the dashboard, so treat this as the source of truth for usage.
 *
 * Serverless notes: the client is configured to flush on every event, and
 * `shutdownAnalytics()` MUST be awaited before the handler returns. Vercel freezes
 * the process the moment the response is sent, so anything still buffered is lost.
 */

import { PostHog } from 'posthog-node';

const POSTHOG_DEFAULT_HOST = 'https://us.i.posthog.com';

let client: PostHog | null = null;
let clientUnavailable = false;

function getClient(): PostHog | null {
  if (clientUnavailable) return null;
  if (client) return client;

  const apiKey = process.env.POSTHOG_API_KEY;
  if (!apiKey) {
    // Warn exactly once. Analytics must never break the chat endpoint.
    console.warn('[Analytics] POSTHOG_API_KEY not set — server-side LLM events disabled');
    clientUnavailable = true;
    return null;
  }

  client = new PostHog(apiKey, {
    host: process.env.POSTHOG_HOST || POSTHOG_DEFAULT_HOST,
    flushAt: 1,
    flushInterval: 0,
  });
  return client;
}

/** Groups every event from one chat request under a single trace. */
export function newTraceId(): string {
  return `trace_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

export interface AIGenerationEvent {
  /** The client's portfolio_visitor_id, so server events stitch to client events. */
  distinctId?: string;
  traceId: string;
  model: string;
  provider: string;
  latencyMs: number;
  inputTokens?: number;
  outputTokens?: number;
  input?: string;
  output?: string;
  agent?: string;
  routingTier?: string;
  isError?: boolean;
  errorMessage?: string;
  /** True when the user was served a canned fallback instead of a real answer. */
  degraded?: boolean;
}

export async function trackAIGeneration(event: AIGenerationEvent): Promise<void> {
  const ph = getClient();
  if (!ph) return;

  // Without a client id the event is still worth having, but it must not spawn a
  // junk person profile for every anonymous request.
  const isAnonymous = !event.distinctId;
  const distinctId = event.distinctId || `anon_${event.traceId}`;

  try {
    ph.capture({
      distinctId,
      event: '$ai_generation',
      properties: {
        $ai_trace_id: event.traceId,
        $ai_model: event.model,
        $ai_provider: event.provider,
        // PostHog expects seconds, not milliseconds.
        $ai_latency: event.latencyMs / 1000,
        $ai_input: event.input ? [{ role: 'user', content: event.input }] : undefined,
        $ai_output_choices: event.output
          ? [{ role: 'assistant', content: event.output }]
          : undefined,
        $ai_input_tokens: event.inputTokens,
        $ai_output_tokens: event.outputTokens,
        $ai_is_error: event.isError ?? false,
        $ai_error: event.errorMessage,
        $ai_span_name: event.agent,
        // Own properties, not part of the $ai_* contract.
        agent_used: event.agent,
        routing_tier: event.routingTier,
        degraded: event.degraded ?? false,
        ...(isAnonymous ? { $process_person_profile: false } : {}),
      },
    });
  } catch (error) {
    console.error('[Analytics] Failed to capture $ai_generation:', error);
  }
}

export async function trackAgentUsage(
  agentType: string,
  distinctId?: string,
  traceId?: string
): Promise<void> {
  const ph = getClient();
  if (!ph) return;

  const isAnonymous = !distinctId;

  try {
    ph.capture({
      distinctId: distinctId || `anon_${traceId ?? newTraceId()}`,
      event: 'ai_agent_routed',
      properties: {
        agent_type: agentType,
        $ai_trace_id: traceId,
        ...(isAnonymous ? { $process_person_profile: false } : {}),
      },
    });
  } catch (error) {
    console.error('[Analytics] Failed to capture ai_agent_routed:', error);
  }
}

/**
 * Flush and close. Await this before the serverless handler returns, on both the
 * success and error paths, or buffered events die with the frozen process.
 */
export async function shutdownAnalytics(): Promise<void> {
  if (!client) return;
  try {
    await client.shutdown();
  } catch (error) {
    console.error('[Analytics] Shutdown failed:', error);
  } finally {
    client = null;
  }
}
