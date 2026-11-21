import { useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import {
  incidentCaseStudy as study,
  incidentLocationCase as location,
  incidentRecallCase as recall,
  incidentReportStatus,
  type IncidentReport,
  type IncidentRecallSource,
} from "../../data/incidentLensCaseStudy";
import { PremiereProjectNavigation, type PremierePageProps } from "./PremiereShared";
import "./incidentLens.css";

const cases = [
  { id: "L1", label: "Sidewalk, Geary Blvd" },
  { id: "P2", label: "Trane HVAC unit" },
] as const;
type CaseId = (typeof cases)[number]["id"];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const fullDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const formatDate = (date: string, year = false) => (year ? fullDate : shortDate).format(new Date(date));
const elapsedDays = (start: string, end: string) => (Date.parse(end) - Date.parse(start)) / 86_400_000;
const timelinePosition = (date: string) => `${100 * elapsedDays("2026-01-01", date) / elapsedDays("2026-01-01", "2026-10-31")}%`;
const serialPosition = (value: number) => `${100 * (value - 23_400_000) / 1_100_000}%`;

const reportPoints = location.records.map((report, index) => ({
  report,
  left: timelinePosition(report.date),
  bottom: 32 + 18 * location.records.slice(0, index).filter((prior) => prior.date === report.date).length,
  later: report.date > location.incident,
}));

function navigateChoices(
  event: KeyboardEvent<HTMLDivElement>,
  select: (id: string) => void,
  wrap = false,
) {
  if (!["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
  const choices = [...event.currentTarget.querySelectorAll<HTMLButtonElement>("button[data-choice]")];
  const current = choices.findIndex((choice) => choice === event.target);
  if (current < 0) return;

  event.preventDefault();
  const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
  const adjacent = current + (forward ? 1 : -1);
  const index = event.key === "Home" ? 0
    : event.key === "End" ? choices.length - 1
    : wrap ? (adjacent + choices.length) % choices.length
    : Math.max(0, Math.min(adjacent, choices.length - 1));
  const choice = choices[index];
  if (choice.dataset.choice) select(choice.dataset.choice);
  choice.focus({ preventScroll: true });
}

function Chip({ children, tone }: { children: string; tone?: string }) {
  return <span className={tone ? `chip ${tone}` : "chip"}><i aria-hidden="true" />{children}</span>;
}

function ReportTimeline({ report, select }: { report: IncidentReport; select: (id: string) => void }) {
  const strip = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const row = strip.current;
    if (!row) return;
    const revealDate = () => {
      const selected = row.querySelector<HTMLButtonElement>('[aria-checked="true"]');
      if (!selected || row.clientWidth === 0) return;
      const bounds = selected.getBoundingClientRect();
      row.scrollLeft += bounds.left - row.getBoundingClientRect().left - (row.clientWidth - bounds.width) / 2;
    };
    revealDate();
    const observer = new ResizeObserver(revealDate);
    observer.observe(row);
    return () => observer.disconnect();
  }, [report.id]);

  function reportLabel(entry: IncidentReport) {
    const timing = entry.date > location.incident ? "filed after" : "filed by";
    return `${formatDate(entry.date, true)}, ${entry.addr}, ${entry.dist} metres, ${timing} the incident`;
  }

  return (
    <>
      <p className="line">Ten reports within 100 m. <span>Eight were filed by the <em>Jul 20</em> incident, two came later.</span></p>
      <div className="tl">
        <div className="tl-axis" aria-hidden="true" />
        {months.map((month, index) => (
          <span key={month} className={`tl-month${index % 2 ? " odd" : ""}`}
            style={{ left: timelinePosition(`2026-${String(index + 1).padStart(2, "0")}-01`) }} aria-hidden="true">{month}</span>
        ))}
        {report.win && (
          <div className="tl-win" aria-hidden="true" style={{
            left: timelinePosition(report.win[0]),
            width: `calc(${timelinePosition(report.win[1])} - ${timelinePosition(report.win[0])} + 3px)`,
          }}><span><b>Work scheduled</b>Jul 27 to 31, per note</span></div>
        )}
        <div className="tl-inc" aria-hidden="true" style={{ left: timelinePosition(location.incident) }}><span>Jul 20 incident</span></div>
        <div className="tl-dots" role="radiogroup" aria-label="Reports by date filed" onKeyDown={(event) => navigateChoices(event, select)}>
          {reportPoints.map(({ report: entry, later, left, bottom }) => (
            <button key={entry.id} type="button" className={later ? "pt later" : "pt"} style={{ left, bottom }}
              role="radio" data-choice={entry.id} aria-label={reportLabel(entry)} aria-checked={entry.id === report.id}
              tabIndex={entry.id === report.id ? 0 : -1} onClick={() => select(entry.id)} />
          ))}
        </div>
        <div className="tl-overview" aria-hidden="true">
          {reportPoints.map(({ report: entry, later, left, bottom }) => (
            <span key={entry.id} className={`pt${later ? " later" : ""}${entry.id === report.id ? " is-selected" : ""}`} style={{ left, bottom }} />
          ))}
        </div>
      </div>
      <div className="rc-row" ref={strip} role="radiogroup" aria-label="Reports by date filed" onKeyDown={(event) => navigateChoices(event, select)}>
        {location.records.map((entry, index) => {
          const later = entry.date > location.incident;
          const startsLater = later && location.records[index - 1]?.date <= location.incident;
          return (
            <DateChip key={entry.id} entry={entry} later={later} showDivider={startsLater}
              label={reportLabel(entry)} selected={entry.id === report.id} select={select} />
          );
        })}
      </div>
      <div className="legend" aria-hidden="true">
        <span><i className="lg" />filed by the incident date</span>
        <span><i className="lg ring" />filed later</span>
        <span><i className="lg inc" />incident</span>
      </div>
    </>
  );
}

function DateChip({ entry, later, showDivider, label, selected, select }: {
  entry: IncidentReport;
  later: boolean;
  showDivider: boolean;
  label: string;
  selected: boolean;
  select: (id: string) => void;
}) {
  return (
    <>
      {showDivider && <span className="rc-inc" aria-hidden="true">Jul 20</span>}
      <button type="button" className={later ? "rc later" : "rc"} role="radio" data-choice={entry.id}
        aria-checked={selected} aria-label={label} tabIndex={selected ? 0 : -1} onClick={() => select(entry.id)}>
        <i aria-hidden="true" />{formatDate(entry.date)}
      </button>
    </>
  );
}

function RecallRanges({ source, select }: { source: IncidentRecallSource; select: (id: string) => void }) {
  const serial = serialPosition(recall.serial);
  return (
    <>
      <p className="line">Three official sources, two answers. <span>Serial 24000000FA is inside the makers’ range but outside the regulator’s.</span></p>
      <div className="rg">
        <div className="rg-head" aria-hidden="true"><span /><div><span style={{ left: serial }}>24000000FA entered</span></div><span /></div>
        <div className="rg-options" role="radiogroup" aria-label="Recall sources" onKeyDown={(event) => navigateChoices(event, select)}>
          {recall.sources.map((entry) => (
            <button key={entry.id} type="button" className="rg-row" role="radio" data-choice={entry.id}
              aria-checked={entry.id === source.id} aria-label={`${entry.org}: published range ${entry.rtxt}, ${entry.res[0]}`}
              tabIndex={entry.id === source.id ? 0 : -1} onClick={() => select(entry.id)}>
              <span className="rg-name">{entry.org}</span>
              <span className="rg-track" aria-hidden="true">
                <span className="rg-fill" style={{ left: serialPosition(entry.range[0]), right: `calc(100% - ${serialPosition(entry.range[1])})` }} />
                <span className="rg-tick" style={{ left: serial }} />
              </span>
              <span className="rg-res"><Chip tone={entry.res[1]}>{entry.res[0]}</Chip></span>
            </button>
          ))}
        </div>
        <div className="rg-scale" aria-hidden="true"><span /><div>
          {[23_500_000, 24_000_000, 24_500_000].map((value) => (
            <span key={value} style={{ left: serialPosition(value) }}>{(value / 1_000_000).toFixed(1)}M</span>
          ))}
        </div><span /></div>
      </div>
      <div className="legend" aria-hidden="true">
        <span><i className="lg range" />published serial range</span>
        <span><i className="lg dash" />entered serial</span>
      </div>
    </>
  );
}

function EvidenceDetail({ when, title, quote, caption, lead, reading, factsTitle, facts, questions, source }: {
  when: string;
  title: string;
  quote: ReactNode;
  caption: string;
  lead?: string;
  reading: string;
  factsTitle: string;
  facts: ReadonlyArray<readonly [string, ReactNode]>;
  questions: readonly string[];
  source: string;
}) {
  return (
    <article className="detail" aria-labelledby="incident-selection">
      <div>
        <p className="d-when">{when}</p>
        <h2 className="d-title" id="incident-selection">{title}</h2>
        <blockquote className="d-quote">{quote}</blockquote>
        <p className="d-cap">{caption}</p>
        <p className="d-read">{lead && <><strong>{lead}</strong>{" "}</>}{reading}</p>
      </div>
      <div className="d-side">
        <div><h3>{factsTitle}</h3><dl className="facts">
          {facts.map(([term, value]) => <div className="fact" key={term}><dt>{term}</dt><dd>{value}</dd></div>)}
        </dl></div>
        <div><h3>Ask next</h3>
          {questions.length > 0
            ? <ol className="ask">{questions.map((question) => <li key={question}>{question}</li>)}</ol>
            : <p className="ask">No record-specific question in the packet.</p>}
        </div>
        <p className="src">{source}</p>
      </div>
    </article>
  );
}

function ReportDetail({ report }: { report: IncidentReport }) {
  const days = elapsedDays(location.incident, report.date);
  const relation = days > 0 ? "after" : "before";
  const [status, tone] = incidentReportStatus[report.cls];
  return <EvidenceDetail
    when={`${formatDate(report.date, true)}, ${Math.abs(days)} days ${relation} the incident`}
    title={report.addr} quote={report.note}
    caption={report.note.includes("…") ? "Status note excerpt from SF311" : "Status note, verbatim from SF311"}
    lead={report.lead} reading={report.read} factsTitle="Record"
    facts={[["Status", <Chip tone={tone}>{status}</Chip>], ["Distance", `${report.dist} m from the pin`], ["Request", report.id]]}
    questions={report.qs} source={study.locationSource}
  />;
}

function RecallDetail({ source }: { source: IncidentRecallSource }) {
  const date = source.date ? `notice dated ${formatDate(source.date, true)}` : "no recall date stated";
  const facts: Array<readonly [string, ReactNode]> = [["Serial", <Chip tone={source.res[1]}>{source.res[0]}</Chip>]];
  if (source.date) facts.push(["Published", <Chip tone="inc">after incident</Chip>]);
  facts.push(["Archived", `first seen ${source.cap.slice(0, 10)}, no bound on earlier publication`]);
  return <EvidenceDetail
    when={`${source.id}, ${date}`} title={source.title} quote={<code>{source.quote}</code>}
    caption="Quote found in the stored source" lead={source.lead} reading={source.read}
    factsTitle="Checks, run in code" facts={facts} questions={source.qs} source={`${source.file}.`}
  />;
}

function IncidentEvaluation() {
  return (
    <>
      <section className="below" aria-label="Implementation and results">
        <div><h2>How it works</h2><ol>{study.howItWorks.map((step) => <li key={step}>{step}</li>)}</ol></div>
        <div><h2>Measured</h2><dl className="nums">
          {study.metrics.map(([label, value]) => <div key={label}><dt>{label}</dt><dd><b>{value}</b></dd></div>)}
        </dl></div>
        <div><h2>Still open</h2><ul className="open-list">{study.limits.map((limit) => <li key={limit}>{limit}</li>)}</ul></div>
      </section>
      <details className="more">
        <summary>Full evaluation and decisions <span>Report of Oct 22, 2026
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span></summary>
        <div className="more-body">
          <div>
            <h3 id="incident-evaluation-results">Results, claude-sonnet-4-5, cached responses</h3>
            <table aria-labelledby="incident-evaluation-results"><tbody>
              {study.evaluation.map(([label, value]) => <tr key={label}><th scope="row">{label}</th><td className="n">{value}</td></tr>)}
            </tbody></table>
            <p className="fine">{study.evaluationNote}</p>
          </div>
          <div>
            <h3>Identifiers found, by how the recall describes them</h3>
            <ul className="bars">{study.identifiers.map(([label, count, total]) => (
              <li className="br" key={label}><span>{label}</span><span className="t" aria-hidden="true">
                <span style={{ width: `${count / total * 100}%` }} />
              </span><b>{count}/{total}</b></li>
            ))}</ul>
            <p className="fine">{study.snapshotNote}</p>
          </div>
        </div>
      </details>
    </>
  );
}

export default function IncidentLensPremiere({ project, previous, next }: PremierePageProps) {
  const [activeCase, setActiveCase] = useState<CaseId>("L1");
  const [reportId, setReportId] = useState("101004430229");
  const [sourceId, setSourceId] = useState("S00");
  const report = location.records.find(({ id }) => id === reportId) ?? location.records[0];
  const source = recall.sources.find(({ id }) => id === sourceId) ?? recall.sources[0];

  function selectCase(id: string) {
    if (id === "L1" || id === "P2") setActiveCase(id);
  }

  return (
    <article className="incident-lens" data-project-document data-project-id={project.id} aria-labelledby="incident-title">
      <div className="wrap">
        <header className="intro">
          <div><h1 id="incident-title">{project.title}</h1><p>{study.question}</p></div>
          <dl className="meta">
            <div><dt>Built</dt><dd><b>Solo, 2026</b></dd></div>
            <div><dt>Stack</dt><dd><b>Python, Claude</b></dd></div>
            <div><dt>State</dt><dd><b>Prototype</b></dd></div>
          </dl>
        </header>
        <section className="stage" aria-label="Incident Lens, two saved cases" data-analytics-section data-section-id="incident_lens_cases" data-section-type="demo">
          <div className="window">
            <div className="bar">
              <div className="seg" role="tablist" aria-label="Saved cases" onKeyDown={(event) => navigateChoices(event, selectCase, true)}>
                {cases.map(({ id, label }) => <button key={id} type="button" id={`incident-tab-${id}`} data-choice={id} role="tab"
                  aria-controls="incident-case-panel" aria-selected={activeCase === id} tabIndex={activeCase === id ? 0 : -1}
                  onClick={() => selectCase(id)}>{label}</button>)}
              </div>
              <span className="saved"><i aria-hidden="true" />{study.savedNotice}</span>
            </div>
            <div id="incident-case-panel" role="tabpanel" aria-labelledby={`incident-tab-${activeCase}`}>
              <div className="view">
                {activeCase === "L1"
                  ? <ReportTimeline report={report} select={setReportId} />
                  : <RecallRanges source={source} select={setSourceId} />}
              </div>
              <p className="incident-announcement" aria-live="polite">{activeCase === "L1" ? report.addr : source.title}</p>
              {activeCase === "L1" ? <ReportDetail report={report} /> : <RecallDetail source={source} />}
            </div>
          </div>
        </section>
        <IncidentEvaluation />
        <p className="foot">{study.footer}</p>
        <footer className="incident-navigation"><PremiereProjectNavigation previous={previous} next={next} /></footer>
      </div>
    </article>
  );
}
