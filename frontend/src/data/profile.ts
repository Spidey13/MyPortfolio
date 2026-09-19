/**
 * Profile & Education Data
 * Edit this file to update your bio, contact info, and education
 */

export interface ProfileLink {
  type: string;
  url: string;
}

export interface Profile {
  name: string;
  title: string;
  summary: string;
  location: string;
  email: string;
  highlights: string[];
  links: ProfileLink[];
}

export interface Education {
  degree: string;
  university: string;
  graduation: string;
  gpa: string;
  coursework: string[];
}

export const RAIL_IDENTITY = {
  nameLines: ["Prathamesh", "More"],
  role: "AI Engineer",
  availability: "Open for work",
} as const;

export const PROFILE: Profile = {
  name: "Prathamesh Pravin More",
  title: "AI Engineer · Full Stack · RAG & Agentic Systems",
  summary: "I build production AI systems: custom agent loops with Pydantic-enforced tool schemas, RAG pipelines, and evaluation suites that verify behavior. I earned an M.S. in Data Science at Indiana University and published peer-reviewed research in The Design Journal and IEEE. My stack spans Python/FastAPI, TypeScript/React, Docker, AWS, Azure, and GCP.",
  location: "Currently seeking full-time opportunities",
  email: "prpmore@gmail.com",
  highlights: [
    "Built end-to-end MLOps pipelines with Docker, MLflow, and DVC that cut model retraining time by 10x.",
    "Built agentic AI workflows and Retrieval-Augmented Generation (RAG) pipelines with LangChain and Pinecone.",
    "Improved information retrieval speed by 70% and reached a 94% F1-score in a production anomaly-detection system.",
    "Published research on algorithms and text-mining frameworks in IEEE and The Design Journal."
  ],
  links: [
    { type: "github", url: "https://github.com/Spidey13" },
    { type: "linkedin", url: "https://linkedin.com/in/more-prathamesh" },
    { type: "publications", url: "https://scholar.google.com/citations?user=hzA9FxwAAAAJ&hl=en" },
    { type: "resume", url: "https://tinyurl.com/434tnjd9" }
  ]
};

export const EDUCATION: Education = {
  degree: "M.S. in Data Science",
  university: "Indiana University, Bloomington, IN",
  graduation: "May 2025",
  gpa: "3.6/4.0",
  coursework: [
    "Applied Machine Learning",
    "Statistical Learning",
    "Data Mining",
    "Applied Database Technologies",
    "Mathematical Foundations for Informatics"
  ]
};
