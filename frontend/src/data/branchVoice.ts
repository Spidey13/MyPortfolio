export type BranchId = "b1" | "b2" | "b3" | "b4";
type TurnId = `t${number}`;
export type ChapterId = "opening" | "fork" | "correct" | "compare" | "merge" | "report";

export interface BranchVoiceSource {
  label: string;
  href: string;
}

// The evidence audit verified these line ranges at this revision.
const repository = "https://github.com/Spidey13/VapiHax";
const revision = "d2251e19d24fbd01e93d5fb512c8ab0baa23e4e1";
const source = (label: string, file: string): BranchVoiceSource => ({
  label,
  href: `${repository}/blob/${revision}/${file}`,
});

export const branchVoiceSources = {
  session: source("Session data", "film/data/launch-session.json#L3290-L3384"),
  history: source("Path lookup", "src/tree/tree.ts#L37-L46"),
  fork: source("Fork code", "src/tree/tree.ts#L78-L100"),
  merge: source("Merge snapshot", "film/data/launch-session.json#L3349-L3384"),
  digests: source("Stored digests", "film/data/launch-session.json#L3349-L3352"),
  script: source("Demo script", "docs/demo-script.md#L1-L16"),
  credits: source("Film credits", "docs/demo-script.md#L29-L31"),
  musicLicense: { label: "CC BY 4.0", href: "https://creativecommons.org/licenses/by/4.0/" },
  architecture: source("Architecture", "docs/architecture.md#L3-L37"),
  evaluation: source("Router evaluation", "docs/results/router-eval.md#L21-L45"),
  latency: source("Latency notes", "docs/results/latency.md#L3-L17"),
};

export const branchVoiceMedia = {
  replay: "/media/branch-voice/replay.mp4",
  poster: "/media/branch-voice/poster.webp",
  captions: "/media/branch-voice/captions.vtt",
  duration: 78,
};

export interface BranchVoiceChapter {
  id: ChapterId;
  start: number;
  seek: number;
  label: string;
  path: BranchId;
  count: number;
  caption: string;
  sources: readonly BranchVoiceSource[];
}

// Starts mark when the film changes state. Seeks land on settled, checked frames.
// Counts describe whole snapshots of the recorded turn store.
export const branchVoiceChapters: readonly BranchVoiceChapter[] = [
  { id: "opening", start: 0, seek: 0, label: "Start a plan", path: "b1", count: 0,
    caption: "The traveler starts a plan for Tokyo and Kyoto.", sources: [branchVoiceSources.script] },
  { id: "fork", start: 15.667, seek: 19, label: "Fork to Hokkaido", path: "b2", count: 4,
    caption: "The film’s “copy” is shorthand. The fork stores a pointer to b1 after t2. No turns are copied.",
    sources: [branchVoiceSources.fork] },
  { id: "correct", start: 26.1, seek: 26.8, label: "Correct to Furano", path: "b3", count: 6,
    caption: "Furano replaces Niseko. The correction creates a successor, b3.",
    sources: [source("Correction code", "src/turn/apply.ts#L224-L230")] },
  { id: "compare", start: 40.3, seek: 40.6, label: "Compare plans", path: "b1", count: 10,
    caption: "Cities for food and temples. Furano for snow and hot springs.", sources: [branchVoiceSources.script] },
  { id: "merge", start: 46.933, seek: 48.7, label: "Merge the plans", path: "b4", count: 12,
    caption: "The combined plan keeps Tokyo, Kyoto, and Furano.", sources: [branchVoiceSources.merge] },
  { id: "report", start: 55.5, seek: 55.9, label: "Read the report", path: "b4", count: 12,
    caption: "The report groups the two Hokkaido paths under one corrected topic.",
    sources: [source("Report grouping", "src/tree/history.ts#L64-L124")] },
];

export const chapterAt = (seconds: number) =>
  reverseChapters.find((chapter) => seconds >= chapter.start) ?? branchVoiceChapters[0];

