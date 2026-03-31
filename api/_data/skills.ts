/**
 * Skills & Technologies Data
 * Edit this file to update your technical skills
 */

export interface Skills {
  languages_and_tools: string[];
  databases: string[];
  ml_and_nlp: string[];
  cloud_and_mlops: string[];
  backend_and_frontend: string[];
  architecture_and_devops: string[];
}

export const SKILLS: Skills = {
  languages_and_tools: ["Python", "TypeScript", "JavaScript (ES6+)", "Java", "C++", "SQL", "R", "Git"],
  databases: ["PostgreSQL", "MongoDB", "Redis", "Vector Databases (Pinecone)", "Pandas", "Spark"],
  ml_and_nlp: ["PyTorch", "Scikit-learn", "XGBoost", "Hugging Face Transformers", "LangChain", "spaCy", "RAG Pipelines", "LLMs", "Prompt Engineering", "Google Gemini"],
  cloud_and_mlops: ["Docker", "Kubernetes", "CI/CD (GitHub Actions)", "MLflow", "AWS (SageMaker, Lambda, Bedrock)", "Azure"],
  backend_and_frontend: ["Node.js", "Express.js", "FastAPI", "REST APIs", "WebSockets", "React.js", "Next.js", "Tailwind CSS", "D3.js", "Streamlit", "HTML/CSS"],
  architecture_and_devops: ["Microservices", "Event-Driven Architecture", "System Design"]
};
