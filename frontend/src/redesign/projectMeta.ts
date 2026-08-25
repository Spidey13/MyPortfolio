import type { Project } from "../data/projects";

export type ArtifactKind =
  | "research"
  | "memory"
  | "race"
  | "wafer"
  | "evaluation"
  | "voice"
  | "audio"
  | "diagnostic"
  | "approval"
  | "cache";

export interface ProjectVisualMeta {
  shortName: string;
  label: string;
  date: string;
  artifact: ArtifactKind;
  tone: string;
  home: {
    order: number;
    mode: "visual" | "quiet";
    keyword?: string;
    thesis: string;
  };
  architecture: string[];
  decision: {
    rejected: string;
    chosen: string;
    reason: string;
  };
  trust: string[];
}

export const PROJECT_META: Record<string, ProjectVisualMeta> = {
  p1: {
    shortName: "Research Agent",
    label: "Scientific discovery system",
    date: "November 2025",
    artifact: "research",
    tone: "lime",
    home: { order: 5, mode: "quiet", keyword: "RESEARCH", thesis: "Scientific research assembled through citation-grounded agent collaboration." },
    architecture: ["Plan", "Search", "Analyze", "Critique", "Report"],
    decision: {
      rejected: "Generate directly from retrieved papers",
      chosen: "Insert a citation-grounding critique pass",
      reason: "Unsupported claims are stopped before the final report is assembled.",
    },
    trust: [
      "Source access is bounded to arXiv and Semantic Scholar through MCP tools.",
      "The critique pass flags unsupported citations before report generation.",
      "The system was co-developed; ownership is not presented as solo work.",
    ],
  },
  p2: {
    shortName: "ReMind",
    label: "Memory-aware retrieval",
    date: "December 2025",
    artifact: "memory",
    tone: "cyan",
    home: { order: 8, mode: "quiet", keyword: "MEMORY", thesis: "Retrieval that remembers recency, repetition, and provenance." },
    architecture: ["Retrieve", "Rerank", "Reinforce", "Score", "Explain"],
    decision: {
      rejected: "Semantic similarity alone",
      chosen: "Hybrid retrieval plus temporal and reinforcement scores",
      reason: "Long-running memory needs to account for recency and repeated use.",
    },
    trust: [
      "The confidence signal is multi-factor and tuned by inspection, not calibrated probability.",
      "The prototype exposes chunk provenance so retrieval failures can be inspected.",
      "The default semantic/temporal weighting remains configurable.",
    ],
  },
  p3: {
    shortName: "StratSim",
    label: "F1 race strategy simulator",
    date: "June 2025",
    artifact: "race",
    tone: "coral",
    home: { order: 6, mode: "visual", thesis: "Six agents planning an F1 race as conditions change." },
    architecture: ["Telemetry", "Tire model", "Six agents", "Lap forecast", "Pit decision"],
    decision: {
      rejected: "Constant-pace strategy baseline",
      chosen: "Clustered race state with learned lap-time forecasts",
      reason: "Tire degradation and changing stint conditions drive the decision quality.",
    },
    trust: [
      "The ~0.05s MAE is scoped to held-out clean-air laps.",
      "The +18% comparison is against a constant-pace baseline on the same holdout.",
      "Historical FastF1 telemetry does not reproduce every live-race variable.",
    ],
  },
  p4: {
    shortName: "Wafer Defects",
    label: "Cluster-conditioned ML pipeline",
    date: "2025",
    artifact: "wafer",
    tone: "violet",
    home: { order: 7, mode: "visual", thesis: "An inspectable ML pipeline for high-dimensional wafer defects." },
    architecture: ["Schema", "KNN impute", "K-Means", "Compare models", "Serve"],
    decision: {
      rejected: "One global classifier over every wafer",
      chosen: "Cluster assignment before per-cluster classification",
      reason: "The pipeline makes preprocessing and model selection inspectable per segment.",
    },
    trust: [
      "The work uses the 591-sensor SECOM benchmark dataset.",
      "Classifier selection is measured with GridSearchCV on ROC-AUC.",
      "It is a reference ML pipeline, not a claim of deployment in a fabrication plant.",
    ],
  },
  p5: {
    shortName: "Prompt Optimization",
    label: "Healthcare NLP evaluation",
    date: "2025",
    artifact: "evaluation",
    tone: "amber",
    home: { order: 9, mode: "quiet", keyword: "EVALUATION", thesis: "Comparing prompt optimization and fine-tuning under one evaluation." },
    architecture: ["Perspectives", "MIPROv2", "PEFT", "Five metrics", "Compare"],
    decision: {
      rejected: "Manual prompt iteration without a common benchmark",
      chosen: "MIPROv2 and PEFT under one held-out evaluation harness",
      reason: "Prompt optimization and fine-tuning need the same task and metrics to compare honestly.",
    },
    trust: [
      "The work is an NLP benchmark, not a clinical diagnostic system.",
      "MIPROv2 is described as competitive, without inventing a winning percentage.",
      "Five metrics are retained because no single score captures the summarization task.",
    ],
  },
  p6: {
    shortName: "Codiey",
    label: "Voice-first coding partner",
    date: "March 2026",
    artifact: "voice",
    tone: "blue",
    home: { order: 3, mode: "visual", thesis: "A voice-first coding partner that understands the whole repository." },
    architecture: ["Voice", "Neural VAD", "Tool gate", "AST context", "Repo graph"],
    decision: {
      rejected: "Energy-threshold voice detection",
      chosen: "Browser-side Silero neural VAD",
      reason: "It removed a recurring class of WebSocket 1008 disconnects.",
    },
    trust: [
      "The <200ms figure is browser-measured perceived round-trip latency.",
      "Blocking tools are gated so tool execution cannot leak into the audio loop.",
      "Tool contracts are validated with Pydantic on both sides of the WebSocket.",
    ],
  },
  p7: {
    shortName: "Audio–Lyric",
    label: "Cross-modal emotional alignment",
    date: "2025",
    artifact: "audio",
    tone: "pink",
    home: { order: 10, mode: "visual", thesis: "Finding emotional alignment between sound and lyrics." },
    architecture: ["Segment", "Identify", "Embed audio", "Embed lyrics", "Align"],
    decision: {
      rejected: "Compare raw modality features directly",
      chosen: "Project OpenL3 and language embeddings into a shared PCA space",
      reason: "The two modalities need a comparable representation before similarity is meaningful.",
    },
    trust: [
      "The reported ~63% value is mean cosine similarity in the shared PCA space.",
      "The analysis covers 712 fixed audio–lyric segment pairs.",
      "The result is exploratory alignment, not a universal measure of musical emotion.",
    ],
  },
  p8: {
    shortName: "Diagnostiq",
    label: "AI technical support agent",
    date: "May 2026",
    artifact: "diagnostic",
    tone: "orange",
    home: { order: 2, mode: "visual", thesis: "Turning equipment faults into cited, actionable repair plans." },
    architecture: ["Fault", "Retrieve", "Cite", "Branch", "Artifact"],
    decision: {
      rejected: "One embedding model and credential path at runtime",
      chosen: "Rich ingest embeddings plus lightweight local serving",
      reason: "The dual-embedding path decouples ingest quality from runtime credentials.",
    },
    trust: [
      "Diagnostic job cards retain source citations to the service manual.",
      "The 80 MB serving model is baked into the image to avoid a cold-start download.",
      "Generated HTML runs in a sandboxed iframe with validation fallbacks.",
    ],
  },
  p9: {
    shortName: "Queue Whisperer",
    label: "Human-approved GitHub agent",
    date: "July 2026",
    artifact: "approval",
    tone: "green",
    home: { order: 4, mode: "quiet", keyword: "APPROVAL", thesis: "A GitHub agent that cannot write without human approval." },
    architecture: ["Read", "Ground", "Propose", "Approve", "Commit"],
    decision: {
      rejected: "Give the model a write tool with a prompt rule",
      chosen: "Keep GitHub writes outside the model-reachable tool set",
      reason: "The safety boundary is enforced by imports and approval state, not model obedience.",
    },
    trust: [
      "Zero GitHub writes are model-initiated.",
      "Every turn has a five-tool-step budget and a 90-second abort.",
      "A citation-trace smoke test rejects answers citing issues the agent never read.",
    ],
  },
  p10: {
    shortName: "cachefault",
    label: "Prefix-cache miss attribution",
    date: "August 2026",
    artifact: "cache",
    tone: "lime",
    home: { order: 1, mode: "quiet", keyword: "CACHE", thesis: "Pinpointing the exact byte that broke an LLM prefix cache." },
    architecture: ["Capture", "Parse", "Diff", "Classify", "Attribute"],
    decision: {
      rejected: "Decode request JSON into ordinary maps",
      chosen: "Forward raw bytes and preserve order, literals and whitespace",
      reason: "The diagnostic proxy cannot be allowed to become the cache-buster.",
    },
    trust: [
      "Identical bytes plus a miss resolves to PROVIDER_SIDE rather than an invented cause.",
      "The OpenAI adapter was not live-validated in the hosted matrix run.",
      "The tool performs post-hoc analysis rather than live monitoring.",
    ],
  },
};

export const getProjectNumber = (project: Pick<Project, "id">) =>
  Number(project.id.replace("p", ""));

export const sortProjects = (projects: Project[]) =>
  [...projects].sort((a, b) => getProjectNumber(a) - getProjectNumber(b));

export const sortHomeProjects = (projects: Project[]) =>
  [...projects].sort((a, b) => getProjectMeta(a.id).home.order - getProjectMeta(b.id).home.order);

export const getProjectMeta = (id: string) => PROJECT_META[id] ?? PROJECT_META.p10;
