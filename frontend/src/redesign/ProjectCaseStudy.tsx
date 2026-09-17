import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { isProductPremiereId } from "../data/productPremieres";
import { PROJECTS } from "../data/projects";
import ProductPremiere from "./ProductPremiere";
import { ProjectVisual } from "./ProjectVisual";
import { getProjectMeta, getProjectNumber, sortProjects } from "./projectMeta";
import StratSimFieldNote from "./StratSimFieldNote";
import ResearchFieldNote from "./fieldnotes/ResearchFieldNote";
import WaferFieldNote from "./fieldnotes/WaferFieldNote";
import PromptFieldNote from "./fieldnotes/PromptFieldNote";
import AudioFieldNote from "./fieldnotes/AudioFieldNote";

const SCENES = [
  { id: "outcome", label: "Outcome" },
  { id: "how-it-works", label: "How it works" },
  { id: "key-decision", label: "Key decision" },
  { id: "evidence", label: "Evidence" },
] as const;

const firstSentence = (text: string) => {
  const match = text.match(/^.*?[.!?](?:\s|$)/);
  return match?.[0]?.trim() || text;
};

function TechnicalNotes({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="rp-technical-notes">
      <summary><span>Technical notes</span><strong>{title}</strong><i>+</i></summary>
      <div>{children}</div>
    </details>
  );
}

