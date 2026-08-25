import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { EDUCATION, EXPERIENCE, PROFILE, PROJECTS, PUBLICATIONS } from "../data";
import { ProjectVisual } from "./ProjectVisual";
import { getProjectMeta, sortHomeProjects } from "./projectMeta";

const SECTION_LINKS = [
  { id: "work", label: "Work" },
  { id: "record", label: "Experience" },
  { id: "publications", label: "Publications" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

const ASK_SUGGESTIONS = [
  "Which project shows evaluation design?",
  "Where is human approval enforced?",
  "What did Prathamesh build in Go?",
];

const profileLinks = Object.fromEntries(PROFILE.links.map((link) => [link.type, link.url]));

function usePortfolioPosition() {
  const [activeSection, setActiveSection] = useState("work");

  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-22% 0px -58% 0px", threshold: [0, 0.1, 0.35] },
    );

    document.querySelectorAll<HTMLElement>("[data-section]").forEach((element) => sectionObserver.observe(element));
    return () => sectionObserver.disconnect();
  }, []);

  return activeSection;
}

interface AskDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CURATED_ANSWERS: Record<string, string> = {
  evaluation:
    "Prompt Optimization compares MIPROv2 and PEFT under one five-metric harness. cachefault validates against both Anthropic’s diagnostics oracle and a real vLLM server.",
  approval:
    "Queue Whisperer enforces human approval structurally: the model can stage a proposal, but the GitHub write tools are imported only by the Slack approval handler.",
  go:
    "cachefault is the Go project. It ships as a static binary containing the capture proxy, order-preserving diff, classifier, CLI and block simulator.",
};

function getCuratedAnswer(query: string) {
  const normalized = query.toLowerCase();
  if (normalized.includes("evaluation")) return CURATED_ANSWERS.evaluation;
  if (normalized.includes("approval") || normalized.includes("human")) return CURATED_ANSWERS.approval;
  if (normalized.includes(" go") || normalized.includes("golang")) return CURATED_ANSWERS.go;
  return "I can point you to a project, decision or piece of evidence. Try asking about evaluation design, human approval, retrieval, voice interfaces or Go.";
}

function AskDrawer({ open, onClose }: AskDrawerProps) {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const prompt = query.trim();
    if (!prompt || loading) return;
    setLoading(true);
    setAnswer("");

    try {
      const { chatWithAI } = await import("../utils/backendConnection");
      const response = await chatWithAI(prompt);
      setAnswer(response.response || getCuratedAnswer(prompt));
    } catch {
      setAnswer(getCuratedAnswer(prompt));
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="rp-ask-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <dialog open className="rp-ask-drawer" aria-modal="true" aria-labelledby="ask-title">
        <div className="rp-ask-header">
          <div>
            <span className="rp-kicker">SECONDARY NAVIGATION</span>
            <h2 id="ask-title">Ask about the work</h2>
          </div>
          <button type="button" className="rp-icon-button" onClick={onClose} aria-label="Close Ask about the work">Close</button>
        </div>
        <p className="rp-ask-intro">Use the portfolio as the source. Answers should take you back to inspectable evidence.</p>
        <div className="rp-suggestions">
          {ASK_SUGGESTIONS.map((suggestion) => (
            <button type="button" key={suggestion} onClick={() => setQuery(suggestion)}>{suggestion}</button>
          ))}
        </div>
        <form onSubmit={submit} className="rp-ask-form">
          <label htmlFor="portfolio-question">Question</label>
          <textarea id="portfolio-question" name="portfolio-question" autoComplete="off" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ask about a system, decision or result…" rows={4} />
          <button type="submit" disabled={!query.trim() || loading}>{loading ? "Looking through the work…" : "Ask"}</button>
        </form>
        <div className="rp-ask-answer" aria-live="polite">
          {answer ? <><span className="rp-kicker">ANSWER</span><p>{answer}</p></> : null}
        </div>
      </dialog>
    </div>
  );
}

