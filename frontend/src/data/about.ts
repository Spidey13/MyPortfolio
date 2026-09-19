/** Short home-page copy. Source records retain the full professional history. */
export const ABOUT = {
  intro: "I build agents, retrieval systems, and the evaluations that test them. My work spans research, applied machine learning, and product engineering.",
  personal: "I follow Chelsea, play League of Legends, VALORANT, and Counter-Strike, and keep up with their esports scenes.",
  invitation: "Got a football take or an esports prediction? I’m always up for that conversation.",
} as const;

export const EXPERIENCE_NOTES: Record<number, string> = {
  1: "Built tools for academic literature retrieval and a text-mining pipeline for published research, working with faculty on evaluation and analysis.",
  2: "Deployed machine learning models on AWS and built document-processing workflows on Azure, combining OCR and NLP to extract information from enterprise documents.",
  3: "Rebuilt the backend for a recruitment platform and fine-tuned NLP models to extract candidate information from résumés.",
};
