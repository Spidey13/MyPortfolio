/**
 * Work Experience Data
 * Edit this file to update your work history
 */

export interface ExperienceSTAR {
  situation: string;
  task: string;
  action: string;
  result: string;
  impact: string;
  architecture: string;
}

export interface ExperienceMetrics {
  usersScaled: string;
  systemUptime: string;
  costReduction: string;
  performanceImprovement: string;
}

export interface ExperienceTeamStructure {
  role: string;
  size: string;
  description: string;
  collaboration: string;
}

export interface ExperienceTag {
  text: string;
  icon: string; // material symbol name
  color: string; // tailwind color class
}

export interface ExperienceCompanyInfo {
  fundingStage: string;
  industry: string;
  size: string;
}

export interface ExperienceArtifact {
  title: string;
  url: string;
  icon?: string;
}

export interface Experience {
  id: number;
  role: string;
  company: string;
  duration: string;
  location: string;
  star: ExperienceSTAR;
  technologies: string[];
  competencies: string[];
  soft_skills: string[];
  metrics?: ExperienceMetrics;
  tag?: ExperienceTag;
  teamStructure?: ExperienceTeamStructure;
  companyInfo?: ExperienceCompanyInfo;
  artifacts?: ExperienceArtifact[];
}

export const EXPERIENCE: Experience[] = [
  {
    id: 1,
    role: "Applied AI Engineer",
    company: "Indiana University",
    duration: "May 2024 to Jun 2026",
    location: "Bloomington, IN",
    star: {
      situation:
        "Indiana University's research team faced two interconnected challenges: the manual literature review process took 3+ weeks per batch and lacked a reusable retrieval tool, while a parallel diversity study across 550+ academic publications needed a reproducible computational pipeline for peer-reviewed publication.",
      task: "Build a reusable Agentic RAG platform to automate literature retrieval with high accuracy, and separately develop the text-mining pipeline to analyze diversity trends across 550+ publications for a peer-reviewed study.",
      action:
        "Built an Agentic RAG platform using Python and Pinecone vector databases, automating literature retrieval across 550+ academic publications. Built the retriever as a hybrid stack (BM25 lexical + Pinecone semantic + metadata filters on publication year and venue) since pure-semantic retrieval over academic abstracts was missing exact-name and acronym matches. Traced runs with LangSmith and used the traces to drive iterative improvements to the routing rules. Validated retrieval quality against a faculty-curated relevance set used as a regression suite. Separately, developed the computational text-mining pipeline for the diversity study — engineering spaCy-based NLP preprocessing, NMF topic modeling, and statistical analysis across 550+ peer-reviewed publications. Engineered asynchronous backend microservices and RESTful APIs with FastAPI and Docker to serve processed datasets across university departments. Deployed Plotly/Dash dashboards for interactive trend visualization and integrated MLflow experiment tracking to ensure full computational reproducibility for the published study.",
      result:
        "Agentic RAG platform processing 550+ publications with hybrid BM25 + semantic retrieval, validated against a faculty-curated relevance set. The diversity analysis pipeline findings were independently validated through peer review and published in The Design Journal.",
      impact:
        "The RAG platform became a reusable research tool for the department. The diversity study was published in The Design Journal, demonstrating that LLM-augmented workflows can meet peer-review reproducibility standards.",
      architecture:
        "RAG platform: Python with Pinecone vector databases for semantic search and routing, FastAPI async microservices, Docker containerization. Diversity study pipeline: spaCy NLP preprocessing, NMF topic modeling, statistical analysis across 550+ publications. Shared infrastructure: Plotly/Dash dashboards for visualization, MLflow for experiment tracking and reproducibility. Hybrid BM25 + Pinecone retrieval with metadata filtering. LangSmith for run traces. Pydantic models for the document, chunk, and citation contracts. Pytest with a faculty-curated evaluation set as the regression suite. OpenAPI auto-published from FastAPI for cross-team integration.",
    },
    technologies: [
      "Python",
      "FastAPI",
      "Docker",
      "MLflow",
      "RAG Pipelines",
      "Pinecone",
      "spaCy",
      "NMF",
      "LLMs",
      "Plotly / Dash",
      "Statistical Modeling",
      "LangSmith",
      "BM25",
      "Pydantic",
      "Pytest",
      "OpenAPI",
    ],
    competencies: [
      "Research & Engineering: Academic Research, RAG Pipeline Architecture, Reproducible Research Methods",
      "Technical Execution: End-to-End ML System Design, Interactive Data Visualization",
      "Problem Solving: Complex Data Analysis, Algorithm Optimization",
    ],
    soft_skills: [
      "Communication: Technical Documentation, Academic Writing, Stakeholder Presentations",
      "Collaboration: Cross-disciplinary Teamwork, Iterative Feedback Integration",
      "Innovation: Creative Problem Solving, Methodology Development",
    ],
    metrics: {
      usersScaled: "550+ Publications",
      systemUptime: "Peer-Reviewed (The Design Journal)",
      costReduction: "Hybrid BM25 + Semantic Retrieval",
      performanceImprovement: "Faculty-Curated Eval Set",
    },
    tag: {
      text: "Most Recent",
      icon: "workspace_premium",
      color: "bg-purple-600",
    },
    teamStructure: {
      role: "Applied AI Engineer",
      size: "Research Team",
      description:
        "Led technical AI pipeline development, collaborating with digital humanities researchers on diversity and inclusion analysis.",
      collaboration:
        "Direct collaboration with faculty to define methodology and ensure academic rigor.",
    },
    companyInfo: {
      fundingStage: "Academic Research",
      industry: "Higher Education",
      size: "Large Public University (40,000+ students)",
    },
    artifacts: [
      {
        title: "System Architecture Diagram.pdf",
        url: "https://www.tandfonline.com/doi/abs/10.1080/14606925.2025.2482556",
        icon: "description",
      },
    ],
  },
  {
    id: 2,
    role: "Machine Learning Engineer",
    company: "Dimensionless Technologies",
    duration: "Feb 2023 to Jul 2023",
    location: "Mumbai, India",
    star: {
      situation:
        "Dimensionless Technologies needed to scale their ML capabilities on two fronts: operationalizing a high-frequency stock prediction model for real-time inference, and scaling their enterprise document processing workflows which were bottlenecked at 50 documents/month due to manual effort.",
      task: "Deploy a production-ready MLOps pipeline on AWS for the stock prediction model with sub-100ms latency, and concurrently engineer a high-throughput ETL pipeline on Azure capable of processing 10,000+ documents monthly.",
      action:
        "I operationalized the high-frequency stock prediction model by architecting an end-to-end MLOps pipeline on AWS SageMaker, optimizing serialization for sub-100ms real-time inference. Simultaneously, I engineered PropelPro — a serverless Azure Functions ETL pipeline integrating Tesseract OCR and BERT-based NLP models to automate 90% of manual data entry for enterprise tender documents, handling 10,000+ documents monthly. To manage scale, I right-sized compute resources and implemented spot instance strategies to keep inference costs proportional to load.",
      result:
        "Achieved sub-100ms inference latency on the production stock model and delivered a document processing pipeline handling 10,000+ documents monthly.",
      impact:
        "Enabled Dimensionless to scale operations without proportional hiring, directly contributing to 3 new enterprise client acquisitions. Demonstrated that complex AI workflows (both time-series financial models and NLP pipelines) could be deployed cost-effectively.",
      architecture:
        "Deployed the stock prediction system on AWS SageMaker with full CI/CD workflows for automated retraining, versioning, and deployment. The document processing pipeline utilized a serverless architecture (Azure Functions) integrating Tesseract OCR and BERT NLP models, optimized for cost and automatic scaling.",
    },
    technologies: [
      "Python",
      "AWS SageMaker",
      "Azure Functions",
      "Time-Series / FinTech",
      "OCR (Tesseract)",
      "NLP (BERT)",
      "MLOps",
    ],
    competencies: [
      "Technical Execution: Production ML System Design, MLOps Best Practices, Hybrid Cloud (AWS/Azure)",
      "Problem Solving: Performance Optimization, Cost Optimization, Scalability Engineering",
      "Business Impact: ROI Optimization, Cross-Functional Client Delivery",
    ],
    soft_skills: [
      "Communication: Technical Requirements Translation, Stakeholder Management",
      "Adaptability: Managing Multiple Production Pipelines, Rapid Technology Evaluation",
      "Delivery: End-to-end Ownership, Agile Execution",
    ],
    metrics: {
      usersScaled: "10,000+ Docs/Month",
      systemUptime: "Sub-100ms Inference",
      costReduction: "Serverless Auto-Scaling",
      performanceImprovement: "90% Data Entry Automated",
    },
    tag: {
      text: "High Growth",
      icon: "trending_up",
      color: "bg-amber-500",
    },
    teamStructure: {
      role: "Machine Learning Engineer",
      size: "10 Engineers",
      description:
        "Built production ML systems as part of a 10-person engineering team, collaborating across MLOps, backend, and data engineering.",
      collaboration:
        "Partnered directly with cross-functional client teams to translate ambiguous business needs into concrete technical requirements for the NLP models.",
    },
    companyInfo: {
      fundingStage: "Bootstrapped",
      industry: "AI Consulting & FinTech Solutions",
      size: "Small Startup (20-50 employees)",
    },
  },
  {
    id: 3,
    role: "Full Stack Engineer",
    company: "Benchmark Computer Solutions",
    duration: "Jun 2022 to Dec 2022",
    location: "Mumbai, India",
    star: {
      situation:
        "Benchmark's enterprise recruitment platform was struggling with reliability and extraction quality. The resume parsing API suffered from frequent timeouts at 500ms+ P99 latency under load, and the core candidate extraction model was underperforming at 78% F1-score, leading to poor candidate matching.",
      task: "Rebuild the API backend for high throughput and reliability, reduce response latency, and improve the NER model accuracy for automated candidate screening.",
      action:
        "I rebuilt the backend architecture using FastAPI and Docker to handle high concurrency, implementing asyncio patterns and Redis caching to cut P99 from 500ms to 300ms. Added targeted PostgreSQL indexes on search-heavy queries for consistent latency under concurrent load. Fine-tuned a Hugging Face Transformer model for NER and built an active-learning loop with uncertainty sampling, lifting F1 from 78% to 91% on held-out test data.",
      result:
        "Improved candidate extraction F1-score from 78% to 91% on held-out test data. Deployed the production API with P99 latency cut from 500ms to 300ms via Redis caching and async FastAPI.",
      impact:
        "Stabilized the recruitment platform's core API, eliminating timeout-related complaints and improving candidate match quality — enabling the product team to reliably serve enterprise clients at scale.",
      architecture:
        "Microservices architecture using FastAPI for async request handling with Redis caching layer. Docker containerization for reproducible deployments. NLP pipeline with fine-tuned Transformer models (Hugging Face) and active learning loop using uncertainty sampling. PostgreSQL with optimized composite indexing.",
    },
    technologies: [
      "Python",
      "FastAPI",
      "Docker",
      "Redis",
      "Transformers (Hugging Face)",
      "Active Learning",
      "PostgreSQL",
      "Asyncio",
    ],
    competencies: [
      "Technical Architecture: Production API Design, Containerization, High-Concurrency Systems",
      "Machine Learning: NLP Fine-Tuning, Named Entity Recognition (NER), Active Learning",
      "Performance: Query Optimization, Latency Reduction, System Reliability",
    ],
    soft_skills: [
      "Communication: Technical Documentation, Cross-team QA Collaboration",
      "Quality: Attention to Detail, Production Reliability Testing",
      "Delivery: Working under pressure to secure client contracts",
    ],
    metrics: {
      usersScaled: "F1: 0.78 → 0.91",
      systemUptime: "P99: 500ms → 300ms",
      costReduction: "Active Learning Loop",
      performanceImprovement: "Uncertainty Sampling",
    },
    tag: {
      text: "Early Career",
      icon: "school",
      color: "bg-emerald-500",
    },
    teamStructure: {
      role: "Full Stack Engineer",
      size: "15 Engineers",
      description:
        "Built production APIs and candidate extraction systems as part of a 15-person engineering team, collaborating across backend, ML, and QA.",
      collaboration:
        "Direct collaboration with QA team to define API specifications and testing strategies. Weekly syncs with DevOps for deployment coordination.",
    },
    companyInfo: {
      fundingStage: "Bootstrapped",
      industry: "HR Tech & Recruitment Software",
      size: "Mid-size Company (100-200 employees)",
    },
  },
];
