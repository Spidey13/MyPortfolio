import React from 'react';
import { motion } from 'framer-motion';

interface AnalysisSummaryData {
  overallMatch: string;
  matchPercentage: number;
  executiveSummary: string;
  keyStrengths: string[];
  competitiveAdvantages: string[];
  interviewHighlights: string[];
  processingTime?: string;
  agentUsed?: string;
}

interface AnalysisSummaryPanelProps {
  summaryData: AnalysisSummaryData;
  isVisible: boolean;
}

const AnalysisSummaryPanel: React.FC<AnalysisSummaryPanelProps> = ({ summaryData, isVisible }) => {
  const panelVariants = {
    hidden: { opacity: 0, x: 20, scale: 0.98 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className="w-full max-w-md mx-auto lg:mx-0"
      variants={panelVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Main Summary Card */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl">
        {/* Header with Match Score */}
        <motion.div 
          className="text-center mb-6"
          variants={itemVariants}
        >
          <div className="relative inline-block">
            <div className="text-6xl font-black text-accent mb-2">
              {summaryData.matchPercentage}%
            </div>
            <div className="text-sm font-bold text-primary uppercase tracking-wider">
              Job Match Score
            </div>
          </div>
          
          {/* Overall Assessment */}
          <motion.div 
            className="mt-4 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full inline-block"
            variants={itemVariants}
          >
            <span className="text-sm font-semibold text-accent">
              {summaryData.overallMatch}
            </span>
          </motion.div>
        </motion.div>

        {/* Executive Summary */}
        <motion.div 
          className="mb-6"
          variants={itemVariants}
        >
          <h3 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
            <span className="text-xl">🔥</span>
            Why This Candidate?
          </h3>
          <p className="text-sm text-secondary leading-relaxed bg-white/5 p-4 rounded-xl border border-white/10">
            {summaryData.executiveSummary}
          </p>
        </motion.div>

        {/* Key Strengths */}
        {summaryData.keyStrengths && summaryData.keyStrengths.length > 0 && (
          <motion.div 
            className="mb-6"
            variants={itemVariants}
          >
            <h4 className="text-md font-bold text-primary mb-3 flex items-center gap-2">
              <span className="text-lg">💪</span>
              Value Proposition
            </h4>
            <div className="space-y-2">
              {summaryData.keyStrengths.slice(0, 3).map((strength, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-2 text-xs text-secondary bg-green-500/10 border border-green-500/20 rounded-lg p-3"
                  variants={itemVariants}
                >
                  <span className="text-green-500 mt-0.5">▶</span>
                  <span>{strength}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Competitive Advantages */}
        {summaryData.competitiveAdvantages && summaryData.competitiveAdvantages.length > 0 && (
          <motion.div 
            className="mb-6"
            variants={itemVariants}
          >
            <h4 className="text-md font-bold text-primary mb-3 flex items-center gap-2">
              <span className="text-lg">🏆</span>
              Competitive Advantages
            </h4>
            <div className="space-y-2">
              {summaryData.competitiveAdvantages.slice(0, 2).map((advantage, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-2 text-xs text-secondary bg-purple-500/10 border border-purple-500/20 rounded-lg p-3"
                  variants={itemVariants}
                >
                  <span className="text-purple-500 mt-0.5">▶</span>
                  <span>{advantage}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Interview Highlights */}
        {summaryData.interviewHighlights && summaryData.interviewHighlights.length > 0 && (
          <motion.div 
            className="mb-6"
            variants={itemVariants}
          >
            <h4 className="text-md font-bold text-primary mb-3 flex items-center gap-2">
              <span className="text-lg">💬</span>
              Interview Highlights
            </h4>
            <div className="space-y-2">
              {summaryData.interviewHighlights.slice(0, 2).map((highlight, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-2 text-xs text-secondary bg-teal-500/10 border border-teal-500/20 rounded-lg p-3"
                  variants={itemVariants}
                >
                  <span className="text-teal-500 mt-0.5">▶</span>
                  <span>{highlight}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Analysis Metadata */}
        <motion.div 
          className="pt-4 border-t border-white/10"
          variants={itemVariants}
        >
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span>Agent: {summaryData.agentUsed || 'Strategic Fit'}</span>
            {summaryData.processingTime && (
              <span>⏱ {summaryData.processingTime}</span>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnalysisSummaryPanel;