import { ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  branchVoiceBranches, branchVoiceChapters, branchVoiceDecisions, branchVoiceDigests,
  branchVoiceHistory, branchVoiceLimits, branchVoicePaths, branchVoiceRouter, branchVoiceSources,
  branchVoiceTurns, replayClock, type BranchId, type BranchVoiceChapter, type BranchVoiceSource,
} from "../../data/branchVoice";
import type { WorkbenchTrack } from "./BranchVoicePlayer";

export function EvidenceLinks({ sources, claim, track }: {
  sources: readonly BranchVoiceSource[];
  claim: string;
  track: WorkbenchTrack;
}) {
  return (
    <div className="bv-sources">
      {sources.map(({ label, href }) => (
        <a key={href} href={href} target="_blank" rel="noreferrer"
          onClick={() => track("source_link_open", { url: href, claim })}
          onAuxClick={(event) => {
            if (event.button === 1) track("source_link_open", { url: href, claim });
          }}>
          {label}
        </a>
      ))}
    </div>
  );
}

const historical = (id: BranchId, frame: BranchVoiceChapter) => id === "b2" && frame.count >= 6;

function BranchPicker({ frame, selected, onSelect }: {
  frame: BranchVoiceChapter;
  selected: BranchId;
  onSelect: (id: BranchId) => void;
}) {
  const ids = branchVoicePaths(frame.count);

  function renderBranch(id: BranchId) {
    const entry = branchVoiceBranches[id];
    const chapter = branchVoiceChapters.find((item) => item.id === entry.chapter)!;
    const children = ids.filter((candidate) => branchVoiceBranches[candidate].parent?.id === id);

    return (
      <li key={id}>
        <button type="button" className="bv-branch-pick" data-tone={entry.tone} data-historical={historical(id, frame)}
          aria-pressed={selected === id} onClick={() => onSelect(id)}>
          <i aria-hidden="true" />
          <span>{entry.name}<small>{historical(id, frame) ? "Replaced by correction b3" : entry.relation}</small></span>
          <time>{replayClock(chapter.seek)}</time>
        </button>
        {children.length > 0 && <ul className="bv-branch-children">{children.map(renderBranch)}</ul>}
      </li>
    );
  }

  return <ul className="bv-branch-list" aria-label="Cue a branch’s recorded frame">{renderBranch("b1")}</ul>;
}

