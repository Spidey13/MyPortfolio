import { useEffect, useRef, useState, type RefObject } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { PROJECTS, RAIL_IDENTITY } from "../data";
import { captureAttributes, type ActionLocation } from "../analytics/attributes";
import { ProjectRailThumbnail } from "./ProjectRailThumbnail";
import { getProjectMeta, sortHomeProjects } from "./projectMeta";
import { RailContactLinks, RailMasthead } from "./RailMasthead";

const HOME_PROJECTS = sortHomeProjects(PROJECTS);
const FOCUSABLE_SELECTOR = "a[href], button:not([disabled]), [tabindex]:not([tabindex=\"-1\"])";

interface ProjectLinksProps {
  onNavigate?: () => void;
  trackRef?: RefObject<HTMLElement | null>;
  location: ActionLocation;
}

interface ProjectIndexRailProps {
  desktopScrollerRef: RefObject<HTMLDivElement | null>;
  desktopTrackRef: RefObject<HTMLElement | null>;
}

function ProjectLinks({ onNavigate, trackRef, location: actionLocation }: ProjectLinksProps) {
  const location = useLocation();

  return (
    <nav className="project-index" aria-label="Projects" ref={trackRef}>
      {HOME_PROJECTS.map((project) => {
        const meta = getProjectMeta(project.id);
        const active = location.pathname === `/project/${project.id}`;

        return (
          <Link
            className={`project-index__link${active ? " is-active" : ""}`}
            to={`/project/${project.id}`}
            aria-current={active ? "page" : undefined}
            aria-label={`Open ${meta.shortName}: ${meta.railLabel}`}
            data-project-id={project.id}
            {...captureAttributes({
              action: "project_open",
              location: actionLocation,
              projectId: project.id,
              navigationSource: active ? "active_project" : "project_index",
            })}
            onClick={onNavigate}
            key={project.id}
          >
            <span className="project-index__thumb" aria-hidden="true">
              <ProjectRailThumbnail project={project} />
            </span>
            <span className="project-index__copy">
              <span className="project-index__title">{meta.shortName}</span>
              <span className="project-index__thesis">{meta.railLabel}</span>
            </span>
            <ArrowUpRight
              className="project-index__arrow"
              aria-hidden="true"
              focusable="false"
              size={16}
              strokeWidth={1.5}
            />
          </Link>
        );
      })}
    </nav>
  );
}

export default function ProjectIndexRail({
  desktopScrollerRef,
  desktopTrackRef,
}: ProjectIndexRailProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const projectsButtonRef = useRef<HTMLButtonElement>(null);
  const mobileDialogRef = useRef<HTMLDivElement>(null);
  const closingForNavigationRef = useRef(false);
  const profileName = RAIL_IDENTITY.nameLines.join(" ");
  const aboutActive = location.pathname === "/";

  useEffect(() => {
    if (!mobileOpen) return;

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const projectsButton = projectsButtonRef.current;
    const dialog = mobileDialogRef.current;
    const focusable = dialog ? Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)) : [];
    focusable[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMobileOpen(false);
        return;
      }

      if (event.key !== "Tab" || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      if (!closingForNavigationRef.current) projectsButton?.focus();
      closingForNavigationRef.current = false;
    };
  }, [mobileOpen]);

  const closeMobileIndex = () => setMobileOpen(false);
  const navigateFromMobileIndex = () => {
    closingForNavigationRef.current = true;
    setMobileOpen(false);
  };

  return (
    <>
      <div className="mobile-project-bar">
        <Link to="/" className="mobile-project-bar__name" {...captureAttributes({ action: "project_navigation", location: "mobile_navigation", navigationSource: "about" })}>{profileName}</Link>
        <button
          type="button"
          ref={projectsButtonRef}
          className="mobile-project-bar__projects"
          aria-expanded={mobileOpen}
          aria-controls="mobile-project-index"
          onClick={() => setMobileOpen((open) => !open)}
        >
          Projects
        </button>
        <Link to="/#contact" state={{ focusContact: true }} className="mobile-project-bar__contact" {...captureAttributes({ action: "project_navigation", location: "mobile_navigation", navigationSource: "contact" })}>
          Contact ↗
        </Link>
      </div>

      <aside className="project-rail" aria-label="Portfolio navigation">
        <RailMasthead projectCount={HOME_PROJECTS.length} />
        <div className="project-rail__viewport">
          <div className="project-rail__scroller" ref={desktopScrollerRef}>
            <ProjectLinks trackRef={desktopTrackRef} location="project_rail" />
          </div>
        </div>
      </aside>

      {mobileOpen ? (
        <div
          className="mobile-index-backdrop"
          role="presentation"
          onMouseDown={(event) => event.target === event.currentTarget && closeMobileIndex()}
        >
          <div
            className="mobile-index-dialog"
            id="mobile-project-index"
            ref={mobileDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-project-index-title"
          >
            <div className="mobile-index-dialog__header">
              <h2 id="mobile-project-index-title">Projects</h2>
              <button type="button" onClick={closeMobileIndex}>Close</button>
            </div>
            <div className="mobile-index-dialog__navigation">
              <Link
                className="mobile-index-dialog__about"
                to="/"
                aria-current={aboutActive ? "page" : undefined}
                onClick={closeMobileIndex}
                {...captureAttributes({ action: "project_navigation", location: "mobile_navigation", navigationSource: "about" })}
              >
                <span>About</span>
                <ArrowUpRight aria-hidden="true" focusable="false" size={15} strokeWidth={1.5} />
              </Link>
              <RailContactLinks className="mobile-index-dialog__contacts" location="mobile_navigation" />
            </div>
            <ProjectLinks onNavigate={navigateFromMobileIndex} location="mobile_navigation" />
          </div>
        </div>
      ) : null}
    </>
  );
}
