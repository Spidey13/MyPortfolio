import React from 'react';
import ProfessionalAnalysisBoard from './ProfessionalAnalysisBoard';

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
    <ProfessionalAnalysisBoard
      isVisible={isVisible}
      analysisData={analysisResult.kanbanData}
      summaryData={analysisResult.summaryData}
      onClose={onClose}
    />
  );
};

export default StrategicFitAnalysisSection;