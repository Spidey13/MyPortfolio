import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnalysisCard {
  id: string;
  title: string;
  description: string;
  score: string;
}

interface AnalysisData {
  technicalSkills: AnalysisCard[];
  relevantExperience: AnalysisCard[];
  projectEvidence: AnalysisCard[];
  quantifiableImpact: AnalysisCard[];
}

interface SummaryData {
  overallMatch: string;
  matchPercentage: number;
  executiveSummary: string;
  keyStrengths: string[];
  competitiveAdvantages: string[];
  interviewHighlights: string[];
  processingTime: string;
  agentUsed: string;
}

interface ProfessionalAnalysisBoardProps {
  isVisible: boolean;
  analysisData: AnalysisData;
  summaryData: SummaryData;
  onClose: () => void;
}

const ProfessionalAnalysisBoard: React.FC<ProfessionalAnalysisBoardProps> = ({
  isVisible,
  analysisData,
  summaryData,
  onClose
}) => {
  const sections = [
    {
      id: 'technical',
      title: 'Technical Skills',
      data: analysisData.technicalSkills || [],
      color: 'border-purple-200 bg-purple-50/30'
    },
    {
      id: 'experience',
      title: 'Experience',
      data: analysisData.relevantExperience || [],
      color: 'border-blue-200 bg-blue-50/30'
    },
    {
      id: 'projects',
      title: 'Project Evidence',
      data: analysisData.projectEvidence || [],
      color: 'border-teal-200 bg-teal-50/30'
    },
    {
      id: 'impact',
      title: 'Impact',
      data: analysisData.quantifiableImpact || [],
      color: 'border-green-200 bg-green-50/30'
    }
  ];

  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 75) return 'text-blue-600 bg-blue-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getMatchLabel = (percentage: number) => {
    if (percentage >= 90) return 'Excellent Match';
    if (percentage >= 75) return 'Strong Match';
    if (percentage >= 60) return 'Good Match';
    return 'Partial Match';
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-lg"
          style={{ maxHeight: '80vh', overflowY: 'auto' }}
        >
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className={`px-4 py-2 rounded-full text-sm font-medium ${getMatchColor(summaryData.matchPercentage)}`}>
                    {summaryData.matchPercentage}% Match
                  </div>
                  <span className="text-gray-600 text-sm">{getMatchLabel(summaryData.matchPercentage)}</span>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close analysis"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              {/* Analysis Sections */}
              {sections.map((section, sectionIndex) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sectionIndex * 0.1, duration: 0.4 }}
                  className={`border rounded-lg p-4 ${section.color}`}
                >
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                    {section.title}
                  </h3>
                  
                  <div className="space-y-3">
                    {section.data.length > 0 ? (
                      section.data.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (sectionIndex * 0.1) + (index * 0.05), duration: 0.3 }}
                          className="bg-white border border-gray-100 rounded-md p-3 shadow-sm"
                        >
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-medium text-gray-900 text-sm leading-tight">
                              {item.title}
                            </h4>
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full ml-2 whitespace-nowrap">
                              {item.score}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {item.description}
                          </p>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        No data available
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Executive Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="bg-gray-50 border border-gray-200 rounded-lg p-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Summary */}
                <div className="lg:col-span-2">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                    Executive Summary
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {summaryData.executiveSummary}
                  </p>
                  
                  {summaryData.keyStrengths.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 text-sm mb-2">Key Strengths:</h4>
                      <ul className="space-y-1">
                        {summaryData.keyStrengths.map((strength, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <span className="text-green-500 mr-2 mt-1">•</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="space-y-4">
                  {summaryData.competitiveAdvantages.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm mb-2">Competitive Advantages:</h4>
                      <ul className="space-y-1">
                        {summaryData.competitiveAdvantages.map((advantage, index) => (
                          <li key={index} className="text-xs text-gray-600 flex items-start">
                            <span className="text-blue-500 mr-2 mt-1">•</span>
                            {advantage}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Analysis Time</span>
                      <span>{summaryData.processingTime}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Agent</span>
                      <span>{summaryData.agentUsed}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfessionalAnalysisBoard;