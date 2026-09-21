import { usePostHog } from "@posthog/react";
import { useEffect, type RefObject } from "react";

const MINIMUM_VISIBLE_RATIO = 0.25;
const MINIMUM_READING_TIME_MS = 2_000;

function visibleRatio(element: Element, root: Element) {
  const elementRect = element.getBoundingClientRect();
  const rootRect = root.getBoundingClientRect();
  const visibleTop = Math.max(elementRect.top, rootRect.top);
  const visibleBottom = Math.min(elementRect.bottom, rootRect.bottom);
  const visibleHeight = Math.max(0, visibleBottom - visibleTop);

  return elementRect.height > 0 ? visibleHeight / elementRect.height : 0;
}

export function useSectionEngagement(
  rootRef: RefObject<HTMLElement | null>,
  routeKey: string,
) {
  const posthog = usePostHog();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;

    const elements = Array.from(
      root.querySelectorAll<HTMLElement>(
        "[data-analytics-section], article[data-project-document] > section",
      ),
    );
    const viewed = new Set<Element>();
    const timers = new Map<Element, number>();

    const cancel = (element: Element) => {
      const timer = timers.get(element);
      if (timer !== undefined) window.clearTimeout(timer);
      timers.delete(element);
    };

    const capture = (element: HTMLElement) => {
      if (
        viewed.has(element) ||
        document.visibilityState !== "visible" ||
        !posthog.__loaded
      ) return;
      viewed.add(element);
      cancel(element);

      const projectRoot = element.closest<HTMLElement>("[data-project-id]");
      const sectionId =
        element.dataset.sectionId ||
        element.getAttribute("aria-labelledby") ||
        element.id ||
        "unnamed_section";

      posthog.capture("portfolio section viewed", {
        document_type: element.dataset.documentType || "project",
        project_id: projectRoot?.dataset.projectId,
        section_id: sectionId,
        section_type: element.dataset.sectionType || "content",
        route_path: routeKey,
        minimum_visible_ratio: MINIMUM_VISIBLE_RATIO,
        minimum_reading_time_ms: MINIMUM_READING_TIME_MS,
      });
    };

    const schedule = (element: HTMLElement) => {
      if (viewed.has(element) || timers.has(element)) return;
      timers.set(
        element,
        window.setTimeout(() => {
          timers.delete(element);
          if (visibleRatio(element, root) >= MINIMUM_VISIBLE_RATIO) {
            capture(element);
          }
        }, MINIMUM_READING_TIME_MS),
      );
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;
          if (
            entry.isIntersecting &&
            entry.intersectionRatio >= MINIMUM_VISIBLE_RATIO
          ) {
            schedule(element);
          } else {
            cancel(element);
          }
        });
      },
      { root, threshold: [0, MINIMUM_VISIBLE_RATIO] },
    );

    elements.forEach((element) => observer.observe(element));

    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") {
        timers.forEach((_, element) => cancel(element));
        return;
      }

      elements.forEach((element) => {
        if (visibleRatio(element, root) >= MINIMUM_VISIBLE_RATIO) {
          schedule(element);
        }
      });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      observer.disconnect();
      timers.forEach((timer) => window.clearTimeout(timer));
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [posthog, rootRef, routeKey]);
}