export function BranchInspector({ frame, selected, onSelect, onViewFrame, track }: {
  frame: BranchVoiceChapter;
  selected: BranchId;
  onSelect: (id: BranchId) => void;
  onViewFrame: (frame: BranchVoiceChapter) => void;
  track: WorkbenchTrack;
}) {
  const branch = branchVoiceBranches[selected];
  const path = branchVoiceHistory(selected, frame.count);
  const inherited = path.filter(([, owner]) => owner !== selected);
  const owned = path.filter(([, owner]) => owner === selected);

  if (!frame.count) return <p className="bv-empty">The first branch snapshot appears at the Hokkaido fork.</p>;

  return (
    <>
      <BranchPicker frame={frame} selected={selected} onSelect={onSelect} />
      <section className="bv-readout" aria-labelledby="bv-readout-title">
        <div className="bv-section-line">
          <h2 id="bv-readout-title">What <code>{selected}</code> reads</h2>
          <span>{frame.id === "report" ? "Merge snapshot" : `${replayClock(frame.seek)} snapshot`}</span>
        </div>
        <dl className="bv-path-facts">
          {branch.parent && (
            <div><dt>Via <code>{branch.parent.id}</code> through <code>{branch.parent.through}</code></dt>
              <dd><code>{inherited.map(([id]) => id).join(", ")}</code></dd></div>
          )}
          <div><dt>Own turns</dt><dd><code>{owned.map(([id]) => id).join(", ")}</code></dd></div>
        </dl>
        <EvidenceLinks sources={[branchVoiceSources.session, branchVoiceSources.history]} claim="path_history" track={track} />
        {selected === "b4" && (
          <section className="bv-digests" aria-labelledby="bv-digest-title">
            <h3 id="bv-digest-title">Two source digests</h3>
            <ul>
              {branchVoiceDigests.map((digest) => (
                <li key={digest.path} data-tone={branchVoiceBranches[digest.path].tone}>
                  <i aria-hidden="true" /><span>{branchVoiceBranches[digest.path].name}</span> <code>{digest.path}</code>
                  {"excerpt" in digest && <p>Excerpt: “{digest.excerpt}”</p>}
                </li>
              ))}
            </ul>
            <EvidenceLinks sources={[branchVoiceSources.digests]} claim="merge_digests" track={track} />
            <details>
              <summary>Read both digests</summary>
              {branchVoiceDigests.map(({ label, text }) => <p key={label} className="bv-digest-text"><strong>{label}</strong> {text}</p>)}
            </details>
          </section>
        )}
        <details key={selected}>
          <summary>Read recorded turns</summary>
          <ol className="bv-transcript">
            {path.map(([id, owner, role, text]) => (
              <li key={id}>
                <code>{id}</code>
                <p>{text}<small>{role} · {owner === selected ? "Owned by" : "Read from"} <code>{owner}</code></small></p>
              </li>
            ))}
          </ol>
        </details>
        <button className="bv-text-button bv-view-frame" type="button" onClick={() => onViewFrame(frame)}>
          View {frame.id === "merge" ? "merge frame" : `frame at ${replayClock(frame.seek)}`}
        </button>
      </section>
    </>
  );
}

