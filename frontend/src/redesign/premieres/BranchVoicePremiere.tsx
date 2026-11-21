import { ArrowUpRight, ChevronRight } from "lucide-react";
import { usePostHog } from "@posthog/react";
import { useCallback, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { captureAttributes } from "../../analytics/attributes";
import { captureInteractiveDemo } from "../../analytics/events";
import {
  branchVoiceBranches, branchVoiceChapters, branchVoiceDefaultChapter, branchVoiceJumps, branchVoiceSources,
  replayClock, type BranchId, type BranchVoiceChapter,
} from "../../data/branchVoice";
import { BranchInspector, BuildInspector, EvidenceLinks, TurnLedger } from "./BranchVoiceEvidence";
import BranchVoicePlayer, { type BranchVoiceTransport, type WorkbenchTrack } from "./BranchVoicePlayer";
import { PremiereProjectNavigation, type PremierePageProps } from "./PremiereShared";
import "./branchVoice.css";

const tabs = [
  { id: "replay", label: "Replay" },
  { id: "branches", label: "Branches" },
  { id: "build", label: "Build" },
] as const;
type Mode = (typeof tabs)[number]["id"];

export default function BranchVoicePremiere({ project, previous, next }: PremierePageProps) {
  const posthog = usePostHog();
  const repositoryUrl = project.github_url;
  const [chapter, setChapter] = useState(branchVoiceDefaultChapter);
  const [selection, setSelection] = useState<BranchId | null>(null);
  const [mode, setMode] = useState<Mode>("replay");
  const [focusRequest, setFocusRequest] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const playerRef = useRef<BranchVoiceTransport>(null);
  const branchPanelRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Partial<Record<Mode, HTMLButtonElement | null>>>({});

  const track = useCallback<WorkbenchTrack>((interaction, context) => {
    captureInteractiveDemo(posthog, { projectId: project.id, demoId: "branch_voice_workbench", interaction, context });
  }, [posthog, project.id]);

  useLayoutEffect(() => {
    if (focusRequest === 0) return;
    const panel = branchPanelRef.current;
    if (panel) {
      panel.focus({ preventScroll: true });
      const mobile = window.matchMedia("(max-width: 959px)").matches;
      panel.closest(".bv-inspector")?.scrollIntoView({ block: mobile ? "start" : "nearest", inline: "nearest", behavior: "instant" });
    }
  }, [focusRequest]);

  const clearSelection = useCallback(() => setSelection(null), []);

  function changeMode(next: Mode, frame = chapter) {
    if (mode === next) return;
    setMode(next);
    track("mode_change", { mode: next, chapter: frame.id });
  }

  function handleTabKeys(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const size = tabs.length;
    const keys: Record<string, number> = { ArrowLeft: (index - 1 + size) % size, ArrowRight: (index + 1) % size, Home: 0, End: size - 1 };
    const next = keys[event.key];
    if (next === undefined) return;
    event.preventDefault();
    changeMode(tabs[next].id);
    tabRefs.current[tabs[next].id]?.focus();
  }

  function cue(frame: BranchVoiceChapter, origin: string) {
    clearSelection();
    playerRef.current?.cue(frame.seek);
    setAnnouncement(`${frame.label}, ${replayClock(frame.seek)}.`);
    track("chapter_jump", { chapter: frame.id, video_seconds: frame.seek, origin });
  }

  function inspectLane(id: BranchId) {
    playerRef.current?.pause();
    setSelection(id);
    changeMode("branches");
    setFocusRequest((request) => request + 1);
    track("path_select", { path: id, chapter: chapter.id, surface: "turn_store" });
  }

  function chooseBranch(id: BranchId) {
    const frame = branchVoiceChapters.find((item) => item.id === branchVoiceBranches[id].chapter)!;
    cue(frame, "branch_picker");
    setSelection(id);
    track("path_select", { path: id, chapter: frame.id, surface: "branch_picker" });
  }

  function inspectMerge() {
    const frame = branchVoiceChapters.find((item) => item.id === "merge")!;
    cue(frame, "proof");
    setSelection("b4");
    setFocusRequest((request) => request + 1);
    track("decision_open", { decision: "shared-history", origin: "proof" });
    changeMode("branches", frame);
  }

  function viewFrame(frame: BranchVoiceChapter) {
    cue(frame, "view_frame");
    playerRef.current?.focus();
  }

  return (
    <article className="bv" data-project-document aria-labelledby="bv-title">
      <div className="bv-content">
        <header className="bv-header">
          <div><h1 id="bv-title">{project.title}</h1><p>{project.star.situation}</p></div>
          {repositoryUrl && (
            <a href={repositoryUrl} target="_blank" rel="noreferrer"
              {...captureAttributes({ action: "repository_open", location: "project_header", projectId: project.id })}
              onClick={() => track("source_link_open", { url: repositoryUrl, claim: "repository" })}>
              GitHub <ArrowUpRight aria-hidden="true" size={15} />
            </a>
          )}
        </header>
        <div className="bv-workbench">
          <BranchVoicePlayer ref={playerRef} onTimeChange={setChapter} onPlay={clearSelection} onSeek={clearSelection} onJump={cue} track={track}>
            <div className="bv-frame-caption">
              <p>{chapter.caption}</p>
              <EvidenceLinks sources={chapter.sources} claim={chapter.id} track={track} />
            </div>
          </BranchVoicePlayer>
          <aside className="bv-inspector" aria-label="Replay and project evidence">
            <div className="bv-tabs" role="tablist" aria-label="Workbench views">
              {tabs.map(({ id, label }, index) => (
                <button type="button" key={id} id={`bv-tab-${id}`} role="tab"
                  aria-controls={`bv-panel-${id}`} aria-selected={mode === id} tabIndex={mode === id ? 0 : -1}
                  ref={(button) => { tabRefs.current[id] = button; }} onClick={() => changeMode(id)}
                  onKeyDown={(event) => handleTabKeys(event, index)}>{label}</button>
              ))}
            </div>
            <div id="bv-panel-replay" role="tabpanel" aria-labelledby="bv-tab-replay" hidden={mode !== "replay"}>
              <ol className="bv-chapters" aria-label="Japan replay chapters">
                {branchVoiceJumps.map((frame) => (
                  <li key={frame.id}>
                    <button type="button" data-tone={branchVoiceBranches[frame.path].tone}
                      aria-current={chapter.id === frame.id ? "step" : undefined}
                      onClick={() => cue(frame, "chapter")}>
                      <time dateTime={`PT${frame.seek}S`}>{replayClock(frame.seek)}</time>
                      <span>{frame.label}</span>
                    </button>
                  </li>
                ))}
              </ol>
              <section className="bv-proof" aria-labelledby="bv-proof-title">
                <h2 id="bv-proof-title">Shared turns</h2>
                <p>A fork stores a pointer to earlier turns. Each turn stays in the same store.</p>
                <EvidenceLinks sources={[branchVoiceSources.fork]} claim="fork_pointer" track={track} />
                <button type="button" className="bv-merge-button" onClick={inspectMerge}>
                  See what the merge reads <ChevronRight size={15} aria-hidden="true" />
                </button>
              </section>
            </div>
            <div id="bv-panel-branches" ref={branchPanelRef} role="tabpanel" tabIndex={0} aria-labelledby="bv-tab-branches" hidden={mode !== "branches"}>
              {mode === "branches" && (
                <BranchInspector frame={chapter} selected={selection ?? chapter.path} onSelect={chooseBranch} onViewFrame={viewFrame} track={track} />
              )}
            </div>
            <div id="bv-panel-build" role="tabpanel" aria-labelledby="bv-tab-build" hidden={mode !== "build"}>
              <BuildInspector onCue={(frame) => cue(frame, "decision")} onViewFrame={viewFrame} track={track} />
            </div>
          </aside>
          <TurnLedger frame={chapter} selected={selection} onInspect={inspectLane} track={track} />
        </div>
        <p role="status" className="bv-sr-only">{announcement}</p>
        <footer className="bv-info">
          <details>
            <summary>About the recording and credits</summary>
            <p>The desktop footage replays a recorded voice session with shortened dialogue and edited timing. “Hi. What are you thinking about?” is the only spoken line. The mobile insert stages the web app’s branch controls.</p>
            <EvidenceLinks sources={[branchVoiceSources.script]} claim="edited_replay" track={track} />
            <p>The film uses a mixed excerpt of “Chill Wave” by Kevin MacLeod. The sound effects were synthesized for the edit.</p>
            <EvidenceLinks sources={[branchVoiceSources.credits, branchVoiceSources.musicLicense]} claim="film_credits" track={track} />
          </details>
          <details>
            <summary>Implementation</summary>
            <p>The product uses {project.technologies.join(", ")}, with browser JavaScript and CSS for the interface.</p>
            <EvidenceLinks sources={[branchVoiceSources.architecture]} claim="implementation" track={track} />
          </details>
        </footer>
        <PremiereProjectNavigation previous={previous} next={next} />
      </div>
    </article>
  );
}
