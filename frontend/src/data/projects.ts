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
        "Traditional text-based AI coding assistants create friction in developer workflows, requiring constant context-switching between typing, reading responses, and navigating code. Real-time collaboration with AI over voice remains largely unexplored, and existing tools lack deep codebase intelligence combining static analysis with live visualization.",
      task: "Build a voice-native AI coding partner using Gemini 2.5 Flash native audio for bidirectional real-time communication, implement comprehensive codebase intelligence with tree-sitter AST parsing and PageRank-based file ranking, create live dependency graph visualization, and ensure session resilience with context window compression and resumption capabilities.",
      action:
        "I developed Codiey, a voice-first AI coding partner that enables natural spoken conversation about codebases using Gemini 2.5 Flash's native audio capabilities over WebSocket. Implemented end-to-end real-time audio pipeline with AudioWorklet for PCM streaming (16 kHz in, 24 kHz out) and integrated Silero-style neural VAD (ONNX Runtime) in the browser to replace brittle energy thresholds. Designed two-tier tool system: Tier 1 blocking tools (read, search, AST introspection with tree-sitter) with TOOL_PENDING gate preventing audio leaks during execution, and Tier 2 silent tools (write_to_rules, mark_as_discussed) for non-intrusive side effects. Built comprehensive codebase intelligence using tree-sitter for parsing Python/JavaScript/TypeScript, extracted import/require dependency graphs, and applied PageRank with personalization for intelligent file ranking. Created D3 force-directed graph visualization with live pulses showing active files during model interaction. Implemented session resilience with context window compression, resumption tokens in localStorage, and goAway handling to maintain audio connection across reconnects.",
      result:
        "Successfully created production-ready voice-native AI coding assistant with real-time bidirectional audio achieving <200ms latency, built robust codebase intelligence system processing AST and dependency graphs with PageRank ranking, delivered interactive D3 visualization showing live model focus, implemented neural VAD eliminating 1008 WebSocket errors, and achieved session resilience with automatic context compression and resumption.",
      impact:
        "Transformed developer-AI interaction by enabling natural voice-based codebase exploration eliminating context-switching overhead, demonstrated cutting-edge integration of Gemini's native audio with function calling and repository tools, provided unprecedented transparency into AI reasoning through live dependency graph visualization, and established robust patterns for real-time audio AI applications with proper state management and resilience.",
      architecture:
        "FastAPI backend serving static assets and tool execution endpoints. Browser-side AudioWorklet for PCM processing with Web Audio API. Gemini 2.5 Flash BidiGenerateContent WebSocket with native audio support. Two-tier tool architecture: blocking tools (read_file, search_codebase, get_class_functions, list_directory) with TOOL_PENDING state gate, and silent scheduled tools (write_to_rules, mark_as_discussed) running on thread pool. Tree-sitter parsers for Python/JavaScript/TypeScript with AST-aware introspection. Dependency graph extraction with PageRank ranking using NumPy/SciPy. D3.js force-directed graph with real-time emphasis on active files. Neural VAD using Silero ONNX model. Session management with context compression, resumption tokens, and goAway recovery. Persistent project memory in .codiey/rules for cross-session learning.",
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
      "Click",
      "NumPy",
      "SciPy",
    ],
    featured: true,
    modalPreview: {
      hook: "Voice-native AI coding partner with real-time audio and codebase intelligence",
      problemTeaser:
        "Talk naturally with AI about your code while watching live dependency graphs reveal what the model understands. Real-time bidirectional audio meets PageRank-powered codebase intelligence.",
      heroMetric: {
        label: "Voice Interface",
        value: "Real-time Bidi",
      },
    },
    metrics: [
      { label: "Tier 1 Tools", value: "6 Blocking" },
      { label: "Audio Latency", value: "<200ms" },
      { label: "File Ranking", value: "PageRank" },
    ],
  },
  {
    id: "p2",
    title: "ReMind - Human-like Memory for AI",
    github_url: "https://github.com/IshanApte/ReMind",
    deployed_url: "https://remind-iota.vercel.app/", // Add your actual deployed URL here
    star: {
      situation:
        "Traditional RAG systems lack human-like memory dynamics, treating all information equally regardless of recency or importance. Static retrieval methods fail to mimic how humans prioritize recently accessed information and reinforce frequently used knowledge.",
      task: "Implement human-like memory dynamics for AI systems with temporal decay and memory reinforcement, create interactive visualizations showing memory access patterns, and develop confidence scoring system to reduce hallucinations in AI responses.",
      action:
        "I developed ReMind, a web application that mimics human-like memory for AI systems, implementing semantic chunking with temporal decay where recently accessed information is prioritized and old information fades unless accessed. Created interactive heatmap visualizations showing which parts of content are being accessed in real-time, implemented memory reinforcement where frequently accessed chunks get boosted priority in future retrievals, and developed multi-factor confidence scoring system measuring groundedness (50%), keyword overlap (30%), and context quality (20%) to reduce hallucination risk. Built hybrid retrieval combining semantic similarity (60%) with temporal decay (40%) for adaptive chunk selection that uses high-scoring chunks when available and falls back to top 5 chunks otherwise.",
      result:
        "Successfully implemented human-like memory dynamics with temporal decay and reinforcement, achieved explainable AI through interactive visualizations showing memory access patterns, reduced hallucinations through comprehensive confidence scoring system, and created adaptive retrieval system that prioritizes relevant and recent information.",
      impact:
        "Demonstrated novel approach to AI memory systems that goes beyond traditional RAG, enabled more natural and context-aware recall behavior in AI systems, provided transparency into AI decision-making through visual feedback, and established foundation for experimenting with temporal memory and explainable AI.",
      architecture:
        "Next.js frontend with interactive heatmap visualizations and real-time feedback. Express.js backend managing RAG pipeline with LangChain integration. Python preprocessing scripts for semantic chunking using sentence-transformers library. Hybrid retrieval system combining semantic similarity (60%) with temporal decay (40%). Multi-factor confidence scoring system with groundedness (50%), keyword overlap (30%), and context quality (20%) measurements. Interactive onboarding and source chunk visualization components.",
    },
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Express.js",
      "LangChain",
      "Google Gemini",
      "Python",
      "Sentence Transformers",
      "Jupyter Notebook",
    ],
    featured: true,
    modalPreview: {
      hook: "Human-like memory dynamics for AI with temporal decay and reinforcement",
      problemTeaser:
        "Traditional RAG systems treat all information equally. ReMind mimics human memory with temporal decay and reinforcement mechanisms.",
      heroMetric: {
        label: "Memory Dynamics",
        value: "Temporal Decay",
      },
    },
    metrics: [
      { label: "Memory Decay", value: "Temporal" },
      { label: "Reinforcement", value: "Adaptive" },
      { label: "Visual Feedback", value: "Real-time" },
    ],
  },
  {
    id: "p3",
    title: "StratSim - F1 Race Strategy Simulator",
    github_url: "https://github.com/Spidey13/StratSim",
    deployed_url: "https://stratsim.streamlit.app/", // Add your actual deployed URL here
    star: {
      situation:
        "F1 race strategy decisions are complex and high-stakes, requiring accurate prediction of tire degradation and lap times. Traditional heuristic approaches fail to optimize strategies under dynamic race conditions, lacking the precision needed for competitive advantage.",
      task: "Synthesize automotive research to develop novel tire degradation algorithm improving pit-stop predictions by 18%, train predictive models on F1 telemetry achieving 0.05-second lap time accuracy, and develop multi-agent simulation platform with specialized AI agents for comprehensive race strategy analysis.",
      action:
        "I developed StratSim, a sophisticated multi-agent simulation platform for Formula 1 race strategy analysis featuring specialized AI agents: Tire Manager Agent tracks tire wear, temperature, and grip; Strategy Agent makes pit stop and tire compound decisions; Lap Time Agent predicts lap times considering car, driver, and track conditions; Weather Agent integrates real-time weather data; Vehicle Dynamics Agent models car performance; and Gap Effects Agent simulates DRS and dirty air impacts. Synthesized automotive research papers to develop novel tire degradation algorithm improving pit-stop strategy predictions by 18% through domain-specific feature engineering, trained machine learning models using CatBoost and other algorithms on historical F1 data (2023-2024 seasons via FastF1 API) achieving 0.05-second accuracy in lap time forecasting through rigorous hyperparameter optimization, and built Streamlit web interface for configuring race scenarios and visualizing simulation results. Integrated MLflow for experiment tracking and Docker for containerization.",
      result:
        "Improved pit-stop strategy predictions by 18% through novel tire degradation algorithm based on automotive research, achieved 0.05-second accuracy in lap time forecasting using machine learning models trained on historical F1 data, successfully created comprehensive F1 strategy simulation platform with specialized AI agents, and delivered interactive web interface for scenario configuration and result visualization.",
      impact:
        "Enabled data-driven race strategy decisions with precise tire degradation modeling, provided 'what-if' analysis capabilities for strategy testing with 0.05-second accurate lap time predictions, demonstrated advanced sports analytics system with comprehensive agent-based modeling, and established foundation for complex simulation scenarios with dynamic race conditions.",
      architecture:
        "Multi-agent simulation architecture with specialized agents: Tire Manager, Strategy, Lap Time, Weather, Vehicle Dynamics, and Gap Effects agents. Novel tire degradation algorithm incorporating domain-specific features from automotive research, improving pit-stop predictions by 18%. Machine learning models for lap time prediction using CatBoost and other algorithms trained on FastF1 historical data achieving 0.05-second accuracy. Streamlit web interface for scenario configuration and visualization. MLflow integration for experiment tracking and model versioning. Docker containerization for deployment. Modular architecture with clear separation of concerns for easy updates and feature additions.",
    },
    technologies: [
      "Python",
      "FastF1",
      "CatBoost",
      "Plotly",
      "Dash",
      "Data Visualization",
      "Machine Learning",
      "Docker",
      "MLflow",
      "Streamlit",
      "Multi-Agent Systems",
      "Jupyter Notebook",
    ],
    featured: true,
    modalPreview: {
      hook: "Improved F1 pit-stop strategy predictions by 18% with 0.05-second lap time accuracy",
      problemTeaser:
        "F1 race strategy decisions require accurate tire degradation and lap time predictions. Traditional heuristics fail under dynamic conditions.",
      heroMetric: {
        label: "Lap Time Accuracy",
        value: "0.05s",
      },
    },
    metrics: [
      { label: "Lap Time Accuracy", value: "0.05s" },
      { label: "Strategy Improvement", value: "18%" },
      { label: "Agent Types", value: "6 Specialized" },
    ],
  },
  {
    id: "p4",
    title: "Semiconductor Defect Detection System",
    github_url: "https://github.com/Spidey13/Wafer-Fault-Detection",
    star: {
      situation:
        "Semiconductor manufacturing requires precise defect detection from high-dimensional sensor data (591 sensors) to maintain production yield and minimize costly errors. Traditional methods lacked comprehensive validation pipelines and cluster-based modeling for reliable production deployment.",
      task: "Build a production-ready ML pipeline with dual algorithm comparison (XGBoost vs Random Forest) and K-Means clustering for targeted wafer fault classification, with automated hyperparameter tuning and comprehensive validation systems.",
      action:
        "I developed an end-to-end ML pipeline using Python and Flask with dual algorithm comparison (XGBoost and Random Forest) and K-Means clustering to segment wafers into distinct groups for targeted model training. Implemented comprehensive validation pipeline including schema validation, data quality checks, and missing value imputation. Used hyperparameter tuning with GridSearchCV and evaluated models using ROC AUC and accuracy metrics. Built Flask web application with training and prediction endpoints, featuring automated data preprocessing, model selection, and persistence systems.",
      result:
        "Created production-ready wafer fault detection system achieving high accuracy on 591-dimensional sensor data using cluster-based modeling approach. Implemented complete MLOps pipeline with automated validation, preprocessing, model training, and prediction capabilities. Delivered web interface for seamless model management and real-time predictions.",
      impact:
        "Enabled precise semiconductor defect detection with innovative cluster-based modeling using dual algorithm comparison (XGBoost vs Random Forest), established robust validation processes preventing erroneous predictions, demonstrated comprehensive MLOps implementation with automated hyperparameter tuning, and provided foundation for scalable industrial AI applications.",
      architecture:
        "Cluster-based modeling architecture using K-Means clustering with Elbow Method to segment wafers, followed by dual algorithm comparison (XGBoost vs Random Forest) with hyperparameter tuning. Comprehensive validation pipeline with schema validation, data quality checks, and missing value imputation. Automated preprocessing with KNN Imputer and feature selection. Flask web application with RESTful endpoints for training and prediction. Modular architecture with separate training and prediction workflows. Automated model selection using GridSearchCV with ROC AUC and accuracy evaluation metrics.",
    },
    technologies: [
      "Python",
      "Flask",
      "XGBoost",
      "Random Forest",
      "K-Means Clustering",
      "Machine Learning",
      "GridSearchCV",
      "ROC AUC",
      "Data Preprocessing",
      "MLOps",
      "REST API",
    ],
    featured: true,
    modalPreview: {
      hook: "Cluster-based modeling with dual algorithm comparison (XGBoost vs Random Forest)",
      problemTeaser:
        "Semiconductor manufacturing demands precise defect detection from 591 sensor inputs. Advanced cluster-based approach improves accuracy significantly.",
      heroMetric: {
        label: "Sensor Inputs",
        value: "591-Dim",
      },
    },
    metrics: [
      { label: "Algorithms", value: "XGBoost + RF" },
      { label: "Sensors", value: "591-Dim" },
      { label: "Validation", value: "Comprehensive" },
    ],
  },
  {
    id: "p5",
    title: "Prompt Optimization for Healthcare NLP",
    github_url: "https://github.com/Spidey13",
    star: {
      situation:
        "Healthcare forums contain multi-perspective medical answers that are difficult to summarize with traditional approaches. Existing methods required expensive model fine-tuning and struggled with perspective-aware content generation, lacking automated prompt optimization for domain-specific tasks.",
      task: "Develop a perspective-aware summarization system using automatic prompt optimization (DSPy MIPROv2) for medical Q&A content, implement multi-objective loss functions for perspective alignment, and achieve state-of-the-art results on healthcare benchmarks without extensive fine-tuning.",
      action:
        "I developed a sophisticated prompt optimization system using DSPy's MIPROv2 algorithm for automatic prompt engineering in healthcare NLP tasks. Implemented perspective-aware summarization with five categories (INFORMATION, SUGGESTION, EXPERIENCE, CAUSE, QUESTION) using multi-objective loss functions combining perspective classification, start-phrase matching, and tone alignment. Created comprehensive evaluation framework with multiple metrics (ROUGE, BLEU, METEOR, BertScore, custom SemanticF1) and integrated BERTopic for seed-topic guided content modeling. Built dual pipeline architecture supporting both traditional fine-tuning and DSPy programmatic optimization approaches with parameter-efficient fine-tuning (PEFT) techniques.",
      result:
        "Achieved state-of-the-art results on healthcare NLP benchmarks with perspective-aware summarization, implemented automatic prompt optimization eliminating manual prompt engineering, and created robust evaluation framework measuring perspective alignment and semantic similarity. Successfully applied MIPROv2 for automated prompt optimization without model retraining.",
      impact:
        "Demonstrated advanced prompt optimization techniques for domain-specific NLP tasks, established new approach to perspective-aware content generation in healthcare, advanced state-of-the-art in medical text summarization with automated optimization, and provided cost-effective solution reducing need for extensive model fine-tuning.",
      architecture:
        "Dual pipeline architecture combining traditional fine-tuning and DSPy programmatic optimization. DSPy MIPROv2 for automatic prompt optimization with Chain-of-Thought reasoning. Multi-objective loss function integrating perspective classification, start-phrase matching, and tone alignment. Comprehensive evaluation framework with ROUGE, BLEU, METEOR, BertScore, and custom SemanticF1 metrics. BERTopic integration for seed-topic guided content modeling. PEFT (Prefix Tuning) for parameter-efficient model adaptation. Modular system with data preprocessing, topic modeling, and generation components.",
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
    ],
    featured: true,
    modalPreview: {
      hook: "Automatic prompt optimization using DSPy MIPROv2 for healthcare NLP",
      problemTeaser:
        "Advanced perspective-aware summarization using automatic prompt optimization for medical Q&A content.",
      heroMetric: {
        label: "Prompt Optimization",
        value: "MIPROv2",
      },
    },
    metrics: [
      { label: "Optimization", value: "MIPROv2" },
      { label: "Perspectives", value: "5 Types" },
      { label: "Metrics", value: "Multi-Faceted" },
    ],
  },
  {
    id: "p7",
    title: "Audio-Lyric Emotional Alignment",
    github_url: "https://github.com/Spidey13",
    star: {
      situation:
        "Understanding emotional congruence between music and lyrics is a complex multimodal AI challenge. Traditional approaches fail to quantify how well emotional content in audio aligns with emotional content in text, lacking sophisticated cross-modal embedding techniques.",
      task: "Develop a multimodal AI system to quantify emotional alignment between music and lyrics using joint audio-language embeddings, implement cross-modal similarity measurement, and achieve measurable emotion alignment percentages using advanced embedding techniques.",
      action:
        "I developed a sophisticated multimodal AI system using OpenL3 for music-specific audio embeddings and Sentence Transformers for text embeddings. Created a joint embedding space using PCA to align audio and text representations, enabling cosine similarity computation between modalities. Implemented comprehensive pipeline including audio segmentation, lyrics extraction via Genius API, preprocessing, and emotion classification using transformer models. Processed 712 audio segments with corresponding lyrics, achieving 63.10% emotional alignment between audio and text modalities. Integrated multiple APIs (ACRCloud, AudD, Genius) for robust data collection and implemented clustering techniques to identify emotional patterns.",
      result:
        "Successfully quantified emotional alignment between music and lyrics with 63.10% alignment rate, created joint embedding space enabling cross-modal similarity measurement, processed 712 audio segments with corresponding lyrics, and demonstrated measurable emotional correspondence between audio and text modalities.",
      impact:
        "Demonstrated cutting-edge multimodal AI techniques for cross-modal emotion recognition, advanced state-of-the-art in music information retrieval with quantifiable emotional alignment metrics, provided framework for emotion-aware music applications, and showcased advanced embedding alignment techniques across different modalities.",
      architecture:
        "Multimodal architecture combining OpenL3 for music-specific audio embeddings and Sentence Transformers for text embeddings. PCA-based dimensionality reduction to create joint embedding space for cross-modal comparison. Comprehensive pipeline with audio segmentation, lyrics extraction via Genius API, preprocessing, and emotion classification. Cosine similarity computation for measuring emotional alignment between modalities. Multiple API integration (ACRCloud, AudD, Genius) for robust data collection. Clustering techniques for identifying emotional patterns. Cross-modal validation framework comparing audio-based and text-based emotion classifications.",
    },
    technologies: [
      "OpenL3",
      "Sentence Transformers",
      "PyTorch",
      "Transformers",
      "Librosa",
      "NumPy",
      "Pandas",
      "Multimodal AI",
      "Python",
      "ACRCloud API",
      "Genius API",
      "Scikit-learn",
    ],
    featured: true,
    modalPreview: {
      hook: "Quantified emotional alignment between music and lyrics at 63.10% accuracy",
      problemTeaser:
        "Advanced multimodal AI system measuring emotional congruence between audio and text using joint embedding spaces.",
      heroMetric: {
        label: "Emotion Alignment",
        value: "63.10%",
      },
    },
    metrics: [
      { label: "Alignment Rate", value: "63.10%" },
      { label: "Segments", value: "712+" },
      { label: "Modalities", value: "Audio + Text" },
    ],
  },
  {
    id: "p1",
    title: "Autonomous Research Agent (Scientific Discovery System)",
    github_url: "https://github.com/YASHY2K/scientific-discovery-agent",
    star: {
      situation:
        "Literature reviews traditionally take researchers months to complete for complex academic queries spanning multiple research domains. Manual review processes are time-consuming, inconsistent, and struggle with interdisciplinary synthesis.",
      task: "Collaborative project (co-developed with a teammate). Led full-stack development of an autonomous research tool that accelerates literature reviews to within minutes, designed hierarchical agent orchestration with specialized roles for different research phases, and implemented a comprehensive transparency system for real-time visibility into agent workflows.",
      action:
        "I led development of an autonomous research tool using AWS Strands Agents and Amazon Bedrock, completing comprehensive literature reviews within minutes instead of months. Designed hierarchical multi-agent architecture with five specialist agents (Research Planner, Paper Searcher, Paper Analyzer, Research Critique, Report Generator) managing the complete five-phase workflow (Planning → Search → Analysis → Critique → Reporting). Implemented 'Glass Box' transparency system providing real-time visibility into agent decision chains with live activity streams, and integrated multi-database search capabilities across arXiv and Semantic Scholar. Deployed Research Critique Agent to validate accuracy and eliminate hallucinations in final reports.",
      result:
        "Eliminated hallucinations in research reports through automated validation, achieved 100% coverage of relevant research papers, accelerated literature reviews from months to minutes, successfully processed interdisciplinary queries requiring cross-domain synthesis, and achieved full transparency with real-time workflow visibility.",
      impact:
        "Transformed research workflows by eliminating months of manual literature review, enabled researchers to focus on analysis rather than data gathering, demonstrated successful hierarchical multi-agent orchestration for complex knowledge synthesis tasks, and provided unprecedented transparency into AI research processes.",
      architecture:
        "Hierarchical multi-agent system built on AWS Strands Agents and Amazon Bedrock with five specialist agents: Research Planner, Paper Searcher, Paper Analyzer, Research Critique, and Report Generator. Five-phase workflow orchestration (Planning → Search → Analysis → Critique → Reporting) with self-critique and refinement capabilities. 'Glass Box' transparency system with real-time activity streams and phase tracking. Multi-database integration with arXiv and Semantic Scholar. Professional report generation with executive summaries, methodology reviews, comparative analysis, and academic citations. Streamlit dashboard for real-time monitoring with comprehensive logging and performance tracking.",
    },
    technologies: [
      "AWS Strands Agents",
      "Amazon Bedrock",
      "Python",
      "Streamlit",
      "Multi-Agent Systems",
      "arXiv API",
      "Semantic Scholar API",
    ],
    featured: true,
    modalPreview: {
      hook: "Autonomous AI agent eliminates hallucinations while completing literature reviews in minutes",
      problemTeaser:
        "Imagine 5 specialized AI agents collaborating autonomously to conduct literature reviews. See how this breakthrough system revolutionizes academic research.",
      heroMetric: {
        label: "Accuracy Validation",
        value: "Glass Box Transparency",
      },
    },
    metrics: [
      { label: "Research Coverage", value: "100%" },
      { label: "Review Speed", value: "Minutes" },
      { label: "Specialist Agents", value: "5" },
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
      task: "Build a production-ready AI support agent using Anthropic's native tool_use loop directly (no LangChain or orchestration frameworks), implement branching diagnostic job cards grounded in the actual service manual, generate interactive HTML artifacts for wiring diagrams and settings configurators, enable multimodal image input for visual fault recognition, and deploy with zero cold-start latency on GCP Cloud Run.",
      action:
        "I built Diagnostiq directly on Claude's tool_use mechanism with a 4-tool architecture: search_knowledge (ChromaDB vector retrieval), get_manual_image (manual page PNG with bbox highlights), render_artifact (Sonnet-generated self-contained HTML in sandboxed iframe), and generate_job_card (Sonnet-validated JSON branching diagnostic workflow). Implemented a dual-embedding RAG pipeline — Gemini 2.5 Flash vision for per-page structured extraction at ingest with Vertex text-embedding-004 (768-dim), then local sentence-transformers all-MiniLM-L6-v2 (384-dim) for serving — eliminating GCP credential requirements at runtime. FastAPI backend streams responses via SSE with the synchronous tool loop running in a thread pool. Haiku drives the agent loop; Sonnet generates validated HTML artifacts and structured JSON job cards. React 19 frontend features a two-panel chat and artifact viewer, pinnable artifacts that persist across follow-up messages, swipe-gesture job card UI with keyboard Y/N navigation, and full accessibility. Baked HuggingFace embedding model weights into the Docker image layer to eliminate cold-start ML download.",
      result:
        "Delivered a production-ready AI support agent with real-time SSE streaming, interactive branching diagnostic workflows backed by actual manual citations, multimodal image input, and zero-dependency serving requiring only ANTHROPIC_API_KEY. Scored 96/100 on Web Interface Guidelines accessibility audit. Eliminated cold-start ML download latency by baking 80 MB embedding model into the Docker image layer. Deployed on GCP Cloud Run with automatic scale-to-zero for cost efficiency.",
      impact:
        "Transformed HVAC fault diagnosis from manual PDF lookup to AI-guided branching workflows with live manual citations, demonstrated framework-free agentic architecture built directly on Claude's tool_use without LangChain or AutoGen, established a dual-embedding pattern for cost-effective RAG deployment separating ingestion-time accuracy from serving-time portability, and proved that production-grade accessibility and UX are achievable in agent-native applications.",
      architecture:
        "FastAPI backend with SSE streaming via sse-starlette. SupportAgent class running synchronous Anthropic tool_use loop in thread pool executor — Haiku for tool routing, Sonnet for HTML artifact generation and job card JSON. 4-tool schema: search_knowledge (ChromaDB cosine similarity with chunk-type boosting), get_manual_image (PNG pages with annotation bbox overlay), render_artifact (three-stage HTML fallback with validation), generate_job_card (validated branching JSON with source_citation enforcement). Dual-embedding pipeline: Gemini 2.5 Flash vision structured per-page extraction, Vertex text-embedding-004 at ingest (768-dim), all-MiniLM-L6-v2 at serve (384-dim). Exact-match SemanticCache for fault button queries. Thread-safe SessionStore for conversation history. React 19 + Vite frontend with useChat SSE consumer, useJobCard branching state machine, ArtifactPanel iframe sandbox, pinnable artifact persistence. Multi-stage Dockerfile with HF_HOME baked into image layer. GCP Cloud Run with 2 GiB RAM, Secret Manager for API key.",
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
      "Docker",
      "GCP Cloud Run",
      "Pydantic",
    ],
    featured: true,
    modalPreview: {
      hook: "Framework-free AI support agent with branching diagnostic job cards and interactive artifacts",
      problemTeaser:
        "Built directly on Claude's tool_use — no LangChain, no AutoGen. Fault descriptions become branching diagnostic workflows grounded in the actual service manual.",
      heroMetric: {
        label: "Accessibility Score",
        value: "96/100",
      },
    },
    metrics: [
      { label: "Agent Tools", value: "4 Specialized" },
      { label: "Accessibility", value: "96/100" },
      { label: "Cold Start", value: "Zero DL" },
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
