import { useEffect, useState, type FormEvent } from "react";
import { EDUCATION, EXPERIENCE, PROFILE, PUBLICATIONS } from "../data";

const ASK_SUGGESTIONS = [
  "Which project shows evaluation design?",
  "Where is human approval enforced?",
  "What did Prathamesh build in Go?",
];

const profileLinks = Object.fromEntries(PROFILE.links.map((link) => [link.type, link.url]));

const firstSentence = (text: string) => {
  const match = text.match(/^.*?[.!?](?:\s|$)/);
  return match?.[0]?.trim() || text;
};

interface AskDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CURATED_ANSWERS: Record<string, string> = {
  evaluation:
    "Prompt Optimization compares MIPROv2 and PEFT under one five-metric harness. cachefault validates against both Anthropic’s diagnostics oracle and a real vLLM server.",
  approval:
    "Queue Whisperer enforces human approval structurally: the model can stage a proposal, but the GitHub write tools are imported only by the Slack approval handler.",
  go: "cachefault is the Go project. It ships as a static binary containing the capture proxy, order-preserving diff, classifier, CLI and block simulator.",
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

export default function AboutDocument() {
  const [askOpen, setAskOpen] = useState(false);

  return (
    <article className="about-document">
      <section className="about-document__section about-document__opening" aria-labelledby="about-opening-title">
        <span className="about-document__kicker">AI ENGINEER · FULL STACK · RAG & AGENTIC SYSTEMS</span>
        <h1 id="about-opening-title">{PROFILE.name}</h1>
        <p className="about-document__title">{PROFILE.title}</p>
      </section>

      <section className="about-document__section" id="what-i-work-on" aria-labelledby="what-i-work-on-title">
        <span className="about-document__kicker">01 · POSITIONING</span>
        <h2 id="what-i-work-on-title">What I work on</h2>
        <p className="about-document__lead">{PROFILE.summary}</p>
      </section>

      <section className="about-document__section" id="experience" aria-labelledby="experience-title">
        <div className="about-document__section-heading">
          <span className="about-document__kicker">02 · PROFESSIONAL RECORD</span>
          <h2 id="experience-title">Experience</h2>
        </div>
        <div className="about-document__records">
          {EXPERIENCE.map((entry) => (
            <article className="about-document__record" key={entry.id}>
              <div>
                <h3>{entry.role}</h3>
                <p>{entry.company}</p>
              </div>
              <time>{entry.duration}</time>
              <p className="about-document__result">{firstSentence(entry.star.result)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-document__section" id="education" aria-labelledby="education-title">
        <div className="about-document__section-heading">
          <span className="about-document__kicker">03 · EDUCATION</span>
          <h2 id="education-title">Education</h2>
        </div>
        <div className="about-document__education">
          <h3>{EDUCATION.degree}</h3>
          <p>{EDUCATION.university}</p>
          <time>{EDUCATION.graduation}</time>
          <p>GPA {EDUCATION.gpa}</p>
          <ul>
            {EDUCATION.coursework.map((course) => <li key={course}>{course}</li>)}
          </ul>
        </div>
      </section>

      <section className="about-document__section" id="publications" aria-labelledby="publications-title">
        <div className="about-document__section-heading">
          <span className="about-document__kicker">04 · PEER-REVIEWED</span>
          <h2 id="publications-title">Publications</h2>
        </div>
        <div className="about-document__publications">
          {PUBLICATIONS.map((publication) => (
            <a href={publication.url} target="_blank" rel="noreferrer" key={publication.id}>
              <strong>{publication.title}</strong>
              <span>{publication.outlet}</span>
              <time>{publication.date}</time>
              <b aria-hidden="true">↗</b>
            </a>
          ))}
        </div>
      </section>

      <section className="about-document__section about-document__interests" id="interests" aria-labelledby="interests-title">
        <div className="about-document__section-heading">
          <span className="about-document__kicker">05 · OUTSIDE ENGINEERING</span>
          <h2 id="interests-title">Interests</h2>
        </div>
        <div>
          <p>I enjoy entering unfamiliar domains, learning how the people and systems inside them actually work, and building from that understanding.</p>
          <p>Outside engineering, football is the constant. I also play badminton, follow sports communities, watch anime, play League of Legends and sketch.</p>
          <p className="about-document__interest-line" aria-label="Personal interests">Football · Competition · Anime · Games · Sketching</p>
        </div>
      </section>

      <section className="about-document__section about-document__contact" id="contact" aria-labelledby="contact-title">
        <span className="about-document__kicker">06 · CONTACT</span>
        <h2 id="contact-title" tabIndex={-1}>Contact</h2>
        <p className="about-document__lead">Have an ambitious AI problem or a role where this kind of work matters?</p>
        <div className="about-document__contact-links">
          <a className="about-document__email" href={`mailto:${PROFILE.email}`}>{PROFILE.email} ↗</a>
          <a href={profileLinks.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
          <a href={profileLinks.github} target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href={profileLinks.publications} target="_blank" rel="noreferrer">Publications ↗</a>
          <a href={profileLinks.resume} target="_blank" rel="noreferrer">Résumé ↗</a>
        </div>
        <button className="about-document__ask" type="button" onClick={() => setAskOpen(true)}>
          Not sure where to start? <span>Ask about the work ↗</span>
        </button>
        <footer>© {new Date().getFullYear()} Prathamesh More</footer>
      </section>

      <AskDrawer open={askOpen} onClose={() => setAskOpen(false)} />
    </article>
  );
}
