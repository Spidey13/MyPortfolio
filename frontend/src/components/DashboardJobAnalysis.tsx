import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Briefcase, FolderKanban, Wrench } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

interface AlignmentEvidence {
  source: 'experience' | 'project' | 'skill';
  title: string;
  relevance: string;
}

interface SummaryData {
  executiveSummary?: string;
  keyStrengths?: string[];
  competitiveAdvantages?: string[];
  interviewHighlights?: string[];
  processingTime?: string;
  agentUsed?: string;
  overallMatch?: string;
  matchPercentage?: number;
}

interface DashboardJobAnalysisProps {
  analysisData?: any;
  isVisible: boolean;
  matchScore?: number;
  summaryData?: SummaryData;
  alignmentEvidence?: AlignmentEvidence[];
  onClose?: () => void;
}

const sourceIcons: Record<string, React.ReactNode> = {
  experience: <Briefcase size={13} className="text-purple-500 shrink-0" />,
  project: <FolderKanban size={13} className="text-blue-500 shrink-0" />,
  skill: <Wrench size={13} className="text-emerald-500 shrink-0" />,
};

const sourceLabels: Record<string, string> = {
  experience: 'Experience',
  project: 'Project',
  skill: 'Skill',
};

export const DashboardJobAnalysis: React.FC<DashboardJobAnalysisProps> = ({
  isVisible,
  matchScore = 0,
  summaryData,
  alignmentEvidence = [],
  onClose
}) => {
  const [expandedItem, setExpandedItem] = React.useState<number | null>(null);

  const getMatchLabel = () => {
    if (matchScore >= 85) return 'EXCELLENT MATCH';
    if (matchScore >= 70) return 'STRONG MATCH';
    if (matchScore >= 50) return 'GOOD MATCH';
    return 'MODERATE MATCH';
  };

  // Track analytics when analysis section becomes visible
  React.useEffect(() => {
    if (isVisible && matchScore > 0) {
      trackEvent('job_analysis_results_viewed', {
        match_score: matchScore,
        match_label: getMatchLabel(),
      });
    }
  }, [isVisible, matchScore]);

  const handleItemToggle = (index: number) => {
    const newExpanded = expandedItem === index ? null : index;
    setExpandedItem(newExpanded);
    if (newExpanded !== null && alignmentEvidence[index]) {
      trackEvent('alignment_evidence_expanded', {
        source: alignmentEvidence[index].source,
        title: alignmentEvidence[index].title,
      });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="w-full bg-paper border-b-2 border-primary/10">
      <div className="max-w-[1440px] mx-auto px-8 py-10">

        {/* ── Header: Editorial "Special Report" Style ─────────────── */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Kicker label */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent">
                Special Report
              </span>
              <span className="font-mono text-[10px] text-primary/30">•</span>
              <span className="font-mono text-[10px] text-primary/30 uppercase tracking-widest">
                AI-Powered Assessment
              </span>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-primary/30 hover:text-primary transition-colors p-1"
                aria-label="Close analysis"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Headline */}
          <div className="flex flex-col lg:flex-row items-start lg:items-end gap-4 lg:gap-8">
            <div className="flex-1">
              <h2 className="font-serif text-4xl lg:text-5xl font-black text-primary leading-[1.1] mb-2">
                Strategic Fit Analysis
              </h2>
              <p className="font-sans text-sm text-primary/50 max-w-xl">
                Comprehensive evaluation of profile alignment against role requirements,
                powered by multi-agent analysis.
              </p>
            </div>

            {/* Match Score — editorial pull-quote style */}
            <motion.div
              className="flex items-baseline gap-3 border-l-4 border-accent pl-4 py-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="font-serif text-6xl font-black text-primary">
                {matchScore}%
              </span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent">
                {getMatchLabel()}
              </span>
            </motion.div>
          </div>

          {/* Divider */}
          <div className="h-[2px] bg-primary mt-6" />
        </motion.div>

        {/* ── Executive Summary ────────────────────────────────────── */}
        {summaryData?.executiveSummary && (
          <motion.div
            className="mb-8 max-w-3xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="font-serif text-lg text-primary/80 leading-relaxed italic">
              "{summaryData.executiveSummary}"
            </p>
          </motion.div>
        )}

        {/* ── Alignment Evidence — Collapsible ─────────────────────── */}
        {alignmentEvidence.length > 0 && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-3 pb-2 border-b border-primary/5">
              Why This Is a Match
            </h4>
            <div className="flex flex-col gap-1.5">
              {alignmentEvidence.map((item, index) => (
                <div key={index} className="border border-primary/5 rounded-sm overflow-hidden bg-white">
                  <button
                    onClick={() => handleItemToggle(index)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/[0.02] transition-colors text-left group"
                  >
                    {sourceIcons[item.source] || sourceIcons.skill}
                    <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-primary/30 w-20 shrink-0">
                      {sourceLabels[item.source] || 'Info'}
                    </span>
                    <span className="font-sans text-sm font-medium text-primary flex-1 truncate">
                      {item.title}
                    </span>
                    <ChevronDown 
                      size={14} 
                      className={`text-primary/30 transition-transform duration-200 shrink-0 ${
                        expandedItem === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {expandedItem === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-3 pt-0 border-t border-primary/5">
                          <p className="font-sans text-sm text-primary/60 leading-relaxed pl-[calc(13px+0.75rem+5rem+0.75rem)]">
                            {item.relevance}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Three-Column Insights ───────────────────────────────── */}
        {summaryData && (summaryData.keyStrengths?.length || summaryData.competitiveAdvantages?.length || summaryData.interviewHighlights?.length) && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 pb-8 border-b border-primary/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {summaryData.keyStrengths && summaryData.keyStrengths.length > 0 && (
              <div>
                <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-3 pb-2 border-b border-primary/5">
                  Key Strengths
                </h4>
                <ul className="space-y-2">
                  {summaryData.keyStrengths.map((s, i) => (
                    <li key={i} className="font-sans text-sm text-primary/70 leading-relaxed pl-3 border-l-2 border-accent/30">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {summaryData.competitiveAdvantages && summaryData.competitiveAdvantages.length > 0 && (
              <div>
                <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-3 pb-2 border-b border-primary/5">
                  Competitive Advantages
                </h4>
                <ul className="space-y-2">
                  {summaryData.competitiveAdvantages.map((a, i) => (
                    <li key={i} className="font-sans text-sm text-primary/70 leading-relaxed pl-3 border-l-2 border-accent/30">
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {summaryData.interviewHighlights && summaryData.interviewHighlights.length > 0 && (
              <div>
                <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-3 pb-2 border-b border-primary/5">
                  Interview Highlights
                </h4>
                <ul className="space-y-2">
                  {summaryData.interviewHighlights.map((h, i) => (
                    <li key={i} className="font-sans text-sm text-primary/70 leading-relaxed pl-3 border-l-2 border-accent/30">
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}

        {/* ── Footer ──────────────────────────────────────────────── */}
        {(summaryData?.processingTime || summaryData?.agentUsed) && (
          <motion.div
            className="mt-8 pt-4 border-t border-primary/5 flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {summaryData.agentUsed && (
              <span className="ai-agent-label flex items-center gap-1.5">
                <span className="material-symbols-outlined text-xs text-accent">psychology</span>
                {summaryData.agentUsed}
              </span>
            )}
            {summaryData.processingTime && (
              <span className="font-mono text-[10px] text-primary/25">
                {summaryData.processingTime}
              </span>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DashboardJobAnalysis;
