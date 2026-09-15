import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import type { ProductPremiereCaseStudy, PremiereVideoAsset } from "../data/productPremieres";
import type { Project } from "../data/projects";
import { ProjectVisual } from "./ProjectVisual";
import { getProjectMeta, getProjectNumber } from "./projectMeta";

const PREMIERE_SECTIONS = [
  { id: "watch", label: "Watch" },
  { id: "build", label: "Build" },
  { id: "decision", label: "Decision" },
  { id: "proof", label: "Proof" },
] as const;

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(query.matches);
    updatePreference();
    query.addEventListener("change", updatePreference);
    return () => query.removeEventListener("change", updatePreference);
  }, []);

  return reducedMotion;
}

function PremiereMedia({
  asset,
  project,
  active,
  label,
}: {
  asset?: PremiereVideoAsset;
  project: Project;
  active: boolean;
  label: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [manualPlayback, setManualPlayback] = useState(false);
  const [pausedByUser, setPausedByUser] = useState(false);

  useEffect(() => {
    setFailed(false);
    setManualPlayback(false);
    setPausedByUser(false);
  }, [asset?.src]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !asset) return;
    const root = frame.closest<HTMLElement>(".document-pane");
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.intersectionRatio >= 0.5),
      { root, threshold: [0, 0.5, 1] },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, [asset]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const shouldPlay = active && visible && !pausedByUser && (!reducedMotion || manualPlayback);
    if (shouldPlay) {
      void video.play().catch(() => setPlaying(false));
    } else {
      video.pause();
    }
  }, [active, manualPlayback, pausedByUser, reducedMotion, visible]);

  if (!asset || failed) {
    return (
      <div className="product-premiere-media" ref={frameRef}>
        <ProjectVisual project={{ ...project, video: undefined }} active={false} expanded />
      </div>
    );
  }

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      setPausedByUser(true);
      video.pause();
    } else {
      setManualPlayback(true);
      setPausedByUser(false);
      void video.play().catch(() => setPlaying(false));
    }
  };

  return (
    <div className="product-premiere-media" ref={frameRef}>
      <video
        ref={videoRef}
        src={asset.src}
        poster={asset.poster}
        muted
        playsInline
        loop
        preload="metadata"
        aria-label={asset.alt}
        onError={() => setFailed(true)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button type="button" className="product-premiere-media__control" onClick={togglePlayback} aria-label={`${playing ? "Pause" : "Play"} ${label}`}>
        {playing ? "Pause" : "Play"} · {asset.durationLabel}
      </button>
      <span className="product-premiere-media__caption">{asset.caption}</span>
    </div>
  );
}

