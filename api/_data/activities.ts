/**
 * Activity Timeline Data
 * Edit this file to add new activities to your portfolio
 */

export interface Activity {
  time: string;
  category: "GitHub" | "ArXiv" | "Course" | "Deploy" | "Research" | "Learning";
  title: string;
  description: string;
  type: "milestone" | "research" | "learning" | "past";
}

export const ACTIVITIES: Activity[] = [
  {
    time: "Dec 2025",
    category: "Research",
    title: "RAG and Forgetting Curve",
    description:
      'Shared "Beyond RAG" work: RAG shouldn\'t be a static archive—it needs a forgetting curve. Explored dynamic memory and retrieval.',
    type: "milestone",
  },
  {
    time: "Nov 2025",
    category: "GitHub",
    title: "Shipped Autonomous Research Agent",
    description:
      "Built a multi-agent system that automates scientific literature reviews from start to finish (with Yash Panchal).",
    type: "milestone",
  },
  {
    time: "Oct 2025",
    category: "GitHub",
    title: "Multi-agent system & AWS integration",
    description:
      "Built first specialized agents for the research pipeline; integrated AWS Bedrock (e.g. Anvi, SemanticScholar, PaperProcessing targets).",
    type: "milestone",
  },
  {
    time: "Sep 2025",
    category: "Deploy",
    title: "Launched interactive portfolio",
    description:
      'Rebuilt the portfolio as an interactive product so it can explain the "why" behind projects, not just list them.',
    type: "past",
  },
  {
    time: "Jun 2025",
    category: "GitHub",
    title: "F1 Race Strategy Simulator",
    description:
      "Shipped AI-powered F1 strategy simulator: configure scenarios, tracks, weather, drivers, tires; run simulations and analyze results with interactive charts.",
    type: "milestone",
  },
  {
    time: "Feb 2025",
    category: "Research",
    title: "FADS project completed",
    description:
      "Completed the FADS project, using advanced data science to explore the intended domain and deliverables.",
    type: "milestone",
  },
];
