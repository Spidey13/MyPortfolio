import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectDetailModalProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, isOpen, onClose }) => {
  if (!project) return null;

  const starData = {
    situation: project.star?.situation || `Challenge faced in technical domain requiring innovative approach and technical expertise to deliver measurable business impact.`,
    task: project.star?.task || `Develop and implement ${project.title} using machine learning and data science methodologies to solve complex business problems and optimize performance metrics.`,
    action: project.star?.action ? [project.star.action] : [
      "Conducted comprehensive data analysis and feature engineering",
      "Designed and implemented machine learning models using advanced algorithms",
      "Built production-ready systems with proper testing and validation",
      "Collaborated with cross-functional teams for seamless integration",
      "Optimized performance and monitored system metrics"
    ],
    result: project.star?.result || `Successfully delivered ${project.title} achieving significant performance improvements and business impact.`
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-100 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-primary">{project.title}</h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className="px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
                    Featured
                  </span>
                  <span className="text-secondary">2024</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Project Overview */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Project Visual */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-primary">Project Showcase</h3>
                  
                  {/* Main Project Image */}
                  <motion.div 
                    className="w-full h-64 bg-gradient-to-br from-accent/10 via-gray-100 to-accent-secondary/10 rounded-xl flex items-center justify-center overflow-hidden border border-gray-200"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Project Icon/Visual */}
                    <div className="text-center">
                      <motion.div 
                        className="w-20 h-20 bg-white/80 backdrop-blur-sm rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg border border-white/20"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </motion.div>
                      <div className="text-lg font-bold text-primary">{project.title}</div>
                      <div className="text-sm text-accent font-semibold uppercase tracking-wider">
                        Technical Project
                      </div>
                    </div>
                  </motion.div>

                  {/* Additional Images/Screenshots */}
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2].map((index) => (
                      <div 
                        key={index}
                        className="h-24 bg-gradient-to-br from-accent/5 to-accent-secondary/5 rounded-lg border border-gray-200 flex items-center justify-center"
                      >
                        <span className="text-xs text-secondary">Screenshot {index}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Metrics & Info */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-4">Project Overview</h3>
                    <p className="text-secondary leading-relaxed">{project.star?.situation || project.description}</p>
                  </div>

                  {/* Key Technologies */}
                  <div>
                    <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">Key Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech: string, idx: number) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md border border-gray-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Technology Stack */}
                  <div>
                    <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">Technology Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech: string, idx: number) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md border border-gray-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* STAR Format Analysis */}
              <div className="border-t border-gray-100 pt-8">
                <h3 className="text-xl font-bold text-primary mb-6">Project Analysis (STAR Format)</h3>
                
                <div className="space-y-6">
                  {/* Situation */}
                  <motion.div 
                    className="p-6 bg-blue-50 rounded-xl border border-blue-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h4 className="text-lg font-bold text-blue-700 mb-3 flex items-center gap-2">
                      <span className="w-8 h-8 bg-blue-700 text-white rounded-full flex items-center justify-center text-sm font-bold">S</span>
                      Situation
                    </h4>
                    <p className="text-blue-800 leading-relaxed">{starData.situation}</p>
                  </motion.div>

                  {/* Task */}
                  <motion.div 
                    className="p-6 bg-green-50 rounded-xl border border-green-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h4 className="text-lg font-bold text-green-700 mb-3 flex items-center gap-2">
                      <span className="w-8 h-8 bg-green-700 text-white rounded-full flex items-center justify-center text-sm font-bold">T</span>
                      Task
                    </h4>
                    <p className="text-green-800 leading-relaxed">{starData.task}</p>
                  </motion.div>

                  {/* Action */}
                  <motion.div 
                    className="p-6 bg-purple-50 rounded-xl border border-purple-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h4 className="text-lg font-bold text-purple-700 mb-3 flex items-center gap-2">
                      <span className="w-8 h-8 bg-purple-700 text-white rounded-full flex items-center justify-center text-sm font-bold">A</span>
                      Action
                    </h4>
                    <div className="space-y-2">
                      {starData.action.map((action: string, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-purple-800 leading-relaxed">{action}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Result */}
                  <motion.div 
                    className="p-6 bg-orange-50 rounded-xl border border-orange-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h4 className="text-lg font-bold text-orange-700 mb-3 flex items-center gap-2">
                      <span className="w-8 h-8 bg-orange-700 text-white rounded-full flex items-center justify-center text-sm font-bold">R</span>
                      Result
                    </h4>
                    <p className="text-orange-800 leading-relaxed">{starData.result}</p>
                  </motion.div>
                </div>
              </div>

              {/* Project Links */}
              <div className="border-t border-gray-100 pt-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-secondary">
                    {project.github_url ? 'Open Source Project' : 'Proprietary Project'}
                  </div>
                  <div className="flex gap-3">
                    {project.github_url && (
                      <motion.a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                        whileHover={{ scale: 1.02 }}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        View Code
                      </motion.a>
                    )}
                    <motion.button
                      onClick={onClose}
                      className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:border-accent hover:text-accent transition-colors"
                      whileHover={{ scale: 1.02 }}
                    >
                      Close
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectDetailModal;