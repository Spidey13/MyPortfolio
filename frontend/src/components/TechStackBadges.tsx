import React from 'react';
import { Layers } from 'lucide-react';

interface TechStackBadgesProps {
  technologies?: string[];
}

export const TechStackBadges: React.FC<TechStackBadgesProps> = ({ 
  technologies = ['Python', 'TensorFlow', 'PyTorch', 'React', 'AWS', 'Docker', 'NLP', 'Kubernetes']
}) => {
  return (
    <div>
      <h3 className="font-mono font-bold text-xs text-ink uppercase tracking-widest mb-4 flex items-center gap-2">
        <Layers className="text-base text-ink/60" size={16} />
        The Stack
      </h3>
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech, idx) => (
          <span 
            key={idx}
            className="px-3 py-1 bg-white border border-ink/10 rounded-full text-[10px] font-mono font-bold text-ink hover:border-editorial-red hover:text-editorial-red cursor-default transition-colors"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TechStackBadges;