export default function ProjectCaseStudy() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const projects = useMemo(() => sortProjects(PROJECTS), []);
  const project = projects.find((candidate) => candidate.id === id);
  const [activeScene, setActiveScene] = useState("outcome");

  useEffect(() => {
    const scrollRoot = document.querySelector<HTMLElement>(".document-pane");
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveScene(visible.target.id);
      },
      { root: scrollRoot, rootMargin: "-25% 0px -55% 0px", threshold: [0.1, 0.35, 0.6] },
    );
    document.querySelectorAll<HTMLElement>("[data-case-scene]").forEach((scene) => observer.observe(scene));
    return () => observer.disconnect();
  }, [id]);

  if (!project) {
    return (
      <main className="rp-not-found">
        <span className="rp-kicker">404</span>
        <h1>Project not found.</h1>
        <Link to="/">Return to the work</Link>
      </main>
    );
  }

  const meta = getProjectMeta(project.id);
  const currentIndex = projects.findIndex((candidate) => candidate.id === project.id);
  const previous = projects[(currentIndex - 1 + projects.length) % projects.length];
  const next = projects[(currentIndex + 1) % projects.length];
  const goBack = () => navigate("/");

  if (isProductPremiereId(project.id)) {
    return (
      <ProductPremiere
        project={project}
        previous={previous}
        next={next}
      />
    );
  }

  if (project.id === "p3") {
    return <StratSimFieldNote project={project} previous={previous} next={next} />;
  }

  if (project.id === "p1") return <ResearchFieldNote project={project} previous={previous} next={next} />;
  if (project.id === "p4") return <WaferFieldNote project={project} previous={previous} next={next} />;
  if (project.id === "p5") return <PromptFieldNote project={project} previous={previous} next={next} />;
  if (project.id === "p7") return <AudioFieldNote project={project} previous={previous} next={next} />;

  return (
    <div className={`rp-case rp-case--${meta.tone}`}>
      <header className="project-document__header">
        <button type="button" onClick={goBack} className="rp-back-link">← Back to all work</button>
        <div className="project-document__identity">
          <span className="rp-kicker">{String(getProjectNumber(project)).padStart(2, "0")} / 10</span>
          <strong>{meta.shortName}</strong>
          <span>{meta.label}</span>
        </div>
        <nav className="project-document__chapters" aria-label="Case study chapters">
          {SCENES.map((scene, index) => (
            <a key={scene.id} href={`#${scene.id}`} aria-current={activeScene === scene.id ? "location" : undefined}>
              <span>{String(index + 1).padStart(2, "0")}</span>{scene.label}
            </a>
          ))}
        </nav>
        <div className="project-document__links">
          <a href={project.github_url} target="_blank" rel="noreferrer">Repository ↗</a>
          {project.deployed_url ? <a href={project.deployed_url} target="_blank" rel="noreferrer">{project.video ? "Demo" : "Live project"} ↗</a> : null}
        </div>
      </header>

      <div className="rp-case-main" id="case-content">
        <section className="rp-case-scene rp-outcome-scene" id="outcome" data-case-scene>
          <div className="rp-scene-heading">
            <span className="rp-kicker">OUTCOME · {meta.date}</span>
            <h1>{meta.shortName}</h1>
            <p>{meta.home.thesis}</p>
          </div>
          <ProjectVisual project={project} active={false} expanded />
          <div className="rp-outcome-frame">
            <div><span>FOR</span><strong>{firstSentence(project.star.situation)}</strong></div>
            <div><span>OWNED</span><strong>{firstSentence(project.star.task)}</strong></div>
            {project.metrics.slice(0, 2).map((metric) => <div key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong></div>)}
          </div>
          <TechnicalNotes title="Scope and result"><p>{project.star.situation}</p><p>{project.star.result}</p></TechnicalNotes>
        </section>

        <section className="rp-case-scene rp-system-scene" id="how-it-works" data-case-scene>
          <div className="rp-scene-heading"><span className="rp-kicker">01 · HOW IT WORKS</span><h2>The request moves through a system you can inspect.</h2><p>{firstSentence(project.star.architecture)}</p></div>
          <div className="rp-architecture-flow" aria-label={`${meta.shortName} architecture flow`}>
            {meta.architecture.map((step, index) => (
              <div key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong>{index < meta.architecture.length - 1 ? <i>→</i> : null}</div>
            ))}
          </div>
          <TechnicalNotes title="Problem context and data flow"><p>{project.star.situation}</p><p>{project.star.architecture}</p></TechnicalNotes>
        </section>

        <section className="rp-case-scene rp-decision-scene" id="key-decision" data-case-scene>
          <div className="rp-scene-heading"><span className="rp-kicker">02 · KEY DECISION</span><h2>{meta.decision.reason}</h2><p>{firstSentence(project.star.action)}</p></div>
          <div className="rp-decision-compare">
            <div className="is-rejected"><span>REJECTED</span><strong>{meta.decision.rejected}</strong><i>×</i></div>
            <div className="is-chosen"><span>CHOSEN</span><strong>{meta.decision.chosen}</strong><i>✓</i></div>
          </div>
          <div className="rp-trust-boundaries">
            {meta.trust.map((boundary, index) => <div key={boundary}><span>{String(index + 1).padStart(2, "0")}</span><p>{boundary}</p><i /></div>)}
          </div>
          <TechnicalNotes title="Implementation decision"><p>{project.star.action}</p></TechnicalNotes>
        </section>

        <section className="rp-case-scene rp-evidence-scene" id="evidence" data-case-scene>
          <div className="rp-scene-heading"><span className="rp-kicker">03 · EVIDENCE</span><h2>The proof keeps its scope attached.</h2><p>{firstSentence(project.star.result)}</p></div>
          <div className="rp-evaluation-board">
            {project.metrics.map((metric, index) => (
              <div key={metric.label} style={{ "--metric-height": `${14 + index * 13}%` } as CSSProperties}><span>{metric.label}</span><strong>{metric.value}</strong><i /></div>
            ))}
          </div>
          <div className="rp-evidence-actions">
            <a href={project.github_url} target="_blank" rel="noreferrer"><span>Repository</span><strong>Read the implementation</strong><b>↗</b></a>
            {project.deployed_url ? <a href={project.deployed_url} target="_blank" rel="noreferrer"><span>{project.video ? "Demo" : "Live project"}</span><strong>Inspect the working surface</strong><b>↗</b></a> : null}
            {project.video ? <a href={project.video} target="_blank" rel="noreferrer"><span>Recorded evidence</span><strong>Watch the system run</strong><b>↗</b></a> : null}
          </div>
          <TechnicalNotes title="Technology and complete scope"><p>{project.technologies.join(" · ")}</p><p>{project.star.impact}</p></TechnicalNotes>
          <div className="rp-case-next">
            <Link to={`/project/${previous.id}`}><span>Previous</span><strong>{getProjectMeta(previous.id).shortName}</strong></Link>
            <button type="button" onClick={goBack}>Back to all work</button>
            <Link to={`/project/${next.id}`}><span>Next</span><strong>{getProjectMeta(next.id).shortName}</strong></Link>
          </div>
        </section>
      </div>
    </div>
  );
}
