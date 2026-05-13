/**
 * DiagnostiqDemo — interactive mock of the Diagnostiq AI support agent.
 * Recreates the full UX (streaming chat, job card, swipe/keyboard) using
 * pre-recorded data so visitors can experience it without a live backend.
 */
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useReducer,
} from "react";
import { Link } from "react-router-dom";

// ─── Palette (matches Diagnostiq exactly) ────────────────────────────────────
const C = {
  paper:   "#f3ede1",
  surface: "#fbf6ea",
  ink:     "#1d1a15",
  ink2:    "#5a5245",
  ink3:    "#8a8275",
  line:    "#d9cfba",
  muted:   "#e8e0d0",
  accent:  "#d96b2e",
  accentD: "#b84d14",
  green:   "#5c7a54",
  red:     "#8a2a14",
};

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_ANSWER = `The Trane Precedent RTU-4A is not cooling. Based on the service manual (p.12–p.36), this is typically caused by one of four root issues: thermostat configuration, a blocked condenser coil, a failed compressor contactor, or insufficient refrigerant charge.

I've generated a **diagnostic job card** to walk you through each check in order, with manual citations at every step.`;

const MOCK_SUGGESTIONS = [
  "Show me the condenser coil cleaning procedure",
  "What are the compressor contactor specs?",
  "How do I check refrigerant charge?",
];

const MOCK_JOB_CARD = {
  metadata: {
    equipment: "Trane Precedent RTU",
    asset_id: "RTU-4A-0731",
    fault_description: "unit not cooling properly",
    priority: "HIGH" as const,
  },
  steps: [
    {
      id: 1,
      instruction: "Is the thermostat setpoint below current room temperature?",
      note: "Confirm COOL mode is active and setpoint is at least 2°F below ambient",
      yes_label: "Yes",
      no_label: "Adjust",
      yes_next: 2,
      no_next: "complete" as const,
      source_citation: "p.12 §3.1",
    },
    {
      id: 2,
      instruction: "Is the condenser coil free of blockage and debris?",
      note: "Inspect fins for dirt, leaves, or bent fins restricting airflow",
      yes_label: "Clear",
      no_label: "Blocked",
      yes_next: 3,
      no_next: "escalate" as const,
      source_citation: "p.24 §5.3",
    },
    {
      id: 3,
      instruction: "Does the compressor contactor show clean contact surfaces?",
      note: "Check for pitting, burning, or welded contacts — replace if worn",
      yes_label: "Clean",
      no_label: "Worn",
      yes_next: 4,
      no_next: "escalate" as const,
      source_citation: "p.31 §6.2",
    },
    {
      id: 4,
      instruction: "Is the supply/return air temperature differential ≥ 15°F?",
      note: "Measure with thermometer at supply grille and return plenum",
      yes_label: "Adequate",
      no_label: "Low",
      yes_next: "complete" as const,
      no_next: "escalate" as const,
      source_citation: "p.36 §7.1",
    },
  ],
};

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase = "idle" | "thinking" | "streaming" | "done";
type JCStatus = "loading" | "active" | "complete" | "escalated";

interface HistoryEntry { stepId: number; choice: "yes" | "no" }

interface JCState {
  status: JCStatus;
  currentStepIdx: number;
  completedSteps: typeof MOCK_JOB_CARD.steps;
  history: HistoryEntry[];
  elapsed: number;
  branchModal: false | "escalate" | "continue";
  pendingChoice: "yes" | "no" | null;
}

type JCAction =
  | { type: "READY" }
  | { type: "ANSWER"; choice: "yes" | "no" }
  | { type: "CONFIRM_BRANCH" }
  | { type: "DISMISS_BRANCH" }
  | { type: "TICK" };

function jcReducer(state: JCState, action: JCAction): JCState {
  switch (action.type) {
    case "READY":
      return { ...state, status: "active" };

    case "TICK":
      if (state.status !== "active") return state;
      return { ...state, elapsed: state.elapsed + 1 };

    case "ANSWER": {
      const step = MOCK_JOB_CARD.steps[state.currentStepIdx];
      if (!step) return state;
      const next = action.choice === "yes" ? step.yes_next : step.no_next;
      const newHistory = [...state.history, { stepId: step.id, choice: action.choice }];
      const newCompleted = [...state.completedSteps, step];

      if (next === "complete") {
        return { ...state, history: newHistory, completedSteps: newCompleted, status: "complete" };
      }
      if (next === "escalate") {
        return {
          ...state, history: newHistory, completedSteps: newCompleted,
          branchModal: "escalate", pendingChoice: action.choice,
        };
      }
      if (action.choice === "no" && next !== "escalate" && next !== "complete") {
        return {
          ...state, history: newHistory, completedSteps: newCompleted,
          branchModal: "continue", pendingChoice: action.choice,
        };
      }
      // yes → advance
      const nextIdx = MOCK_JOB_CARD.steps.findIndex(s => s.id === next);
      return {
        ...state, history: newHistory, completedSteps: newCompleted,
        currentStepIdx: nextIdx >= 0 ? nextIdx : state.currentStepIdx,
      };
    }

    case "CONFIRM_BRANCH": {
      if (state.branchModal === "escalate") {
        return { ...state, branchModal: false, pendingChoice: null, status: "escalated" };
      }
      // continue after a "no" detour — advance to next step
      const step = MOCK_JOB_CARD.steps[state.currentStepIdx];
      const next = step ? step.no_next : "complete";
      const nextIdx = MOCK_JOB_CARD.steps.findIndex(s => s.id === next);
      return {
        ...state, branchModal: false, pendingChoice: null,
        currentStepIdx: nextIdx >= 0 ? nextIdx : state.currentStepIdx,
      };
    }

    case "DISMISS_BRANCH":
      return { ...state, branchModal: false, pendingChoice: null };

    default:
      return state;
  }
}

