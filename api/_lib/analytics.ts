import { randomUUID } from "node:crypto";
import { PostHog } from "posthog-node";

const DEFAULT_POSTHOG_HOST = "https://us.i.posthog.com";

let client: PostHog | null = null;
let warnedAboutMissingToken = false;

function getClient(): PostHog | null {
  if (client) return client;

  const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
  if (!projectToken) {
    if (!warnedAboutMissingToken) {
      console.warn(
        "[Analytics] POSTHOG_PROJECT_TOKEN is missing; server-side AI analytics are disabled.",
      );
      warnedAboutMissingToken = true;
    }
    return null;
  }

  client = new PostHog(projectToken, {
    host: process.env.POSTHOG_HOST || DEFAULT_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  });

  return client;
}

export function newTraceId(): string {
  return randomUUID();
}

export interface AIGenerationEvent {
  distinctId?: string;
  sessionId?: string;
  traceId: string;
  model: string;
  provider: string;
  latencyMs: number;
  inputTokens?: number;
  outputTokens?: number;
  inputLength?: number;
  outputLength?: number;
  agent?: string;
  routingTier?: string;
  isError?: boolean;
  errorMessage?: string;
  degraded?: boolean;
}

export function trackAIGeneration(event: AIGenerationEvent): void {
  const posthog = getClient();
  if (!posthog) return;

  try {
    posthog.capture({
      distinctId: event.distinctId || `anonymous-${event.traceId}`,
      event: "$ai_generation",
      properties: {
        $process_person_profile: false,
        $session_id: event.sessionId,
        $ai_trace_id: event.traceId,
        $ai_model: event.model,
        $ai_provider: event.provider,
        $ai_latency: event.latencyMs / 1_000,
        $ai_input_tokens: event.inputTokens,
        $ai_output_tokens: event.outputTokens,
        $ai_is_error: event.isError ?? false,
        $ai_error: event.errorMessage,
        $ai_span_name: event.agent,
        analytics_schema_version: 2,
        agent_used: event.agent,
        routing_tier: event.routingTier,
        degraded: event.degraded ?? false,
        input_length: event.inputLength,
        output_length: event.outputLength,
      },
    });
  } catch (error) {
    console.error("[Analytics] Failed to capture server event:", error);
  }
}

export async function shutdownAnalytics(): Promise<void> {
  if (!client) return;

  try {
    await client.shutdown();
  } catch (error) {
    console.error("[Analytics] Failed to flush server events:", error);
  } finally {
    client = null;
  }
}