const reverseChapters = [...branchVoiceChapters].reverse();
export const branchVoiceJumps = branchVoiceChapters.slice(1);
export const branchVoiceDefaultChapter = chapterAt(40.6);

interface BranchVoiceBranch {
  name: string;
  chapter: ChapterId;
  parent: { id: BranchId; through: TurnId } | null;
  relation: string;
  tone: "mint" | "periwinkle" | "lilac";
}

export const branchVoiceBranches: Record<BranchId, BranchVoiceBranch> = {
  b1: { name: "Tokyo and Kyoto", chapter: "compare", parent: null, relation: "Original", tone: "mint" },
  b2: { name: "Hokkaido ryokan", chapter: "fork", parent: { id: "b1", through: "t2" }, relation: "Fork after t2", tone: "periwinkle" },
  b3: { name: "Hokkaido ryokan", chapter: "correct", parent: { id: "b2", through: "t4" }, relation: "Correction after t4", tone: "periwinkle" },
  b4: { name: "Tokyo + Hokkaido", chapter: "merge", parent: { id: "b1", through: "t2" }, relation: "Base b1 after t2", tone: "lilac" },
};

type BranchVoiceTurn = readonly [TurnId, BranchId, "Traveler" | "Assistant", string, "correction"?];

export const branchVoiceTurns: readonly BranchVoiceTurn[] = [
  ["t1", "b1", "Traveler", "So 3 of us have 7 nights in Japan this window. I'm thinking Tokyo and Kyoto for food and temples."],
  ["t2", "b1", "Assistant", "That pairing works well for seven nights. Four in Tokyo and three in Kyoto is a natural split, with the bullet train between them. Do you want to add a day trip like Nara?"],
  ["t3", "b2", "Traveler", "What if we did Hokkaido instead? A small ryokan near Niseko hot springs and 2 ski mornings."],
  ["t4", "b2", "Assistant", "That's a very different trip, slower and more about snow and soaking than food and temples. Are all three of you on board, and do you ski?"],
  ["t5", "b3", "Traveler", "I meant Furano. Not Niseko.", "correction"],
  ["t6", "b3", "Assistant", "Furano it is. It's quieter and less crowded than Niseko, with great powder and a calmer ryokan feel. You'd fly into Asahikawa or Sapporo, so a couple of nights in Sapporo for ramen could keep some food in the trip."],
  ["t7", "b1", "Traveler", "Go back to the Tokyo and Kyoto plan."],
  ["t8", "b1", "Assistant", "Back to the Tokyo and Kyoto. Sure. Next step is booking Kyoto lodging first, since good places for three people fill quickly. Want to lock the split at four and three?"],
  ["t9", "b1", "Traveler", "Wait. What's the main trade off between the city plan and the Furano plan?"],
  ["t10", "b1", "Assistant", "The cities give you food and temples with variety; Furano gives you quiet, hot springs, and snow, but little else. Want to combine them?"],
  ["t11", "b4", "Traveler", "Okay. Let's combine them."],
  ["t12", "b4", "Assistant", "Two nights Tokyo, two Kyoto, then fly to Furano for three nights at a ryokan with two ski mornings."],
];

export const branchVoicePaths = (count: number) =>
  [...new Set(branchVoiceTurns.slice(0, count).map(([, owner]) => owner))];

export function branchVoiceHistory(id: BranchId, count: number): BranchVoiceTurn[] {
  const { parent } = branchVoiceBranches[id];
  const inherited = parent
    ? branchVoiceHistory(parent.id, Math.min(count, branchVoiceTurns.findIndex(([turn]) => turn === parent.through) + 1))
    : [];
  return [...inherited, ...branchVoiceTurns.slice(0, count).filter(([, owner]) => owner === id)];
}