const initialJCState: JCState = {
  status: "loading",
  currentStepIdx: 0,
  completedSteps: [],
  history: [],
  elapsed: 0,
  branchModal: false,
  pendingChoice: null,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function simpleHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function formatTimer(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

const PRIORITY_COLORS: Record<string, string> = {
  LOW: "#5c7a54", MEDIUM: "#d96b2e", HIGH: "#b84d14", CRITICAL: "#8a2a14",
};

const RING_R = 26;
const RING_C = 2 * Math.PI * RING_R;

// ─── Sub-components ───────────────────────────────────────────────────────────

function ThinkingDots() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "20px 0" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 6, height: 6, borderRadius: "50%", background: C.accent,
          animation: `dq-blip 1.2s ease-in-out ${i * 0.18}s infinite`,
        }} />
      ))}
      <span style={{
        fontFamily: "'Geist Mono', monospace", fontSize: 11, color: C.ink3,
        letterSpacing: "0.08em", textTransform: "uppercase", marginLeft: 4,
      }}>
        Working…
      </span>
    </div>
  );
}

function StreamingText({ text, streaming }: { text: string; streaming: boolean }) {
  const html = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>");
  return (
    <div>
      <div
        style={{ fontFamily: "'Geist', system-ui, sans-serif", fontSize: 16, color: C.ink2, lineHeight: 1.7 }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {streaming && (
        <span style={{
          display: "inline-block", width: 2, height: "1em", background: C.accent,
          marginLeft: 2, animation: "dq-cursor 0.8s step-end infinite",
          verticalAlign: "text-bottom",
        }} />
      )}
    </div>
  );
}

function SuggestionPills({ suggestions, onSend }: { suggestions: string[]; onSend: (s: string) => void }) {
  return (
    <div style={{ marginTop: 28, paddingTop: 20, borderTop: `1px solid ${C.line}`, display: "flex", flexWrap: "wrap", gap: 8 }}>
      {suggestions.map((s, i) => (
        <button key={i} onClick={() => onSend(s)} style={{
          fontFamily: "'Geist', system-ui, sans-serif", fontSize: 13, color: C.ink2,
          background: C.muted, border: `1px solid ${C.line}`, borderRadius: 100,
          padding: "6px 14px", lineHeight: 1.4, cursor: "pointer",
        }}>
          {s}
        </button>
      ))}
    </div>
  );
}

// ─── Job Card sub-components ──────────────────────────────────────────────────

function ProgressRing({ completed, total, status }: { completed: number; total: number; status: JCStatus }) {
  const progress = total > 0 ? completed / total : 0;
  const offset = RING_C * (1 - progress);
  const strokeColor = status === "escalated" ? "#c0381b" : status === "complete" ? C.green : C.accent;
  return (
    <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
      <svg width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={RING_R} fill="none" stroke={C.line} strokeWidth="3" />
        <circle cx="28" cy="28" r={RING_R} fill="none"
          stroke={strokeColor} strokeWidth="3"
          strokeDasharray={RING_C} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transform: "rotate(-90deg)", transformOrigin: "28px 28px", transition: "stroke-dashoffset .6s cubic-bezier(.34,1.3,.5,1)" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Geist Mono', monospace", fontSize: 11, fontWeight: 600, color: C.ink,
      }}>{completed}/{total}</div>
    </div>
  );
}

