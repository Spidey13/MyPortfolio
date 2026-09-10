import { useEffect, type RefObject } from "react";

interface ProjectRailLayoutOptions {
  railTrackRef: RefObject<HTMLElement | null>;
  railViewportRef: RefObject<HTMLDivElement | null>;
}

const CARD_GAP = 8;
const CARD_MAX_HEIGHT = 104;
const CARD_MIN_HEIGHT = 72;
const CARD_TARGET_HEIGHT = 84;
const MAX_VISIBLE_CARDS = 7;
const MIN_VISIBLE_CARDS = 3;
const STACK_DEPTH_IN_PITCHES = 2.5;
const STACK_TRANSLATE_IN_PITCHES = 2;

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(Math.max(value, minimum), maximum);

function getAdaptiveLayout(viewportHeight: number) {
  let best = {
    cardHeight: CARD_MIN_HEIGHT,
    distance: Number.POSITIVE_INFINITY,
    visibleCount: MIN_VISIBLE_CARDS,
  };

  for (let count = MIN_VISIBLE_CARDS; count <= MAX_VISIBLE_CARDS; count += 1) {
    const cardHeight = (
      viewportHeight - CARD_GAP * (count - 1)
    ) / (count + 0.5);
    if (cardHeight < CARD_MIN_HEIGHT || cardHeight > CARD_MAX_HEIGHT) continue;

    const distance = Math.abs(cardHeight - CARD_TARGET_HEIGHT);
    if (distance < best.distance) best = { cardHeight, distance, visibleCount: count };
  }

  if (!Number.isFinite(best.distance)) {
    const visibleCount = clamp(
      Math.round((viewportHeight + CARD_GAP) / (CARD_TARGET_HEIGHT + CARD_GAP) - 0.5),
      MIN_VISIBLE_CARDS,
      MAX_VISIBLE_CARDS,
    );
    best = {
      cardHeight: clamp(
        (viewportHeight - CARD_GAP * (visibleCount - 1)) / (visibleCount + 0.5),
        CARD_MIN_HEIGHT,
        CARD_MAX_HEIGHT,
      ),
      distance: 0,
      visibleCount,
    };
  }

  return best;
}

export function useProjectRailLayout({
  railTrackRef,
  railViewportRef,
}: ProjectRailLayoutOptions) {
  useEffect(() => {
    const rail = railViewportRef.current;
    const track = railTrackRef.current;
    if (!rail || !track) return;

    const desktopQuery = window.matchMedia("(min-width: 960px)");
    let frame: number | null = null;
    let disposed = false;
    let projectLinks: HTMLElement[] = [];

    const clearCardTransform = (link: HTMLElement) => {
      link.style.removeProperty("opacity");
      link.style.removeProperty("pointer-events");
      link.style.removeProperty("transform");
      link.style.removeProperty("z-index");
      delete link.dataset.depthLayer;
    };

    const renderDeck = () => {
      frame = null;
      if (!rail.dataset.deckActive) return;

      const cardHeight = Number.parseFloat(
        track.style.getPropertyValue("--rail-card-height"),
      );
      const pitch = cardHeight + CARD_GAP;
      const stackStart = rail.clientHeight - cardHeight * 1.5;
      const stackRange = pitch * STACK_DEPTH_IN_PITCHES;

      projectLinks.forEach((link, index) => {
        const naturalTop = link.offsetTop - rail.scrollTop;
        const progress = clamp((naturalTop - stackStart) / stackRange, 0, 1);
        if (progress <= 0) {
          clearCardTransform(link);
          link.style.zIndex = String(projectLinks.length - index);
          return;
        }

        link.style.zIndex = String(projectLinks.length - index);
        const scale = 1 - progress * 0.5;
        const translateY = -pitch * STACK_TRANSLATE_IN_PITCHES * progress;
        const opacity = clamp((1 - progress) / 0.3, 0, 1);
        link.dataset.depthLayer = "true";
        link.style.transform = `translateY(${translateY}px) scale(${scale})`;
        link.style.opacity = String(opacity);
        link.style.pointerEvents = opacity < 0.01 ? "none" : "auto";
      });
    };

    const scheduleRender = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(renderDeck);
    };

    const measure = () => {
      frame = null;
      projectLinks = Array.from(track.querySelectorAll<HTMLElement>("[data-project-id]"));
      if (!desktopQuery.matches || projectLinks.length < 2) {
        projectLinks.forEach(clearCardTransform);
        track.style.removeProperty("--rail-card-gap");
        track.style.removeProperty("--rail-card-height");
        track.style.removeProperty("--rail-end-space");
        delete rail.dataset.deckActive;
        return;
      }

      const { cardHeight } = getAdaptiveLayout(rail.clientHeight);
      track.style.setProperty("--rail-card-gap", `${CARD_GAP}px`);
      track.style.setProperty("--rail-card-height", `${cardHeight}px`);
      track.style.setProperty("--rail-end-space", `${cardHeight * 0.5}px`);
      rail.dataset.deckActive = "true";
      renderDeck();
    };

    const scheduleMeasure = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    const resizeObserver = new ResizeObserver(scheduleMeasure);
    resizeObserver.observe(rail);
    desktopQuery.addEventListener("change", scheduleMeasure);
    rail.addEventListener("scroll", scheduleRender, { passive: true });

    if (document.fonts) {
      void document.fonts.ready.then(() => {
        if (!disposed) scheduleMeasure();
      });
    }
    scheduleMeasure();

    return () => {
      disposed = true;
      resizeObserver.disconnect();
      desktopQuery.removeEventListener("change", scheduleMeasure);
      rail.removeEventListener("scroll", scheduleRender);
      if (frame !== null) cancelAnimationFrame(frame);
      projectLinks.forEach(clearCardTransform);
      track.style.removeProperty("--rail-card-gap");
      track.style.removeProperty("--rail-card-height");
      track.style.removeProperty("--rail-end-space");
      delete rail.dataset.deckActive;
    };
  }, [railTrackRef, railViewportRef]);
}
