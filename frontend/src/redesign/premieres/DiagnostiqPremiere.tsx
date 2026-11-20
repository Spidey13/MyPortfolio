import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { DIAGNOSTIQ_CASE_STUDY as cs } from "../../data/diagnostiqCaseStudy";
import { PRODUCT_PREMIERE_ASSETS as assets } from "../../data/productPremiereAssets";
import { captureAttributes } from "../../analytics/attributes";
import { PremiereFooter, type PremierePageProps } from "./PremiereShared";

const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

/** Wrap the identifiers named in `terms` in <code>, leaving the rest of the sentence as text. */
function withCode(text: string, terms: readonly string[]): ReactNode {
  const pattern = new RegExp(`(${terms.map((t) => t.replace(/[-]/g, "\\-")).join("|")})`, "g");
  return text.split(pattern).map((part, i) =>
    terms.includes(part) ? <code key={i}>{part}</code> : <Fragment key={i}>{part}</Fragment>,
  );
}

function SessionFilm({ projectId }: { projectId: string }) {
  const video = assets.diagnostiqHero;
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [active, setActive] = useState(-1);
  const chapters = cs.film.chapters;

  useEffect(() => {
    const el = videoRef.current;
    const frame = frameRef.current;
    if (!el || !frame) return;
    const root = frame.closest<HTMLElement>(".document-pane");
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) el.pause();
    }, { root, threshold: 0.15 });
    observer.observe(frame);
    return () => observer.disconnect();
  }, [started]);

  const play = (seconds?: number) => {
    setStarted(true);
    requestAnimationFrame(() => {
      const el = videoRef.current;
      if (!el) return;
      if (seconds !== undefined) el.currentTime = seconds;
      void el.play().catch(() => undefined);
      el.focus({ preventScroll: true });
    });
  };

  const onTimeUpdate = () => {
    const t = videoRef.current?.currentTime ?? 0;
    let index = -1;
    chapters.forEach((chapter, i) => { if (t >= chapter.seconds) index = i; });
    setActive((prev) => (prev === index ? prev : index));
  };

  return (
    <figure className="dq-film" aria-label="Recorded Diagnostiq session">
      <div className="dq-frame" ref={frameRef}>
        {started && !failed ? (
          <video
            ref={videoRef}
            src={video.src}
            poster={cs.film.poster}
            controls
            playsInline
            preload="metadata"
            aria-label={video.alt}
            onTimeUpdate={onTimeUpdate}
            onError={() => setFailed(true)}
          />
        ) : (
          <>
            <img src={cs.film.poster} alt={cs.film.posterAlt} width={1600} height={900} decoding="async" />
            {failed ? (
              <a className="dq-play" href={video.src} target="_blank" rel="noreferrer">Open the recording in a new tab</a>
            ) : (
              <button
                className="dq-play"
                type="button"
                onClick={() => play()}
                {...captureAttributes({ action: "recorded_demo_open", location: "project_header", projectId })}
              >
                <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1v10l9-5z" /></svg>
                {cs.film.playLabel} <span>{video.durationLabel.replace(/^0/, "")}</span>
              </button>
            )}
          </>
        )}
      </div>
      <ol className="dq-chapters" aria-label="Jump to a moment in the session">
        {chapters.map((chapter, i) => (
          <li key={chapter.seconds}>
            <button type="button" onClick={() => play(chapter.seconds)} aria-current={active === i ? "true" : undefined}>
              <time dateTime={`PT${chapter.seconds}S`}>{formatTime(chapter.seconds)}</time>
              <span>{chapter.label}</span>
            </button>
          </li>
        ))}
      </ol>
    </figure>
  );
}