function StepCard({
  step, swiperRef, handleRef, onPointerDown, onPointerMove, onPointerUp,
}: {
  step: typeof MOCK_JOB_CARD.steps[0];
  swiperRef: React.RefObject<HTMLDivElement | null>;
  handleRef: React.RefObject<HTMLDivElement | null>;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: () => void;
}) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.line}`, borderRadius: 28,
      padding: "44px 48px 36px", flex: 1, overflow: "hidden", display: "flex", flexDirection: "column",
      boxShadow: "0 1px 0 rgba(255,255,255,0.47) inset, 0 20px 60px -30px rgba(46,38,24,0.27)",
      animation: "dq-cardIn .55s cubic-bezier(.2,.9,.3,1.05)",
    }}>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        fontFamily: "'Geist Mono', monospace", fontSize: 10.5, fontWeight: 500,
        letterSpacing: "0.14em", textTransform: "uppercase", color: C.accentD, marginBottom: 18,
      }}>
        <span style={{ display: "inline-block", width: 24, height: 1.5, background: C.accent }} />
        {step.id} — Diagnostic
      </div>

      <div style={{
        fontFamily: "'Fraunces', Georgia, serif", fontWeight: 350,
        fontSize: 40, lineHeight: 1.06, letterSpacing: "-0.025em",
        color: C.ink, marginBottom: 18,
      }}>
        {step.instruction}
      </div>

      {step.note && (
        <div style={{
          fontFamily: "'Geist', system-ui, sans-serif", fontSize: 15, lineHeight: 1.55,
          color: C.ink2, marginBottom: 28,
        }}>
          {step.note}
        </div>
      )}

      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        fontFamily: "'Geist Mono', monospace", fontSize: 11, color: C.ink3,
        padding: "6px 12px", border: `1px solid ${C.line}`, borderRadius: 100,
        background: C.paper, marginBottom: 36, alignSelf: "flex-start",
      }}>
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M2 3h5a3 3 0 0 1 3 3v7a2 2 0 0 0-2-2H2V3z"/>
          <path d="M14 3H9a3 3 0 0 0-3 3v7a2 2 0 0 1 2-2h6V3z"/>
        </svg>
        {step.source_citation}
      </div>

      {/* Swiper */}
      <div ref={swiperRef}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove}
        onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
        style={{
          position: "relative", borderRadius: 999,
          background: C.muted, border: `1px solid ${C.line}`,
          height: 88, overflow: "hidden", marginBottom: 16,
          boxShadow: "inset 0 2px 4px rgba(46,38,24,0.1)",
          touchAction: "none", cursor: "grab",
        }}>
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "0 32px",
          fontFamily: "'Geist Mono', monospace", fontSize: 11, fontWeight: 500,
          letterSpacing: "0.14em", textTransform: "uppercase", color: C.ink3,
          pointerEvents: "none",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 10H4M8 5L3 10l5 5"/>
            </svg>
            <span>{step.no_label}</span>
          </div>
          <div style={{
            fontFamily: "'Fraunces', Georgia, serif", fontSize: 17, fontWeight: 400,
            fontStyle: "italic", letterSpacing: "-0.01em", color: C.ink2,
            position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
            textTransform: "none", whiteSpace: "nowrap",
          }}>
            Swipe to answer
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span>{step.yes_label}</span>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 10h12M12 5l5 5-5 5"/>
            </svg>
          </div>
        </div>
        <div ref={handleRef} style={{
          position: "absolute", top: 6,
          width: 76, height: 76, borderRadius: "50%",
          background: C.ink, color: C.paper,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 6px 20px -6px rgba(46,38,24,0.67)",
          zIndex: 2, pointerEvents: "none",
          transition: "background .25s",
        }}>
          <svg width="28" height="28" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 15h10M14 11l-4 4 4 4M16 11l4 4-4 4"/>
          </svg>
        </div>
      </div>

      <div style={{
        textAlign: "center", fontFamily: "'Geist Mono', monospace", fontSize: 10.5,
        color: C.ink3, letterSpacing: "0.1em", textTransform: "uppercase",
      }}>
        Drag or press{" "}
        <kbd style={{ padding: "1px 6px", borderRadius: 4, background: C.muted, border: `1px solid ${C.line}`, fontFamily: "inherit", fontSize: 10, margin: "0 2px" }}>Y</kbd>
        {" / "}
        <kbd style={{ padding: "1px 6px", borderRadius: 4, background: C.muted, border: `1px solid ${C.line}`, fontFamily: "inherit", fontSize: 10, margin: "0 2px" }}>N</kbd>
      </div>
    </div>
  );
}

function CompletePanel({ elapsed, completed, faults, onClose }: { elapsed: number; completed: number; faults: number; onClose: () => void }) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.line}`, borderRadius: 28,
      padding: "56px 48px", textAlign: "center",
      flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      animation: "dq-cardIn .6s cubic-bezier(.2,.9,.3,1)",
    }}>
      <div style={{
        width: 120, height: 120, borderRadius: "50%", background: "#dce4d1", color: C.green,
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 24px",
        boxShadow: `0 0 0 12px transparent`,
        outline: `1px dashed ${C.green}`, outlineOffset: 12,
      }}>
        <svg width="56" height="56" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 15.5l5.5 5.5L24 8.5"/>
        </svg>
      </div>
      <div style={{
        fontFamily: "'Fraunces', Georgia, serif", fontSize: 42, fontWeight: 300,
        letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: 12, color: C.ink,
      }}>
        Ready for <em style={{ fontStyle: "italic", color: C.green }}>return to service</em>
      </div>
      <div style={{ fontFamily: "'Geist', system-ui, sans-serif", fontSize: 15, color: C.ink2, lineHeight: 1.55, maxWidth: 420, margin: "0 auto 28px" }}>
        All diagnostic steps completed. Review the audit record before signing off.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, padding: "18px 0", margin: "0 auto 24px", maxWidth: 420, width: "100%", borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }}>
        {[["Steps", completed], ["Faults", faults], ["Time", formatTimer(elapsed)]].map(([label, val]) => (
          <div key={label as string} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 28, fontWeight: 400, color: C.ink, letterSpacing: "-0.02em" }}>{val}</div>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, color: C.ink3, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 5 }}>{label as string}</div>
          </div>
        ))}
      </div>
      <button onClick={onClose} style={{
        padding: "15px 32px", background: C.ink, color: C.paper,
        border: "none", borderRadius: 100,
        fontFamily: "'Geist', system-ui, sans-serif", fontSize: 14, fontWeight: 500,
        letterSpacing: "0.04em", cursor: "pointer",
      }}>
        Close job card
      </button>
    </div>
  );
}

