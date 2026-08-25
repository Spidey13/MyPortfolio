import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { PROJECTS } from "../data";
import { ProjectVisual } from "./ProjectVisual";
import { getProjectMeta, sortHomeProjects } from "./projectMeta";

const HOME_PROJECTS = sortHomeProjects(PROJECTS);
const FOCUSABLE_SELECTOR = "a[href], button:not([disabled]), [tabindex]:not([tabindex=\"-1\"])";

function ProjectLinks({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();
  const aboutActive = location.pathname === "/";

  return (
    <nav className="project-index" aria-label="Project index">
      <Link
        className={`project-index__link project-index__link--about${aboutActive ? " is-active" : ""}`}
        to="/"
        aria-current={aboutActive ? "page" : undefined}
        onClick={onNavigate}
      >
        <span className="project-index__about-label">About</span>
      </Link>

      {HOME_PROJECTS.map((project) => {
        const meta = getProjectMeta(project.id);
        const active = location.pathname === `/project/${project.id}`;

        return (
          <Link
            className={`project-index__link${active ? " is-active" : ""}`}
            to={`/project/${project.id}`}
            aria-current={active ? "page" : undefined}
            aria-label={`Open ${meta.shortName}: ${meta.home.thesis}`}
            onClick={onNavigate}
            key={project.id}
          >
            <span className="project-index__thumb" aria-hidden="true">
              <ProjectVisual project={project} active={false} />
            </span>
            <span className="project-index__copy">
              <span className="project-index__title">{meta.shortName}</span>
              <span className="project-index__thesis">{meta.home.thesis}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function ProjectIndexRail() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const projectsButtonRef = useRef<HTMLButtonElement>(null);
  const mobileDialogRef = useRef<HTMLDivElement>(null);
  const profileName = "Prathamesh More";

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
      projectsButton?.focus();
    };
  }, [mobileOpen]);

  const closeMobileIndex = () => setMobileOpen(false);

  return (
    <>
      <div className="mobile-project-bar">
        <Link to="/" className="mobile-project-bar__name">{profileName}</Link>
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
        <Link to="/#contact" state={{ focusContact: true }} className="mobile-project-bar__contact">
          Contact ↗
        </Link>
      </div>

      <aside className="project-rail" aria-label="Portfolio navigation">
        <div className="project-rail__scroller">
          <div className="identity-block">
            <Link to="/" className="identity-block__name">{profileName}</Link>
            <p>I turn ambiguous ideas into dependable AI systems people can actually use.</p>
          </div>
          <ProjectLinks />
        </div>
        <div className="contact-dock">
          <Link to="/#contact" state={{ focusContact: true }} aria-label="Contact Prathamesh More">
            Contact ↗
          </Link>
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
            <ProjectLinks onNavigate={closeMobileIndex} />
          </div>
        </div>
      ) : null}
    </>
  );
}
