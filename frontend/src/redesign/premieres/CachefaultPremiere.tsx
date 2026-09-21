import { BehindTheProduct, PremiereEyebrow, PremiereFooter, PremiereLinks, type PremierePageProps } from "./PremiereShared";

export default function CachefaultPremiere(props: PremierePageProps) {
  const { project } = props;
  return (
    <article className="premiere premiere-cachefault" data-project-document>
      <section className="cache-hero" aria-labelledby="cache-title">
        <div className="cache-hero__copy"><PremiereEyebrow project={project} /><h1 id="cache-title">Your provider says the prompt changed.<br /><em>cachefault names the field.</em></h1><PremiereLinks project={project} /></div>
        <div className="cache-terminal" role="img" aria-label="cachefault CLI locating a prefix divergence at tools zero input schema"><span>$ cachefault analyze demo/demo-session.jsonl</span><p>PREFIX_DIVERGENCE · turn 02</p><strong>tools[0].input_schema</strong><code>KEY_REORDERED</code><small>system[0].text remained stable<br />17 / 18 turns recomputed</small></div>
      </section>

      <section className="cache-precision" aria-labelledby="cache-precision-title">
        <header><p className="premiere-eyebrow">01 / From symptom to culprit</p><h2 id="cache-precision-title">Precision is the interface.</h2></header>
        <div className="cache-compare"><div><span>Provider</span><strong>“The cached prefix changed.”</strong><p>Enough to know a miss occurred. Not enough to fix it.</p></div><div><span>cachefault</span><strong>tools[0].input_schema</strong><p>First divergent path, structural cause, affected turn, and recomputation cost.</p></div></div>
      </section>

      <section className="cache-incident" aria-labelledby="cache-incident-title">
        <div><p className="premiere-eyebrow">02 / Real incident · headroom #1042</p><h2 id="cache-incident-title">A harmless reserialization became 1.15 million recomputed tokens.</h2><p>A proxy reordered tool-schema keys. The requests were semantically identical, but their byte prefixes were not; 17 of 18 turns lost the cache.</p></div>
        <dl><div><dt>Affected turns</dt><dd>17 / 18</dd></div><div><dt>Recomputed</dt><dd>≈1.15M tokens</dd></div><div><dt>Cause</dt><dd>Key order</dd></div></dl>
      </section>

      <section className="cache-byte-trail" aria-labelledby="cache-trail-title"><p className="premiere-eyebrow">03 / Follow one byte</p><h2 id="cache-trail-title">The analysis preserves the evidence it is measuring.</h2><div className="premiere-pipeline cache-pipeline">{["JSONL capture", "Order-preserving parse", "Prefix comparison", "Divergent path", "Token accounting"].map((step, index) => <div key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong></div>)}</div><p>The proxy forwards and stores raw request bodies. It never decodes and reserializes the request on the capture path, because doing so could create the very cache miss under investigation.</p></section>

      <section className="cache-validation" aria-labelledby="cache-validation-title"><div><p className="premiere-eyebrow">04 / Validation</p><h2 id="cache-validation-title">Measured against the systems it claims to explain.</h2></div><dl><div><dt>Anthropic oracle</dt><dd>9 / 9</dd><span>scored rows agree</span></div><div><dt>vLLM exact</dt><dd>47 / 47</dd><span>cases</span></div><div><dt>Mean error</dt><dd>0.0</dd><span>tokens</span></div></dl></section>

      <BehindTheProduct>
        <div className="cache-architecture"><strong>One static Go binary</strong><span>Capture proxy</span><span>Provider adapters</span><span>Evidence classifier</span><span>CLI + block simulator</span></div>
        <div className="cache-limits"><span>Honest limits</span><p>Anthropic and OpenAI adapters only. The OpenAI adapter is not live validated. This is post-hoc diagnosis, not production monitoring. Python is used only for optional self-hosted rendering and tokenization.</p></div>
      </BehindTheProduct>

      <PremiereFooter {...props} note="Read the implementation, reproduce the miss, and follow the evidence." />
    </article>
  );
}
