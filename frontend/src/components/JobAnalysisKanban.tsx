import React from 'react';
import { motion } from 'framer-motion';

interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  score?: string;
  category?: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
  color: string;
}

interface JobAnalysisKanbanProps {
  analysisData: {
    technicalSkills: KanbanCard[];
    relevantExperience: KanbanCard[];
    projectEvidence: KanbanCard[];
    quantifiableImpact: KanbanCard[];
  };
  isVisible: boolean;
}

const JobAnalysisKanban: React.FC<JobAnalysisKanbanProps> = ({ analysisData, isVisible }) => {
  const columns: KanbanColumn[] = [
    {
      id: 'technical-skills',
      title: 'Technical Skills Match',
      cards: analysisData.technicalSkills || [],
      color: 'from-purple-500/20 to-purple-600/20'
    },
    {
      id: 'relevant-experience',
      title: 'Relevant Experience',
      cards: analysisData.relevantExperience || [],
      color: 'from-blue-500/20 to-blue-600/20'
    },
    {
      id: 'project-evidence',
      title: 'Project Evidence',
      cards: analysisData.projectEvidence || [],
      color: 'from-teal-500/20 to-teal-600/20'
    },
    {
      id: 'quantifiable-impact',
      title: 'Quantifiable Impact',
      cards: analysisData.quantifiableImpact || [],
      color: 'from-green-500/20 to-green-600/20'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const columnVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className="w-full max-w-7xl mx-auto px-6 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div 
        className="text-center mb-8"
        variants={columnVariants}
      >
        <h2 className="text-4xl font-black text-primary mb-2">
          Strategic Fit Analysis
        </h2>
        <p className="text-lg text-secondary">
          AI-powered job match assessment based on your profile
        </p>
      </motion.div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {columns.map((column) => (
          <motion.div
            key={column.id}
            className="flex flex-col"
            variants={columnVariants}
          >
            {/* Column Header */}
            <div className={`bg-gradient-to-br ${column.color} backdrop-blur-sm border border-white/20 rounded-t-2xl p-4 shadow-lg`}>
              <h3 className="text-xl font-bold text-primary text-center">
                {column.title}
              </h3>
              <div className="text-center mt-2">
                <span className="text-sm font-medium text-accent bg-white/20 px-3 py-1 rounded-full">
                  {column.cards.length} items
                </span>
              </div>
            </div>

            {/* Column Content */}
            <div className="bg-white/5 backdrop-blur-sm border-l border-r border-b border-white/20 rounded-b-2xl p-4 min-h-[300px] flex flex-col gap-3 shadow-lg">
              {column.cards.length > 0 ? (
                column.cards.map((card, index) => (
                  <motion.div
                    key={card.id || index}
                    className="bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:bg-white/90"
                    variants={cardVariants}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <h4 className="font-bold text-primary text-sm mb-2">
                      {card.title}
                    </h4>
                    {card.description && (
                      <p className="text-xs text-secondary leading-relaxed mb-2">
                        {card.description}
                      </p>
                    )}
                    {card.score && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded-full">
                          {card.score}
                        </span>
                        {card.category && (
                          <span className="text-xs text-gray-500">
                            {card.category}
                          </span>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                  <div className="text-center">
                    <div className="text-2xl mb-2">📝</div>
                    <p>No matches found</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default JobAnalysisKanban;