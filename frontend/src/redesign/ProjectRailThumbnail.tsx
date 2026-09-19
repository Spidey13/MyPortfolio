import type { ReactNode } from "react";
import type { Project } from "../data/projects";
import { getProjectMeta, type ArtifactKind } from "./projectMeta";
import "./rail-symbols.css";

// Small editorial marks: one shared canvas, bold silhouettes, two-color printing.
const SYMBOLS: Record<ArtifactKind, ReactNode> = {
  cache: <>
    <path d="M15 9h16v16H15z M36 9h16v16H36z M57 9h16v16H57z M15 30h16v16H15z M36 30h16v16H36z" />
    <path className="rail-symbol__accent" d="m61 29 18 7-7 18-18-7z" />
  </>,
  diagnostic: <>
    <path d="M25 11h8v15h28v18h-8V34H33v10h-8z" />
    <circle cx="29" cy="12" r="9" /><circle cx="29" cy="46" r="9" />
    <circle className="rail-symbol__accent" cx="57" cy="46" r="9" />
    <path className="rail-symbol__accent" fillRule="evenodd" d="m56 5 13 13-13 13-13-13z m0 8-5 5 5 5 5-5z" />
  </>,
  voice: <>
    <path d="m21 10 6 5-12 15 12 15-6 5L4 30z M67 10l17 20-17 20-6-5 12-15-12-15z" />
    <rect x="31" y="20" width="7" height="20" rx="3.5" />
    <rect className="rail-symbol__accent" x="41" y="9" width="7" height="42" rx="3.5" />
    <rect x="51" y="17" width="7" height="26" rx="3.5" />
  </>,
  approval: <>
    <path d="M9 10h29v40H9z" />
    <path className="rail-symbol__accent" d="m55 4 26 26-26 26-26-26z" />
    <path className="rail-symbol__ink-stroke" d="m44 30 8 8 15-17" />
  </>,
  research: <>
    <path className="rail-symbol__accent" d="m17 8 30-4 6 43-30 4z" />
    <path d="M32 12h31v43H32z" />
    <path className="rail-symbol__paper-stroke" d="M39 36h16 M39 43h10" />
    <circle className="rail-symbol__paper" cx="61" cy="19" r="12" />
    <circle cx="61" cy="19" r="6" />
  </>,
  race: <>
    <path className="rail-symbol__ink-stroke rail-symbol__lane" d="M14 54V32C14 12 34 4 51 12l26 13 M27 54V33c0-12 12-17 22-12l28 13" />
    <path className="rail-symbol__accent-stroke rail-symbol__lane" d="M40 54V34c0-4 4-6 8-4l29 13" />
  </>,
  wafer: <>
    <circle cx="44" cy="30" r="25" />
    <path className="rail-symbol__surface-stroke" d="M22 19h44 M19 30h50 M22 41h44 M32 8v44 M44 5v50 M56 8v44" />
    <path className="rail-symbol__surface" d="m38 3 6 9 6-9z" />
    <path className="rail-symbol__accent" d="m55 30 12 3-3 12-12-3z" />
  </>,
  memory: <>
    <path d="m44 26 33 16-33 16-33-16z" />
    <path className="rail-symbol__surface-stroke" d="m12 32 32 16 32-16" />
    <path className="rail-symbol__accent" d="m44 14 33 16-33 16-33-16z" />
    <path className="rail-symbol__paper" d="m44 2 33 16-33 16-33-16z" />
    <path d="m44 11 14 7-14 7-14-7z" />
  </>,
  evaluation: <>
    <path d="M15 10h42v9H15z M15 26h58v9H15z M15 42h33v9H15z" />
    <circle className="rail-symbol__accent" cx="59" cy="14.5" r="9" />
    <circle className="rail-symbol__paper" cx="39" cy="30.5" r="9" />
    <circle className="rail-symbol__accent" cx="50" cy="46.5" r="9" />
  </>,
  audio: <>
    <path d="M12 21h7v18h-7z M23 10h7v40h-7z M34 17h7v26h-7z" />
    <path className="rail-symbol__accent" d="M48 12h27v8H48z M48 26h19v8H48z M48 40h27v8H48z" />
  </>,
};

export function ProjectRailThumbnail({ project }: { project: Project }) {
  const kind = getProjectMeta(project.id).artifact;
  return (
    <svg
      className={`rail-symbol rail-symbol--${kind}`}
      viewBox="0 0 88 60"
      width="88"
      height="60"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {SYMBOLS[kind]}
    </svg>
  );
}
