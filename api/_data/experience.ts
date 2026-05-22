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
    duration: "May 2024 to Present",
    location: "Bloomington, IN",
    star: {
      situation:
        "Indiana University's research team faced two interconnected challenges: the manual literature review process took 3+ weeks per batch and lacked a reusable retrieval tool, while a parallel diversity study across 550+ academic publications needed a reproducible computational pipeline for peer-reviewed publication.",
      task: "Build a reusable Agentic RAG platform to automate literature retrieval with high accuracy, and separately develop the text-mining pipeline to analyze diversity trends across 550+ publications for a peer-reviewed study.",
      action:
        "Built an Agentic RAG platform using Python and Pinecone vector databases with semantic routing, automating literature retrieval and reducing manual review cycles by 95% (3 weeks → 4 hours) with 98% retrieval accuracy. Built the retriever as a hybrid stack (BM25 lexical + Pinecone semantic + metadata filters on publication year and venue) since pure-semantic retrieval over academic abstracts was missing exact-name and acronym matches. Traced runs with LangSmith and used the traces to drive iterative improvements to the routing rules. Separately, developed the computational text-mining pipeline for the diversity study — engineering spaCy-based NLP preprocessing, NMF topic modeling, and statistical analysis across 550+ peer-reviewed publications. Engineered asynchronous backend microservices and RESTful APIs with FastAPI and Docker to serve processed datasets across university departments. Deployed Plotly/Dash dashboards for interactive trend visualization and integrated MLflow experiment tracking to ensure full computational reproducibility for the published study.",
      result:
        "Reduced literature review time by 95% (3 weeks → 4 hours) with 98% retrieval accuracy on the RAG platform. The diversity analysis pipeline processed 550+ publications, and findings were independently validated through peer review and published in The Design Journal.",
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
      usersScaled: "550+ Papers Analyzed",
      systemUptime: "Peer-Reviewed Publication",
      costReduction: "95% Faster Review",
      performanceImprovement: "98% Retrieval Accuracy",
    },
    tag: {
      text: "Current",
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
        "Dimensionless Technologies needed to ship two separate products: a stock market news classification system requiring real-time inference for their fintech clients, and an enterprise document processing tool bottlenecked at 50 documents/month due to manual effort.",
      task: "Fine-tune a BERT model for multiclass stock news classification and build the AWS inference backend with sub-100ms latency. Separately, assess the document processing problem, design the right approach, and build a high-throughput extraction pipeline on Azure.",
      action:
        "Fine-tuned a BERT model for multiclass classification of stock market news and built the serving infrastructure on AWS SageMaker with CI/CD pipelines for automated retraining and deployment, achieving sub-100ms inference latency through optimized model serialization and endpoint configuration. Set up Weights & Biases to track fine-tuning runs and compare checkpoints on the eval split before promoting any model to staging. For the document processing product, evaluated the business problem and identified that a chatbot-based approach wouldn't solve the core extraction need — designed PropelPro as an extraction-first pipeline instead. Built it on serverless Azure Functions, integrating Tesseract OCR with BERT-based NLP models to automate parsing and structured data extraction from enterprise tender documents, scaling throughput from 50 to 10,000+ documents monthly. Optimized cloud infrastructure across both products by right-sizing compute and implementing spot instance strategies, cutting costs by 20% ($15K+ annually).",
      result:
        "Achieved sub-100ms inference latency on the stock classification backend, scaled document processing from 50 to 10,000+ documents monthly (200x increase), and reduced cloud infrastructure costs by 20% ($15K+ annually).",
      impact:
        "Enabled the team to serve enterprise document processing clients at scale without proportional headcount, and established reusable MLOps patterns across both AWS and Azure for the engineering team.",
      architecture:
        "Stock classification: BERT fine-tuned for multiclass news classification, deployed on AWS SageMaker with CI/CD for automated retraining, versioning, and endpoint management. Document processing (PropelPro): Serverless Azure Functions ETL pipeline with Tesseract OCR and BERT-based NLP for structured extraction, optimized for cost and automatic scaling. W&B for experiment tracking. Pydantic for the SageMaker request/response contracts. Pytest for the OCR + NER + routing pipeline.",
    },
    technologies: [
      "Python",
      "AWS SageMaker",
      "Azure Functions",
      "Time-Series / FinTech",
      "OCR (Tesseract)",
      "NLP (BERT)",
      "MLOps",
      "Weights & Biases",
      "Pydantic",
      "Pytest",
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
      systemUptime: "99.9% API Uptime",
      costReduction: "20% Cloud Cost Savings",
      performanceImprovement: "<100ms Inference Latency",
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
        "Rebuilt the backend architecture using FastAPI and Docker to handle high concurrency, implementing asyncio patterns and Redis caching to reduce P99 latency by 40% (500ms → 300ms). Used FastAPI's built-in OpenAPI generation as the contract surface for QA and frontend, and added Pytest coverage on the parse → match → respond path so the active-learning loop couldn't regress shipped behavior. Set up Sentry for error tracking on the production endpoints. Fine-tuned a Hugging Face Transformer model for NER and implemented an active learning pipeline using uncertainty sampling to continuously improve the model while reducing manual labeling effort by 40%.",
      result:
        "Deployed the production API handling 10,000+ daily requests with 99.9% uptime. Improved candidate extraction F1-score from 78% to 91% and reduced annotation costs by 40% through the active learning loop.",
      impact:
        "Stabilized the recruitment platform's core API, eliminating timeout-related complaints and improving candidate match quality — enabling the product team to reliably serve enterprise clients at scale.",
      architecture:
        "Microservices architecture using FastAPI for async request handling with Redis caching layer. Docker containerization for reproducible deployments. NLP pipeline with fine-tuned Transformer models (Hugging Face) and active learning loop using uncertainty sampling. PostgreSQL with optimized composite indexing. OpenAPI / Swagger auto-generated from FastAPI for cross-team integration. Pytest for end-to-end coverage of the parsing and matching paths. Sentry for production error tracking.",
    },
    technologies: [
      "Python",
      "FastAPI",
      "Docker",
      "Transformers (Hugging Face)",
      "Active Learning",
      "PostgreSQL",
      "Asyncio",
      "OpenAPI",
      "Pytest",
      "Sentry",
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
      usersScaled: "10,000+ Daily Requests",
      systemUptime: "99.9% System Uptime",
      costReduction: "40% Annotation Cost",
      performanceImprovement: "+13% F1-Score",
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
