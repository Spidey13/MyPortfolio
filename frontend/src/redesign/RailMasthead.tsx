import { ArrowUpRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { PROFILE, RAIL_IDENTITY } from "../data";
import { captureAttributes, type ActionLocation } from "../analytics/attributes";

function RailArrow() {
  return <ArrowUpRight aria-hidden="true" focusable="false" size={15} strokeWidth={1.5} />;
}

export function RailContactLinks({
  className = "",
  location = "identity_rail",
}: {
  className?: string;
  location?: ActionLocation;
}) {
  const linkedInUrl = PROFILE.links.find((link) => link.type === "linkedin")?.url;
  const resumeUrl = PROFILE.links.find((link) => link.type === "resume")?.url;

  return (
    <div className={`rail-contact-links${className ? ` ${className}` : ""}`}>
      <a href={`mailto:${PROFILE.email}`} {...captureAttributes({ action: "contact_email", location })}>
        <span>Email</span>
        <RailArrow />
      </a>
      {linkedInUrl ? (
        <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" {...captureAttributes({ action: "linkedin_open", location })}>
          <span>LinkedIn</span>
          <RailArrow />
        </a>
      ) : null}
      {resumeUrl ? (
        <a href={resumeUrl} target="_blank" rel="noopener noreferrer" {...captureAttributes({ action: "resume_open", location })}>
          <span>Résumé</span>
          <RailArrow />
        </a>
      ) : null}
    </div>
  );
}

export function RailMasthead({ projectCount }: { projectCount: number }) {
  const location = useLocation();
  const aboutActive = location.pathname === "/";

  return (
    <header className="rail-masthead">
      <div className="rail-masthead__utility">
        <span>{RAIL_IDENTITY.availability}</span>
        <Link to="/" aria-current={aboutActive ? "page" : undefined} {...captureAttributes({ action: "project_navigation", location: "identity_rail", navigationSource: "about" })}>
          <span>About</span>
          <RailArrow />
        </Link>
      </div>

      <div className="rail-masthead__identity">
        <div className="rail-masthead__name">
          <span>{RAIL_IDENTITY.nameLines[0]}</span>
          <span className="rail-masthead__surname-line">
            <span>{RAIL_IDENTITY.nameLines[1]}</span>
            <span className="rail-masthead__role">{RAIL_IDENTITY.role}</span>
          </span>
        </div>
      </div>

      <RailContactLinks />

      <div className="rail-masthead__projects-heading">
        <span>Selected projects</span>
        <span>{String(projectCount).padStart(2, "0")}</span>
      </div>
    </header>
  );
}
