import { Link } from "react-router-dom";
import type { Project } from "../../data/projects";
import { getProjectMeta } from "../projectMeta";

export interface FieldNoteProps { project: Project; previous: Project; next: Project }

export function FieldNoteEnd({ project, previous, next, note }: FieldNoteProps & { note: string }) {
  return <footer className="field-note__end">
    <div className="field-note__end-main">
      <span className="field-note__end-label">Project · {getProjectMeta(project.id).shortName}</span>
      <h2>{note}</h2>
      <div className="field-note__end-sources">
        <a href={project.github_url} target="_blank" rel="noreferrer">Explore the repository <span aria-hidden="true">↗</span></a>
        {project.deployed_url ? <a href={project.deployed_url} target="_blank" rel="noreferrer">Open the project <span aria-hidden="true">↗</span></a> : null}
      </div>
    </div>
    <nav aria-label="Continue exploring projects" className="field-note__end-nav">
      <Link to={`/project/${previous.id}`}><span>← Previous</span><strong>{getProjectMeta(previous.id).shortName}</strong></Link>
      <Link to="/"><span>Index</span><strong>All work</strong></Link>
      <Link to={`/project/${next.id}`}><span>Next →</span><strong>{getProjectMeta(next.id).shortName}</strong></Link>
    </nav>
  </footer>;
}
