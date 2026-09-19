import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import type { PremiereAsset } from "../../data/productPremiereAssets";
import type { Project } from "../../data/projects";
import { getProjectMeta } from "../projectMeta";

export interface PremierePageProps {
  project: Project;
  previous: Project;
  next: Project;
}

export function PremiereEyebrow({ project, children }: { project: Project; children?: ReactNode }) {
  const meta = getProjectMeta(project.id);
  return (
    <p className="premiere-eyebrow">
      {children ?? meta.label} · {meta.date}
    </p>
  );
}

export function PremiereLinks({ project }: { project: Project }) {
  return (
    <div className="premiere-links" aria-label="Project links">
      <a href={project.github_url} target="_blank" rel="noreferrer">Repository ↗</a>
      {project.deployed_url ? <a href={project.deployed_url} target="_blank" rel="noreferrer">Live project ↗</a> : null}
      {project.video ? <a href={project.video} target="_blank" rel="noreferrer">Full demo ↗</a> : null}
    </div>
  );
}

export function PremiereMedia({ asset, className = "" }: { asset: PremiereAsset; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const frame = frameRef.current;
    if (!video || !frame) return;
    const root = frame.closest<HTMLElement>(".document-pane");
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) video.pause();
    }, { root, threshold: 0.15 });
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  if (asset.kind === "placeholder" || failed) {
    const placeholder = asset.kind === "placeholder" ? asset : {
      label: "Media unavailable",
      brief: "The product story remains available below.",
      ratio: "landscape" as const,
    };
    return (
      <div className={`premiere-placeholder premiere-placeholder--${placeholder.ratio} ${className}`} ref={frameRef} role="img" aria-label={`${placeholder.label}. ${placeholder.brief}`}>
        <span>Media fallback</span>
        <strong>{placeholder.label}</strong>
        <p>{placeholder.brief}</p>
      </div>
    );
  }

  return (
    <figure className={`premiere-media ${className}`} ref={frameRef}>
      <video ref={videoRef} src={asset.src} muted playsInline loop preload="metadata" controls aria-label={asset.alt} onError={() => setFailed(true)} />
      <figcaption><span>{asset.caption}</span><b>{asset.durationLabel}</b></figcaption>
    </figure>
  );
}

export function BehindTheProduct({ children }: { children: ReactNode }) {
  return (
    <section className="premiere-behind" aria-labelledby="behind-product-title">
      <p className="premiere-eyebrow">Behind the product</p>
      <h2 id="behind-product-title">The mechanism behind the moment.</h2>
      {children}
    </section>
  );
}

export function PremiereFooter({ project, previous, next, note }: PremierePageProps & { note: string }) {
  return (
    <footer className="premiere-footer">
      <div className="premiere-footer__statement">
        <p className="premiere-eyebrow">Inspect the work</p>
        <h2>{note}</h2>
        <PremiereLinks project={project} />
      </div>
      <nav aria-label="Adjacent projects" className="premiere-footer__nav">
        <Link to={`/project/${previous.id}`}><span>Previous</span><strong>{getProjectMeta(previous.id).shortName}</strong></Link>
        <Link to="/"><span>Index</span><strong>All work</strong></Link>
        <Link to={`/project/${next.id}`}><span>Next</span><strong>{getProjectMeta(next.id).shortName}</strong></Link>
      </nav>
    </footer>
  );
}
