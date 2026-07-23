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
        "Explored a direction the industry is moving toward — voice as a first-class developer interface — and produced a reference implementation for combining Gemini native audio with function calling and repo-aware tools.",
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
        "An exploration of memory-augmented retrieval and explainable RAG. Surfacing retrieved chunks made it easy to debug bad answers — most cases traced to retrieval, not generation.",
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
      situation:
        "Wafer defect detection from the SECOM dataset (591 sensors) is a common imbalanced-classification benchmark with significant missing-data and validation challenges.",
      task: "Build an end-to-end ML pipeline with schema validation, missing-value handling, dual model comparison, and a serving layer that can be inspected and re-trained.",
      action:
        "Built an end-to-end pipeline in Python/Flask handling schema validation, missing-value imputation (KNN), and a K-Means clustering step that segments wafers before training a per-cluster classifier — comparing XGBoost vs Random Forest with GridSearchCV on ROC-AUC. Validated all incoming payloads with Pydantic schemas at the Flask boundary. Added Pytest coverage for the preprocessing, training, and prediction paths. Wrapped the training and prediction flows behind Flask endpoints with model persistence and re-training hooks.",
      result:
        "End-to-end pipeline running training and prediction over 591-dimensional sensor inputs with cluster-conditioned classification, automated hyperparameter search, and a working web interface for model management.",
      impact:
        "A reference implementation of a structured ML pipeline (schema → cleaning → clustering → classification → serving) over a high-dimensional imbalanced dataset.",
      architecture:
        "K-Means cluster assignment (elbow method) followed by per-cluster classifier comparison (XGBoost vs Random Forest) with GridSearchCV on ROC-AUC. Validation pipeline with Pydantic schemas, schema checks, KNN imputation, and feature selection. Flask REST endpoints for training and prediction with model persistence. Dockerized Flask serving layer; GitHub Actions training job triggered on data refresh. Pytest covering the preprocessing, training, and prediction paths.",
    },
    technologies: [
      "Python",
      "Flask",
      "XGBoost",
      "Random Forest",
      "K-Means Clustering",
      "GridSearchCV",
      "ROC AUC",
      "Pydantic",
      "Pytest",
      "Docker",
      "GitHub Actions",
      "REST API",
    ],
    featured: true,
    modalPreview: {
      hook: "End-to-end ML pipeline on SECOM wafer data: cluster-conditioned XGBoost vs Random Forest",
      problemTeaser:
        "591-sensor wafer defect detection with schema validation, KNN imputation, K-Means segmentation, and per-cluster classifier comparison.",
      heroMetric: {
        label: "Input Dim",
        value: "591 sensors",
      },
    },
    metrics: [
      { label: "Models", value: "XGBoost + RF" },
      { label: "Input Dim", value: "591 sensors" },
      { label: "Pipeline", value: "Cluster-conditioned" },
    ],
  },
  {
    id: "p5",
    title: "Prompt Optimization for Healthcare NLP",
    github_url: "https://github.com/Spidey13",
    star: {
      situation:
        "Healthcare Q&A summarization is a perspective-heavy task — answers blend information, suggestion, experience, cause, and question. Manual prompt engineering doesn't scale across perspectives.",
      task: "Apply automatic prompt optimization (DSPy MIPROv2) to a perspective-aware summarization pipeline and compare against parameter-efficient fine-tuning on the same dataset.",
      action:
        "Built a dual pipeline: (1) DSPy MIPROv2 programmatic prompt optimization with Chain-of-Thought, optimizing a multi-objective loss combining perspective classification, start-phrase matching, and tone alignment; (2) PEFT Prefix Tuning as a fine-tuning baseline. Evaluated both with ROUGE, BLEU, METEOR, BertScore, and a custom SemanticF1. Integrated BERTopic for seed-topic guided content modeling. Logged every optimization run to Weights & Biases for head-to-head comparison of MIPROv2 and PEFT variants on the same held-out set under one report.",
      result:
        "DSPy MIPROv2 pipeline produced competitive summaries on the perspective-aware benchmark without weight updates, evaluated head-to-head against PEFT fine-tuning across five metrics. Working evaluation framework with custom SemanticF1.",
      impact:
        "A practical comparison of programmatic prompt optimization vs parameter-efficient fine-tuning for domain summarization — useful when fine-tuning compute is constrained.",
      architecture:
        "Dual pipeline (DSPy MIPROv2 + PEFT Prefix Tuning). Multi-objective loss combining perspective classification, start-phrase matching, and tone alignment. Multi-metric evaluation harness (ROUGE, BLEU, METEOR, BertScore, custom SemanticF1) so both variants compare on the same held-out set. BERTopic for seed-topic content modeling. Weights & Biases for run tracking and side-by-side comparison.",
    },
    technologies: [
      "DSPy",
      "MIPROv2",
      "Hugging Face Transformers",
      "PyTorch",
      "PEFT",
      "BERTopic",
      "ROUGE",
      "BertScore",
      "NLTK",
      "Sentence Transformers",
      "Weights & Biases",
    ],
    featured: true,
    modalPreview: {
      hook: "DSPy MIPROv2 prompt optimization vs PEFT fine-tuning on perspective-aware healthcare summarization",
      problemTeaser:
        "Head-to-head comparison of programmatic prompt optimization and parameter-efficient fine-tuning on a five-perspective medical Q&A task.",
      heroMetric: {
        label: "Optimization",
        value: "DSPy MIPROv2",
      },
    },
    metrics: [
      { label: "Optimization", value: "MIPROv2 vs PEFT" },
      { label: "Fine-tuning", value: "PEFT Prefix Tuning" },
      { label: "Eval Harness", value: "5-metric (ROUGE/BLEU/METEOR/BertScore/SemanticF1)" },
    ],
  },
  {
    id: "p7",
    title: "Audio-Lyric Emotional Alignment",
    github_url: "https://github.com/Spidey13",
    star: {
      situation:
        "Quantifying emotional congruence between music audio and lyrics requires aligning representations from two different modalities.",
      task: "Build a pipeline that produces a comparable embedding for music and for lyrics, then measure cross-modal similarity over a fixed segment set.",
      action:
        "Used OpenL3 for music-specific audio embeddings and Sentence Transformers for lyric embeddings. Projected both into a shared space via PCA and computed cosine similarity. Built the data pipeline end-to-end: audio segmentation, lyric retrieval via Genius API, ACRCloud/AudD for track identification, preprocessing, and emotion classification with transformer models. Ran the analysis over 712 segment-lyric pairs.",
      result:
        "Across 712 audio-lyric segment pairs, mean cosine similarity in the shared PCA space was ~63%. Working cross-modal pipeline with multi-API data collection and clustering for pattern inspection.",
      impact:
        "An end-to-end exploration of joint audio-text embeddings for emotion analysis. Surfaced where audio and lyric emotional signals agree and where they diverge.",
      architecture:
        "OpenL3 audio embeddings + Sentence Transformers text embeddings projected into a shared PCA space. Cosine similarity for cross-modal comparison. Pipeline: audio segmentation, Genius API lyric retrieval, ACRCloud/AudD for track ID, transformer emotion classification, clustering for pattern analysis.",
    },
    technologies: [
      "OpenL3",
      "Sentence Transformers",
      "PyTorch",
      "Transformers",
      "Librosa",
      "NumPy",
      "Pandas",
      "Python",
      "ACRCloud API",
      "Genius API",
      "Scikit-learn",
    ],
    featured: true,
    modalPreview: {
      hook: "Joint audio-lyric embeddings for cross-modal emotion analysis across 712 segments",
      problemTeaser:
        "OpenL3 audio embeddings + Sentence Transformers lyric embeddings projected into a shared PCA space, with cosine similarity measured over a fixed segment set.",
      heroMetric: {
        label: "Mean Cosine Similarity",
        value: "~63%",
      },
    },
    metrics: [
      { label: "Mean Cosine Similarity", value: "~63%" },
      { label: "Segments", value: "712 pairs" },
      { label: "Modalities", value: "Audio + Text" },
    ],
  },
  {
    id: "p1",
    title: "Autonomous Research Agent (Scientific Discovery System)",
    github_url: "https://github.com/YASHY2K/scientific-discovery-agent",
    star: {
      situation:
        "Cross-domain literature reviews take researchers weeks of manual searching and synthesis, with inconsistent coverage and citation quality.",
      task: "Co-developed with a teammate. Build a multi-agent system that searches across academic sources, analyzes papers, critiques its own output, and produces a structured report with verified citations.",
      action:
        "Co-developed an autonomous research assistant on AWS Strands Agents and Amazon Bedrock. Designed a hierarchical five-agent architecture (Research Planner, Paper Searcher, Paper Analyzer, Research Critique, Report Generator) and a five-phase workflow (Planning → Search → Analysis → Critique → Reporting). The Critique agent acts as an automated eval layer over the Analyzer's output — checking citation grounding and flagging unsupported claims, equivalent to a custom RAGAS-style faithfulness check before report generation. Exposed arXiv and Semantic Scholar integrations as MCP servers so the Paper Searcher consumes them through a uniform tool interface, decoupling source-specific auth and rate-limiting from agent logic. Traced every agent run with LangSmith to inspect tool-call sequences, token usage, and failure modes — used those traces to tune the Critique agent's threshold for flagging unsupported claims. Built a 'Glass Box' Streamlit dashboard streaming each agent's decisions in real time.",
      result:
        "Working multi-agent pipeline that produces structured literature reviews in minutes, with a critique pass that flags and removes unverifiable citations before final report generation.",
      impact:
        "Demonstrated hierarchical agent orchestration with a self-critique loop for citation grounding — a pattern that translates directly to other knowledge-synthesis workflows where source verification matters.",
      architecture:
        "Hierarchical multi-agent system on AWS Strands Agents + Amazon Bedrock. Five specialist agents (Planner, Searcher, Analyzer, Critique, Reporter) over a five-phase workflow with a self-critique step. Source integrations (arXiv, Semantic Scholar) wrapped as MCP servers for uniform tool access. LangSmith for run traces and eval. Pydantic schemas for inter-agent message contracts. Pytest for the eval harness. Streamlit dashboard with real-time activity streams and phase tracking. Containerized dashboard with Docker.",
    },
    technologies: [
      "AWS Strands Agents",
      "Amazon Bedrock",
      "Python",
      "Streamlit",
      "Multi-Agent Systems",
      "MCP",
      "LangSmith",
      "Pydantic",
      "Pytest",
      "Docker",
      "LLM Evaluation",
      "arXiv API",
      "Semantic Scholar API",
    ],
    featured: true,
    modalPreview: {
      hook: "Five-agent literature review pipeline with a self-critique loop that flags unverifiable citations",
      problemTeaser:
        "Planner → Searcher → Analyzer → Critique → Reporter, on AWS Strands + Bedrock. The critique pass re-validates sources before the final report is generated.",
      heroMetric: {
        label: "Specialist Agents",
        value: "5",
      },
    },
    metrics: [
      { label: "Specialist Agents", value: "5" },
      { label: "Sources", value: "arXiv + Semantic Scholar (via MCP)" },
      { label: "Self-Critique", value: "Citation Validation Loop" },
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
        "HVAC field technicians diagnosing rooftop unit faults rely on dense PDF service manuals that require slow page-by-page lookup. Existing support tools lack multimodal input for photo-based fault identification, interactive diagnostic workflows that branch based on technician responses, and real-time streaming — forcing constant context-switching between manuals and equipment.",
      task: "Build a support agent on a custom agentic loop written directly against the Anthropic API with Pydantic-enforced tool schemas, implement branching diagnostic job cards grounded in the actual service manual, generate interactive HTML artifacts for wiring diagrams and settings configurators, enable multimodal image input for visual fault recognition, and deploy with zero cold-start latency on GCP Cloud Run.",
      action:
        "Built Diagnostiq on a custom agentic loop over the Anthropic API with a 4-tool architecture: search_knowledge (ChromaDB vector retrieval), get_manual_image (manual page PNG with bbox highlights), render_artifact (Sonnet-generated self-contained HTML in sandboxed iframe), and generate_job_card (Sonnet-validated JSON branching diagnostic workflow). Implemented a dual-embedding RAG pipeline — Gemini 2.5 Flash vision for per-page structured extraction at ingest with Vertex text-embedding-004 (768-dim), then local sentence-transformers all-MiniLM-L6-v2 (384-dim) for serving — eliminating GCP credential requirements at runtime. Enabled Anthropic prompt caching on the system prompt and tool schemas, cutting per-turn token cost by ~75% on cache hits since the manual-grounded system prompt is large and stable. Used structured outputs / JSON mode for the branching job-card generation so the schema is enforced at the model layer rather than re-validated. FastAPI backend streams responses via SSE with the synchronous tool loop running in a thread pool. Haiku drives the agent loop; Sonnet generates validated HTML artifacts and structured JSON job cards. React 19 frontend features a two-panel chat and artifact viewer, pinnable artifacts that persist across follow-up messages, swipe-gesture job card UI with keyboard Y/N navigation, and full accessibility. Baked HuggingFace embedding model weights into the Docker image layer to eliminate cold-start ML download.",
      result:
        "Working AI support agent with real-time SSE streaming, branching diagnostic workflows grounded in actual manual citations, and multimodal image input. Scored 96/100 on the Web Interface Guidelines accessibility audit. Eliminated cold-start ML download by baking the 80 MB embedding model into the Docker image layer. Deployed on GCP Cloud Run with scale-to-zero. Per-turn cost reduced ~75% on cache hits via Anthropic prompt caching.",
      impact:
        "Showed that a production-shape agent can be built on a custom agentic loop with Pydantic-enforced tool schemas, and that a dual-embedding pattern (richer model at ingest, lightweight model at serve) decouples accuracy from runtime credential requirements.",
      architecture:
        "FastAPI backend with SSE streaming via sse-starlette and auto-generated OpenAPI docs. SupportAgent class running a synchronous custom agent loop over the Anthropic API in a thread pool executor — Haiku for tool routing, Sonnet for HTML artifact generation and job card JSON. 4-tool schema: search_knowledge (ChromaDB cosine similarity with chunk-type boosting), get_manual_image (PNG pages with annotation bbox overlay), render_artifact (three-stage HTML fallback with validation), generate_job_card (validated branching JSON with source_citation enforcement). Dual-embedding pipeline: Gemini 2.5 Flash vision structured per-page extraction, Vertex text-embedding-004 at ingest (768-dim), all-MiniLM-L6-v2 at serve (384-dim). Anthropic prompt caching on system prompt + tool schemas. Structured outputs / JSON mode for job-card generation. Exact-match SemanticCache for fault button queries. Thread-safe SessionStore for conversation history. React 19 + Vite frontend with useChat SSE consumer, useJobCard branching state machine, ArtifactPanel iframe sandbox, pinnable artifact persistence. Pydantic for tool-call schemas, job-card JSON contract, and SSE event payloads. Pytest for the agent loop and tool integration tests. Multi-stage Dockerfile with HF_HOME baked into image layer. GitHub Actions building the multi-stage image and deploying to Cloud Run on main. GCP Cloud Run with 2 GiB RAM, Secret Manager for API key.",
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
        "The real state of a product often sits in a noisy GitHub issue queue: what is newly urgent, what is recurring, and what has quietly stalled. Reading that state and making routine triage changes is manual work, and existing AI agents can't be trusted with it — an agent that can write to a public repository on its own is a liability, and an agent that answers from stale or imagined data is worse than no agent.",
      task: "Build a Slack agent grounded in a live GitHub issue queue that answers questions with citations to the issues it actually read, and stages triage actions (labels, replies) that commit only after a human clicks Approve in Slack — with the write-safety boundary enforced structurally in the architecture, not by prompt instructions.",
      action:
        "I built Queue Whisperer, a TypeScript service wrapping a bounded tool-calling agent (Vercel AI SDK) in a Slack Bolt app over the GitHub REST API. The model's toolset contains only read tools plus two propose tools that stage to an ActionStore; the GitHub write tools live in a separate module imported solely by the Slack approval-button handler, so a prompt injection in issue text can at worst stage a proposal a human still reviews. Implemented the propose → approve → commit flow with compare-and-set state transitions making double-approve safe, label commits that fetch-and-merge existing labels so an approval can't erase the others, and credential re-resolution at approve time so a stale token fails cleanly. Bounded every turn with a five-tool-step budget and 90-second abort, with a final no-tools grounded-or-decline pass so the bot honestly says when it can't answer instead of fabricating. Built a hosted multi-workspace mode: Slack OAuth installation, a GitHub App minting 60-minute installation tokens per workspace (never stored), HMAC-signed state binding each GitHub installation to its Slack team, an AES-256-GCM-encrypted PAT fallback, and Postgres holding only bot state so GitHub stays the sole source of truth. Escaped untrusted issue text before Slack rendering so <!channel>-style pings can't fire. Made the LLM layer provider-agnostic (Google AI Studio, Vertex, or Anthropic via one env var), and wrote an agent:smoke grounding eval that runs the real agent loop against the live repo and fails any answer citing an issue that never appeared in that run's tool trace.",
      result:
        "Shipped a hosted, installable multi-workspace Slack app on Railway where zero GitHub writes are model-initiated — every write passes through a human Approve click and plain TypeScript. Answers cite the issues they read and decline honestly on thin data, with a citation-trace eval regression-checking grounding on every prompt or model change. Trust boundaries and the five key design decisions are documented as ADRs.",
      impact:
        "Demonstrates the pattern production AI agents need most: human-in-the-loop approval as a structural boundary — the model never receives a write tool — rather than a prompt rule. Showed prompt-injection containment by architecture, grounded-or-decline behavior over confident fabrication, and deliberate v1 scoping with the seams (ActionStore, credential resolution, event log) that make production hardening additive rather than a rewrite.",
      architecture:
        "Single-process TypeScript service: Slack Bolt (Socket Mode) wrapping one bounded tool-calling agent turn (Vercel AI SDK) over the GitHub REST API. buildContext resolves a Slack team to { owner, repo, credential, mode, labels }; label vocabulary and date cutoffs are injected into the system prompt as schema-in-context while issue bodies, comments, and activity arrive only through live tool calls. Model-reachable tools: list/search/read issues and comments plus proposeLabel/proposeReply staging to an ActionStore with compare-and-set transitions; GitHub write tools imported only by the approval handler. Tools never throw — failures return { error } in-band as data the model reacts to. Multi-workspace auth: Slack OAuth plus a GitHub App via @octokit/auth-app minting short-lived installation tokens (cached, refreshed before expiry, never stored), HMAC-signed OAuth state, AES-256-GCM-encrypted PAT fallback, Postgres for installations and per-team repo config only. Zod-validated configuration at startup. Read-only mode for public repos derived per turn from live installation coverage. Smoke-test suite: rest:smoke (live GitHub tool layer), model:smoke (tool-calling round trip), agent:smoke (citation-trace grounding eval). Deployed on Railway.",
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
      hook: "A Slack agent over a live GitHub queue where zero writes are model-initiated — every action needs a human Approve",
      problemTeaser:
        "Answers queue questions from live GitHub data with citations, and stages triage actions a human approves in Slack. The model never receives a write tool — safety is structural, not a prompt rule.",
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
];
