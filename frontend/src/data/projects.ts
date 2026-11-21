/**
 * Projects Data
 * Edit this file to add/update your projects
 */

export interface ProjectSTAR {
  situation: string;
  task: string;
  action: string;
  result: string;
  impact: string;
  architecture: string;
}

export interface ProjectModalPreview {
  hook: string; // One compelling sentence about impact/result
  problemTeaser: string; // Brief 1-2 sentence problem description
  heroMetric: {
    label: string; // e.g., "Prediction Accuracy"
    value: string; // e.g., "94%"
  };
}

export interface ProjectMetric {
  label: string; // e.g., "Accuracy", "Daily Processing", "Uptime"
  value: string; // e.g., "94%", "10k+", "99.9%"
}

export interface Project {
  id: string;
  title: string;
  github_url: string;
  deployed_url?: string;
  image?: string;
  video?: string;
  star: ProjectSTAR;
  technologies: string[];
  featured: boolean;
  modalPreview: ProjectModalPreview;
  metrics: ProjectMetric[];
}

export const PROJECTS: Project[] = [
  {
    id: "p12",
    title: "Branch Voice",
    github_url: "https://github.com/Spidey13/VapiHax",
    featured: true,
    technologies: ["TypeScript", "Node.js", "Express", "Vapi", "Deepgram", "Jev", "Claude"],
    star: {
      situation: "A voice planner that keeps each detour in its own thread.",
      task: "Let travelers explore, correct, compare, and combine plans within one conversation.",
      action: "Stored turns once, with branch-local history read through parent pointers and a turn boundary.",
      result: "The recorded Japan merge reads four path turns and carries two source digests.",
      impact: "The session report groups the original Hokkaido plan and its Furano correction under one topic.",
      architecture: "Vapi and Deepgram handle speech, Jev scores routing, TypeScript applies changes to the tree, and Claude writes replies and summaries.",
    },
    modalPreview: {
      hook: "Compare two plans without losing either thread.",
      problemTeaser: "A detour should leave the original plan available to revisit.",
      heroMetric: { label: "Recorded merge", value: "4 turns + 2 digests" },
    },
    metrics: [{ label: "Held-out routing", value: "50 of 54" }],
  },
  {
    id: "p6",
    title: "Codiey - Voice-First AI Coding Partner",
    github_url: "https://github.com/Spidey13/Codiey",
    video: "/codiey-demo.mp4",
    star: {
      situation:
        "Text-based AI coding assistants force constant context-switching between typing, reading responses, and navigating code. Voice-native interaction with deep codebase awareness was largely unexplored at the time of building.",
      task: "Build a voice-first AI coding assistant on Gemini 2.5 Flash native audio with low-latency bidirectional streaming, AST-aware codebase intelligence, live dependency-graph visualization, and session resilience across reconnects.",
      action:
        "Built Codiey, a voice-first coding assistant using Gemini 2.5 Flash native audio over WebSocket. Implemented an end-to-end real-time audio pipeline with AudioWorklet for PCM streaming (16 kHz in, 24 kHz out) and replaced brittle energy-threshold VAD with a browser-side Silero ONNX neural VAD. Designed a two-tier tool system: Tier 1 blocking tools (read, search, AST introspection via tree-sitter) gated by TOOL_PENDING to prevent audio leakage during execution, and Tier 2 silent tools (write_to_rules, mark_as_discussed) for non-intrusive side effects. Defined every tool with Pydantic schemas validated on both sides of the WebSocket so malformed calls fail at the contract instead of corrupting the audio loop. Shaped the tool schemas as MCP-compatible so the same tools can serve other MCP clients without rewrites. Extracted import/require dependency graphs from tree-sitter ASTs across Python/JS/TS and ranked files with personalized PageRank. Built a D3 force-directed graph with live emphasis pulses on files the model was actively reasoning about. Added session resilience via context-window compression, resumption tokens in localStorage, and goAway handling.",
      result:
        "Working voice-native coding assistant with sub-200ms perceived audio latency (browser-measured round-trip), neural VAD that eliminated a recurring class of WebSocket 1008 disconnects, and session continuity across reconnects via compression + resumption tokens.",
      impact:
        "Produced a reference implementation for an emerging developer interface: voice combined with Gemini native audio, function calling, and repo-aware tools.",
      architecture:
        "FastAPI backend serving static assets and tool execution endpoints, with auto-generated OpenAPI docs. Browser-side AudioWorklet for PCM with Web Audio API. Gemini 2.5 Flash BidiGenerateContent WebSocket for native audio. Two-tier tool architecture: blocking tools gated by TOOL_PENDING; silent tools on a thread pool. Tree-sitter parsers for Python/JS/TS with AST-aware introspection. Dependency-graph extraction with personalized PageRank (NumPy/SciPy). D3.js force-directed graph with real-time emphasis. Silero ONNX VAD in-browser. Session management with context compression, resumption tokens, goAway recovery. Persistent project memory in .codiey/rules. Pydantic for tool contracts. Pytest for the tool-execution layer. Sentry for client-side error tracking. Multi-stage Dockerfile for the FastAPI backend with GitHub Actions for lint, type-check, and image build. Deployable on GCP Cloud Run with Secret Manager for the Gemini API key.",
    },
    technologies: [
      "Python",
      "FastAPI",
      "Google Gemini",
      "Tree-sitter",
      "D3.js",
      "WebSocket",
      "ONNX Runtime",
      "Web Audio API",
      "Pydantic",
      "OpenAPI",
      "Pytest",
      "Sentry",
      "MCP",
      "Docker",
      "GitHub Actions",
      "GCP Cloud Run",
      "NumPy",
      "SciPy",
    ],
    featured: true,
    modalPreview: {
      hook: "Voice-first AI coding partner with real-time audio and AST-aware codebase intelligence",
      problemTeaser:
        "Talk to your codebase. Bidirectional audio meets tree-sitter ASTs and PageRank-ranked file context, with a live dependency graph showing what the model is actually reading.",
      heroMetric: {
        label: "Audio Latency",
        value: "<200ms",
      },
    },
    metrics: [
      { label: "Audio Latency", value: "<200ms" },
      { label: "VAD", value: "Silero ONNX" },
      { label: "File Ranking", value: "Personalized PageRank" },
    ],
  },
  {
    id: "p2",
    title: "ReMind - Human-like Memory for AI",
    github_url: "https://github.com/IshanApte/ReMind",
    deployed_url: "https://remind-iota.vercel.app/", // Add your actual deployed URL here
    star: {
      situation:
        "Standard RAG treats all chunks equally regardless of recency or access frequency, which is a poor fit for assistants that maintain context across long-running sessions.",
      task: "Prototype a retrieval layer that adapts chunk priority over time, surfaces what the model is using, and exposes a confidence signal for each answer.",
      action:
        "Built ReMind, a Next.js + Express RAG prototype that adds temporal decay (recently accessed chunks score higher) and reinforcement (frequently accessed chunks score higher) on top of semantic similarity. Built the retriever as a hybrid stack combining BM25 lexical scoring with semantic similarity from sentence-transformers, with Cohere Rerank as an optional final-stage re-ranker for ambiguous queries. Combined semantic and temporal scores with a configurable weighting (defaulted to 60/40 semantic/temporal after qualitative tuning on sample queries). Added a multi-factor confidence score combining groundedness, query-chunk keyword overlap, and context quality with weights tuned by inspection. Orchestrated the retrieve → re-rank → reinforcement update → confidence score → respond flow with LangGraph, modeling each step as an explicit graph node so the pipeline could be inspected and resumed per query. Traced every run with LangSmith for per-query retrieval diagnostics. Built a heatmap UI that highlights which chunks were retrieved for each query.",
      result:
        "Working prototype demonstrating temporal + reinforcement re-ranking on top of hybrid BM25 + semantic retrieval, with a per-answer confidence score and an interactive heatmap surfacing chunk-level provenance.",
      impact:
        "An exploration of memory-augmented retrieval and explainable RAG. Surfacing retrieved chunks made bad answers easier to debug. Most failures came from retrieval, not generation.",
      architecture:
        "Next.js frontend with heatmap visualization. Express backend orchestrating the RAG pipeline with LangChain and LangGraph for stateful graph execution. Python preprocessing for semantic chunking via sentence-transformers. Hybrid retriever combining BM25 + semantic similarity with optional Cohere Rerank. Configurable temporal-decay and reinforcement re-ranking on top. Multi-factor confidence score (groundedness + keyword overlap + context quality, configurable weights). LangSmith for retrieval traces and per-query diagnostics. Pydantic for chunk schemas and confidence-score contracts. Containerized backend with Docker; GitHub Actions for Vercel preview deploys per PR.",
    },
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Express.js",
      "LangChain",
      "LangGraph",
      "LangSmith",
      "Cohere Rerank",
      "BM25",
      "Google Gemini",
      "Python",
      "Sentence Transformers",
      "Pydantic",
      "Docker",
      "GitHub Actions",
      "Jupyter Notebook",
    ],
    featured: true,
    modalPreview: {
      hook: "RAG with hybrid retrieval, temporal decay, reinforcement, and per-chunk provenance heatmap",
      problemTeaser:
        "Standard RAG treats every chunk equally. ReMind adds recency, reinforcement, hybrid BM25 + semantic retrieval, and a visible confidence signal so you can see what the model is using.",
      heroMetric: {
        label: "Re-ranking",
        value: "Temporal + Reinforcement",
      },
    },
    metrics: [
      { label: "Retrieval", value: "Hybrid BM25 + Semantic" },
      { label: "Re-ranking", value: "Temporal + Reinforcement" },
      { label: "Provenance", value: "Per-chunk Heatmap" },
    ],
  },
  {
    id: "p3",
    title: "StratSim - F1 Race Strategy Simulator",
    github_url: "https://github.com/Spidey13/StratSim",
    deployed_url: "https://stratsim.streamlit.app/", // Add your actual deployed URL here
    star: {
      situation:
        "F1 race strategy depends on tire degradation and lap-time forecasts. Heuristic strategies struggle under variable stint conditions.",
      task: "Build a multi-agent simulator modeling tire wear, weather, vehicle dynamics, and gap effects, with an ML lap-time predictor trained on real telemetry.",
      action:
        "Built StratSim with six specialist agents (Tire Manager, Strategy, Lap Time, Weather, Vehicle Dynamics, Gap Effects) coordinating per-lap decisions. Trained a CatBoost lap-time predictor on FastF1 telemetry from the 2023–2024 seasons, with hyperparameter search and per-track holdout splits. Derived a tire-degradation feature set from automotive literature (compound, stint age, surface temperature) and benchmarked the resulting pit-strategy recommendations against a naive constant-pace baseline. Built a Streamlit UI for scenario configuration. Tracked experiments in MLflow; containerized with Docker; GitHub Actions for the Streamlit Cloud deploy.",
      result:
        "CatBoost lap-time MAE of ~0.05s on held-out laps in clean-air conditions (measured on 2024 holdout). Tire-degradation feature set improved pit-stop recommendation accuracy by ~18% over a constant-pace baseline on the same holdout. Working scenario simulator with six interacting agents.",
      impact:
        "A reproducible setup for testing race-strategy hypotheses against historical data. Surfaced how much of strategy quality comes from the tire model rather than the optimizer.",
      architecture:
        "Multi-agent simulator with six specialists. CatBoost lap-time predictor trained on FastF1 telemetry (2023–2024) with per-track holdout splits. Tire-degradation feature engineering derived from automotive literature. Streamlit UI. MLflow for experiment tracking. Docker for deployment. GitHub Actions for the Streamlit Cloud deploy.",
    },
    technologies: [
      "Python",
      "FastF1",
      "CatBoost",
      "Plotly",
      "Dash",
      "Machine Learning",
      "Docker",
      "MLflow",
      "GitHub Actions",
      "Streamlit",
      "Multi-Agent Systems",
      "Jupyter Notebook",
    ],
    featured: true,
    modalPreview: {
      hook: "Multi-agent F1 strategy sim with CatBoost lap-time predictor on real telemetry",
      problemTeaser:
        "Six specialist agents simulate a race lap-by-lap. CatBoost lap-time predictor trained on FastF1 2023–24 data; tire-degradation features improved pit recommendations vs a constant-pace baseline.",
      heroMetric: {
        label: "Lap-time MAE",
        value: "~0.05s",
      },
    },
    metrics: [
      { label: "Lap-time MAE", value: "~0.05s (holdout)" },
      { label: "Pit Strategy vs Baseline", value: "+18%" },
      { label: "Agents", value: "6 Specialists" },
    ],
  },
  {
    id: "p4",
    title: "Semiconductor Defect Detection System",
    github_url: "https://github.com/Spidey13/Wafer-Fault-Detection",
    star: {
      situation: "This archival wafer-defect prototype uses a schema with 590 sensor fields, a wafer ID, and an output label.",
      task: "Explore missing-value handling, clustering, and per-cluster model selection while keeping the inference limitation visible.",
      action: "The training code imputes missing values with KNN, removes zero-variance columns, clusters rows with K-Means, then compares Random Forest and XGBoost for each cluster. The prediction loop loses its cluster subset.",
      result: "An inspectable training path; reliable cluster-conditioned inference is not demonstrated by the current prediction code.",
      impact: "An archival example of pipeline decomposition, not a production defect-detection result.",
      architecture: "Schema checks, KNN imputation, zero-variance removal, K-Means clustering, and per-cluster Random Forest/XGBoost selection. The inference loop replaces its filtered subset with the full table before prediction.",
    },
    technologies: ["Python", "Flask", "XGBoost", "Random Forest", "K-Means Clustering", "KNN Imputation"],
    featured: true,
    modalPreview: {
      hook: "An inspectable wafer training pipeline with an unfinished inference contract",
      problemTeaser: "590 sensor fields feed imputation, clustering, and per-cluster model selection; prediction still needs repair.",
      heroMetric: { label: "Input Dim", value: "590 sensors" },
    },
    metrics: [
      { label: "Models", value: "XGBoost + RF" },
      { label: "Input Dim", value: "590 sensors" },
      { label: "Status", value: "Training path inspectable" },
    ],
  },
  {
    id: "p5",
    title: "Prompt Optimization for Healthcare NLP",
    github_url: "https://github.com/Spidey13/Perspective-aware-summarization",
    star: {
      situation: "Healthcare Q&A summarization can foreground information, suggestion, experience, cause, or question.",
      task: "Test DSPy MIPROv2 prompt candidates against a default perspective-aware summarization program; inspect PEFT code without asserting a final head-to-head result.",
      action: "Defined a DSPy task signature and evaluated MIPROv2 prompt candidates with a SemanticF1-style metric. PEFT prefix-tuning code also exists, but the repository does not record a comparable final score.",
      result: "In the notebook's 80-example internal full evaluation, the default scored 61.23 and evaluated candidates scored 53.33, 53.31, and 55.69. The optimizer retained the default.",
      impact: "A useful negative result: candidate selection can retain a baseline when evaluated alternatives do worse. This is not an external clinical benchmark.",
      architecture: "DSPy task signature, MIPROv2 candidate search, and an internal SemanticF1-style evaluation. A separate PEFT prefix-tuning path exists without a defensible numerical comparison.",
    },
    technologies: ["DSPy", "MIPROv2", "Hugging Face Transformers", "PyTorch", "PEFT", "SemanticF1"],
    featured: true,
    modalPreview: {
      hook: "The recorded prompt-optimization run retained its default program",
      problemTeaser: "MIPROv2 candidates did not beat the default in the notebook's 80-example internal evaluation; PEFT remains an adjacent code path.",
      heroMetric: { label: "Selection", value: "Default retained" },
    },
    metrics: [
      { label: "Default", value: "61.23" },
      { label: "Best candidate", value: "55.69" },
      { label: "Selection", value: "Default retained" },
    ],
  },
  {
    id: "p7",
    title: "Audio-Lyric Emotional Alignment",
    github_url: "https://github.com/Ranvirsv/Emotion_Analysis_Music-Lyrics",
    star: {
      situation: "The team explored whether audio and lyric representations could distinguish matched from mismatched pairs.",
      task: "Test a cross-modal comparison while checking whether the saved similarity readout supports an alignment claim.",
      action: "The team prepared audio and lyric inputs, instantiated MuLan-style encoders, and compared resulting vectors. The script does not load trained joint weights, and later emotion labels rely on heuristics.",
      result: "The saved readout rounds both matched and unmatched mean similarities to −0.115, with reported separation of 0.039 standard deviations above random.",
      impact: "An exploratory team experiment whose comparison did not support an emotion-alignment claim.",
      architecture: "Parallel audio and lyric preprocessing, encoder instantiation, and cosine-similarity comparison. No trained joint checkpoint is loaded into the MuLan-style encoders.",
    },
    technologies: ["Python", "PyTorch", "Transformers", "Librosa", "NumPy", "Pandas"],
    featured: true,
    modalPreview: {
      hook: "Matched and mismatched audio–lyric pairs barely separated",
      problemTeaser: "A team experiment in cross-modal comparison; the saved matched and unmatched means both round to −0.115.",
      heroMetric: { label: "Separation", value: "0.039σ" },
    },
    metrics: [
      { label: "Matched mean", value: "−0.115" },
      { label: "Unmatched mean", value: "−0.115" },
      { label: "Separation", value: "0.039σ" },
    ],
  },
  {
    id: "p1",
    title: "Autonomous Research Agent (Scientific Discovery System)",
    github_url: "https://github.com/YASHY2K/scientific-discovery-agent",
    star: {
      situation: "Research synthesis needs a way to revisit weak analysis before report generation; this prototype encodes a critique-and-revision gate.",
      task: "As a team, design a route from planning and paper search through analysis, critique, and report generation.",
      action: "The team implemented five-stage orchestration. The critique tool parses a model-issued verdict: REVISE stores pending revisions, while APPROVED sets a quality state before report generation. Source integrations include arXiv and Semantic Scholar.",
      result: "The source demonstrates the critique state branch. No saved end-to-end report or independent citation-accuracy evaluation is presented here.",
      impact: "An inspectable research workflow design, not proof of verified citations or research speed.",
      architecture: "Five phases: plan, search, analyze, critique, and report. A model-issued critique verdict is parsed into pending_revisions or quality_validated state. Code and a synthetic fixture are available; saved report evidence is not.",
    },
    technologies: ["AWS Strands Agents", "Amazon Bedrock", "Python", "Streamlit", "Multi-Agent Systems", "MCP", "arXiv API", "Semantic Scholar API"],
    featured: true,
    modalPreview: {
      hook: "A team-built research workflow with an explicit critique-and-revision gate",
      problemTeaser: "Plan → search → analyze → critique → report. The model-issued verdict changes workflow state; citation accuracy has not been independently verified.",
      heroMetric: { label: "Workflow", value: "5 stages" },
    },
    metrics: [
      { label: "Workflow", value: "5 stages" },
      { label: "Sources", value: "arXiv + Semantic Scholar (via MCP)" },
      { label: "Decision", value: "Critique gate" },
    ],
  },
  {
    id: "p8",
    title: "Diagnostiq - AI Technical Support Agent",
    github_url: "https://github.com/Spidey13/diagnostiq",
    deployed_url: "/demo/diagnostiq",
    video: "/diagnostiq-demo.mp4",
    star: {
      situation:
        "HVAC field technicians diagnosing rooftop unit faults rely on dense PDF service manuals that require slow page-by-page lookup. Existing support tools lack multimodal input for photo-based fault identification, interactive diagnostic workflows that branch based on technician responses, and real-time streaming. Technicians must keep switching between manuals and equipment.",
      task: "Build a support agent on a custom agentic loop written directly against the Anthropic API with Pydantic-enforced tool schemas, implement branching diagnostic job cards grounded in the actual service manual, generate interactive HTML artifacts for wiring diagrams and settings configurators, enable multimodal image input for visual fault recognition, and deploy with zero cold-start latency on GCP Cloud Run.",
      action:
        "Built Diagnostiq on a custom agentic loop over the Anthropic API with a 4-tool architecture: search_knowledge (ChromaDB vector retrieval), get_manual_image (manual page PNG with bbox highlights), render_artifact (Sonnet-generated self-contained HTML in sandboxed iframe), and generate_job_card (Sonnet-validated JSON branching diagnostic workflow). Implemented a dual-embedding RAG pipeline. Gemini 2.5 Flash vision performs structured per-page extraction at ingest with Vertex text-embedding-004 (768-dim), while local sentence-transformers all-MiniLM-L6-v2 (384-dim) handles serving without GCP credentials at runtime. Enabled Anthropic prompt caching on the system prompt and tool schemas, cutting per-turn token cost by ~75% on cache hits since the manual-grounded system prompt is large and stable. Used structured outputs / JSON mode for the branching job-card generation so the schema is enforced at the model layer rather than re-validated. FastAPI streams responses via SSE while the synchronous tool loop runs in a thread pool. Haiku drives the agent loop; Sonnet generates validated HTML artifacts and structured JSON job cards. The React 19 frontend has a two-panel chat and artifact viewer, pinnable artifacts that persist across follow-up messages, a swipe-gesture job card UI with keyboard Y/N navigation, and full accessibility. Baked HuggingFace embedding model weights into the Docker image layer to eliminate cold-start ML download.",
      result:
        "Working AI support agent with real-time SSE streaming, branching diagnostic workflows grounded in actual manual citations, and multimodal image input. Scored 96/100 on the Web Interface Guidelines accessibility audit. Eliminated cold-start ML download by baking the 80 MB embedding model into the Docker image layer. Deployed on GCP Cloud Run with scale-to-zero. Per-turn cost reduced ~75% on cache hits via Anthropic prompt caching.",
      impact:
        "Showed that a production-shape agent can be built on a custom agentic loop with Pydantic-enforced tool schemas, and that a dual-embedding pattern (richer model at ingest, lightweight model at serve) decouples accuracy from runtime credential requirements.",
      architecture:
        "FastAPI backend with SSE streaming via sse-starlette and auto-generated OpenAPI docs. SupportAgent runs a synchronous custom agent loop over the Anthropic API in a thread pool executor. Haiku handles tool routing, while Sonnet generates HTML artifacts and job card JSON. 4-tool schema: search_knowledge (ChromaDB cosine similarity with chunk-type boosting), get_manual_image (PNG pages with annotation bbox overlay), render_artifact (three-stage HTML fallback with validation), generate_job_card (validated branching JSON with source_citation enforcement). Dual-embedding pipeline: Gemini 2.5 Flash vision structured per-page extraction, Vertex text-embedding-004 at ingest (768-dim), all-MiniLM-L6-v2 at serve (384-dim). Anthropic prompt caching on system prompt + tool schemas. Structured outputs / JSON mode for job-card generation. Exact-match SemanticCache for fault button queries. Thread-safe SessionStore for conversation history. React 19 + Vite frontend with useChat SSE consumer, useJobCard branching state machine, ArtifactPanel iframe sandbox, pinnable artifact persistence. Pydantic for tool-call schemas, job-card JSON contract, and SSE event payloads. Pytest for the agent loop and tool integration tests. Multi-stage Dockerfile with HF_HOME baked into image layer. GitHub Actions builds the multi-stage image and deploys to Cloud Run on main. GCP Cloud Run with 2 GiB RAM and Secret Manager for the API key.",
    },
    technologies: [
      "Python",
      "FastAPI",
      "Anthropic Claude",
      "ChromaDB",
      "Sentence Transformers",
      "React",
      "Vite",
      "SSE",
      "Google Gemini",
      "Pydantic",
      "Prompt Caching",
      "Structured Outputs",
      "OpenAPI",
      "Pytest",
      "Docker",
      "GitHub Actions",
      "GCP Cloud Run",
    ],
    featured: true,
    modalPreview: {
      hook: "AI support agent on a custom agentic loop with branching diagnostic job cards",
      problemTeaser:
        "Built on a custom agentic framework with Pydantic-enforced tool schemas. Fault descriptions become branching diagnostic workflows grounded in the actual service manual.",
      heroMetric: {
        label: "Accessibility Score",
        value: "96/100",
      },
    },
    metrics: [
      { label: "Accessibility", value: "96/100" },
      { label: "Prompt Cache Savings", value: "~75% per-turn" },
      { label: "Cold Start", value: "Zero ML Download" },
    ],
  },
  {
    id: "p9",
    title: "Queue Whisperer - Human-Approved GitHub Agent in Slack",
    github_url: "https://github.com/Spidey13/queue-whisperer",
    deployed_url:
      "https://queue-whisperer-production.up.railway.app/slack/install",
    star: {
      situation:
        "A product's current state often sits in a noisy GitHub issue queue: what is newly urgent, what keeps recurring, and what has stalled. Reading that state and making routine triage changes is manual work. An agent that can write to a public repository on its own is a liability, and an agent that answers from stale or imagined data is worse than no agent.",
      task: "Build a Slack agent grounded in a live GitHub issue queue that answers questions with citations to the issues it actually read. It stages triage actions (labels, replies) that commit only after a human clicks Approve in Slack. The architecture enforces the write-safety boundary without relying on prompt instructions.",
      action:
        "I built Queue Whisperer, a TypeScript service wrapping a bounded tool-calling agent (Vercel AI SDK) in a Slack Bolt app over the GitHub REST API. The model's toolset contains only read tools plus two propose tools that stage to an ActionStore; the GitHub write tools live in a separate module imported solely by the Slack approval-button handler, so a prompt injection in issue text can at worst stage a proposal a human still reviews. Implemented the propose → approve → commit flow with compare-and-set state transitions making double-approve safe, label commits that fetch-and-merge existing labels so an approval can't erase the others, and credential re-resolution at approve time so a stale token fails cleanly. Bounded every turn with a five-tool-step budget and 90-second abort, with a final no-tools grounded-or-decline pass so the bot honestly says when it can't answer instead of fabricating. Built a hosted multi-workspace mode: Slack OAuth installation, a GitHub App minting 60-minute installation tokens per workspace (never stored), HMAC-signed state binding each GitHub installation to its Slack team, an AES-256-GCM-encrypted PAT fallback, and Postgres holding only bot state so GitHub stays the sole source of truth. Escaped untrusted issue text before Slack rendering so <!channel>-style pings can't fire. Made the LLM layer provider-agnostic (Google AI Studio, Vertex, or Anthropic via one env var), and wrote an agent:smoke grounding eval that runs the live agent loop against the repository and fails any answer citing an issue that never appeared in that run's tool trace.",
      result:
        "Shipped a hosted, installable multi-workspace Slack app on Railway where zero GitHub writes are model-initiated. Every write passes through a human Approve click and plain TypeScript. Answers cite the issues they read and decline on thin data, with a citation-trace evaluation that regression-checks grounding after every prompt or model change. Trust boundaries and the five key design decisions are documented as ADRs.",
      impact:
        "Human-in-the-loop approval is a structural boundary. The model never receives a write tool, and safety does not depend on a prompt rule. The architecture contains prompt injection, makes the agent decline when it lacks grounding, and keeps production hardening additive through ActionStore, credential resolution, and the event log.",
      architecture:
        "Single-process TypeScript service: Slack Bolt (Socket Mode) wrapping one bounded tool-calling agent turn (Vercel AI SDK) over the GitHub REST API. buildContext resolves a Slack team to { owner, repo, credential, mode, labels }; label vocabulary and date cutoffs are injected into the system prompt as schema-in-context while issue bodies, comments, and activity arrive only through live tool calls. Model-reachable tools: list/search/read issues and comments plus proposeLabel/proposeReply staging to an ActionStore with compare-and-set transitions; GitHub write tools imported only by the approval handler. Tools return { error } in-band instead of throwing, so the model can react to failures. Multi-workspace auth: Slack OAuth plus a GitHub App via @octokit/auth-app minting short-lived installation tokens (cached, refreshed before expiry, never stored), HMAC-signed OAuth state, AES-256-GCM-encrypted PAT fallback, Postgres for installations and per-team repo config only. Zod-validated configuration at startup. Read-only mode for public repos derived per turn from live installation coverage. Smoke-test suite: rest:smoke (live GitHub tool layer), model:smoke (tool-calling round trip), agent:smoke (citation-trace grounding eval). Deployed on Railway.",
    },
    technologies: [
      "TypeScript",
      "Node.js",
      "Slack Bolt",
      "Vercel AI SDK",
      "GitHub REST API",
      "GitHub Apps",
      "OAuth",
      "Zod",
      "PostgreSQL",
      "Google Gemini",
      "Anthropic Claude",
      "Railway",
    ],
    featured: true,
    modalPreview: {
      hook: "A Slack agent over a live GitHub queue where zero writes are model-initiated. Every action needs a human Approve",
      problemTeaser:
        "Answers queue questions from live GitHub data with citations, and stages triage actions a human approves in Slack. The model never receives a write tool. A plain TypeScript approval handler owns the write boundary.",
      heroMetric: {
        label: "Model-Initiated Writes",
        value: "Zero",
      },
    },
    metrics: [
      { label: "Model Write Access", value: "Zero by Design" },
      { label: "Tool-Step Budget", value: "5 / turn" },
      { label: "Grounding Eval", value: "Citation Trace" },
    ],
  },
  {
    id: "p10",
    title: "cachefault - Prefix-Cache Miss Attribution",
    github_url: "https://github.com/Spidey13/cachefault",
    star: {
      situation:
        "LLM prompt caching matches an exact prefix. One byte off causes a silent total miss at roughly 10x the bill. Providers report that a miss happened. Anthropic's April 2026 diagnostics beta names the top-level component that diverged (model / system / tools / messages), but it does not identify the field that moved. Other providers and self-hosted engines offer no equivalent attribution. A tool in the middle is often responsible: in headroom #1042, a proxy's own canonical re-serialization reordered tool-schema keys and recomputed ~1.15M tokens across 17 of 18 turns.",
      task: "Build a tool that names the exact request field that broke a prefix cache across hosted providers and self-hosted vLLM. It must return a field path, not a component name, report a miss as provider-side when the bytes were identical, and validate every verdict against real systems. Publish disagreements instead of dropping them.",
      action:
        "Built cachefault as a single static Go binary owning the capture proxy, diff, classifier, CLI, block simulator, and both validation harnesses. Made the proxy forward request bodies as raw bytes without decoding them. A proxy that round-trips JSON through a decoder reorders keys and becomes the cache-buster it exists to diagnose. Wrote internal/ojson, an order-preserving JSON parser, because encoding/json into a map destroys key order and rewrites number literals. Both are signals here: key reordering, float re-encoding, and whitespace-only edits break a cache while looking identical in a debugger. Provider usage counters settle the verdict before heuristics run. The diff then names a cause and reports the earliest divergence in the provider's own prefix order (tools → system → messages on Anthropic), since everything after the first changed byte is invalidated. Shipped nine verdicts across Anthropic and OpenAI adapters; the four client-fixable ones exit 1 so analyze works as a CI gate, with --json for machine output and an X-Cachefault-Session header to group sessions. For self-hosted engines, built an inverse map from token index to 16-token block, character range, and request field. A simulator replays a session through vLLM's V1 block-hash chain with no GPU. Isolated render+tokenize in a Python sidecar (transformers + Jinja2, NDJSON over stdio) because vLLM renders chat templates with Python, so only Python is definitionally exact against the server being validated. The Go options were evaluated and rejected: gonja is Jinja-ish rather than exact, while minja and the HF tokenizer bindings are cgo and would cost the static binary. Validated both tiers against real systems: a live hosted matrix against the Anthropic API using its diagnostics beta as the oracle, and a differential vLLM run under WSL2 scored against the engine's own prefix-cache counters.",
      result:
        "Across 10 live Anthropic scenarios ($0.04 of real traffic), 9 of 9 scored rows agree with Anthropic's cache-diagnostics oracle on whether the client caused the miss, with a field path on every divergence the oracle could only label by component. Three rows disagreed with the scenario table's own prediction. In all three, the prediction was wrong about Anthropic rather than the tool: key reordering inside input_schema, a model alias vs its dated snapshot, and tool_choice are not part of Anthropic's cache key. Those findings are published instead of being rewritten into agreement. The block simulator agrees with a real vLLM server within one block (16 tokens) on 100% of requests. All 47 samples across five workloads matched exactly, with a mean error of 0.0 tokens. Ships as one binary with no runtime, plus a 17-pair fixture corpus under go test.",
      impact:
        "Provides deterministic attribution with no model in the loop. The tool reports PROVIDER_SIDE when two requests were byte-identical and the cache still missed, because there is no client-side cause to report. Its scope is explicit: Anthropic and OpenAI adapters only, post-hoc analysis rather than live monitoring, and an OpenAI adapter that remains unvalidated against the live API because no key was available for the matrix run. The provider's own beta is credited and used as the oracle. cachefault goes deeper in three places: the field path inside the component, cross-provider coverage, and self-hosted token/block attribution.",
      architecture:
        "Single static Go binary (Cobra CLI: analyze, diff, proxy, attribute, simulate). Byte-faithful capture proxy writing append-only JSONL, closed after every request so a session can be analyzed while recording continues. Order-preserving JSON parser (internal/ojson) feeding a structural diff that detects value changes, key reordering, float re-encoding, and whitespace-only edits. Provider adapters (internal/providers) defining prefix order, cache-key fields, and minimum cacheable length per model; classifier (internal/classify) with counter-driven verdict precedence over diff heuristics. Self-hosted path: Python analyzer sidecar (transformers + Jinja2 + tokenizers, NDJSON over stdio) for exact chat-template render and tokenization, an inverse map from token index through block to character range to request field, and a vLLM V1 block-hash-chain simulator running without a GPU. Two validation harnesses kept out of go test because they spend money or need a GPU: cmd/validate-hosted (live Anthropic matrix, hard-capped spend, diagnostics beta as oracle) and cmd/validate-vllm (differential run against a real server, scored on vllm:prefix_cache_hits_total). Cross-compiled releases for darwin-arm64, darwin-amd64, linux-amd64, and windows-amd64.",
    },
    technologies: [
      "Go",
      "Cobra",
      "Python",
      "Hugging Face Transformers",
      "Tokenizers",
      "Jinja2",
      "vLLM",
      "Anthropic Claude",
      "OpenAI API",
      "Prompt Caching",
      "KV Cache",
      "HTTP Proxy",
      "NDJSON",
      "WSL2",
    ],
    featured: true,
    modalPreview: {
      hook: "Names the exact request field that broke your prefix cache across providers and on your own vLLM box",
      problemTeaser:
        "Providers can tell you that a cache miss happened. cachefault records traffic byte for byte, diffs each request against the one before it, and names the field. It reports tools[0].input_schema instead of tools_changed, down to the token block on self-hosted engines.",
      heroMetric: {
        label: "Simulator vs Real vLLM",
        value: "47/47 exact",
      },
    },
    metrics: [
      { label: "Oracle Agreement", value: "9/9 Scored Rows" },
      { label: "Simulator vs Real vLLM", value: "47/47 Exact" },
      { label: "Attribution", value: "Field Path, Not Component" },
    ],
  },
];
