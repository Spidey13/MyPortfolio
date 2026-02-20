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

export const PROFILE: Profile = {
  name: "Prathamesh Pravin More",
  title: "AI/ML Engineer & Data Scientist",
  summary: "M.S. Data Science graduate specializing in productionizing end-to-end Generative AI and Agentic AI solutions. Proven experience architecting advanced RAG pipelines and deploying full-stack ML applications using Python, LangChain, and MLOps best practices.",
  location: "Currently seeking full-time opportunities",
  email: "prpmore@gmail.com",
  highlights: [
    "Architected and operationalized end-to-end MLOps pipelines using Docker, MLflow, and DVC that slashed model retraining time by 10x.",
    "Engineered agentic AI workflows and advanced Retrieval-Augmented Generation (RAG) pipelines using LangChain and vector databases (Pinecone).",
    "Delivered high-impact results, including a 70% improvement in information retrieval speed and a 98% F1-score in a production-level anomaly detection system.",
    "Published research on novel algorithms and text-mining frameworks in outlets including IEEE and The Design Journal."
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
