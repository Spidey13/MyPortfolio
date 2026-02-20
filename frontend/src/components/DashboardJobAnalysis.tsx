import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { trackEvent } from '../utils/analytics';



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
  onClose?: () => void;
}

export const DashboardJobAnalysis: React.FC<DashboardJobAnalysisProps> = ({
  isVisible,
  matchScore = 0,
  summaryData,
  onClose
}) => {
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