function EscalatePanel({ onClose }: { onClose: () => void }) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.line}`, borderRadius: 28,
      padding: "56px 48px", textAlign: "center",
      flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      animation: "dq-cardIn .6s cubic-bezier(.2,.9,.3,1)",
    }}>
      <div style={{
        width: 120, height: 120, borderRadius: "50%", background: "#f3c9c0", color: C.red,
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 24px", outline: `1px dashed ${C.red}`, outlineOffset: 12,
      }}>
        <svg width="52" height="52" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 2L2 17h16L10 2z"/><path d="M10 8v4M10 14v.5"/>
        </svg>
      </div>
      <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 42, fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: 12, color: C.ink }}>
        <em style={{ fontStyle: "italic", color: C.red }}>Escalation Required</em>
      </div>
      <div style={{ fontFamily: "'Geist', system-ui, sans-serif", fontSize: 15, color: C.ink2, lineHeight: 1.55, maxWidth: 420, margin: "0 auto 28px" }}>
        This fault requires supervisor intervention. Do not attempt further repair without qualified oversight.
      </div>
      <button onClick={onClose} style={{
        padding: "15px 32px", background: C.red, color: C.paper,
        border: "none", borderRadius: 100,
        fontFamily: "'Geist', system-ui, sans-serif", fontSize: 14, fontWeight: 500,
        letterSpacing: "0.04em", cursor: "pointer",
      }}>
        Acknowledge &amp; close
      </button>
    </div>
  );
}

function BranchModal({ type, step, onConfirm, onDismiss }: {
  type: "escalate" | "continue";
  step: typeof MOCK_JOB_CARD.steps[0];
  onConfirm: () => void;
  onDismiss: () => void;
}) {
  const isEscalate = type === "escalate";
  return (
    <div onClick={onDismiss} style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "rgba(46,38,24,0.7)", backdropFilter: "blur(10px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      animation: "dq-fadeIn .3s ease",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        maxWidth: 560, width: "100%", background: C.paper, borderRadius: 32, overflow: "hidden",
        boxShadow: "0 40px 80px -20px rgba(0,0,0,0.33)",
        animation: "dq-branchIn .55s cubic-bezier(.2,1.2,.3,1.05)",
      }}>
        <div style={{
          padding: "14px 28px", background: isEscalate ? C.red : C.accent, color: C.paper,
          fontFamily: "'Geist Mono', monospace", fontSize: 11, fontWeight: 600,
          letterSpacing: "0.14em", textTransform: "uppercase",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 2L2 17h16L10 2z"/><path d="M10 8v4M10 14v.5"/>
          </svg>
          {isEscalate ? "Escalation Required" : "Fault Detected"}
        </div>
        <div style={{ padding: "32px 36px 28px" }}>
          <div style={{
            fontFamily: "'Fraunces', Georgia, serif", fontSize: 30, fontWeight: 350,
            lineHeight: 1.1, letterSpacing: "-0.02em", color: C.ink, marginBottom: 12,
          }}>
            {isEscalate
              ? <>Fault detected — <em style={{ fontStyle: "italic", color: C.red }}>escalate</em> to supervisor.</>
              : <>{step.instruction} — result: <em style={{ fontStyle: "italic", color: C.accentD }}>{step.no_label}</em>.</>
            }
          </div>
          <div style={{ fontFamily: "'Geist', system-ui, sans-serif", fontSize: 15, lineHeight: 1.6, color: C.ink2, marginBottom: 16 }}>
            {isEscalate
              ? "This fault requires escalation. Do not proceed further without qualified supervision."
              : `Record the result "${step.no_label}" and follow the corrective action before continuing.`
            }
          </div>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: C.ink3, padding: "8px 12px", background: C.muted, borderRadius: 8, marginBottom: 20, display: "inline-block" }}>
            Ref: {step.source_citation}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onConfirm} style={{
              flex: 1, padding: "15px 22px", background: isEscalate ? C.red : C.ink, color: C.paper,
              border: "none", borderRadius: 100,
              fontFamily: "'Geist', system-ui, sans-serif", fontSize: 14, fontWeight: 500,
              letterSpacing: "0.04em", cursor: "pointer",
            }}>
              {isEscalate ? "Confirm escalation" : "Confirmed, continue"}
            </button>
            <button onClick={onDismiss} style={{
              padding: "15px 22px", background: "transparent", color: C.ink2,
              border: `1px solid ${C.line}`, borderRadius: 100,
              fontFamily: "'Geist', system-ui, sans-serif", fontSize: 14, fontWeight: 500,
              cursor: "pointer",
            }}>
              Go back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Job Card Panel ───────────────────────────────────────────────────────────
function JobCardPanel({ onClose }: { onClose: () => void }) {
  const [state, dispatch] = useReducer(jcReducer, initialJCState);
  const rootRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, currentDx: 0, maxDx: 0 });

  const { metadata, steps } = MOCK_JOB_CARD;
  const currentStep = steps[state.currentStepIdx] ?? null;
  const jobId = `JC-${String(simpleHash(metadata.fault_description)).slice(0, 4).padStart(4, "0")}`;

  // Load after 600ms to simulate generation
  useEffect(() => {
    const t = setTimeout(() => dispatch({ type: "READY" }), 600);
    return () => clearTimeout(t);
  }, []);

  // Timer tick
  useEffect(() => {
    if (state.status !== "active") return;
    const t = setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => clearInterval(t);
  }, [state.status]);

  // Auto-focus for keyboard
  useEffect(() => { rootRef.current?.focus(); }, []);

  // Center swipe handle when step changes
  useEffect(() => {
    if (!handleRef.current || !swiperRef.current) return;
    const trackW = swiperRef.current.offsetWidth;
    const handleW = handleRef.current.offsetWidth || 76;
    handleRef.current.style.left = `${(trackW - handleW) / 2}px`;
    handleRef.current.style.transform = "translateX(0)";
    if (swiperRef.current) {
      swiperRef.current.style.background = C.muted;
    }
  }, [state.currentStepIdx]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (state.status !== "active" || state.branchModal) return;
    if (e.key === "y" || e.key === "Y" || e.key === "ArrowRight") dispatch({ type: "ANSWER", choice: "yes" });
    else if (e.key === "n" || e.key === "N" || e.key === "ArrowLeft") dispatch({ type: "ANSWER", choice: "no" });
  }, [state.status, state.branchModal]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (state.status !== "active") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const trackW = swiperRef.current?.offsetWidth ?? 400;
    const handleW = handleRef.current?.offsetWidth ?? 76;
    drag.current = { active: true, startX: e.clientX, currentDx: 0, maxDx: (trackW - handleW - 12) / 2 };
    if (handleRef.current) handleRef.current.style.transition = "none";
  }, [state.status]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const dx = Math.max(-drag.current.maxDx, Math.min(drag.current.maxDx, e.clientX - drag.current.startX));
    drag.current.currentDx = dx;
    if (handleRef.current) handleRef.current.style.transform = `translateX(${dx}px)`;
    if (swiperRef.current) {
      const threshold = drag.current.maxDx * 0.4;
      if (handleRef.current) {
        handleRef.current.style.background = dx > threshold ? C.green : dx < -threshold ? C.accent : C.ink;
      }
    }
  }, []);

  const handlePointerUp = useCallback(() => {
    if (!drag.current.active) return;
    drag.current.active = false;
    const { currentDx, maxDx } = drag.current;
    if (handleRef.current) {
      handleRef.current.style.transition = "background .25s, transform .45s cubic-bezier(.34,1.4,.35,1)";
      handleRef.current.style.transform = "translateX(0)";
      handleRef.current.style.background = C.ink;
    }
    const threshold = maxDx * 0.4;
    if (currentDx > threshold) dispatch({ type: "ANSWER", choice: "yes" });
    else if (currentDx < -threshold) dispatch({ type: "ANSWER", choice: "no" });
  }, []);

  const priorityColor = PRIORITY_COLORS[metadata.priority] ?? C.accent;
  const statusLabels: Record<JCStatus, string> = { loading: "Generating", active: "In Progress", complete: "Complete", escalated: "Escalated" };
  const statusBg: Record<JCStatus, string> = { loading: "#e8e0d0", active: "#fbe9d9", complete: "#dce4d1", escalated: "#f3c9c0" };
  const statusColor: Record<JCStatus, string> = { loading: C.ink2, active: C.accentD, complete: C.green, escalated: C.red };

  return (
    <div ref={rootRef} tabIndex={0} onKeyDown={handleKeyDown}
      style={{
        position: "fixed", inset: 0, background: C.paper,
        fontFamily: "'Geist', system-ui, sans-serif", color: C.ink,
        overflow: "hidden", outline: "none", zIndex: 50,
      }}
    >
      {/* Grain overlay */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 200,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.11 0 0 0 0 0.1 0 0 0 0 0.08 0 0 0 0.7 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E")`,
        opacity: 0.4, mixBlendMode: "multiply",
      }} />

      <div style={{
        maxWidth: 1320, margin: "0 auto", height: "100%",
        display: "grid", gridTemplateRows: "auto 1fr",
        padding: "20px 32px", gap: 20,
        position: "relative", zIndex: 1,
      }}>
        {/* Header */}
        <header style={{
          display: "grid", gridTemplateColumns: "auto 1fr auto",
          alignItems: "center", gap: 16,
          paddingBottom: 16, borderBottom: `1px solid ${C.line}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%", background: C.ink, color: C.paper,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Fraunces', Georgia, serif", fontSize: 22, fontWeight: 500,
              fontStyle: "italic", letterSpacing: "-0.02em", flexShrink: 0,
            }}>D</div>
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 22, fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1, whiteSpace: "nowrap" }}>
              Diagnost<em style={{ fontStyle: "italic", fontWeight: 300, color: C.ink2 }}>iq</em>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "'Geist Mono', monospace", fontSize: 11, color: C.ink3, letterSpacing: "0.04em", justifyContent: "center" }}>
            <span>{jobId}</span>
            <span style={{ color: "#c4b89f" }}>·</span>
            <b style={{ color: C.ink2, fontWeight: 500 }}>{metadata.equipment}</b>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={onClose} aria-label="Close job card" style={{
              width: 40, height: 40, borderRadius: "50%", background: "transparent",
              border: `1px solid ${C.line}`, color: C.ink2, display: "flex", alignItems: "center",
              justifyContent: "center", cursor: "pointer", fontSize: 20, lineHeight: 1,
            }}>×</button>
          </div>
        </header>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 32, minHeight: 0 }}>
          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0, minHeight: 0, overflow: "hidden" }}>
            {/* Status pill */}
            <div style={{ marginBottom: 20 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "7px 14px 7px 12px", borderRadius: 100,
                fontFamily: "'Geist Mono', monospace", fontSize: 11, fontWeight: 500,
                letterSpacing: "0.06em", textTransform: "uppercase",
                background: statusBg[state.status], color: statusColor[state.status],
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%", background: statusColor[state.status], flexShrink: 0,
                  animation: state.status === "active" ? "dq-blip 1.6s ease-in-out infinite" : undefined,
                }} />
                {statusLabels[state.status]}
              </div>
            </div>

            {/* Fault headline */}
            <div>
              <div style={{
                fontFamily: "'Fraunces', Georgia, serif", fontWeight: 350,
                fontSize: 40, lineHeight: 1.02, letterSpacing: "-0.025em",
                color: C.ink, marginBottom: 12,
              }}>
                {metadata.fault_description.split(" ").slice(0, -2).join(" ")}{" "}
                <em style={{ fontStyle: "italic", fontWeight: 300, color: C.accentD }}>
                  {metadata.fault_description.split(" ").slice(-2).join(" ")}
                </em>
              </div>
              <div style={{ fontFamily: "'Geist', system-ui, sans-serif", fontSize: 14, lineHeight: 1.5, color: C.ink2 }}>
                {metadata.equipment}
              </div>
            </div>

            {/* Ledger */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, borderTop: `1px solid ${C.line}`, marginTop: 16 }}>
              {[
                ["Asset ID", metadata.asset_id, true],
                ["Priority", null, false],
                ["Equipment", metadata.equipment, true],
                ["Status", metadata.priority === "CRITICAL" ? "Urgent" : "Active", false],
              ].map(([label, val, mono], i) => (
                <div key={i as number} style={{
                  padding: "10px 0", borderBottom: `1px solid ${C.line}`,
                  ...(i % 2 === 0 ? { paddingRight: 14, borderRight: `1px solid ${C.line}` } : { paddingLeft: 14 }),
                }}>
                  <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: C.ink3, marginBottom: 3 }}>{label as string}</div>
                  <div style={{ fontFamily: mono ? "'Geist Mono', monospace" : "'Fraunces', Georgia, serif", fontSize: mono ? 13 : 16, fontWeight: mono ? 500 : 400, color: C.ink }}>
                    {label === "Priority"
                      ? <span style={{ display: "inline-block", fontFamily: "'Geist Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", padding: "2px 8px", borderRadius: 100, color: "#fff", background: priorityColor }}>{metadata.priority}</span>
                      : val as string
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* Timer */}
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "14px 0 4px" }}>
              <div>
                <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: C.ink3, marginBottom: 2 }}>Elapsed</div>
                <div style={{
                  fontFamily: "'Fraunces', Georgia, serif", fontSize: 48, fontWeight: 300,
                  letterSpacing: "-0.04em", lineHeight: 0.95, fontVariantNumeric: "tabular-nums",
                  color: state.status === "active" ? C.accentD : state.status === "complete" ? C.green : state.status === "escalated" ? C.red : C.ink,
                }}>
                  {formatTimer(state.elapsed)}
                </div>
              </div>
              <ProgressRing completed={state.completedSteps.length} total={steps.length} status={state.status} />
            </div>

            {/* Completed steps */}
            {state.completedSteps.length > 0 && (
              <div style={{ flex: 1, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column", marginTop: 8 }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 15, fontStyle: "italic", fontWeight: 400, color: C.ink2 }}>Record</div>
                  <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: C.ink3 }}>{state.completedSteps.length} step{state.completedSteps.length !== 1 ? "s" : ""}</div>
                </div>
                <div style={{ flex: 1, overflowY: "auto", paddingRight: 4 }}>
                  {state.completedSteps.map(step => {
                    const record = state.history.find(h => h.stepId === step.id);
                    const choice = record?.choice ?? "yes";
                    return (
                      <div key={step.id} style={{ display: "grid", gridTemplateColumns: "24px 1fr auto", gap: 8, padding: "9px 0", alignItems: "start", borderBottom: `1px dashed ${C.line}` }}>
                        <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, color: C.ink3, paddingTop: 2, letterSpacing: "0.05em" }}>{String(step.id).padStart(2, "0")}</div>
                        <div style={{ fontFamily: "'Geist', system-ui, sans-serif", fontSize: 12, lineHeight: 1.4, color: C.ink2 }}>{step.instruction}</div>
                        <span style={{
                          fontFamily: "'Geist Mono', monospace", fontSize: 9.5, fontWeight: 500,
                          letterSpacing: "0.08em", textTransform: "uppercase",
                          padding: "3px 7px", borderRadius: 100,
                          display: "inline-flex", alignItems: "center", gap: 5, whiteSpace: "nowrap",
                          background: choice === "yes" ? "#dce4d1" : "#fbe9d9",
                          color: choice === "yes" ? C.green : C.accentD,
                        }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: choice === "yes" ? C.green : C.accent }} />
                          {choice === "yes" ? "Pass" : "Fail"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0, minHeight: 0, overflow: "hidden", position: "relative" }}>
            {state.status === "loading" && (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#fbe9d9", border: `2px solid ${C.accent}`, animation: "dq-pulse 1.6s ease-in-out infinite" }} />
                <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: C.ink3, letterSpacing: "0.1em", textTransform: "uppercase" }}>Generating job card…</div>
              </div>
            )}

            {state.status === "active" && currentStep && (
              <>
                {/* Step nav */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.ink3 }}>Diagnostic Step</div>
                  <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 18, fontWeight: 400, color: C.ink2, fontStyle: "italic" }}>
                    <span style={{ color: C.accentD, fontStyle: "normal", fontWeight: 500, fontSize: 24 }}>{currentStep.id}</span>
                    {" / "}{steps.length}
                  </div>
                </div>
                {/* Step progress bar */}
                <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
                  {steps.map(s => {
                    const done = state.completedSteps.some(c => c.id === s.id);
                    const active = s.id === currentStep.id;
                    return (
                      <div key={s.id} style={{
                        flex: 1, height: 3, borderRadius: 2,
                        background: done ? C.green : active ? C.accent : C.line,
                        position: "relative", overflow: "hidden",
                      }}>
                        {active && <div style={{
                          position: "absolute", inset: 0,
                          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                          animation: "dq-shimmer 1.6s linear infinite",
                        }} />}
                      </div>
                    );
                  })}
                </div>
                <StepCard
                  step={currentStep}
                  swiperRef={swiperRef}
                  handleRef={handleRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                />
              </>
            )}

            {state.status === "complete" && (
              <CompletePanel
                elapsed={state.elapsed}
                completed={state.completedSteps.length}
                faults={state.history.filter(h => h.choice === "no").length}
                onClose={onClose}
              />
            )}

            {state.status === "escalated" && (
              <EscalatePanel onClose={onClose} />
            )}
          </div>
        </div>
      </div>

      {/* Branch modal */}
      {state.branchModal && currentStep && (
        <BranchModal
          type={state.branchModal}
          step={currentStep}
          onConfirm={() => dispatch({ type: "CONFIRM_BRANCH" })}
          onDismiss={() => dispatch({ type: "DISMISS_BRANCH" })}
        />
      )}
    </div>
  );
}

// ─── Main Demo Page ───────────────────────────────────────────────────────────
export default function DiagnostiqDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [displayedText, setDisplayedText] = useState("");
  const [showJobCard, setShowJobCard] = useState(false);
  const [jobCardClosed, setJobCardClosed] = useState(false);
  const [inputText, setInputText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Pre-fill the input after a short delay for demo effect
  useEffect(() => {
    const t = setTimeout(() => setInputText("Unit is not cooling properly"), 800);
    return () => clearTimeout(t);
  }, []);

  const startDemo = useCallback(() => {
    if (submitted) return;
    setSubmitted(true);
    setPhase("thinking");

    // After thinking delay, start streaming
    setTimeout(() => {
      setPhase("streaming");
      let i = 0;
      const words = MOCK_ANSWER.split(" ");
      const interval = setInterval(() => {
        i++;
        setDisplayedText(words.slice(0, i).join(" "));
        if (i >= words.length) {
          clearInterval(interval);
          setPhase("done");
          // Open job card after a beat
          setTimeout(() => setShowJobCard(true), 700);
        }
      }, 40);
    }, 1200);
  }, [submitted]);

  const handleSuggestion = useCallback((s: string) => {
    setInputText(s);
  }, []);

  return (
    <>
      {/* Keyframes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500;600&display=swap');
        @keyframes dq-blip { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.8);opacity:0.3} }
        @keyframes dq-pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.15);opacity:0.6} }
        @keyframes dq-cursor { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes dq-cardIn { from{opacity:0;transform:translateY(12px) scale(.98)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes dq-fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes dq-branchIn { 0%{opacity:0;transform:translateY(32px) scale(.92)} 100%{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes dq-shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: C.paper,
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Geist', system-ui, sans-serif",
        color: C.ink,
      }}>
        {/* Back nav */}
        <nav style={{
          borderBottom: `1px solid ${C.line}`, background: "rgba(243,237,225,0.9)",
          backdropFilter: "blur(8px)", position: "sticky", top: 0, zIndex: 40,
        }}>
          <div style={{
            maxWidth: 1200, margin: "0 auto", padding: "0 24px",
            height: 48, display: "flex", alignItems: "center", justifyContent: "space-between",
            fontFamily: "'Geist Mono', monospace", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase",
          }}>
            <Link to="/project/p8" style={{ color: C.ink3, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 10H4M8 5L3 10l5 5"/>
              </svg>
              Back to Case Study
            </Link>
            <span style={{ color: C.ink3 }}>Diagnostiq — Interactive Demo</span>
            <span style={{ color: C.ink3, padding: "3px 10px", border: `1px solid ${C.line}`, borderRadius: 100 }}>Mock</span>
          </div>
        </nav>

        {/* Demo context banner */}
        <div style={{
          background: "#fbe9d9", borderBottom: `1px solid rgba(217,107,46,0.3)`,
          padding: "10px 24px", textAlign: "center",
          fontFamily: "'Geist Mono', monospace", fontSize: 11, color: C.accentD,
          letterSpacing: "0.06em",
        }}>
          DEMO MODE — Pre-recorded responses. No backend required. Try the swipe gesture or press Y / N keys inside the job card.
        </div>

        {/* App shell */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "calc(100vh - 96px)" }}>
          {/* Entry bar */}
          <form onSubmit={e => { e.preventDefault(); startDemo(); }} style={{
            background: C.paper, borderBottom: `1px solid ${C.line}`,
            padding: "0 24px", flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0" }}>
              {/* Brand */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%", background: C.ink, color: C.paper,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Fraunces', Georgia, serif", fontSize: 19, fontWeight: 500,
                  fontStyle: "italic", letterSpacing: "-0.02em",
                }}>D</div>
                <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 17, fontWeight: 400, letterSpacing: "-0.02em", color: C.ink, whiteSpace: "nowrap" }}>
                  Diagnost<em style={{ fontStyle: "italic", fontWeight: 300, color: C.ink2 }}>iq</em>
                </div>
              </div>
              <div style={{ width: 1, height: 26, background: C.line, flexShrink: 0 }} />
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                disabled={phase !== "idle"}
                placeholder="Describe a fault or ask about settings, wiring, specs…"
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  fontFamily: "'Geist', system-ui, sans-serif", fontSize: 15,
                  color: C.ink, lineHeight: 1.5, minWidth: 0,
                  cursor: phase !== "idle" ? "default" : "text",
                }}
              />
              {phase === "thinking" || phase === "streaming" ? (
                <div style={{ display: "flex", gap: 4, alignItems: "center", flexShrink: 0 }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 5, height: 5, borderRadius: "50%", background: C.accent,
                      animation: `dq-blip 1.2s ease-in-out ${i * 0.18}s infinite`,
                    }} />
                  ))}
                </div>
              ) : (
                <button type="submit" disabled={!inputText.trim() || phase !== "idle"} aria-label="Send" style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: inputText.trim() && phase === "idle" ? C.ink : C.muted,
                  border: "none",
                  color: inputText.trim() && phase === "idle" ? C.paper : C.ink3,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: inputText.trim() && phase === "idle" ? "pointer" : "default",
                  transition: "background .2s, color .2s", flexShrink: 0,
                }}>
                  <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 10h12M12 5l5 5-5 5"/>
                  </svg>
                </button>
              )}
            </div>
          </form>

          {/* Result area */}
          <div style={{ flex: 1, background: C.paper, overflowY: "auto" }}>
            {phase === "idle" && !submitted && (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40, minHeight: "60vh" }}>
                <div style={{ textAlign: "center", maxWidth: 400 }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: "50%", background: C.muted,
                    border: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 20px",
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.ink3} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="8" y1="13" x2="16" y2="13"/>
                      <line x1="8" y1="17" x2="12" y2="17"/>
                    </svg>
                  </div>
                  <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 22, fontWeight: 350, color: C.ink2, letterSpacing: "-0.02em", marginBottom: 8 }}>
                    Ask anything
                  </div>
                  <div style={{ fontFamily: "'Geist', system-ui, sans-serif", fontSize: 14, color: C.ink3, lineHeight: 1.6, marginBottom: 24 }}>
                    Describe a fault for a diagnostic job card, or ask about settings, wiring, and specs.
                  </div>
                  <button onClick={startDemo} style={{
                    padding: "12px 28px", background: C.ink, color: C.paper,
                    border: "none", borderRadius: 100,
                    fontFamily: "'Geist', system-ui, sans-serif", fontSize: 13, fontWeight: 500,
                    letterSpacing: "0.04em", cursor: "pointer",
                  }}>
                    Run demo query →
                  </button>
                </div>
              </div>
            )}

            {(phase === "thinking" || phase === "streaming" || phase === "done") && (
              <div style={{ maxWidth: 680, width: "100%", padding: "40px 32px", margin: "0 auto" }}>
                {phase === "thinking" && <ThinkingDots />}
                {(phase === "streaming" || phase === "done") && displayedText && (
                  <div>
                    <StreamingText text={displayedText} streaming={phase === "streaming"} />
                    {phase === "done" && (
                      <>
                        <SuggestionPills suggestions={MOCK_SUGGESTIONS} onSend={handleSuggestion} />
                        {jobCardClosed && (
                          <div style={{ marginTop: 24, padding: "12px 16px", background: C.muted, borderRadius: 12, fontFamily: "'Geist Mono', monospace", fontSize: 12, color: C.ink3 }}>
                            Job card closed. You can reopen it by asking about another fault.
                          </div>
                        )}
                        {!showJobCard && !jobCardClosed && (
                          <div style={{
                            marginTop: 24, display: "flex", alignItems: "center", gap: 10,
                            padding: "14px 18px", background: "#fbe9d9", border: `1px solid rgba(217,107,46,0.3)`, borderRadius: 12,
                          }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.accent, animation: "dq-blip 1.6s ease-in-out infinite" }} />
                            <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: C.accentD, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                              Diagnostic job card generated
                            </span>
                            <button onClick={() => setShowJobCard(true)} style={{
                              marginLeft: "auto", padding: "6px 14px", background: C.accent, color: C.paper,
                              border: "none", borderRadius: 100, fontSize: 11, cursor: "pointer",
                              fontFamily: "'Geist Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase",
                            }}>
                              Open
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Card Overlay */}
      {showJobCard && (
        <JobCardPanel onClose={() => { setShowJobCard(false); setJobCardClosed(true); }} />
      )}
    </>
  );
}
