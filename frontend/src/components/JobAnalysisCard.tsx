import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface JobAnalysisCardProps {
  onAnalyze: (jobDescription: string) => void;
  matchScore?: number;
  analysisResult?: any; // Added to show rapid scan details
  isAnalyzing?: boolean;
  onViewReport?: () => void;
}

export const JobAnalysisCard: React.FC<JobAnalysisCardProps> = ({
  onAnalyze,
  matchScore,
  analysisResult,
  isAnalyzing,
  onViewReport
}) => {
  const [jobDescription, setJobDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jobDescription.trim() && !isAnalyzing) {
      onAnalyze(jobDescription);
      setJobDescription('');
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 85) return '#10b981';
    if (score >= 70) return '#3b82f6';
    if (score >= 50) return '#f59e0b';
    return '#6b7280';
  };

  return (
    <div
      className="bg-white border border-primary/10 shadow-card relative overflow-hidden rounded-widget"
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-3 border-b border-primary/5 pb-2">
          <h3 className="font-bold text-primary text-[10px] uppercase tracking-widest flex items-center gap-2 font-mono">
            <span className="material-symbols-outlined text-sm text-accent" aria-hidden="true">candlestick_chart</span>
            Role Fit Analysis
          </h3>
          <span className="text-[9px] text-primary/40 font-mono">AI-POWERED</span>
        </div>

        {/* Always-visible form */}
        <form onSubmit={handleSubmit}>
          <div className="relative mb-3">
            <textarea
              name="job-description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste a job description to analyze fit…"
              disabled={isAnalyzing}
              rows={3}
              aria-label="Paste a job description to analyze fit"
              className="w-full bg-paper text-primary placeholder-primary/30 border border-primary/10 rounded-lg p-3 focus:ring-2 focus:ring-accent/40 focus:border-accent/30 resize-none font-mono text-[11px] leading-relaxed transition-colors disabled:opacity-50"
            />
            {jobDescription.length > 0 && (
              <div className="absolute bottom-2 right-2 text-[9px] font-mono text-primary/25">
                {jobDescription.length}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!jobDescription.trim() || isAnalyzing}
            className="w-full py-2.5 bg-gradient-to-r from-accent to-purple-600 text-white font-mono text-[10px] font-bold uppercase tracking-wider rounded-lg hover:shadow-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            aria-label={isAnalyzing ? 'Analyzing job description' : 'Analyze job fit'}
          >
            {isAnalyzing ? (
              <>
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Analyzing…</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm" aria-hidden="true">bolt</span>
                <span>Analyze Fit</span>
              </>
            )}
          </button>
        </form>

        {/* Post-analysis match badge */}
        {matchScore != null && matchScore > 0 && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="mt-3 pt-3 border-t border-primary/5"
          >
            {/* Rapid Scan Summary for Recruiters */}
            <div className="mb-3 px-1">
               <div className="flex items-baseline justify-between mb-2">
                 <h4 className="font-serif text-3xl font-bold text-ink" style={{ color: getMatchColor(matchScore) }}>
                   {matchScore}%
                 </h4>
                 <span className="font-mono text-[10px] uppercase tracking-widest text-ink/50">
                   Fit Index
                 </span>
               </div>
               
               {/* Top Matched Skills - Mini List */}
               {analysisResult?.technicalSkills && (
                 <div className="flex flex-wrap gap-1.5 mb-3">
                   {analysisResult.technicalSkills.slice(0, 3).map((skill: any, i: number) => {
                     // Handle both string and object formats from backend
                     const skillName = typeof skill === 'string' ? skill : skill?.title || skill?.name || 'Skill';
                     return (
                       <span key={i} className="px-1.5 py-0.5 bg-ink/5 text-ink/70 text-[9px] font-mono rounded-sm uppercase tracking-wide">
                         + {skillName}
                       </span>
                     );
                   })}
                   {analysisResult.technicalSkills.length > 3 && (
                     <span className="px-1.5 py-0.5 text-ink/40 text-[9px] font-mono">
                       +{analysisResult.technicalSkills.length - 3} more
                     </span>
                   )}
                 </div>
               )}
            </div>

            <button
              onClick={onViewReport}
              className="w-full flex items-center justify-between group cursor-pointer bg-ink/5 hover:bg-ink/10 rounded-sm p-3 transition-colors"
            >
              <span className="font-mono text-[10px] font-bold text-ink uppercase tracking-wider">
                Full Strategic Report
              </span>
              <span className="material-symbols-outlined text-sm text-ink/40 group-hover:text-editorial-red transition-colors">
                arrow_forward
              </span>
            </button>
          </motion.div>
        )}
      </div>
      
      {/* Scanline Animation Overlay */}
      {isAnalyzing && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-widget">
          <motion.div
            initial={{ top: -100 }}
            animate={{ top: "100%" }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "linear"
            }}
            className="absolute left-0 right-0 h-2 bg-gradient-to-b from-transparent via-[#8B5CF6]/30 to-transparent w-full blur-sm" // Scanline beam
          />
          <div className="absolute inset-0 bg-accent/5 mix-blend-overlay" /> 
        </div>
      )}
    </div>
  );
};

export default JobAnalysisCard;