export default function ProductPremiere({
  project,
  premiere,
  previous,
  next,
}: {
  project: Project;
  premiere: ProductPremiereCaseStudy;
  previous: Project;
  next: Project;
}) {
  const meta = getProjectMeta(project.id);
  const [activeMoment, setActiveMoment] = useState(0);
  const watchRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = watchRef.current;
    if (!section) return;
    const root = section.closest<HTMLElement>(".document-pane");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActiveMoment(0);
      },
      { root, threshold: 0.5 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [project.id]);

  const code = premiere.codeEvidence;
  const accentStyle = { "--product-premiere-accent": `var(--rp-case-accent)` } as CSSProperties;

  return (
    <article className={`product-premiere product-premiere--${meta.tone}`} style={accentStyle}>
      <section className="product-premiere-hero" id="overview" aria-labelledby="premiere-title">
        <div className="product-premiere-panel product-premiere-hero__media">
          <PremiereMedia asset={premiere.heroVideo} project={project} active label={`${meta.shortName} product film`} />
        </div>
        <div className="product-premiere-hero__story">
          <div className="product-premiere-panel product-premiere-hero__statement">
            <p className="product-premiere-kicker">{String(getProjectNumber(project)).padStart(2, "0")} / 10 · Product Premiere · {meta.date}</p>
            <h1 id="premiere-title">{meta.shortName}</h1>
            <p className="product-premiere-hero__premise">{premiere.premise}</p>
            <p className="product-premiere-status">{premiere.status}</p>
            <div className="product-premiere-inline-links" aria-label="Project links">
              <a href={project.github_url} target="_blank" rel="noreferrer">Repository ↗</a>
              {project.deployed_url ? <a href={project.deployed_url} target={project.deployed_url.startsWith("http") ? "_blank" : undefined} rel={project.deployed_url.startsWith("http") ? "noreferrer" : undefined}>Live project ↗</a> : null}
              {project.video ? <a href={project.video} target="_blank" rel="noreferrer">Full demo ↗</a> : null}
            </div>
            <nav className="product-premiere-anchors" aria-label="Product Premiere sections">
              {PREMIERE_SECTIONS.map(({ id, label }) => <a key={id} href={`#${id}`}>{label}</a>)}
            </nav>
          </div>
          <div className="product-premiere-panel product-premiere-hero__proof">
            <p className="product-premiere-kicker">I built</p>
            <p className="product-premiere-ownership">{premiere.ownership}</p>
            <dl className="product-premiere-hero__metrics">
              {project.metrics.slice(0, 3).map((metric) => <div key={metric.label}><dt>{metric.label}</dt><dd>{metric.value}</dd></div>)}
            </dl>
          </div>
        </div>
      </section>

      <section className="product-premiere-section product-premiere-watch" id="watch" aria-labelledby="watch-title" ref={watchRef}>
        <header className="product-premiere-section__heading">
          <p className="product-premiere-kicker">01 · Watch it work</p>
          <h2 id="watch-title">Three moments. One working system.</h2>
        </header>
        <div className="product-premiere-contact-sheet">
          {premiere.moments.map((moment, index) => (
            <article
              className="product-premiere-moment"
              data-active={activeMoment === index}
              key={moment.id}
              onPointerEnter={() => setActiveMoment(index)}
              onFocusCapture={() => setActiveMoment(index)}
            >
              <div className="product-premiere-panel product-premiere-moment__media">
                <PremiereMedia asset={moment.video} project={project} active={activeMoment === index} label={`${meta.shortName}: ${moment.title}`} />
              </div>
              <div className="product-premiere-moment__copy">
                <p className="product-premiere-kicker">{String(index + 1).padStart(2, "0")}</p>
                <h3><button type="button" onClick={() => setActiveMoment(index)} aria-pressed={activeMoment === index} aria-label={`Select ${moment.title} moment`}>{moment.title}</button></h3>
                <p>{moment.caption}</p>
                <small>{moment.implementationNote}</small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="product-premiere-section" id="build" aria-labelledby="build-title">
        <header className="product-premiere-section__heading">
          <p className="product-premiere-kicker">02 · Under the hood</p>
          <h2 id="build-title">The guarantee lives in the implementation.</h2>
          <p>{premiere.buildSummary}</p>
        </header>
        <div className="product-premiere-build">
          <figure className="product-premiere-panel product-premiere-code">
            <figcaption><span>{code.label}</span><a href={code.repositoryHref} target="_blank" rel="noreferrer">{code.filePath} ↗</a><span>{code.language}</span></figcaption>
            <pre tabIndex={0} aria-label={`${code.label} code excerpt`}><code>{code.lines.map((line, index) => {
              const lineNumber = index + 1;
              const highlighted = lineNumber >= code.highlightedLines[0] && lineNumber <= code.highlightedLines[1];
              return <span className={highlighted ? "is-highlighted" : undefined} key={`${lineNumber}-${line}`}><i>{String(lineNumber).padStart(2, "0")}</i>{line || " "}{"\n"}</span>;
            })}</code></pre>
          </figure>
          <aside className="product-premiere-panel product-premiere-annotation">
            <p className="product-premiere-kicker">Why it matters</p>
            <p>{code.annotation}</p>
          </aside>
        </div>
      </section>

      <section className="product-premiere-section" id="decision" aria-labelledby="decision-title">
        <div className="product-premiere-panel product-premiere-decision__heading">
          <p className="product-premiere-kicker">03 · The decision</p>
          <h2 id="decision-title">{meta.decision.reason}</h2>
        </div>
        <div className="product-premiere-decision">
          <div className="product-premiere-panel product-premiere-choice is-rejected"><span>Rejected</span><strong>{meta.decision.rejected}</strong></div>
          <div className="product-premiere-panel product-premiere-choice is-chosen"><span>Chosen</span><strong>{meta.decision.chosen}</strong></div>
          <aside className="product-premiere-panel product-premiere-tradeoff"><span>Tradeoff</span><p>{meta.decision.reason}</p></aside>
        </div>
      </section>

      <section className="product-premiere-section" id="proof" aria-labelledby="proof-title">
        <header className="product-premiere-section__heading">
          <p className="product-premiere-kicker">04 · Proof, with boundaries</p>
          <h2 id="proof-title">The evidence keeps its scope attached.</h2>
        </header>
        <dl className="product-premiere-proof-grid">
          {project.metrics.slice(0, 3).map((metric) => <div className="product-premiere-panel" key={metric.label}><dt>{metric.label}</dt><dd>{metric.value}</dd></div>)}
        </dl>
        <div className="product-premiere-boundaries">
          {meta.trust.slice(0, 3).map((boundary, index) => <div className="product-premiere-panel" key={boundary}><span>{String(index + 1).padStart(2, "0")}</span><p>{boundary}</p></div>)}
        </div>
      </section>

      <section className="product-premiere-section product-premiere-inspect" id="inspect" aria-labelledby="inspect-title">
        <header className="product-premiere-section__heading">
          <p className="product-premiere-kicker">05 · Inspect the work / next project</p>
          <h2 id="inspect-title">Follow the evidence.</h2>
        </header>
        <div className="product-premiere-inspect__links">
          <a href={project.github_url} target="_blank" rel="noreferrer"><span>Repository</span><strong>Read the implementation</strong><b>↗</b></a>
          {project.deployed_url ? <a href={project.deployed_url} target={project.deployed_url.startsWith("http") ? "_blank" : undefined} rel={project.deployed_url.startsWith("http") ? "noreferrer" : undefined}><span>Live project</span><strong>Use the working surface</strong><b>↗</b></a> : null}
          {project.video ? <a href={project.video} target="_blank" rel="noreferrer"><span>Full demo</span><strong>Watch the complete recording</strong><b>↗</b></a> : null}
        </div>
        <nav className="product-premiere-project-nav" aria-label="Adjacent projects">
          <Link to={`/project/${previous.id}`}><span>Previous</span><strong>{getProjectMeta(previous.id).shortName}</strong></Link>
          <Link to="/"><span>Index</span><strong>All work</strong></Link>
          <Link to={`/project/${next.id}`}><span>Next</span><strong>{getProjectMeta(next.id).shortName}</strong></Link>
        </nav>
      </section>
    </article>
  );
}
