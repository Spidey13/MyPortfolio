import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import JobAnalysisKanban from './JobAnalysisKanban';
import AnalysisSummaryPanel from './AnalysisSummaryPanel';

interface AnalysisResult {
  kanbanData: {
    technicalSkills: Array<{
      id: string;
      title: string;
      description?: string;
      score?: string;
      category?: string;
    }>;
    relevantExperience: Array<{
      id: string;
      title: string;
      description?: string;
      score?: string;
      category?: string;
    }>;
    projectEvidence: Array<{
      id: string;
      title: string;
      description?: string;
      score?: string;
      category?: string;
    }>;
    quantifiableImpact: Array<{
      id: string;
      title: string;
      description?: string;
      score?: string;
      category?: string;
    }>;
  };
  summaryData: {
    overallMatch: string;
    matchPercentage: number;
    executiveSummary: string;
    keyStrengths: string[];
    potentialGaps: string[];
    recommendations: string[];
    processingTime?: string;
    agentUsed?: string;
  };
}

interface StrategicFitAnalysisSectionProps {
  analysisResult: AnalysisResult | null;
  isVisible: boolean;
  onClose: () => void;
}

const StrategicFitAnalysisSection: React.FC<StrategicFitAnalysisSectionProps> = ({
  analysisResult,
  isVisible,
  onClose
}) => {
  const sectionVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      y: -50,
      scale: 0.98
    },
    visible: {
      opacity: 1,
      height: 'auto',
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      y: -30,
      scale: 0.98,
      transition: {
        duration: 0.5,
        ease: "easeIn"
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && analysisResult && (
        <motion.section
          className="w-full bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-teal-500/5 border-b border-white/10 backdrop-blur-sm relative overflow-hidden"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)] bg-[size:20px_20px]"></div>
          </div>

          {/* Close Button */}
          <motion.button
            className="absolute top-6 right-6 z-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-2 hover:bg-white/20 transition-all duration-200 text-white"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>

          <motion.div 
            className="container mx-auto px-6 py-12"
            variants={contentVariants}
          >
            {/* Desktop Layout: Side by Side */}
            <div className="hidden xl:block">
              <div className="flex gap-8 items-start">
                {/* Summary Panel - Left Side */}
                <div className="w-80 flex-shrink-0">
                  <AnalysisSummaryPanel
                    summaryData={analysisResult.summaryData}
                    isVisible={true}
                  />
                </div>

                {/* Kanban Board - Right Side */}
                <div className="flex-1 min-w-0">
                  <JobAnalysisKanban
                    analysisData={analysisResult.kanbanData}
                    isVisible={true}
                  />
                </div>
              </div>
            </div>

            {/* Mobile & Tablet Layout: Stacked */}
            <div className="xl:hidden space-y-8">
              {/* Summary Panel - Top */}
              <div className="flex justify-center">
                <AnalysisSummaryPanel
                  summaryData={analysisResult.summaryData}
                  isVisible={true}
                />
              </div>

              {/* Kanban Board - Bottom */}
              <JobAnalysisKanban
                analysisData={analysisResult.kanbanData}
                isVisible={true}
              />
            </div>
          </motion.div>

          {/* Bottom Border Accent */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-teal-500/30"></div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};

export default StrategicFitAnalysisSection;