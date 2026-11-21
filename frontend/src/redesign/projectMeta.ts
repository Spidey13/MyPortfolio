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
  | "cache"
  | "fire"
  | "incident";

export interface ProjectVisualMeta {
  shortName: string;
  label: string;
  railLabel: string;
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
  p13: {
    shortName: "Incident Lens",
    label: "Public-record research",
    railLabel: "Checks public records",
    date: "October 2026",
    artifact: "incident",
    tone: "green",
    home: { order: 2.5, mode: "quiet", keyword: "RECORDS", thesis: "Finds what was on the public record before an injury and what appeared later." },
    architecture: ["Locate sources", "Save records", "Extract conditions", "Check", "Write packet"],
    decision: {
      rejected: "Collapse source disagreements into one answer",
      chosen: "Keep each source and its checks in the packet",
      reason: "An investigator can check the source wording and follow up on conclusions the records cannot settle.",
    },
    trust: [
      "The walkthrough uses two saved hypothetical cases.",
      "A 311 report marked Closed does not establish when or whether a repair happened.",
      "The evaluation uses model-written labels adjudicated by the owner.",
    ],
  },
  p12: {
    shortName: "Branch Voice",
    label: "Branching voice planner",
    railLabel: "Explore plans by voice",
    date: "November 2026",
    artifact: "audio",
    tone: "violet",
    home: { order: 2.6, mode: "quiet", keyword: "VOICE", thesis: "A voice planner that keeps each detour in its own thread." },
    architecture: ["Voice", "Route", "Read history", "Reply", "Report"],
    decision: {
      rejected: "Duplicate turns when a conversation forks",
      chosen: "Reference the parent branch and a turn boundary",
      reason: "All branches read from a shared turn store.",
    },
    trust: [
      "The edited desktop replay uses recorded state and shortened text. The mobile insert is staged.",
      "The four-turn merge and its two digests come from one recorded session.",
      "Router timings measure cached text routing.",
    ],
  },
  p1: {
    shortName: "Research Agent",
    label: "Scientific discovery system",
    railLabel: "Reviews research drafts",
    date: "November 2025",
    artifact: "research",
    tone: "lime",
    home: { order: 6, mode: "quiet", keyword: "RESEARCH", thesis: "A team-built research workflow with a visible critique-and-revision gate." },
    architecture: ["Plan", "Search", "Analyze", "Critique", "Report"],
    decision: {
      rejected: "Generate directly from retrieved papers",
      chosen: "Parse critique verdict into revision or approval state",
      reason: "The decision gate is inspectable, but its model-issued verdict is not citation verification.",
    },
    trust: [
      "Source access is bounded to arXiv and Semantic Scholar through MCP tools.",
      "The critique verdict is model-issued, not a deterministic citation check.",
      "No saved report or independent citation-accuracy evaluation is presented.",
      "The work is attributed to a team.",
    ],
  },
  p2: {
    shortName: "ReMind",
    label: "Memory-aware retrieval",
    railLabel: "Ranks memories over time",
    date: "December 2025",
    artifact: "memory",
    tone: "cyan",
    home: { order: 9, mode: "quiet", keyword: "MEMORY", thesis: "Retrieval that remembers recency, repetition, and provenance." },
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
    railLabel: "Simulates F1 pit strategy",
    date: "June 2025",
    artifact: "race",
    tone: "coral",
    home: { order: 7, mode: "visual", thesis: "Six agents planning an F1 race as conditions change." },
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
    railLabel: "Trains wafer defect models",
    date: "2025",
    artifact: "wafer",
    tone: "violet",
    home: { order: 8, mode: "visual", thesis: "A 590-sensor wafer training path, with an unfinished inference contract." },
    architecture: ["Schema", "KNN impute", "Zero-variance", "K-Means", "Model selection"],
    decision: {
      rejected: "One global classifier over every wafer",
      chosen: "Cluster assignment before per-cluster classification",
      reason: "The training code makes preprocessing and model selection inspectable per cluster.",
    },
    trust: [
      "The schema has 590 sensor fields plus wafer ID and output label.",
      "The prediction loop replaces its cluster subset with the full table.",
      "No saved model score or reliable deployed inference is claimed.",
    ],
  },
  p5: {
    shortName: "Prompt Optimization",
    label: "Healthcare NLP evaluation",
    railLabel: "Tests against a baseline",
    date: "2025",
    artifact: "evaluation",
    tone: "amber",
    home: { order: 10, mode: "quiet", keyword: "EVALUATION", thesis: "The prompt optimizer tested candidates and retained the default." },
    architecture: ["Task contract", "MIPROv2", "SemanticF1", "Evaluate", "Retain default"],
    decision: {
      rejected: "Assume an optimized candidate must improve the baseline",
      chosen: "Retain the default when evaluated candidates score lower",
      reason: "The recorded 80-example full evaluation selected the default program.",
    },
    trust: [
      "The work is an NLP benchmark, not a clinical diagnostic system.",
      "The default scored 61.23; the best evaluated candidate scored 55.69.",
      "PEFT code exists, but no comparable final score is established.",
    ],
  },
  p6: {
    shortName: "Codiey",
    label: "Voice-first coding partner",
    railLabel: "Talk through a codebase",
    date: "March 2026",
    artifact: "voice",
    tone: "blue",
    home: { order: 4, mode: "visual", thesis: "A voice-first coding partner that understands the whole repository." },
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
    label: "Cross-modal comparison experiment",
    railLabel: "Compares lyrics and audio",
    date: "2025",
    artifact: "audio",
    tone: "pink",
    home: { order: 11, mode: "visual", thesis: "A team experiment where matched and unmatched pairs barely separated." },
    architecture: ["Audio", "Lyrics", "Encode", "Compare", "Inspect overlap"],
    decision: {
      rejected: "Treat matching vector dimensions as semantic alignment",
      chosen: "Inspect matched against unmatched similarity",
      reason: "The saved comparison does not establish emotional alignment.",
    },
    trust: [
      "Both saved means round to −0.115; separation is 0.039σ above random.",
      "The MuLan-style encoders do not load trained joint weights.",
      "The result cannot support an emotion-detector claim.",
    ],
  },
  p8: {
    shortName: "Diagnostiq",
    label: "AI technical support agent",
    railLabel: "Cites service manuals",
    date: "May 2026",
    artifact: "diagnostic",
    tone: "orange",
    home: { order: 2, mode: "visual", thesis: "Turning equipment faults into repair plans backed by manual citations." },
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
    railLabel: "GitHub changes with approval",
    date: "July 2026",
    artifact: "approval",
    tone: "green",
    home: { order: 5, mode: "quiet", keyword: "APPROVAL", thesis: "A GitHub agent that cannot write without human approval." },
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
    railLabel: "Finds prompt cache misses",
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
  p11: {
    shortName: "FireTrace",
    label: "Wildfire source mapping",
    railLabel: "Wildfire source mapping",
    date: "October 2026",
    artifact: "fire",
    tone: "lime",
    home: { order: 3, mode: "visual", thesis: "Every source's fire outline, kept apart on its own clocks." },
    architecture: ["Collect", "Normalize", "Gate", "Compare", "Map"],
    decision: {
      rejected: "Merge every source into one current fire polygon",
      chosen: "Store each outline as its own observation with separate clocks",
      reason: "A merged shape hides that the sources were observed hours apart and disagree.",
    },
    trust: [
      "Only flights that pass a five-check comparability gate are compared; 4 of 26 were excluded, none deleted.",
      "An official outline's observation time is inferred only at IoU 0.997 or higher; otherwise it stays unknown.",
      "Detection accuracy and lead time have not been validated.",
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
