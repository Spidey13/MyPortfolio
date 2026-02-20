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
    role: "Data Scientist",
    company: "Indiana University",
    duration: "May 2024 to Present",
    location: "Bloomington, IN",
    star: {
      situation:
        "Indiana University's digital humanities research team faced a critical bottleneck: analyzing 550+ academic publications for diversity trends required 3+ weeks of manual review per batch. The manual process was error-prone, delaying publication timelines, and lacked the reproducibility guarantees required for rigorous peer review.",
      task: "Build an AI-powered research analysis platform to automate literature review workflows, verify source reliability, extract diversity themes, and provide interactive visualizations—all while meeting strict academic reproducibility standards.",
      action:
        "I engineered a production-grade RAG pipeline that reduced processing time from 3 weeks to 4 hours. The system integrated custom spaCy verification logic to filter unreliable sources (achieving 98% accuracy) and utilized NMF topic modeling for theme extraction. Additionally, I developed interactive Plotly and Dash dashboards to visualize emerging semantic trends, enabling researchers to dynamically explore complex word co-occurrence patterns.",
      result:
        "Reduced literature review time by 95%, processed 550+ academic publications with 98% retrieval accuracy, and provided stakeholders with real-time semantic dashboards to explore complex data models.",
      impact:
        "Transformed the university's research workflow, enabling the team to meet critical deadlines and publish findings in a prestigious peer-reviewed journal. The reproducible framework successfully demonstrated that LLM-based automation can meet rigorous academic standards.",
      architecture:
        "Built a RAG pipeline with custom spaCy-based logic for source filtering and Pinecone vector databases for efficient semantic search. Implemented multi-stage LLM processing for automated synthesis and deployed Plotly/Dash for frontend visualization. Engineered for complete reproducibility with data versioning and experiment tracking.",
    },
    technologies: [
      "Python",
      "RAG Pipelines",
      "spaCy",
      "LLMs",
      "Pinecone",
      "Plotly / Dash",
      "Statistical Modeling",
    ],
    competencies: [
      "Research & Innovation: Academic Research, Novel Pipeline Architecture, Reproducible Research Methods",
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
      systemUptime: "100% Reproducibility",
      costReduction: "95% Time Saved",
      performanceImprovement: "98% Retrieval Accuracy",
    },
    tag: {
      text: "Current",
      icon: "workspace_premium",
      color: "bg-purple-600",
    },
    teamStructure: {
      role: "Data Scientist",
      size: "3 Researchers",
      description:
        "Led technical AI pipeline development, collaborating with a team of 3 digital humanities researchers on diversity and inclusion analysis.",
      collaboration:
        "Direct collaboration with faculty members to define methodology and ensure academic rigor. Regular syncs with research ethics board.",
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
    duration: "May 2023 to Jul 2023",
    location: "Mumbai, India",
    star: {
      situation:
        "Dimensionless Technologies needed to scale their ML capabilities on two fronts: operationalizing a high-frequency stock prediction model for real-time inference, and scaling their enterprise document processing workflows which were bottlenecked at 50 documents/month due to manual effort.",
      task: "Deploy a production-ready MLOps pipeline on AWS for the stock prediction model with sub-100ms latency, and concurrently engineer a high-throughput ETL pipeline on Azure to process 10,000+ documents monthly while reducing overall cloud infrastructure costs.",
      action:
        "I operationalized the high-frequency stock prediction model by architecting an end-to-end MLOps pipeline on AWS SageMaker, optimizing serialization for sub-100ms real-time inference. Simultaneously, I engineered a serverless Azure ETL pipeline integrating OCR and BERT-based NLP models to automate 90% of manual data entry for tender documents. To manage scale, I right-sized compute resources and implemented spot instance strategies, cutting cloud costs by 20%.",
      result:
        "Achieved sub-100ms inference latency on the production stock model, scaled document processing capacity from 50 to 10,000+ documents monthly (200x increase).",
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
    company: "Benchmark Computer Solutions Pvt. Ltd.",
    duration: "Jun 2022 to Dec 2022",
    location: "Mumbai, India",
    star: {
      situation:
        "Benchmark's enterprise recruitment platform was struggling with scale and accuracy. Their resume parsing API was handling thousands of concurrent requests but suffered from frequent timeouts (500ms+ latency). Furthermore, the core candidate extraction model was underperforming at a 78% F1-score, leading to poor candidate matching and threatening key enterprise contracts.",
      task: "Architect a high-throughput, containerized REST API capable of serving 10,000+ daily requests with 99.9% uptime, reduce response latency by 40%, and boost the NER (Named Entity Recognition) model accuracy to ensure reliable automated candidate screening.",
      action:
        "I rebuilt the backend architecture using FastAPI and Docker to handle high concurrency, implementing asyncio patterns and Redis caching to cut API response times from 500ms to 300ms. To fix the extraction accuracy, I fine-tuned a state-of-the-art Hugging Face Transformer model for NER and implemented an active learning pipeline using uncertainty sampling to continuously improve the model while reducing manual labeling efforts by 40%.",
      result:
        "Successfully deployed the production API handling 10,000+ daily requests with 99.9% uptime. Improved the candidate matching F1-score from 78% to 91%, and reduced annotation costs by 40%.",
      impact:
        "Stabilized the core enterprise product, eliminating downtime complaints and securing over $500K in at-risk enterprise contracts. The improved extraction accuracy reduced time-to-placement by 33%, significantly boosting client satisfaction.",
      architecture:
        "Built a scalable microservices architecture using FastAPI for high-performance async request handling. Docker containerization ensured reproducible deployments. The NLP pipeline combined fine-tuned Transformer models (Hugging Face) with an active learning loop using uncertainty sampling to maximize labeling efficiency. Used PostgreSQL with optimized indexing strategies.",
    },
    technologies: [
      "Python",
      "FastAPI",
      "Docker",
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
