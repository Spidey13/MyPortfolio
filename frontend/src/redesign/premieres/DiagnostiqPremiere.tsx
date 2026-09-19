import { PRODUCT_PREMIERE_ASSETS as assets } from "../../data/productPremiereAssets";
import { BehindTheProduct, PremiereEyebrow, PremiereFooter, PremiereLinks, PremiereMedia, type PremierePageProps } from "./PremiereShared";

export default function DiagnostiqPremiere(props: PremierePageProps) {
  const { project } = props;
  return (
    <article className="premiere premiere-diagnostiq">
      <section className="diagnostiq-hero" aria-labelledby="diagnostiq-title">
        <div className="diagnostiq-hero__copy">
          <PremiereEyebrow project={project} />
          <p className="diagnostiq-fault">Incoming fault / RTU-04 / code 33</p>
          <h1 id="diagnostiq-title">From an unfamiliar fault to a <em>defensible field decision.</em></h1>
          <p>Diagnostiq turns service-manual evidence into a cited, branching repair procedure a technician can act on.</p>
          <PremiereLinks project={project} />
        </div>
        <PremiereMedia asset={assets.diagnostiqHero} className="diagnostiq-hero__film" />
      </section>

      <section className="diagnostiq-evidence" aria-labelledby="diagnostiq-evidence-title">
        <div className="diagnostiq-evidence__intro"><p className="premiere-eyebrow">01 / Find the evidence</p><h2 id="diagnostiq-evidence-title">The answer stays attached to the page that supports it.</h2><p>The serving path retrieves the relevant manual, exposes the page, and preserves the source beside the recommended check.</p></div>
        <figure className="diagnostiq-manual" aria-label="Illustrated manual evidence for fault 33">
          <figcaption><span>Trane service manual</span><b>§4.2 · page evidence</b></figcaption>
          <div><span>RTU fault reference</span><strong>Fault 33</strong><p>Supply air sensor circuit</p><mark>Inspect the sensor connection and resistance before replacing the controller.</mark></div>
          <small>Highlighted source retained with the answer</small>
        </figure>
        <aside className="diagnostiq-citation"><span>Trane service manual · §4.2</span><strong>Fault 33: supply air sensor circuit</strong><p>Inspect the sensor connection and resistance before replacing the controller.</p><b>Source located / page evidence retained</b></aside>
      </section>

      <section className="diagnostiq-procedure" aria-labelledby="diagnostiq-procedure-title">
        <header><p className="premiere-eyebrow">02 / Build the job card</p><h2 id="diagnostiq-procedure-title">A branching procedure, not another chat transcript.</h2></header>
        <ol>
          <li><span>01</span><div><strong>Is the supply-air sensor connected?</strong><p>Inspect harness and terminal seating.</p></div><b>Yes</b></li>
          <li><span>02</span><div><strong>Is resistance inside the manual range?</strong><p>Measure at the controller input.</p></div><b>No</b></li>
          <li className="is-resolution"><span>03</span><div><strong>Replace the sensor and verify the reading.</strong><p>The chosen branch becomes the final field action.</p></div><b>Action</b></li>
        </ol>
      </section>

      <section className="diagnostiq-artifact" aria-labelledby="diagnostiq-artifact-title">
        <div><p className="premiere-eyebrow">03 / Leave with an artifact</p><h2 id="diagnostiq-artifact-title">The work survives beyond the conversation.</h2><p>The resolved branch becomes a printable checklist or service report, while the original citation remains available for verification.</p><dl><div><dt>Fault</dt><dd>33</dd></div><div><dt>Evidence</dt><dd>Manual §4.2</dd></div><div><dt>Next action</dt><dd>Replace + verify</dd></div></dl></div>
        <figure className="diagnostiq-job-card" aria-label="Illustrated field job card for unit RTU-04">
          <figcaption><span>Field job card</span><b>RTU-04</b></figcaption>
          <div><span>Fault 33</span><h3>Supply air sensor circuit</h3></div>
          <ol><li>Isolate power and inspect the sensor connection.</li><li>Measure resistance against the manual range.</li><li>Replace the sensor, restore power, and verify the reading.</li></ol>
          <footer><span>Status</span><strong>Ready for technician verification</strong></footer>
        </figure>
      </section>

      <BehindTheProduct>
        <div className="premiere-pipeline diagnostiq-pipeline" aria-label="Diagnostiq system flow">
          {["Fault intake", "Manual retrieval", "Page citation", "Job-card branch", "Sandboxed artifact"].map((step, index) => <div key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong></div>)}
        </div>
        <p className="diagnostiq-scope">A bounded Anthropic tool loop joins retrieval, manual imagery, branching procedures, and artifact generation. The technician keeps the decision; the product keeps the evidence visible.</p>
      </BehindTheProduct>

      <PremiereFooter {...props} note="Follow the service call from fault to cited field action." />
    </article>
  );
}
