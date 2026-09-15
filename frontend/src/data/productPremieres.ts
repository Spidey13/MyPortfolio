export interface PremiereVideoAsset {
  src: string;
  poster: string;
  alt: string;
  caption: string;
  durationLabel: string;
}

export interface PremiereMoment {
  id: string;
  title: string;
  caption: string;
  implementationNote: string;
  video?: PremiereVideoAsset;
}

export interface PremiereCodeEvidence {
  label: string;
  filePath: string;
  language: string;
  lines: string[];
  highlightedLines: [number, number];
  repositoryHref: string;
  annotation: string;
}

export interface ProductPremiereCaseStudy {
  projectId: "p2" | "p6" | "p8" | "p9" | "p10";
  premise: string;
  ownership: string;
  status: string;
  moments: readonly [PremiereMoment, PremiereMoment, PremiereMoment];
  heroVideo?: PremiereVideoAsset;
  codeEvidence: PremiereCodeEvidence;
  buildSummary: string;
}

export const PRODUCT_PREMIERES: Record<ProductPremiereCaseStudy["projectId"], ProductPremiereCaseStudy> = {
  p10: {
    projectId: "p10",
    premise: "Pinpointing the exact byte that broke an LLM prefix cache.",
    ownership: "Built the capture proxy, order-preserving JSON parser, evidence-first classifier, CLI, block simulator, and both validation harnesses as one static Go binary.",
    status: "Validated against hosted Anthropic traffic and a real vLLM server",
    moments: [
      { id: "capture", title: "Capture", caption: "The proxy records the request exactly as the provider receives it.", implementationNote: "Raw bodies are forwarded and stored byte-for-byte; credentials are forwarded but never persisted." },
      { id: "diff", title: "Diff", caption: "The first structural divergence is located inside the cached prefix.", implementationNote: "The parser preserves key order, number literals, duplicate keys, and whitespace-sensitive evidence." },
      { id: "attribute", title: "Attribute", caption: "A field path—or a provider-side verdict—closes the investigation.", implementationNote: "Provider counters outrank heuristics, so identical bytes never receive an invented client-side cause." },
    ],
    codeEvidence: {
      label: "Byte-faithful capture",
      filePath: "internal/proxy/proxy.go",
      language: "Go",
      lines: [
        "func (s *Server) serveHTTP(w http.ResponseWriter, r *http.Request) {",
        "    start := time.Now()",
        "",
        "    // Raw bytes. Never decoded, never parsed, never re-encoded on this path.",
        "    body, err := io.ReadAll(r.Body)",
        "    if err != nil {",
        "        http.Error(w, \"cachefault: read request body: \"+err.Error(), http.StatusBadRequest)",
        "        return",
        "    }",
        "",
        "    upstream := *s.target",
        "    upstream.Path = r.URL.Path",
        "    upstream.RawPath = r.URL.RawPath",
        "    upstream.RawQuery = r.URL.RawQuery",
        "",
        "    req, err := http.NewRequestWithContext(r.Context(), r.Method, upstream.String(), bytes.NewReader(body))",
      ],
      highlightedLines: [4, 16],
      repositoryHref: "https://github.com/Spidey13/cachefault/blob/main/internal/proxy/proxy.go",
      annotation: "The forward path never decodes JSON, because decoding and reserializing can reorder keys or rewrite numeric literals—the proxy would create the cache miss it is supposed to diagnose. Analysis later uses internal/ojson so document order and literal text survive inspection.",
    },
    buildSummary: "The capture path preserves the evidence; the parser and provider adapters establish prefix order; the classifier stops at the earliest provable divergence.",
  },
  p8: {
    projectId: "p8",
    premise: "Turning equipment faults into cited, actionable repair plans.",
    ownership: "Built the custom Anthropic agent loop, four validated tools, dual-embedding retrieval path, SSE interface, sandboxed artifacts, and Cloud Run deployment.",
    status: "Live product demo with service-manual-grounded workflows",
    moments: [
      { id: "fault", title: "Fault", caption: "A technician supplies a symptom, fault code, or equipment image.", implementationNote: "The request contract carries product, conversation, optional image, and structured fault intent into one bounded agent turn." },
      { id: "source", title: "Source", caption: "Relevant service-manual evidence appears with its page and document provenance.", implementationNote: "Local query embeddings keep serving credential-light while structured ingest retains the richer extraction path." },
      { id: "job-card", title: "Job Card", caption: "The evidence becomes a branching diagnostic procedure or a sandboxed artifact.", implementationNote: "The loop limits tool iterations and skips redundant synthesis once a complete job card exists." },
    ],
    codeEvidence: {
      label: "Validated request, explicit dispatch",
      filePath: "agent.py",
      language: "Python",
      lines: [
        "tool_name  = block.name",
        "tool_input = block.input",
        "tool_id    = block.id",
        "log.info(\"Tool call: %s  input=%s\", tool_name, tool_input)",
        "",
        "try:",
        "    if tool_name == \"search_knowledge\":",
        "        raw_result = self._tool_search_knowledge(",
        "            query=tool_input.get(\"query\", query),",
        "            product_id=tool_input.get(\"product_id\", product_id),",
        "        )",
        "        retrieval_trace.extend(raw_result)",
        "    elif tool_name == \"get_manual_image\":",
        "        raw_result = self._tool_get_manual_image(",
        "            product_id=tool_input.get(\"product_id\", product_id),",
        "            page_number=int(tool_input[\"page_number\"]),",
        "        )",
      ],
      highlightedLines: [6, 17],
      repositoryHref: "https://github.com/Spidey13/diagnostiq/blob/main/agent.py",
      annotation: "The outer AskRequest is Pydantic-validated by FastAPI; inside the loop, Claude tool inputs follow declared JSON schemas and enter an explicit four-way dispatcher. Rich Vertex embeddings belong to ingest, while the serving path queries with the baked local model—keeping runtime credentials and cold-start downloads out of the request path.",
    },
    buildSummary: "A synchronous, bounded Anthropic tool loop runs behind an SSE surface, joining cited retrieval, manual imagery, generated artifacts, and branching job cards without hiding their sources.",
  },
  p6: {
    projectId: "p6",
    premise: "A voice-first coding partner that understands the whole repository.",
    ownership: "Built the real-time audio pipeline, neural VAD, gated tool system, AST-aware repository graph, and reconnect-safe session layer.",
    status: "Working voice-native prototype with browser-measured latency",
    moments: [
      { id: "speak", title: "Speak", caption: "The developer talks while browser-side neural VAD controls the live turn.", implementationNote: "AudioWorklet PCM streaming and Silero VAD keep speech detection separate from the model connection." },
      { id: "inspect", title: "Inspect", caption: "Repository files and the AST-derived dependency graph become working context.", implementationNote: "Tree-sitter extraction and personalized PageRank prioritize the files most relevant to the request." },
      { id: "act", title: "Act", caption: "A gated tool completes, then the audio session resumes without leaking tool text.", implementationNote: "Blocking calls enter TOOL_PENDING; interruption changes the response schedule to SILENT." },
    ],
    codeEvidence: {
      label: "Blocking-tool gate",
      filePath: "codiey/static/app.js",
      language: "JavaScript",
      lines: [
        "addToolMessage(`🔧 ${fc.name}(${displayArgs})`);",
        "debugLog('🔧', 'TOOL_ARGS', `${fc.name} args=[${displayArgs}]`);",
        "}",
        "",
        "if (entersToolPending) {",
        "    state.audioState = 'TOOL_PENDING';",
        "}",
        "",
        "// Execute all tool calls in parallel via the backend",
        "const responses = await Promise.all(",
        "    functionCalls.map(async (fc) => {",
        "        try {",
        "            const res = await fetch('/api/tools/execute', {",
        "                method: 'POST',",
        "                headers: { 'Content-Type': 'application/json' },",
        "                body: JSON.stringify({ tool_name: fc.name, args: fc.args || {} })",
        "            });",
      ],
      highlightedLines: [5, 7],
      repositoryHref: "https://github.com/Spidey13/Codiey/blob/main/codiey/static/app.js",
      annotation: "TOOL_PENDING moves the session out of ordinary streaming before any blocking call runs. If the user speaks while the tool is pending, the result is scheduled SILENT; otherwise the state returns to STREAMING only after the gated work completes, keeping tool execution and tool text out of the live audio loop.",
    },
    buildSummary: "The product treats speech, repository intelligence, and tool execution as separate stateful systems, then reconnects them through an explicit audio-state gate.",
  },
  p9: {
    projectId: "p9",
    premise: "A GitHub agent that cannot write without human approval.",
    ownership: "Built the bounded tool-calling agent, Slack approval flow, multi-workspace authentication, grounding evaluation, and the structural boundary separating model tools from GitHub writes.",
    status: "Hosted multi-workspace Slack app with human-approved writes",
    moments: [
      { id: "ask", title: "Ask", caption: "A teammate asks what is urgent, recurring, or stalled in the issue queue.", implementationNote: "The agent reads live GitHub data within a five-step tool budget and cites only issues present in its trace." },
      { id: "propose", title: "Propose", caption: "The model stages a label or reply with the evidence that supports it.", implementationNote: "Model-reachable tools stop at read and propose; no GitHub write function is merged into that toolset." },
      { id: "approve", title: "Approve", caption: "A human click performs the write outside the model toolset.", implementationNote: "The Slack handler resolves pending state with compare-and-set before importing and invoking write tools." },
    ],
    codeEvidence: {
      label: "Model-reachable tool boundary",
      filePath: "src/agent/tools.ts",
      language: "TypeScript",
      lines: [
        "import { getGithubTools } from \"../github/tools.js\";",
        "import { createProposeTools } from \"./actionTools.js\";",
        "import type { RepoContext } from \"../context.js\";",
        "",
        "// The only tool set the model's loop ever sees: GitHub's read tools plus",
        "// the two propose tools. GitHub's write tools are never merged in here --",
        "// they're only ever invoked directly by src/slack/actions.ts, after a human",
        "// clicks Approve, so the model structurally cannot write to GitHub itself.",
        "export async function getAgentTools(context: RepoContext) {",
        "  const { readTools } = getGithubTools(context.token);",
        "  if (context.mode === \"read-only\") return { ...readTools };",
        "  return { ...readTools, ...createProposeTools(context) };",
        "}",
      ],
      highlightedLines: [9, 12],
      repositoryHref: "https://github.com/Spidey13/queue-whisperer/blob/main/src/agent/tools.ts",
      annotation: "The model receives read tools and proposal constructors, never write functions. The separately imported Slack approval handler performs a pending → approved compare-and-set before calling GitHub, so competing clicks cannot commit twice and prompt text cannot cross the structural boundary.",
    },
    buildSummary: "The safety claim lives in module composition and state transitions: the model can gather evidence and stage intent, while only the human approval path can import the GitHub writers.",
  },
  p2: {
    projectId: "p2",
    premise: "Retrieval that remembers recency, repetition, and provenance.",
    ownership: "Built the hybrid retrieval and re-ranking pipeline, temporal and reinforcement scoring, LangGraph orchestration, confidence signal, and chunk-provenance heatmap.",
    status: "Working memory-aware retrieval prototype",
    moments: [
      { id: "retrieve", title: "Retrieve", caption: "A question gathers candidate chunks through lexical and semantic retrieval.", implementationNote: "BM25 and embedding similarity widen the candidate set before memory-aware scoring changes its order." },
      { id: "rerank", title: "Re-rank", caption: "Recency and repeated access alter which memories surface first.", implementationNote: "Each access refreshes a chunk's last-seen turn; exponential decay and semantic similarity remain configurable." },
      { id: "explain", title: "Explain", caption: "The answer exposes its confidence signal and chunk-level provenance.", implementationNote: "The heatmap makes retrieval failures inspectable; confidence is a tuned signal, not calibrated probability." },
    ],
    codeEvidence: {
      label: "Memory-aware scoring",
      filePath: "src/server/retrieval/retrieval.ts",
      language: "TypeScript",
      lines: [
        "const scoredChunks = memoryBank.map((chunk) => {",
        "  const similarity = cosineSimilarity(queryVector, chunk.embedding);",
        "  let recencyScore = 1.0;",
        "  let lastSeen = currentTurn;",
        "  if (beta > 0 && typeof halfLife === 'number') {",
        "    const storedLastSeen = accessHistory.get(chunk.id);",
        "    if (typeof storedLastSeen === 'number') {",
        "      lastSeen = storedLastSeen;",
        "    } else {",
        "      lastSeen = currentTurn;",
        "    }",
        "    const age = Math.max(0, currentTurn - lastSeen);",
        "    recencyScore = calculateActivation(age, halfLife, lambdaFloor);",
        "  }",
        "  const finalScore = alpha * similarity + beta * recencyScore;",
      ],
      highlightedLines: [5, 15],
      repositoryHref: "https://github.com/IshanApte/ReMind/blob/main/src/server/retrieval/retrieval.ts",
      annotation: "The scoring stage combines semantic relevance with time-based activation; reinforcement updates last-seen state so repeated use changes later rankings. The displayed confidence value combines inspectable heuristics, but it is not a calibrated probability of correctness.",
    },
    buildSummary: "Candidate retrieval, temporal scoring, reinforcement, and answer evidence remain separate enough to inspect—so a weak answer can be traced back to the chunks and scores that produced it.",
  },
};

export const isProductPremiereId = (id: string): id is ProductPremiereCaseStudy["projectId"] =>
  id in PRODUCT_PREMIERES;
