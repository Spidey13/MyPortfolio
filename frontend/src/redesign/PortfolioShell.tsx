import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { PROJECTS } from "../data/projects";
import { useSectionEngagement } from "../analytics/useSectionEngagement";
import AboutDocument from "./AboutDocument";
import ProjectCaseStudy from "./ProjectCaseStudy";
import ProjectIndexRail from "./ProjectIndexRail";
import { useProjectRailLayout } from "./useProjectRailLayout";

const PROJECT_IDS = new Set(PROJECTS.map((project) => project.id));

interface RouteState {
  focusContact?: boolean;
}

export default function PortfolioShell() {
  const location = useLocation();
  const { id } = useParams();
  const documentPaneRef = useRef<HTMLElement>(null);
  const projectRailViewportRef = useRef<HTMLDivElement>(null);
  const projectRailTrackRef = useRef<HTMLElement>(null);
  const previousPathRef = useRef(location.pathname);
  const [entering, setEntering] = useState(false);
  const isProjectRoute = location.pathname.startsWith("/project/");
  const hasUnknownProject = isProjectRoute && (!id || !PROJECT_IDS.has(id));
  const routeState = location.state as RouteState | null;

  useEffect(() => {
    setEntering(true);
    const frame = requestAnimationFrame(() => setEntering(false));
    return () => cancelAnimationFrame(frame);
  }, [location.key]);

  useEffect(() => {
    const pane = documentPaneRef.current;
    if (!pane) return;

    const frame = requestAnimationFrame(() => {
      const isMobile = window.matchMedia("(max-width: 959px)").matches;
      const scrollToTop = () => {
        if (isMobile) {
          window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        } else {
          pane.scrollTo({ top: 0, left: 0, behavior: "auto" });
        }
      };

      if (location.hash) {
        const section = document.getElementById(location.hash.slice(1));
        if (section instanceof HTMLElement && pane.contains(section)) {
          const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          section.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start", inline: "nearest" });
          if (!isProjectRoute) section.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
        }
        return;
      }

      scrollToTop();

    });

    return () => cancelAnimationFrame(frame);
  }, [isProjectRoute, location.hash, location.key, routeState?.focusContact]);

  useEffect(() => {
    if (previousPathRef.current === location.pathname) return;
    previousPathRef.current = location.pathname;
    const frame = requestAnimationFrame(() => documentPaneRef.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, [location.pathname]);

  useProjectRailLayout({
    railTrackRef: projectRailTrackRef,
    railViewportRef: projectRailViewportRef,
  });

  useSectionEngagement(documentPaneRef, location.pathname);

  if (hasUnknownProject) return <Navigate to="/" replace />;

  const documentKey = isProjectRoute ? `project-${id}` : "about";

  return (
    <div className="portfolio-shell">
      <a className="portfolio-skip-link" href="#main-content">Skip to content</a>
      <ProjectIndexRail
        desktopScrollerRef={projectRailViewportRef}
        desktopTrackRef={projectRailTrackRef}
      />
      <main className="document-pane" id="main-content" ref={documentPaneRef} tabIndex={-1}>
        <div
          className={`document-pane__transition${entering ? " is-entering" : ""}`}
          data-project-id={isProjectRoute ? id : undefined}
          key={documentKey}
        >
          {isProjectRoute ? <ProjectCaseStudy /> : <AboutDocument />}
        </div>
      </main>
    </div>
  );
}
