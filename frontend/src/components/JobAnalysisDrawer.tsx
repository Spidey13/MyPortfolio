import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface JobAnalysisDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyze: (jobDescription: string) => void;
  isAnalyzing?: boolean;
}

const JobAnalysisDrawer: React.FC<JobAnalysisDrawerProps> = ({
  isOpen,
  onClose,
  onAnalyze,
  isAnalyzing = false
}) => {
  const [jobDescription, setJobDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim() || isAnalyzing) return;
    
    onAnalyze(jobDescription);
    setJobDescription(''); // Clear the textarea
  };

  const handleClose = () => {
    onClose();
    setJobDescription(''); // Clear on close
  };

  // Backdrop variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  };

  // Drawer variants
  const drawerVariants = {
    hidden: { 
      y: "100%",
      opacity: 0
    },
    visible: { 
      y: 0,
      opacity: 1,
      transition: { 
        duration: 0.4, 
        ease: [0.25, 0.46, 0.45, 0.94] // Custom ease-in-out curve
      }
    },
    exit: { 
      y: "100%",
      opacity: 0,
      transition: { 
        duration: 0.3, 
        ease: [0.55, 0.06, 0.68, 0.19] // Custom ease-in curve
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop with blur and dim */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Glassmorphism Container */}
            <div className="bg-gray-900/90 backdrop-blur-xl border-t border-white/20 shadow-2xl">
              {/* Handle Bar */}
              <div className="flex justify-center pt-4 pb-2">
                <div className="w-12 h-1 bg-white/30 rounded-full"></div>
              </div>

              {/* Content */}
              <div className="px-6 pb-6 pt-2">
                <div className="max-w-4xl mx-auto">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <div className="p-2 bg-gradient-to-r from-purple-500/20 to-teal-500/20 rounded-full">
                        {/* Brain/Spark Icon */}
                        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        AI Job Analysis
                      </h3>
                    </div>
                    <p className="text-white/70 text-sm">
                      Get instant insights on candidate fit for any role
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Textarea */}
                    <div className="relative">
                      <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the full job description here to begin the analysis..."
                        className="w-full h-32 px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400/70 focus:border-purple-400/70 transition-all duration-200 font-medium"
                        disabled={isAnalyzing}
                        required
                      />
                      
                      {/* Character counter */}
                      <div className="absolute bottom-3 right-3 text-xs text-white/70 font-medium">
                        {jobDescription.length} characters
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between gap-4">
                      {/* Cancel Button */}
                      <button
                        type="button"
                        onClick={handleClose}
                        className="px-6 py-3 text-white/80 hover:text-white transition-colors duration-200 font-medium"
                        disabled={isAnalyzing}
                      >
                        Cancel
                      </button>

                      {/* Analyze Button */}
                      <motion.button
                        type="submit"
                        disabled={!jobDescription.trim() || isAnalyzing}
                        className="px-8 py-3 bg-gradient-to-r from-purple-500 to-teal-500 hover:from-purple-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isAnalyzing ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Analyzing...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Analyze Candidate
                          </div>
                        )}
                      </motion.button>
                    </div>
                  </form>

                  {/* Quick Tips */}
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-center gap-6 text-xs text-white/80 font-medium">
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span>Paste complete job descriptions for best results</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Analysis typically takes 2-3 seconds</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default JobAnalysisDrawer;