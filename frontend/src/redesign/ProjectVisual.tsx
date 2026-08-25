import { useEffect, useRef, type CSSProperties } from "react";
import type { Project } from "../data/projects";
import { getProjectMeta } from "./projectMeta";

interface ProjectVisualProps {
  project: Project;
  active?: boolean;
  expanded?: boolean;
}

function InViewVideo({ src, active, label }: { src: string; active: boolean; label: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const supportsDeliberateHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (active && supportsDeliberateHover && !prefersReducedMotion) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [active]);

  return (
    <video
      ref={videoRef}
      className="rp-artifact-video"
      src={src}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
    />
  );
}

const Waveform = ({ count = 30 }: { count?: number }) => (
  <div className="rp-waveform" aria-hidden="true">
    {Array.from({ length: count }, (_, index) => (
      <span key={index} style={{ "--bar-index": index } as CSSProperties} />
    ))}
  </div>
);

export function ProjectVisual({ project, active = false, expanded = false }: ProjectVisualProps) {
  const meta = getProjectMeta(project.id);
  const visualClass = `rp-artifact rp-artifact--${meta.artifact} ${expanded ? "is-expanded" : ""}`;

  if ((project.id === "p6" || project.id === "p8") && project.video) {
    return (
      <div className={`${visualClass} rp-artifact--video`} data-active={active}>
        <InViewVideo src={project.video} active={active} label={`${meta.shortName} demonstration`} />
        <div className="rp-artifact-video-label">
          <span>{project.id === "p6" ? "VOICE → TOOL → REPOSITORY" : "FAULT → SOURCE → JOB CARD"}</span>
          <span>RECORDED DEMO</span>
        </div>
      </div>
    );
  }

  return (
    <div className={visualClass} data-active={active} aria-label={`${meta.shortName} system artifact`}>
      {meta.artifact === "research" ? (
        <div className="rp-research-trace">
          {meta.architecture.map((step, index) => (
            <div className={`rp-trace-node ${index === 3 ? "is-critical" : ""}`} key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
              {index === 3 ? <small>CITATION CHECK</small> : null}
            </div>
          ))}
          <div className="rp-trace-line" aria-hidden="true" />
        </div>
      ) : null}

      {meta.artifact === "memory" ? (
        <div className="rp-memory-grid">
          <div className="rp-memory-query">How should an assistant remember?</div>
          <div className="rp-memory-bars">
            {["Semantic", "Recency", "Reinforced"].map((label, index) => (
              <div key={label}>
                <span>{label}</span>
                <i style={{ "--memory-width": `${82 - index * 13}%` } as CSSProperties} />
              </div>
            ))}
          </div>
          <div className="rp-heatmap" aria-label="Retrieved chunk provenance heatmap">
            {Array.from({ length: 24 }, (_, index) => (
              <span key={index} data-level={(index * 7) % 5} />
            ))}
          </div>
        </div>
      ) : null}

      {meta.artifact === "race" ? (
        <div className="rp-race-board">
          <div className="rp-race-track" aria-hidden="true"><i /><b /></div>
          <div className="rp-race-timeline">
            {["L18", "L23", "L31", "L42", "L56"].map((lap, index) => (
              <span key={lap} className={index === 2 ? "is-pit" : ""}>{lap}</span>
            ))}
          </div>
          <div className="rp-race-decision"><span>PIT WINDOW</span><strong>LAP 31</strong><small>6 AGENTS AGREE</small></div>
        </div>
      ) : null}

      {meta.artifact === "wafer" ? (
        <div className="rp-wafer-flow">
          <div className="rp-sensor-field">
            {Array.from({ length: 64 }, (_, index) => <span key={index} data-hot={index % 11 === 0} />)}
          </div>
          <div className="rp-wafer-arrow">591 SENSORS</div>
          <div className="rp-clusters">
            <span>C1</span><span>C2</span><span className="is-selected">C3</span>
          </div>
          <div className="rp-model-verdict"><small>MODEL SELECTED</small><strong>XGBOOST</strong></div>
        </div>
      ) : null}

      {meta.artifact === "evaluation" ? (
        <div className="rp-evaluation-split">
          <div><small>PROGRAMMATIC</small><strong>MIPROv2</strong><span>Prompt stays editable</span></div>
          <div><small>PARAMETER-EFFICIENT</small><strong>PEFT</strong><span>Weights adapt</span></div>
          <div className="rp-eval-metrics">
            {['ROUGE','BLEU','METEOR','BERT','SEM F1'].map((metric) => <span key={metric}>{metric}</span>)}
          </div>
        </div>
      ) : null}

      {meta.artifact === "voice" ? (
        <div className="rp-voice-system"><Waveform /><div className="rp-tool-call">read_symbol()<small>TOOL_PENDING</small></div><div className="rp-repo-nodes"><span /><span /><span /><span /><span /></div></div>
      ) : null}

      {meta.artifact === "audio" ? (
        <div className="rp-audio-align">
          <Waveform count={42} />
          <div className="rp-lyric-lines"><span>the rhythm keeps moving</span><strong>emotion aligned</strong><span>across the same moment</span></div>
          <div className="rp-similarity"><small>MEAN COSINE SIMILARITY</small><strong>~63%</strong><span>712 PAIRS</span></div>
        </div>
      ) : null}

      {meta.artifact === "diagnostic" ? (
        <div className="rp-diagnostic-flow"><div>FAULT 33</div><span>MANUAL §4.2</span><strong>CHECK SUPPLY AIR SENSOR</strong><em className="rp-diagnostic-option">YES</em><em className="rp-diagnostic-option">NO</em></div>
      ) : null}

      {meta.artifact === "approval" ? (
        <div className="rp-approval-flow">
          <div className="rp-issue"><small>GITHUB #1042</small><strong>Queue is stalling</strong><span>3 cited comments</span></div>
          <div className="rp-proposal"><small>PROPOSED</small><strong>Add: priority/high</strong></div>
          <div className="rp-boundary"><span>MODEL ACCESS ENDS HERE</span></div>
          <div className="rp-human-action"><small>HUMAN ACTION</small><strong>Approve</strong></div>
        </div>
      ) : null}

      {meta.artifact === "cache" ? (
        <div className="rp-cache-diff">
          <div className="rp-cache-request"><small>REQUEST A · HIT</small><code>"required": ["query"]</code><code>"type": "object"</code></div>
          <div className="rp-cache-request is-changed"><small>REQUEST B · MISS</small><code>"type": "object"</code><code>"required": ["query"]</code></div>
          <div className="rp-cache-path"><small>FIRST DIVERGENCE</small><strong>tools[0].input_schema</strong><span>KEY_REORDERED</span></div>
        </div>
      ) : null}
    </div>
  );
}
