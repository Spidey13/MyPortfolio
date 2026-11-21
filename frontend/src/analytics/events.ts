import type { PostHog } from "posthog-js";

interface InteractiveDemoEvent {
  projectId: string;
  demoId: string;
  interaction: string;
  result?: string;
  context?: Record<string, string | number>;
}

export function captureInteractiveDemo(
  posthog: PostHog,
  event: InteractiveDemoEvent,
) {
  if (!posthog.__loaded) return;

  posthog.capture("interactive demo used", {
    ...event.context,
    project_id: event.projectId,
    demo_id: event.demoId,
    interaction: event.interaction,
    result: event.result,
  });
}
