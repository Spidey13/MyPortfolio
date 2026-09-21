import type { PostHog } from "posthog-js";

interface InteractiveDemoEvent {
  projectId: string;
  demoId: string;
  interaction: string;
  result?: string;
}

export function captureInteractiveDemo(
  posthog: PostHog,
  event: InteractiveDemoEvent,
) {
  if (!posthog.__loaded) return;

  posthog.capture("interactive demo used", {
    project_id: event.projectId,
    demo_id: event.demoId,
    interaction: event.interaction,
    result: event.result,
  });
}
