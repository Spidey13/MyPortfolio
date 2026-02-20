/**
 * Skills & Technologies Data
 * Edit this file to update your technical skills
 */

export interface Skills {
  languages_and_tools: string[];
  databases: string[];
  ml_and_nlp: string[];
  cloud_and_mlops: string[];
  visualization: string[];
}

export const SKILLS: Skills = {
  languages_and_tools: ["Python", "SQL", "Java", "R", "C++", "Git"],
  databases: ["MongoDB", "Vector Databases (Pinecone)", "Pandas", "Spark"],
  ml_and_nlp: ["PyTorch", "Scikit-learn", "XGBoost", "Hugging Face Transformers", "LangChain", "spaCy"],
  cloud_and_mlops: ["Docker", "CI/CD (GitHub Actions)", "MLflow", "AWS (SageMaker, Lambda, Bedrock)", "Azure"],
  visualization: ["FastAPI"]
};
