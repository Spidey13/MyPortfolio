import React from 'react';
import { Zap } from 'lucide-react';

interface ActiveFocusCardProps {
  title?: string;
  description?: string;
  phase?: string;
  progress?: number;
}

export const ActiveFocusCard: React.FC<ActiveFocusCardProps> = ({
  title = 'LLM Quantization',
  description = 'Exploring quantization methods for edge deployment',
  phase = 'Research Phase',
  progress = 65
}) => {
  return (
    <div className="bg-white border border-ink/10 text-ink p-5 rounded-sm shadow-card relative overflow-hidden group">
      <div className="absolute right-0 top-0 opacity-5 transform translate-x-1/3 -translate-y-1/3">
        <Zap size={100} strokeWidth={2} />
      </div>
      <div className="relative z-10">
        <span className="font-mono text-[9px] uppercase tracking-widest text-editorial-red mb-1 block">
          Active Focus
        </span>
        <h3 className="font-serif font-bold text-lg leading-tight mb-2 text-ink">
          {title}
        </h3>
        {description && (
          <p className="font-sans text-xs text-ink/60 leading-relaxed mb-4">
            {description}
          </p>
        )}
        <div className="w-full bg-ink/10 h-1.5 rounded-full overflow-hidden mb-2">
          <div 
            className="bg-editorial-red h-full shadow-[0_0_10px_rgba(153,27,27,0.3)] transition-all duration-500" 
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          ></div>
        </div>
        <div className="flex justify-between font-mono text-[9px] text-ink/50">
          <span>{phase}</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
};

export default ActiveFocusCard;