function ManualStorage() {
  const s = cs.storage;
  return (
    <section className="dq-section" aria-labelledby="dq-storage-title">
      <h2 id="dq-storage-title">{s.title}</h2>
      <p className="dq-intro">{s.intro}</p>
      <div className="dq-grid dq-store">
        <figure className="dq-page">
          <div className="dq-sheet">
            <img src={s.page.src} alt={s.page.alt} width={s.page.width} height={s.page.height} loading="lazy" decoding="async" />
            <span className="dq-bracket" style={{ left: "7%", top: "11%", height: "84%" }} aria-hidden="true" />
            <span className="dq-bracket" style={{ left: "49%", top: "12%", height: "40%" }} aria-hidden="true" />
            <span className="dq-highlight" style={{ left: "51.5%", top: "49%", width: "45%", height: "45%" }} aria-hidden="true" />
          </div>
          <figcaption>{s.page.caption}</figcaption>
        </figure>
        <div className="dq-tree">
          <div className="dq-node">
            <h3>{s.parent.title} <small>{s.parent.tokens}</small></h3>
            <p><strong>{s.parent.lead}</strong> {s.parent.body}</p>
          </div>
          <div className="dq-kids">
            {s.windows.map((w) => (
              <div className="dq-node" key={w.title}>
                <h3>{w.title} <small>{w.tokens}</small></h3>
                <p>{"quote" in w ? <>Starts mid-sentence at <mark>{w.quote}</mark> </> : null}{w.body}</p>
              </div>
            ))}
          </div>
          <div className="dq-node">
            <h3>{s.address.title}</h3>
            <p>Each one starts with <span className="dq-address">{s.address.prefix}</span> {s.address.body}</p>
          </div>
        </div>
        <ol className="dq-wire" aria-label="What happens to a question">
          {s.path.map((p) => <li key={p.step}><b>{p.step}</b><span>{p.detail}</span></li>)}
        </ol>
        <dl className="dq-figures">
          {s.figures.map((f) => <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}
        </dl>
      </div>
    </section>
  );
}

function Decisions({ projectId }: { projectId: string }) {
  const d = cs.decisions;
  return (
    <section className="dq-section" aria-labelledby="dq-decisions-title">
      <h2 id="dq-decisions-title">{d.title}</h2>
      <p className="dq-intro">{d.intro}</p>
      <div className="dq-rows">
        {d.items.map((item) => (
          <article className="dq-grid dq-row" key={item.title} aria-labelledby={`dq-${item.title.toLowerCase()}`}>
            <h3 id={`dq-${item.title.toLowerCase()}`}>{item.title}</h3>
            <p className="dq-row__body">{withCode(item.body, d.codeTerms)}</p>
            <div className="dq-row__evidence">
              <strong>{item.figure}</strong>
              <span>{item.figureNote}</span>
              <a href={item.source.href} target="_blank" rel="noreferrer" {...captureAttributes({ action: "technical_notes_open", location: "project_body", projectId })}>{item.source.label}</a>
            </div>
          </article>
        ))}
      </div>
      <div className="dq-open">
        <h3>{cs.open.title}</h3>
        <ul>
          {cs.open.items.map((o) => <li key={o.lead}><strong>{o.lead}</strong> {o.body}</li>)}
        </ul>
      </div>
    </section>
  );
}

export default function DiagnostiqPremiere(props: PremierePageProps) {
  const { project } = props;
  return (
    <article className="premiere premiere-diagnostiq dq" data-project-document aria-labelledby="dq-title">
      <div className="dq-wrap">
        <header>
          <div className="dq-top">
            <p>{cs.stack}</p>
            <nav aria-label="Project links">
              <a href={project.github_url} target="_blank" rel="noreferrer" {...captureAttributes({ action: "repository_open", location: "project_header", projectId: project.id })}>Source code</a>
              {project.deployed_url ? <a href={project.deployed_url} {...captureAttributes({ action: "interactive_demo_open", location: "project_header", projectId: project.id })}>Try the walkthrough</a> : null}
            </nav>
          </div>
          <div className="dq-grid dq-hero">
            <h1 id="dq-title">{cs.title}</h1>
            <p className="dq-lede">{cs.lede}</p>
          </div>
        </header>
        <SessionFilm projectId={project.id} />
        <ManualStorage />
        <Decisions projectId={project.id} />
      </div>
      <PremiereFooter {...props} note="Read the code behind each decision." />
    </article>
  );
}
