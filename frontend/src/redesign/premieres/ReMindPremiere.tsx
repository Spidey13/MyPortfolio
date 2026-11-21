import { useState, type CSSProperties } from "react";
import { usePostHog } from "@posthog/react";
import { captureInteractiveDemo } from "../../analytics/captureInteractiveDemo";
import { BehindTheProduct, PremiereEyebrow, PremiereFooter, PremiereLinks, type PremierePageProps } from "./PremiereShared";

const QUERY_STATES = [
  { label: "Accessory organs", scores: [92, 72, 46, 28, 14], confidence: 88 },
  { label: "Recent anatomy notes", scores: [41, 95, 61, 33, 18], confidence: 81 },
  { label: "Reinforced concepts", scores: [54, 44, 86, 68, 22], confidence: 84 },
] as const;

const HEATMAP_CHUNKS = ["chunk-01", "chunk-02", "chunk-03", "chunk-04", "chunk-05"] as const;

export default function ReMindPremiere(props: PremierePageProps) {
  const { project } = props;
  const posthog = usePostHog();
  const [queryIndex, setQueryIndex] = useState(0);
  const query = QUERY_STATES[queryIndex];
  return (
    <article className="premiere premiere-remind" data-project-document>
      <section className="remind-hero" aria-labelledby="remind-title">
        <div className="remind-hero__copy"><PremiereEyebrow project={project} /><h1 id="remind-title">Memory should change when <em>the world does.</em></h1><p>ReMind combines semantic relevance with decay and reinforcement, then shows which chunks shaped the answer.</p><PremiereLinks project={project} /></div>
        <div className="remind-memory-stack" aria-label="Memory chunks with changing relevance"><span className="premiere-eyebrow">Living memory / current rank</span>{["Accessory organs", "Digestive system", "Clinical notes", "Old chapter summary"].map((name, index) => <div key={name} style={{ "--memory-score": `${95 - index * 19}%` } as CSSProperties}><b>{String(index + 1).padStart(2, "0")}</b><strong>{name}</strong><i /></div>)}</div>
      </section>

      <section className="remind-time" aria-labelledby="remind-time-title"><header><p className="premiere-eyebrow">01 / Time changes the answer</p><h2 id="remind-time-title">The same memory can arrive, fade, and return.</h2></header><div><article><span>Newly learned</span><strong>1.00</strong><i style={{ width: "100%" }} /></article><article><span>Fading</span><strong>0.42</strong><i style={{ width: "42%" }} /></article><article><span>Reinforced</span><strong>0.86</strong><i style={{ width: "86%" }} /></article></div></section>

      <section className="remind-explorer" aria-labelledby="remind-explorer-title">
        <div className="remind-explorer__controls"><p className="premiere-eyebrow">02 / Explore the retrieval</p><h2 id="remind-explorer-title">Ask a different question. Watch memory reorder.</h2><div role="group" aria-label="Sample memory queries">{QUERY_STATES.map((item, index) => <button type="button" key={item.label} aria-pressed={queryIndex === index} onClick={() => { setQueryIndex(index); if (queryIndex !== index) captureInteractiveDemo(posthog, { projectId: project.id, demoId: "retrieval_explorer", interaction: "sample_query_selected", result: item.label }); }}>{item.label}</button>)}</div></div>
        <div className="remind-heatmap" aria-live="polite"><div className="remind-heatmap__header"><span>Chunk relevance heatmap</span><b>Query / {query.label}</b></div>{query.scores.map((score, index) => <div key={HEATMAP_CHUNKS[index]}><span>Chunk {String(index + 1).padStart(2, "0")}</span><i style={{ "--heat-score": `${score}%` } as CSSProperties} /><strong>{score / 100}</strong></div>)}</div>
        <div className="remind-confidence"><span>Confidence score</span><strong>{query.confidence}</strong><p>A qualitative signal, not a calibrated probability.</p><dl><div><dt>Groundedness</dt><dd>50%</dd></div><div><dt>Keyword overlap</dt><dd>30%</dd></div><div><dt>Context quality</dt><dd>20%</dd></div></dl></div>
      </section>

      <section className="remind-compare" aria-labelledby="remind-compare-title"><header><p className="premiere-eyebrow">03 / Why the ranking changed</p><h2 id="remind-compare-title">Similarity finds a match. Memory adds a point of view.</h2></header><div><article><span>Standard RAG</span><strong>Semantic score only</strong><ol><li>Accessory organs · .72</li><li>Old chapter summary · .69</li><li>Clinical notes · .65</li></ol></article><article><span>ReMind</span><strong>Semantic + time + reinforcement</strong><ol><li>Accessory organs · .92</li><li>Clinical notes · .86</li><li>Digestive system · .72</li></ol></article></div></section>

      <BehindTheProduct><div className="premiere-pipeline remind-pipeline">{["BM25 + semantic", "Temporal decay", "Reinforcement", "Optional rerank", "Visible chunks"].map((step, index) => <div key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong></div>)}</div><p className="remind-scope">The prototype makes retrieval inspectable. Its weighting and confidence formula were tuned qualitatively on sample queries; they communicate the system’s reasoning, not certainty.</p></BehindTheProduct>

      <PremiereFooter {...props} note="Explore the retrieval model, then inspect the pipeline behind it." />
    </article>
  );
}
