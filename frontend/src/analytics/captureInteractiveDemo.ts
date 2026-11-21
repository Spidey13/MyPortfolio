import type { captureInteractiveDemo as Capture } from "./events";

export function captureInteractiveDemo(...args: Parameters<typeof Capture>) {
  const [posthog] = args;
  if (!posthog.__loaded) return;

  // A blocked analytics module must leave the demo usable.
  void import("./events").then(
    (events) => events.captureInteractiveDemo(...args),
    () => {},
  );
}
