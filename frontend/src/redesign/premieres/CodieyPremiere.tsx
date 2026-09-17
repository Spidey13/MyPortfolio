import { PRODUCT_PREMIERE_ASSETS as assets } from "../../data/productPremiereAssets";
import { BehindTheProduct, PremiereEyebrow, PremiereFooter, PremiereLinks, PremiereMedia, type PremierePageProps } from "./PremiereShared";

const graphNodes = ["main.py", "audio.py", "tools.py", "graph.py", "session.py", "vad.ts", "app.ts"];

export default function CodieyPremiere(props: PremierePageProps) {
  const { project } = props;
  return (
    <article className="premiere premiere-codiey">
      <section className="codiey-hero" aria-labelledby="codiey-title">
        <div className="codiey-hero__copy">
          <PremiereEyebrow project={project} />
          <h1 id="codiey-title">Talk through the codebase.<br /><em>See where it looks.</em></h1>
          <p>A voice-first thinking partner that reads, navigates, and explains a repository while its reasoning path stays visible.</p>
          <PremiereLinks project={project} />
          <div className="codiey-voice-state"><i /><span>Listening</span><b>Native audio · live session</b></div>
        </div>
        <PremiereMedia asset={assets.codieyHero} className="codiey-hero__film" />
        <div className="codiey-hero__graph" aria-label="Repository graph preview">
          <span className="premiere-eyebrow">Repository / live context</span>
          <div className="codiey-node-field">{graphNodes.map((node, index) => <span key={node} data-active={index === 2 || index === 3}>{node}</span>)}</div>
          <p>Personalized PageRank brings the likely source files forward before the next tool call.</p>
        </div>
      </section>

      <section className="codiey-conversation" aria-labelledby="codiey-conversation-title">
        <header><p className="premiere-eyebrow">One repository conversation</p><h2 id="codiey-conversation-title">Speech becomes an inspectable line of inquiry.</h2></header>
        <ol>
          <li><span>01 / Developer</span><p>“Where does the repository decide which files matter?”</p></li>
          <li><span>02 / Tool inspection</span><p><code>search_symbols()</code> → <code>read_file()</code> → <code>rank_repository()</code></p></li>
          <li><span>03 / Codiey</span><p>“The graph is built from imports, then personalized PageRank raises files connected to the active symbol…”</p></li>
        </ol>
      </section>

      <section className="codiey-intelligence" aria-labelledby="codiey-graph-title">
        <div><p className="premiere-eyebrow">Repository intelligence</p><h2 id="codiey-graph-title">The answer starts with structure, not a blind search.</h2><p>Tree-sitter extracts imports and symbols across Python, JavaScript, and TypeScript. A dependency graph ranks the repository and the active files pulse as Codiey inspects them.</p></div>
        <PremiereMedia asset={assets.codieyGraph} />
        <PremiereMedia asset={assets.codieyToolState} />
      </section>

      <BehindTheProduct>
        <div className="premiere-pipeline codiey-pipeline" aria-label="Codiey system flow">
          {["Microphone", "Silero VAD", "Gemini Bidi", "Repository tools", "Spoken answer"].map((step, index) => <div key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong></div>)}
        </div>
        <div className="codiey-boundary"><strong>It reasons over code. It never writes or modifies it.</strong><p>16 kHz input, 24 kHz output, blocking and silent tool tiers, reconnect-safe session resumption, and context compression keep the live loop usable.</p></div>
      </BehindTheProduct>

      <PremiereFooter {...props} note="Listen to the product. Then inspect the system that keeps it coherent." />
    </article>
  );
}
