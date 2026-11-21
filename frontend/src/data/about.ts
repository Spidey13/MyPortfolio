import { EXPERIENCE } from "./experience";

/** Short home-page copy. Source records retain the full professional history. */
export const ABOUT = {
  headline: {
    lead: "I turn unfamiliar problems",
    accent: "into working tools.",
  },
  intro: "When a rooftop HVAC unit won't start, Diagnostiq finds what to check in its service manual. When an AI request misses the prompt cache, cachefault shows which field changed.",
  personal: "I follow Chelsea, play League of Legends, VALORANT, and Counter-Strike, and keep up with their esports scenes.",
  invitation: "Got a football take or an esports prediction? I’m always up for that conversation.",
} as const;

const EXPERIENCE_NOTES: Record<number, string> = {
  1: "I built tools that helped faculty find academic papers and analyze published research.",
  2: "I fine-tuned BERT for multiclass classification of streaming stock market news. I also built a tool to extract data from tender documents.",
  3: "I rebuilt the backend for a recruiting platform that extracts candidate information from résumés.",
};

export const ABOUT_EXPERIENCE = [
  {
    id: "avvi",
    company: "Avvi",
    role: "AI Engineer",
    duration: null,
    description: "Avvi helps small businesses and managed service providers (MSPs) handle everyday IT tasks. Staff describe what they need in plain English, and the assistant prepares changes for a person to approve.",
  },
  ...EXPERIENCE.map(({ id, company, role, duration, star }) => ({
    id,
    company,
    role,
    duration: duration.replace(" to ", " – "),
    description: EXPERIENCE_NOTES[id] ?? star.result,
  })),
];