export function BuildInspector({ onCue, onViewFrame, track }: {
  onCue: (frame: BranchVoiceChapter) => void;
  onViewFrame: (frame: BranchVoiceChapter) => void;
  track: WorkbenchTrack;
}) {
  const [decision, setDecision] = useState<string | null>(null);

  return (
    <>
      <ul className="bv-decisions">
        {branchVoiceDecisions.map((item) => {
          const open = item.id === decision;
          const frame = branchVoiceChapters.find((chapter) => chapter.id === item.chapter);
          return (
            <li key={item.id}>
              <button type="button" className="bv-decision" aria-expanded={open} aria-controls={`bv-decision-${item.id}`}
                onClick={() => {
                  setDecision(open ? null : item.id);
                  if (open) return;
                  track("decision_open", { decision: item.id, origin: "build" });
                  if (frame) onCue(frame);
                }}>
                <span>{item.label}<small>{item.value}</small></span>
                <ChevronRight size={16} aria-hidden="true" />
              </button>
              <div id={`bv-decision-${item.id}`} className="bv-decision-body" hidden={!open}>
                <p>{item.text}</p>
                {item.scope && <p>{item.scope}</p>}
                <EvidenceLinks sources={item.sources} claim={item.id} track={track} />
                {frame && (
                  <button type="button" className="bv-text-button bv-view-frame" onClick={() => onViewFrame(frame)}>View frame at {replayClock(frame.seek)}</button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <details className="bv-build-extra">
        <summary>Router results</summary>
        <dl className="bv-metrics">
          {branchVoiceRouter.map(({ value, label, source }) => (
            <div key={value}>
              <dt>{label}</dt>
              <dd><strong>{value}</strong><EvidenceLinks sources={[source]} claim={label} track={track} /></dd>
            </div>
          ))}
        </dl>
        <p>Both splits informed the question revision.</p>
      </details>
      <details className="bv-build-extra">
        <summary>Limits</summary>
        <ul className="bv-limits">
          {branchVoiceLimits.map((limit) => (
            <li key={limit.title}><h3>{limit.title}</h3><p>{limit.text}</p>
              <EvidenceLinks sources={limit.sources} claim={limit.title} track={track} /></li>
          ))}
        </ul>
      </details>
    </>
  );
}

const legend = [
  ["owned", "Owned turn"], ["parent", "Read via parent"], ["digest", "Digest source"], ["correction", "Correction"],
];

export function TurnLedger({ frame, selected, onInspect, track }: {
  frame: BranchVoiceChapter;
  selected: BranchId | null;
  onInspect: (id: BranchId) => void;
  track: WorkbenchTrack;
}) {
  const ids = branchVoicePaths(frame.count);
  const merge = ids.includes("b4");

  return (
    <section className="bv-ledger" aria-labelledby="bv-ledger-title" data-analytics-section data-section-id="branch_voice_turn_store" data-section-type="architecture">
      <div className="bv-section-line">
        <h2 id="bv-ledger-title">Turn store</h2>
        <EvidenceLinks sources={[branchVoiceSources.session]} claim="turn_store" track={track} />
      </div>
      <ul className="bv-legend" aria-label="Turn store legend">
        {legend.map(([kind, label]) => <li key={kind}><i data-mark={kind} aria-hidden="true" />{label}</li>)}
      </ul>
      {frame.count ? (
        <>
          <div className="bv-lane bv-turn-index" aria-hidden="true">
            <span>{frame.count} recorded turns</span>
            <div className="bv-dots">{branchVoiceTurns.map(([turn], index) => <span key={turn}>{index < frame.count && turn}</span>)}</div>
          </div>
          <div className="bv-lanes">
            {merge && (
              <svg className="bv-digest-edges" viewBox="0 0 12 4" preserveAspectRatio="none" aria-hidden="true">
                {branchVoiceDigests.map(({ path, head }) => {
                  const x = branchVoiceTurns.findIndex(([turn]) => turn === head) + 0.5;
                  const y = ids.indexOf(path) + 0.5;
                  const bend = (x + 10.5) / 2;
                  return <path key={path} d={`M ${x} ${y} C ${bend} ${y} ${bend} 3.5 10.5 3.5`} />;
                })}
              </svg>
            )}
            {ids.map((id) => {
              const path = branchVoiceHistory(id, frame.count);
              return (
                <div key={id} className="bv-lane" data-tone={branchVoiceBranches[id].tone} data-historical={historical(id, frame)}>
                  <button type="button" className="bv-lane-label" aria-pressed={(selected ?? frame.path) === id}
                    aria-label={`Inspect ${id} ${branchVoiceBranches[id].name}. ${historical(id, frame) ? "Replaced by correction b3. " : ""}Reads ${path.map(([turn]) => turn).join(", ")}.`}
                    onClick={() => onInspect(id)}>
                    <code>{id}</code><span>{branchVoiceBranches[id].name}</span><ChevronRight size={12} aria-hidden="true" />
                  </button>
                  <div className="bv-dots" aria-hidden="true">
                    {branchVoiceTurns.map(([turn, owner, , , kind], index) => {
                      const onPath = path.some(([entry]) => entry === turn);
                      const next = branchVoiceTurns[index + 1]?.[0];
                      return (
                        <span key={turn} data-tone={branchVoiceBranches[owner].tone}
                          data-next={onPath && path.some(([entry]) => entry === next)}>
                          {onPath && <i data-owned={owner === id} data-current={frame.path === id && path.at(-1)?.[0] === turn} data-correction={kind === "correction"} />}
                        </span>
                      );
                    })}
                    {historical(id, frame) && <small>Replaced by <span>correction </span>b3</small>}
                  </div>
                </div>
              );
            })}
          </div>
          {merge && (
            <p className="bv-lane-note">
              {frame.id === "report" && "The ledger shows the merge snapshot. "}
              <code>b4</code> keeps digests from <code>b1</code> and <code>b3</code>.
            </p>
          )}
        </>
      ) : <p className="bv-empty">The first branch snapshot appears at the Hokkaido fork.</p>}
    </section>
  );
}
