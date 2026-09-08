import type { Project } from "../data/projects";
import { ProjectVisual } from "./ProjectVisual";

const RAIL_THUMBNAILS: Record<string, string> = {
  p10: "/images/rail/cachefault.webp",
  p6: "/images/rail/codiey.webp",
  p8: "/images/rail/diagnostiq.webp",
  p9: "/images/rail/queue-whisperer.webp",
};

export function ProjectRailThumbnail({ project }: { project: Project }) {
  const imageSource = RAIL_THUMBNAILS[project.id];

  if (imageSource) {
    return (
      <img
        className="project-index__thumb-image"
        src={imageSource}
        alt=""
        width={88}
        height={60}
        loading="lazy"
        decoding="async"
      />
    );
  }

  return <ProjectVisual project={project} active={false} />;
}
