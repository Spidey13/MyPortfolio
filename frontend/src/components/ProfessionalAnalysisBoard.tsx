import React, { useState } from 'react';
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
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
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

  // Helper to get impact level from score - improved consistency
  const getImpactLevel = (score: string): string => {
    // Handle percentage scores
    if (score.includes('%')) {
      const numericScore = parseInt(score.replace('%', ''));
      if (numericScore >= 90) return 'Excellent';
      if (numericScore >= 80) return 'High';
      if (numericScore >= 70) return 'Strong';
      if (numericScore >= 60) return 'Good';
      return 'Moderate';
    }
    
    // Handle text-based scores from AI
    const scoreLower = score.toLowerCase();
    if (scoreLower.includes('excellent') || scoreLower.includes('90')) return 'Excellent';
    if (scoreLower.includes('high') || scoreLower.includes('80')) return 'High';
    if (scoreLower.includes('strong') || scoreLower.includes('70')) return 'Strong';
    if (scoreLower.includes('good') || scoreLower.includes('60')) return 'Good';
    if (scoreLower.includes('moderate') || scoreLower.includes('50')) return 'Moderate';
    
    // Default fallback
    return 'Moderate';
  };

  // Helper to get tag color based on impact level
  const getTagColor = (level: string): string => {
    switch (level) {
      case 'Excellent': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'High': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Strong': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Good': return 'bg-teal-100 text-teal-800 border-teal-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleCardClick = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
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
            {/* Header - Minimal & Prominent */}
            <div className="flex items-center justify-between mb-12">
              <div className="text-center flex-1">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="inline-flex items-center gap-4"
                >
                  <div className={`px-6 py-3 rounded-2xl text-lg font-bold ${getMatchColor(summaryData.matchPercentage)} border-2 border-current/20`}>
                    {summaryData.matchPercentage}%
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{getMatchLabel(summaryData.matchPercentage)}</h2>
                    <p className="text-sm text-gray-500">Strategic Fit Analysis</p>
                  </div>
                </motion.div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                aria-label="Close analysis"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Instruction Hint */}
            <div className="text-center mb-8">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Click any card below to view detailed analysis</p>
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
                      section.data.map((item, index) => {
                        const cardId = `${section.id}-${index}`;
                        const isExpanded = expandedCard === cardId;
                        const impactLevel = getImpactLevel(item.score);
                        
                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (sectionIndex * 0.1) + (index * 0.05), duration: 0.3 }}
                            className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 hover:border-gray-200"
                            onClick={() => handleCardClick(cardId)}
                            whileHover={{ y: -1 }}
                            layout
                          >
                            {/* Minimal Default View - Title + Tag */}
                            <div className="flex items-start justify-between">
                              <h4 className="font-semibold text-gray-900 text-base leading-tight flex-1 pr-3">
                                {item.title}
                              </h4>
                              <span className={`text-xs px-3 py-1.5 border rounded-full font-medium whitespace-nowrap ${getTagColor(impactLevel)}`}>
                                {impactLevel}
                              </span>
                            </div>
                            
                            {/* Progressive Disclosure - Expanded Details */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                  animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                                  className="overflow-hidden"
                                >
                                  <div className="pt-3 border-t border-gray-100">
                                    <p className="text-sm text-gray-600 leading-relaxed mb-3">
                                      {item.description}
                                    </p>
                                    {/* Removed redundant score display - tag already shows the level */}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                            
                            {/* Subtle Expand Indicator */}
                            <motion.div
                              className="flex justify-center mt-2"
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </motion.div>
                          </motion.div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8 text-gray-500 text-sm">
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