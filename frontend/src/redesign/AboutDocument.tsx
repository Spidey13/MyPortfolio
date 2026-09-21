import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import { ABOUT, EXPERIENCE_NOTES } from "../data/about";
import { EDUCATION, PROFILE } from "../data/profile";
import { EXPERIENCE } from "../data/experience";
import { PUBLICATIONS } from "../data/publications";
import { captureAttributes } from "../analytics/attributes";
import "./about.css";

const LINKS = Object.fromEntries(PROFILE.links.map((link) => [link.type, link.url]));

function AskDialog({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const request = useRef<AbortController | null>(null);

  useEffect(() => {
    const element = dialog.current;
    const trigger = document.activeElement;
    element?.showModal();
    return () => {
      request.current?.abort();
      element?.close();
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus({ preventScroll: true });
    };
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!query.trim() || loading) return;
    setLoading(true);
    setAnswer("");
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    try {
      const { chatWithAI } = await import("../utils/backendConnection");
      const result = await chatWithAI(query.trim(), controller.signal);
      if (!controller.signal.aborted) setAnswer(result.response || "Try asking about a specific project in the index.");
    } catch {
      if (!controller.signal.aborted) setAnswer("I couldn’t reach the portfolio assistant. You can explore the projects in the index or email me directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog className="folio-dialog" ref={dialog} onCancel={onClose} aria-labelledby="folio-ask-title">
      <div className="folio-dialog__body">
        <button className="folio-dialog__close" onClick={onClose} type="button" aria-label="Close portfolio assistant"><X size={22} /></button>
        <span className="folio-label">Portfolio assistant</span>
        <h2 id="folio-ask-title">Ask about the work.</h2>
        <p>Ask about a project or a design decision.</p>
        <form onSubmit={submit}>
          <label htmlFor="folio-question">Your question</label>
          <textarea className="ph-mask" data-sensitive id="folio-question" value={query} onChange={(event) => setQuery(event.target.value)} rows={3} placeholder="Which project shows evaluation design?" required />
          <button className="folio-solid-button" type="submit" disabled={loading || !query.trim()} {...captureAttributes({ action: "assistant_submit", location: "assistant_dialog" })}>{loading ? "Looking through the work…" : "Ask the portfolio"}<ArrowUpRight size={18} /></button>
        </form>
        <div className="folio-dialog__answer ph-mask" data-sensitive aria-live="polite">{answer}</div>
      </div>
    </dialog>
  );
}

export default function AboutDocument() {
  const publications = useRef<HTMLDivElement>(null);
  const [askOpen, setAskOpen] = useState(false);

  useEffect(() => {
    const track = publications.current;
    if (!track) return;
    // Keep native touch, keyboard and trackpad scrolling. Translate a vertical
    // mouse wheel only while this strip has room; release it at either edge.
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.shiftKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
      const end = track.scrollWidth - track.clientWidth;
      if (end < 1 || (event.deltaY < 0 && track.scrollLeft <= 1) || (event.deltaY > 0 && track.scrollLeft >= end - 1)) return;
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? track.clientWidth : 1);
      event.preventDefault();
      track.scrollLeft = Math.max(0, Math.min(end, track.scrollLeft + delta));
    };
    track.addEventListener("wheel", onWheel, { passive: false });
    return () => track.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <article className="folio-home">
      <section className="folio-hero" aria-labelledby="folio-title" data-analytics-section data-document-type="about" data-section-id="about_intro" data-section-type="intro">
        <header className="folio-topline">
          <span className="folio-label">About</span>
          <nav aria-label="About page"><Link to="/#experience" {...captureAttributes({ action: "project_navigation", location: "about_navigation", navigationSource: "experience" })}>Experience</Link><Link to="/#publications" {...captureAttributes({ action: "project_navigation", location: "about_navigation", navigationSource: "publications" })}>Publications</Link><Link to="/#contact" {...captureAttributes({ action: "project_navigation", location: "about_navigation", navigationSource: "contact" })}>Contact <ArrowUpRight size={13} /></Link></nav>
        </header>
        <h1 id="folio-title"><span className="folio-title-line">Engineering</span><span className="folio-title-line folio-title-accent">intelligence.</span></h1>
        <div className="folio-hero__bottom"><span className="folio-label"><span>AI engineer</span><span>Research → systems</span></span><p>{ABOUT.intro}</p></div>
      </section>

      <section className="folio-experience" id="experience" aria-labelledby="folio-experience-title" data-analytics-section data-document-type="about" data-section-id="experience" data-section-type="career">
        <div className="folio-experience__heading"><span className="folio-label">Experience</span><h2 id="folio-experience-title" tabIndex={-1}>Where I’ve <br />been.</h2><a className="folio-text-link" href={LINKS.resume} target="_blank" rel="noreferrer" {...captureAttributes({ action: "resume_open", location: "experience" })}>Full résumé <ArrowUpRight size={15} /></a></div>
        <div className="folio-jobs">{EXPERIENCE.map((entry) => (
          <article className="folio-job" key={entry.id}>
            <div className="folio-job__meta"><p className="folio-job__company">{entry.company}</p><time>{entry.duration.replace(" to ", " – ")}</time></div>
            <h3>{entry.role}</h3>
            <p className="folio-job__result">{EXPERIENCE_NOTES[entry.id] || entry.star.result}</p>
          </article>
        ))}</div>
        <div className="folio-education"><span className="folio-label">Education</span><p><strong>{EDUCATION.degree}</strong><span>{EDUCATION.university} · {EDUCATION.graduation}</span></p></div>
      </section>

      <section className="folio-research" id="publications" aria-labelledby="folio-research-title" data-analytics-section data-document-type="about" data-section-id="publications" data-section-type="research">
        <div className="folio-section-heading"><h2 id="folio-research-title" tabIndex={-1}>Research, in print.<span className="folio-count">({String(PUBLICATIONS.length).padStart(2, "0")})</span></h2><span className="folio-label folio-scroll-hint">Scroll to explore ↔</span></div>
        <div className="folio-publication-track" ref={publications} role="region" aria-label="Publications. Scroll horizontally or use the arrow keys to explore." tabIndex={0}>
          {PUBLICATIONS.map((publication) => (
            <a className="folio-publication" key={publication.id} href={publication.url} target="_blank" rel="noreferrer" {...captureAttributes({ action: "publication_open", location: "publications", navigationSource: String(publication.id) })}>
              <div className="folio-publication__meta"><span className="folio-label">Research paper</span><time>{publication.date}</time></div>
              <h3>{publication.title}</h3>
              <div className="folio-publication__bottom"><p>{publication.outlet}</p><span className="folio-publication__read">Read paper <ArrowUpRight size={20} strokeWidth={1.5} /></span></div>
            </a>
          ))}
        </div>
      </section>

      <div className="folio-finale">
        <section className="folio-personal" id="off-clock" aria-labelledby="folio-personal-title" data-analytics-section data-document-type="about" data-section-id="off_clock" data-section-type="personal"><h2 id="folio-personal-title" tabIndex={-1}>Off the clock</h2><div><p>{ABOUT.personal}</p><p>{ABOUT.invitation}</p></div><img className="folio-personal__mark" src="/prathamesh-more-mark.svg" alt="" width="445" height="437" aria-hidden="true" /></section>
        <section className="folio-contact" id="contact" aria-labelledby="folio-contact-title" data-analytics-section data-document-type="about" data-section-id="contact" data-section-type="conversion">
          <a className="folio-contact__main" href={`mailto:${PROFILE.email}`} {...captureAttributes({ action: "contact_email", location: "contact" })}><h2 id="folio-contact-title" tabIndex={-1}>Let’s build.</h2><ArrowUpRight aria-hidden="true" strokeWidth={1.1} /></a>
          <div className="folio-contact__links"><a className="folio-contact__email" href={`mailto:${PROFILE.email}`} {...captureAttributes({ action: "contact_email", location: "contact" })}>{PROFILE.email}</a><a href={LINKS.linkedin} target="_blank" rel="noreferrer" {...captureAttributes({ action: "linkedin_open", location: "contact" })}>LinkedIn <ArrowUpRight size={13} /></a><a href={LINKS.github} target="_blank" rel="noreferrer" {...captureAttributes({ action: "github_profile_open", location: "contact" })}>GitHub <ArrowUpRight size={13} /></a><button type="button" onClick={() => setAskOpen(true)} {...captureAttributes({ action: "assistant_open", location: "contact" })}>Ask about the work <ArrowUpRight size={13} /></button></div>
        </section>
        <footer className="folio-footer"><span>© {new Date().getFullYear()} {PROFILE.name.replace(" Pravin", "")}</span><span>Open for work</span></footer>
      </div>
      {askOpen ? <AskDialog onClose={() => setAskOpen(false)} /> : null}
    </article>
  );
}