export const branchVoiceDigests = [
  {
    path: "b1", head: "t10", label: 'Thread "Tokyo and Kyoto"',
    text: "Three travelers have seven nights in Japan and want Tokyo and Kyoto for food and temples. The assistant suggested four nights in Tokyo and three in Kyoto, the bullet train between them, and a possible Nara day trip. The user steered back to the core Tokyo-Kyoto plan without taking up Nara. The assistant then suggested booking Kyoto lodging first because places for three fill quickly. Still open: whether to lock the four-three split and whether to add Nara.",
  },
  {
    path: "b3", head: "t6", label: 'Thread "Hokkaido ryokan"',
    excerpt: "a small ryokan near hot springs with two ski mornings, corrected from Niseko to Furano",
    text: "Three travelers have seven nights in Japan. The user first proposed Tokyo and Kyoto for food and temples, then floated Hokkaido instead: a small ryokan near hot springs with two ski mornings, corrected from Niseko to Furano. The assistant suggested flying into Asahikawa or Sapporo, with a couple of Sapporo nights for ramen. Open: whether Hokkaido replaces Tokyo-Kyoto, whether all three agree and ski, and whether to add Sapporo.",
  },
] as const;

export const replayClock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

interface BranchVoiceDecision {
  id: string;
  label: string;
  value: string;
  chapter?: ChapterId;
  text: string;
  scope?: string;
  sources: readonly BranchVoiceSource[];
}

export const branchVoiceDecisions: readonly BranchVoiceDecision[] = [
  { id: "shared-history", label: "Branch-scoped history", value: "4 turns + 2 digests", chapter: "merge",
    text: "One store holds all turns. A fork saves a parent and a turn boundary. In this recorded merge, b4 reads four turns and keeps two source digests.",
    sources: [source("ADR 0001", "docs/adr/0001-branch-scoped-history.md"), branchVoiceSources.merge] },
  { id: "routing-policy", label: "Routing policy", value: "0 of 7 false forks", chapter: "fork",
    text: "Jev scores the transcript and TypeScript chooses an operation, defaulting to continue on failure. The development evaluation found zero false forks among seven held-out predicted forks.",
    sources: [source("Routing policy", "src/route/policy.ts#L15-L41"), branchVoiceSources.evaluation] },
  { id: "partial-routing", label: "Early routing", value: "2 matching partials",
    text: "Two matching normalized partial transcripts start routing on a cloned session. Branch Voice reuses a completed result only when the final text and session revision match.",
    scope: "The film illustrates the idea. The development results give no measured speedup for early routing.",
    sources: [source("Speculation code", "src/route/speculate.ts#L20-L65"), source("ADR 0002", "docs/adr/0002-routing-and-speculation.md")] },
  { id: "voice-turns", label: "Playback reconciliation", value: "2-word threshold",
    text: "Two transcribed words can interrupt playback under the configured policy. The server uses playback state to trim or roll back stored replies.",
    scope: "This replay omits interruptions.",
    sources: [source("Reconciliation", "src/vapi/reconcile.ts"), source("Assistant configuration", "src/vapi/assistantConfig.ts#L65-L83")] },
];

export const branchVoiceRouter = [
  { value: "50 of 54", label: "Correctly routed on the held-out split", source: branchVoiceSources.evaluation },
  { value: "0 of 7", label: "False forks among held-out predicted forks", source: branchVoiceSources.evaluation },
  { value: "98 ms", label: "Median cached text routing time across 54 held-out items", source: branchVoiceSources.evaluation },
];

export const branchVoiceLimits = [
  { title: "Small evaluation", text: "Four of 54 held-out items missed. Merge and park each succeeded on two of three items.", sources: [branchVoiceSources.evaluation] },
  { title: "In-memory sessions", text: "Idle sessions expire after 30 minutes. Ended sessions and share links expire after 24 hours. A restart clears both.", sources: [source("Session store", "src/tree/store.ts#L5-L14")] },
  { title: "Voice measurement", text: "Speech is configured for English. The latency report covers text routing and server timing proxies.", sources: [source("Speech configuration", "src/vapi/assistantConfig.ts#L61-L70"), branchVoiceSources.latency] },
];
