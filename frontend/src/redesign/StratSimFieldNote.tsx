import type { Project } from "../data/projects";
import { ProjectVisual } from "./ProjectVisual";
import { getProjectMeta } from "./projectMeta";
import { FieldNoteEnd } from "./fieldnotes/FieldNoteShared";
import StratSimRaceChart from "./StratSimRaceChart";

interface StratSimFieldNoteProps {
  project: Project;
  previous: Project;
  next: Project;
}

const agents = [
  ["01", "Tire manager", "wear · temperature · grip"],
  ["02", "Strategy", "pit window · compound"],
  ["03", "Lap time", "forecast · conditions"],
  ["04", "Weather", "track · rainfall"],
  ["05", "Vehicle dynamics", "performance baseline"],
  ["06", "Gap effects", "dirty air · DRS"],
] as const;

export default function StratSimFieldNote({ project, previous, next }: StratSimFieldNoteProps) {
  const meta = getProjectMeta(project.id);

  return (
    <article className="field-note field-note--stratsim" data-project-document>
      <section className="stratsim-cover" aria-labelledby="stratsim-title">
        <div className="stratsim-cover__heading">
          <p className="field-note__eyebrow">StratSim / F1 strategy simulation · {meta.date}</p>
          <h1 id="stratsim-title">The race changed. So did the call.</h1>
          <p className="stratsim-cover__dek">StratSim models tire wear, weather, vehicle dynamics, and race position together so a strategy can change as the race changes.</p>
          {project.deployed_url ? <a className="stratsim-cover__action" href={project.deployed_url} target="_blank" rel="noreferrer">Run the simulator <span aria-hidden="true">↗</span></a> : null}
        </div>
        <div className="stratsim-cover__artifact">
          <ProjectVisual project={project} expanded />
          <p className="field-note__caption"><span>Illustration / saved tire test</span><span>Rain at lap 30. A tire manager recommendation from lap 32. A stop on lap 41.</span></p>
        </div>
      </section>

      <section className="field-note__spread stratsim-decision" aria-labelledby="stratsim-decision-title">
        <div className="field-note__section-label"><span>01</span><span>One decision</span></div>
        <div className="field-note__spread-copy">
          <h2 id="stratsim-decision-title">One stop. Fifty changing laps.</h2>
          <p>Each lap updates the weather and tire state. This saved tire manager test shows a pit recommendation arriving as grip falls, then the compound change that actually happened.</p>
        </div>
        <div className="stratsim-decision__note"><span>Observed in this run</span><strong>Rain begins lap 30. The tire manager starts recommending a stop on lap 32. The saved run pits on lap 41.</strong></div>
        <StratSimRaceChart />
      </section>

      <section className="field-note__spread stratsim-system" aria-labelledby="stratsim-system-title">
        <div className="field-note__section-label"><span>02</span><span>The system</span></div>
        <div className="field-note__spread-copy">
          <h2 id="stratsim-system-title">Six specialists share one race state.</h2>
          <p>The agents are not six chat windows. They are focused models contributing state to a lap-by-lap loop. The architecture is interesting because the decision is only as good as the tire and lap-time signals beneath it.</p>
        </div>
        <ol className="stratsim-agents">
          {agents.map(([number, name, detail]) => <li key={name}><span>{number}</span><strong>{name}</strong><small>{detail}</small></li>)}
        </ol>
      </section>

      <section className="field-note__code-spread" aria-labelledby="stratsim-code-title">
        <div className="field-note__section-label"><span>03</span><span>Implementation</span></div>
        <div className="field-note__code-copy">
          <h2 id="stratsim-code-title">The strategy decision is an ordinary function inside an extraordinary amount of state.</h2>
          <p>The important implementation detail is the order: weather updates first, tire management second, then dynamics and gap effects before the final lap-time record is written. That ordering is what makes the simulation inspectable.</p>
        </div>
        <pre className="field-note__code"><code><span className="code-muted"># one simulated lap</span>{"\n"}<span>weather = agents[<b>"weather"</b>].process(state)</span>{"\n"}<span>decision = agents[<b>"strategy"</b>].process(race_state)</span>{"\n"}<span>tires = agents[<b>"tire_manager"</b>].process(decision)</span>{"\n"}<span>lap_time = predict(dynamics, tires, gaps)</span>{"\n"}<span>record(lap_time, decision, state)</span></code></pre>
        <p className="field-note__source">Source / <a href={project.github_url} target="_blank" rel="noreferrer">StratSim repository ↗</a> · adapted from the simulation loop for readability.</p>
      </section>

      <section className="field-note__spread stratsim-evidence" aria-labelledby="stratsim-evidence-title">
        <div className="field-note__section-label"><span>04</span><span>Evidence & limits</span></div>
        <div className="field-note__spread-copy">
          <h2 id="stratsim-evidence-title">A simulation earns trust by showing where its forecast stops.</h2>
          <p>This is a systems demo, not a claim that a model can see the future. The saved run makes the decision legible: wear climbs, grip drops, rain changes the context, and a compound change resets the state. A real race still contains incidents, driver behavior, and uncertainty the simulator cannot reproduce.</p>
        </div>
        <div className="stratsim-evidence__ledger">
          <div><span>Data</span><strong>FastF1 telemetry · 2023–2024</strong></div>
          <div><span>Model</span><strong>CatBoost lap-time predictor</strong></div>
          <div><span>Interface</span><strong>Streamlit scenario runner</strong></div>
          <div><span>Honest boundary</span><strong>Historical simulation, not live race strategy</strong></div>
        </div>
      </section>

      <FieldNoteEnd project={project} previous={previous} next={next} note="Try a race. Trace the decision back to the code." />
    </article>
  );
}