interface NavigationRailProps {
  activeSection: string;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

function NavigationRail({ activeSection, mobileMenuOpen, onToggleMobileMenu }: NavigationRailProps) {
  return (
    <>
      <aside className="rp-rail" aria-label="Portfolio navigation">
        <div className="rp-rail-identity">
          <a href="#work" className="rp-name">Prathamesh More</a>
          <p>I turn ambiguous ideas into dependable AI systems people can actually use.</p>
        </div>

        <nav className="rp-section-nav" aria-label="Sections">
          {SECTION_LINKS.map((link, index) => (
            <a key={link.id} href={`#${link.id}`} aria-current={activeSection === link.id ? "location" : undefined}>
              <span>{String(index + 1).padStart(2, "0")}</span>{link.label}
            </a>
          ))}
        </nav>

        <div className="rp-rail-footer">
          <div className="rp-social-links">
            <a href={`mailto:${PROFILE.email}`}>Email</a>
            <a href={profileLinks.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
            <a href={profileLinks.github} target="_blank" rel="noreferrer">GitHub ↗</a>
            <a href={profileLinks.resume} target="_blank" rel="noreferrer">Résumé ↗</a>
          </div>
        </div>
      </aside>

      <header className="rp-mobile-bar">
        <a href="#work" className="rp-mobile-name">Prathamesh More</a>
        <button type="button" onClick={onToggleMobileMenu} aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation">{mobileMenuOpen ? "Close" : "Menu"}</button>
      </header>

      {mobileMenuOpen ? (
        <div className="rp-mobile-menu" id="mobile-navigation">
          <nav aria-label="Mobile sections">
            {SECTION_LINKS.map((link) => <a key={link.id} href={`#${link.id}`} onClick={onToggleMobileMenu}>{link.label}</a>)}
          </nav>
          <div><a href={`mailto:${PROFILE.email}`}>Email</a><a href={profileLinks.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a><a href={profileLinks.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={profileLinks.resume} target="_blank" rel="noreferrer">Résumé ↗</a></div>
        </div>
      ) : null}
    </>
  );
}

function ProjectCard({ project }: { project: (typeof PROJECTS)[number] }) {
  const meta = getProjectMeta(project.id);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const active = hovered || focused;
  const year = meta.date.match(/\d{4}/)?.[0] ?? meta.date;

  return (
    <article className={`rp-project-card rp-project-card--${meta.artifact} rp-project-card--${meta.home.mode}`} data-project-id={project.id} data-home-mode={meta.home.mode} data-active={active}>
      <Link
        to={`/project/${project.id}`}
        state={{ fromWork: true, scrollY: typeof window === "undefined" ? 0 : window.scrollY }}
        aria-label={`Open ${meta.shortName} case study`}
        onPointerEnter={(event) => event.pointerType !== "touch" && setHovered(true)}
        onPointerLeave={(event) => event.pointerType !== "touch" && setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <div className="rp-project-hover-copy" aria-hidden="true">
          <div className="rp-project-hover-title">
            <strong>{meta.shortName}</strong>
            <span>↗</span>
          </div>
          <div className="rp-project-hover-meta">
            <span>{meta.label}</span>
            <time>{year}</time>
          </div>
        </div>

        <div className="rp-project-media">
          {meta.home.mode === "quiet" ? <div className="rp-project-quiet-keyword" aria-hidden={active}>{meta.home.keyword}</div> : null}
          <div className="rp-project-artifact" aria-hidden={meta.home.mode === "quiet" && !active}>
            <ProjectVisual project={project} active={active} />
          </div>
        </div>

        <div className="rp-project-copy">
          <div className="rp-project-title-row">
            <h3>{meta.shortName}</h3>
            <span aria-hidden="true">↗</span>
          </div>
          <p>{meta.home.thesis}</p>
        </div>
      </Link>
    </article>
  );
}

export default function PortfolioHome() {
  const projects = useMemo(() => sortHomeProjects(PROJECTS), []);
  const activeSection = usePortfolioPosition();
  const [askOpen, setAskOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { restore?: boolean; scrollY?: number } | null;
    if (state?.restore && typeof state.scrollY === "number") {
      requestAnimationFrame(() => window.scrollTo({ top: state.scrollY, behavior: "auto" }));
    }
  }, [location.state]);

  return (
    <div className="rp-site">
      <a className="rp-skip-link" href="#main-content">Skip to content</a>
      <NavigationRail activeSection={activeSection} mobileMenuOpen={mobileMenuOpen} onToggleMobileMenu={() => setMobileMenuOpen((value) => !value)} />

      <main className="rp-main" id="main-content">
        <section className="rp-work" id="work" data-section>
          <div className="rp-mobile-intro">
            <span className="rp-kicker">AI ENGINEER</span>
            <p>I turn ambiguous ideas into dependable AI systems people can actually use.</p>
          </div>
          <header className="rp-section-heading">
            <div><span className="rp-kicker">01—10 · SELECTED SYSTEMS</span><h2>Work</h2></div>
            <p>Different domains, one recurring process: understand the problem, decide where AI helps, make its behaviour measurable, and ship something usable.</p>
          </header>

          <div className="rp-project-stream">
            {projects.map((project) => <ProjectCard project={project} key={project.id} />)}
          </div>
        </section>

        <section className="rp-record" id="record" data-section>
          <header className="rp-section-heading"><div><span className="rp-kicker">PROFESSIONAL RECORD</span><h2>Experience</h2></div><p>The project depth is backed by production engineering, applied research and peer-reviewed work.</p></header>
          <div className="rp-record-list">
            {EXPERIENCE.map((entry, index) => (
              <details key={entry.id}>
                <summary><span>{String(index + 1).padStart(2, "0")}</span><strong>{entry.role}</strong><span>{entry.company}</span><time>{entry.duration}</time><i>+</i></summary>
                <div><p>{entry.star.result}</p><span>{entry.location}</span></div>
              </details>
            ))}
            <details>
              <summary><span>04</span><strong>{EDUCATION.degree}</strong><span>{EDUCATION.university}</span><time>{EDUCATION.graduation}</time><i>+</i></summary>
              <div><p>Applied machine learning, statistical learning, data mining and database systems.</p><span>GPA {EDUCATION.gpa}</span></div>
            </details>
          </div>
        </section>

        <section className="rp-publications-section" id="publications" data-section>
          <header className="rp-section-heading"><div><span className="rp-kicker">PEER-REVIEWED</span><h2>Publications</h2></div></header>
          <div className="rp-publications">
            {PUBLICATIONS.map((publication, index) => (
              <a href={publication.url} target="_blank" rel="noreferrer" key={publication.id}>
                <span>{String(index + 1).padStart(2, "0")}</span><strong>{publication.title}</strong><span>{publication.outlet}</span><time>{publication.date}</time><b>↗</b>
              </a>
            ))}
          </div>
        </section>

        <section className="rp-about" id="about" data-section>
          <div className="rp-about-copy"><span className="rp-kicker">ABOUT</span><h2>Curious about systems—on screen, on the field, and everywhere in between.</h2></div>
          <div className="rp-about-body">
            <p>I enjoy entering unfamiliar domains, learning how the people and systems inside them actually work, and building from that understanding.</p>
            <p>Outside engineering, football is the constant. I also play badminton, follow sports communities, watch anime, play League of Legends and sketch.</p>
            <div className="rp-interest-line" aria-label="Personal interests"><span>Football</span><span>Competition</span><span>Anime</span><span>Games</span><span>Sketching</span></div>
          </div>
        </section>

        <section className="rp-contact" id="contact" data-section>
          <span className="rp-kicker">CONTACT</span>
          <h2>Have an ambitious AI problem or a role where this kind of work matters? <a href={`mailto:${PROFILE.email}`}>Let’s talk.</a></h2>
          <div className="rp-contact-actions">
            <a className="rp-email-link" href={`mailto:${PROFILE.email}`}>Email me <span>↗</span></a>
            <a href={profileLinks.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
            <a href={profileLinks.github} target="_blank" rel="noreferrer">GitHub ↗</a>
            <a href={profileLinks.resume} target="_blank" rel="noreferrer">Résumé ↗</a>
          </div>
          <button className="rp-contact-ask" type="button" onClick={() => setAskOpen(true)}>Not sure where to start? <span>Ask about the work ↗</span></button>
          <footer><span>© {new Date().getFullYear()} Prathamesh More</span></footer>
        </section>
      </main>

      <AskDrawer open={askOpen} onClose={() => setAskOpen(false)} />
    </div>
  );
}
