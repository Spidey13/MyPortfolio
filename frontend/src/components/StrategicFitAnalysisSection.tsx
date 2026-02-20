import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardJobAnalysis from './DashboardJobAnalysis';

interface AnalysisCard {
  id: string;
  title: string;
  description: string;
  score: string;
}

interface AnalysisResult {
  kanbanData: {
    technicalSkills: AnalysisCard[];
    relevantExperience: AnalysisCard[];
    projectEvidence: AnalysisCard[];
    quantifiableImpact: AnalysisCard[];
  };
  summaryData: {
    overallMatch: string;
    matchPercentage: number;
    executiveSummary: string;
    keyStrengths: string[];
    competitiveAdvantages: string[];
    interviewHighlights: string[];
    processingTime: string;
    agentUsed: string;
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
  if (!analysisResult) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="strategic-fit-section"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
          className="overflow-hidden"
        >
          <DashboardJobAnalysis
            isVisible={isVisible}
            analysisData={analysisResult.kanbanData}
            matchScore={analysisResult.summaryData?.matchPercentage}
            summaryData={analysisResult.summaryData}
            onClose={onClose}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StrategicFitAnalysisSection;