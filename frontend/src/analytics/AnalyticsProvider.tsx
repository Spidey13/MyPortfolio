import { PostHogErrorBoundary, PostHogProvider } from "@posthog/react";
import type { PostHogConfig } from "posthog-js";
import type { PropsWithChildren } from "react";

const projectToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN;
const analyticsEnabled =
  import.meta.env.PROD &&
  import.meta.env.VITE_POSTHOG_ENABLED !== "false" &&
  Boolean(projectToken);

const options: Partial<PostHogConfig> = {
  api_host: import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com",
  defaults: "2026-05-30",
  capture_pageview: "history_change",
  capture_pageleave: true,
  capture_dead_clicks: true,
  capture_exceptions: true,
  capture_heatmaps: true,
  capture_performance: true,
  person_profiles: "identified_only",
  disable_surveys: true,
  autocapture: {
    capture_copied_text: false,
    css_selector_ignorelist: [
      ".ph-no-capture",
      "[data-ph-no-capture]",
      "[data-sensitive]",
    ],
  },
  session_recording: {
    maskAllInputs: true,
    maskTextSelector: ".ph-mask, .sensitive, .password-input, [data-sensitive]",
  },
  tracing_headers:
    typeof window === "undefined" ? [] : [window.location.hostname],
  loaded: (posthog) => {
    posthog.register({
      analytics_schema_version: 2,
      app_environment:
        import.meta.env.VITE_APP_ENVIRONMENT || "production",
      site_version: import.meta.env.VITE_APP_VERSION || "unknown",
    });
  },
};

export function AnalyticsProvider({ children }: PropsWithChildren) {
  if (!analyticsEnabled || !projectToken) return children;

  return (
    <PostHogProvider apiKey={projectToken} options={options}>
      <PostHogErrorBoundary
        fallback={
          <main role="alert" className="rp-route-loading">
            Something went wrong. Refresh the page to try again.
          </main>
        }
        additionalProperties={{ app_surface: "portfolio" }}
      >
        {children}
      </PostHogErrorBoundary>
    </PostHogProvider>
  );
}
