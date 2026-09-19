import { useState } from "react";
import { BehindTheProduct, PremiereEyebrow, PremiereFooter, PremiereLinks, type PremierePageProps } from "./PremiereShared";

type ApprovalState = "pending" | "approved" | "rejected";

export default function QueueWhispererPremiere(props: PremierePageProps) {
  const { project } = props;
  const [approval, setApproval] = useState<ApprovalState>("pending");
  return (
    <article className="premiere premiere-queue">
      <section className="queue-hero" aria-labelledby="queue-title">
        <div className="queue-hero__copy"><PremiereEyebrow project={project} /><h1 id="queue-title">The model never gets <em>the keys.</em></h1><p>Queue Whisperer can inspect an issue queue, cite its evidence, and propose a change. Only a human-approved handler can commit it.</p><PremiereLinks project={project} /></div>
        <div className="queue-boundary-hero" aria-label="Model and human permission boundary"><div><span>Model side</span><strong>Read · cite · propose</strong></div><b>Model stops here</b><div><span>Human side</span><strong>Approve · authenticate · write</strong></div></div>
      </section>

      <section className="queue-transcript" aria-labelledby="queue-transcript-title">
        <header><p className="premiere-eyebrow">01 / Ask the queue</p><h2 id="queue-transcript-title">Grounded answers before automation.</h2></header>
        <div className="queue-thread"><p className="is-user">What’s hot today?</p><p className="is-agent">Issue #10 is the most urgent: three reports point to the queue stalling after deploy. <a href="#approval">Cited from #10 ↗</a></p><p className="is-user">Triage #10.</p><p className="is-agent">Proposal ready: add <code>priority-high</code>. No repository state has changed.</p></div>
      </section>

      <section className="queue-approval" id="approval" aria-labelledby="queue-approval-title">
        <div className="queue-approval__context"><p className="premiere-eyebrow">02 / Proposal, not mutation</p><h2 id="queue-approval-title">Nothing crosses automatically.</h2><p>The demo below is local to this portfolio. It explains the transaction without calling Slack or GitHub.</p></div>
        <div className="queue-slack-card" aria-live="polite">
          <span>Queue Whisperer · GitHub #10</span><h3>Add label <code>priority-high</code>?</h3><p>Proposed from the cited issue context. The write handler has not run.</p>
          {approval === "pending" ? <div><button type="button" onClick={() => setApproval("approved")}>Approve</button><button type="button" onClick={() => setApproval("rejected")}>Reject</button></div> : <div className={`queue-result is-${approval}`}><strong>{approval === "approved" ? "Approved and committed by @you" : "Rejected. Repository unchanged"}</strong><button type="button" onClick={() => setApproval("pending")}>Reset demo</button></div>}
        </div>
        <div className="queue-model-stop"><span>Read tools</span><span>proposeLabel()</span><b>Model stops here</b><span>Compare-and-set</span><span>GitHub write</span></div>
      </section>

      <BehindTheProduct>
        <div className="queue-code-split"><div><span>Model imports</span><strong>Read tools<br />proposeLabel<br />proposeReply</strong><p>No write capability exists in the model loop.</p></div><div><span>Approval handler imports</span><strong>Authentication<br />compare-and-set<br />GitHub mutation</strong><p>The approval click starts the write.</p></div></div>
        <ul className="queue-safeguards"><li>5 tool-step limit</li><li>90 second abort</li><li>Grounded-or-decline pass</li><li>Escaped issue content</li><li>GitHub App tokens</li></ul>
      </BehindTheProduct>

      <PremiereFooter {...props} note="Inspect an agent architecture where authority remains legible." />
    </article>
  );
}
