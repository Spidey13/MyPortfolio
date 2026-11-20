// Content for the Diagnostiq case study (/project/p8).
// Figures come from the Diagnostiq repository: docs/adr, tests/eval/history.jsonl and the shipped chroma_db index.

const REPO = "https://github.com/Spidey13/diagnostiq/blob/main";

export interface CaseStudyChapter {
  seconds: number;
  label: string;
}

export interface CaseStudyDecision {
  title: string;
  body: string;
  figure: string;
  figureNote: string;
  source: { label: string; href: string };
}

export const DIAGNOSTIQ_CASE_STUDY = {
  stack: "Built in 2026 with Python, FastAPI, Claude tool use and ChromaDB",
  title: "Troubleshooting that cites the manual, step by step",
  lede: "A technician describes a rooftop-unit fault. Diagnostiq searches four Trane manuals and returns a job card, one cited check at a time.",
  film: {
    poster: "/images/diagnostiq-poster.webp",
    posterAlt:
      "Diagnostiq job card for “Compressor won’t start, no fault codes”, step 1 of 5: verify 24 VAC at compressor disable input terminal 3J1-8 or 3J3-2",
    playLabel: "Watch the session",
    chapters: [
      { seconds: 30, label: "Cited spec answer" },
      { seconds: 59, label: "LED-code reference" },
      { seconds: 122, label: "Five-step job card" },
      { seconds: 171, label: "Open-circuit escalation" },
    ] satisfies CaseStudyChapter[],
  },
  storage: {
    title: "Search a small window, hand the model the whole page",
    intro:
      "Each manual page is stored twice: once whole, and again as overlapping 500-token windows that point back to it. Search ranks the windows. The model reads the page.",
    page: {
      src: "/images/diagnostiq-manual-p35.webp",
      width: 900,
      height: 1164,
      alt: "Trane controls manual page 35, RTRM J6-8 cooling and J6-7 heating readings",
      caption: "Controls manual, page 35. Brackets mark window 1, highlight marks window 2. Edges are approximate.",
    },
    parent: {
      title: "The whole page",
      tokens: "691 tokens",
      lead: "This is what the model reads.",
      body: "Both J6 sections arrive together, in reading order, capped at 4,000 characters.",
    },
    windows: [
      { title: "Window 1", tokens: "517 tokens", body: "Cooling J6-8, then heating on and off." },
      {
        title: "Window 2",
        tokens: "241 tokens, 50 shared",
        quote: "“…is not actively heating.”",
        body: "It ranks well for “pulsing”, but on its own it has lost its heading.",
      },
    ],
    address: {
      title: "Every chunk carries its address",
      prefix: "[Trane Precedent Rooftop Unit | manual | Page 35]",
      body: "so a window found on its own still says where it came from.",
    },
    path: [
      { step: "Question", detail: "“J6 terminals?”" },
      { step: "Two searches", detail: "Embeddings and BM25" },
      { step: "Fuse", detail: "Reciprocal rank, k = 60" },
      { step: "One hit per page", detail: "Five different pages" },
      { step: "Whole page out", detail: "Cited by page number" },
    ],
    figures: [
      { value: "4", label: "Trane manuals" },
      { value: "354", label: "pages, stored whole" },
      { value: "860", label: "search windows" },
      { value: "1,214", label: "chunks in the index" },
    ],
  },
  decisions: {
    title: "Four decisions and what settled each one",
    intro: "Every decision is written up in the repository as an architecture decision record or an eval run.",
    items: [
      {
        title: "Retrieval",
        body: "Embeddings blurred exact identifiers like J6 and 3J1-8, so the J6 page never came back. BM25 now runs beside them, the two rankings are fused, and each of the top five slots goes to a different page. A cross-encoder reranker scored lower and was taken out.",
        figure: "5.00",
        figureNote: "different pages in the top 5, up from 3.32",
        source: { label: "Read ADR 006", href: `${REPO}/docs/adr/006-hybrid-retrieval.md` },
      },
      {
        title: "Routing",
        body: "Faults become a job card, specs become a reference sheet and plain questions get text. The flowchart option was removed from the tool schema, so a fault can no longer be sent there.",
        figure: "0.72",
        figureNote: "route match across 25 test cases",
        source: { label: "Read ADR 004", href: `${REPO}/docs/adr/004-job-card-output-mode.md` },
      },
      {
        title: "Validation",
        body: "Every job-card step needs a source_citation. The server checks the card against its schema and flags uncited steps before the technician sees them.",
        figure: "1 per step",
        figureNote: "citation required by the schema",
        source: { label: "Read ADR 004", href: `${REPO}/docs/adr/004-job-card-output-mode.md` },
      },
      {
        title: "Evaluation",
        body: "Fixed checks score retrieval, routing and structure, and one pinned model judges faithfulness. The first run caught the agent answering 12–24 VDC where the manual says 32 VDC.",
        figure: "0.63",
        figureNote: "faithfulness after grounding rules, up from 0.26",
        source: { label: "See the eval history", href: `${REPO}/tests/eval/README.md` },
      },
    ] satisfies CaseStudyDecision[],
    codeTerms: ["J6", "3J1-8", "source_citation"],
  },
  open: {
    title: "Still open",
    items: [
      { lead: "Faithfulness slipped to 0.43", body: "in the latest run, below the 0.55 gate." },
      { lead: "Windows outrun the embedder.", body: "They are cut at 500 tokens, but the embedding model reads 256 of its own. 78% are truncated." },
      { lead: "Three questions still miss the top 5.", body: "Their answer pages sit at rank 7 to 14." },
    ],
  },
} as const;
