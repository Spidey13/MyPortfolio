import React from 'react';
import { motion } from 'framer-motion';

export interface TimelineEntry {
  time: string;
  category: string;
  title: string;
  description: string;
  type: 'milestone' | 'research' | 'learning' | 'past';
}

interface ActivityTimelineProps {
  entries?: TimelineEntry[];
  isDark?: boolean;
}

const defaultEntries: TimelineEntry[] = [
  {
    time: '2m ago',
    category: 'GitHub',
    title: 'Pushed v2.1 to repo/vision-core',
    description: 'Optimized inference pipeline',
    type: 'milestone'
  },
  {
    time: '45m ago',
    category: 'ArXiv',
    title: 'Reading: "LoRA Fine-tuning"',
    description: 'Notes on parameter efficiency',
    type: 'research'
  },
  {
    time: '2h ago',
    category: 'Deploy',
    title: 'Production Build Success',
    description: 'Deployed to Vercel Edge',
    type: 'past'
  },
  {
    time: '5h ago',
    category: 'Course',
    title: 'Advanced CUDA Kernels',
    description: 'Completed module 4',
    type: 'learning'
  }
];

const getIconForCategory = (category: string) => {
  switch (category.toLowerCase()) {
    case 'github': return 'commit';
    case 'arxiv': return 'article';
    case 'deploy': return 'rocket_launch';
    case 'course': return 'school';
    default: return 'circle';
  }
};

const getColorForCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case 'github': return 'text-blue-400';
      case 'arxiv': return 'text-yellow-400';
      case 'deploy': return 'text-green-400';
      case 'course': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ 
  entries = defaultEntries,
  isDark = false
}) => {
  return (
    <div className={`p-5 rounded-sm shadow-card border-l-4 border-accent bg-paper ${isDark ? 'bg-transparent text-white' : 'bg-white text-primary'}`}>
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-mono font-bold text-[10px] uppercase tracking-widest text-accent flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          Live Feed
        </h3>
        <span className="font-mono text-[9px] text-gray-400 uppercase">
            Updated Now
        </span>
      </div>
      
      <div className="space-y-4 relative">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gray-200 dark:bg-gray-800"></div>
        
        {entries.map((entry, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.3 }}
            className="relative pl-6 group"
          >
            <div className={`absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border border-gray-100 bg-white flex items-center justify-center z-10 ${isDark ? 'bg-gray-900 border-gray-700' : ''}`}>
               <div className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-accent animate-pulse' : 'bg-gray-300'}`}></div>
            </div>
            
            <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] text-gray-400 uppercase tracking-tight">{entry.time}</span>
                    <span className={`font-mono text-[9px] uppercase tracking-wider font-bold ${getColorForCategory(entry.category)}`}>
                        {entry.category}
                    </span>
                </div>
                <div className="font-sans text-xs font-medium leading-tight text-primary dark:text-gray-200 group-hover:text-accent transition-colors cursor-default">
                    {entry.title}
                </div>
                {entry.description && (
                    <div className="font-mono text-[10px] text-gray-500 mt-0.5 truncate">
                        {entry.description}
                    </div>
                )}
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 text-center">
        <button className="text-[9px] font-mono uppercase tracking-widest text-gray-400 hover:text-accent transition-colors flex items-center justify-center gap-1 w-full">
            View Full Log <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default ActivityTimeline;
