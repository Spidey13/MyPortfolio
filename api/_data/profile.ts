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
  title: "AI Engineer · Full Stack · RAG & Agentic Systems",
  summary: "M.S. Data Science graduate building end-to-end AI systems — from RAG pipelines and agentic workflows to full-stack ML applications. Experience across fintech, HR tech, and academic research using Python, FastAPI, LangChain, and cloud platforms (AWS, Azure, GCP).",
  location: "Currently seeking full-time opportunities",
  email: "prpmore@gmail.com",
  highlights: [
    "Built an Agentic RAG platform at Indiana University that reduced manual literature review by 95% (3 weeks → 4 hours) with 98% retrieval accuracy — research published in The Design Journal.",
    "Engineered agentic AI workflows and RAG pipelines using LangChain, Pinecone, and vector databases for semantic search and retrieval.",
    "Production results: Benchmark NER F1 0.78 → 0.91 with active learning + Pytest regression coverage; Dimensionless doc-processing scaled to 10K+ docs/month with W&B-tracked BERT fine-tuning; IU literature review cut from ~3 weeks to ~4 hours with hybrid BM25 + Pinecone retrieval, traced via LangSmith and published in The Design Journal.",
    "Working stack across the full lifecycle: FastAPI + Pydantic + Pytest on the backend; React + TypeScript + Tailwind on the frontend; Docker + GitHub Actions + GCP Cloud Run / AWS SageMaker / Azure Functions for deployment."
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
