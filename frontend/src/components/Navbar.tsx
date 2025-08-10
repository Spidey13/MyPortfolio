import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { analyzeJobMatch } from '../utils/backendConnection';
import JobAnalysisDrawer from './JobAnalysisDrawer';

interface NavbarProps {
  className?: string;
  onNavigate: (sectionId: string) => void;
  portfolioData?: any;
  onAnalysisComplete?: (analysisResult: any) => void;
  onOpenCommandPalette?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ className = '', onNavigate, portfolioData, onAnalysisComplete, onOpenCommandPalette }) => {
  const [showJobAnalysisDrawer, setShowJobAnalysisDrawer] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleNavClick = (sectionId: string) => {
    if (onNavigate) {
      onNavigate(sectionId);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  const handleAnalyzeJob = async (jobDescription: string) => {
    setIsAnalyzing(true);
    
    try {
      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const result = await analyzeJobMatch(jobDescription, portfolioData || {});
      console.log('Job Analysis Result:', result);
      
      // Trigger the Kanban board display
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      } else {
        // Fallback to alert if onAnalysisComplete not provided
        const message = `🎯 Strategic Fit Analysis Complete!\n\nMatch Score: ${result.match_score}\nAgent: ${result.agent_used}`;
        alert(message);
      }
      
      // Log detailed analysis for review
      console.log('Detailed Analysis:', result.analysis);
      
      // Close drawer after successful analysis
      setShowJobAnalysisDrawer(false);
      
    } catch (error) {
      console.warn('Backend connection failed:', error);
      alert('⚠️ Backend offline - Please ensure the backend server is running on localhost:8000');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleJobAnalysisDrawer = () => {
    setShowJobAnalysisDrawer(!showJobAnalysisDrawer);
  };

  const handleCloseDrawer = () => {
    setShowJobAnalysisDrawer(false);
  };

  const handleCommandCenterClick = () => {
    if (onOpenCommandPalette) {
      onOpenCommandPalette();
    }
  };
  
  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Work' },
    { id: 'experience', label: 'Experience' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <>
    <motion.div
      className={`fixed bottom-8 left-0 right-0 z-30 flex justify-center ${className}`}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.nav
        className="bg-white border-2 border-accent/60 shadow-lg shadow-accent/10 overflow-hidden"
                            animate={{
          borderRadius: '9999px',
          width: 'auto'
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Navigation */}
        <motion.div
          className="flex items-center justify-center gap-8 px-8 py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
              {/* Quick Search Button - Leftmost */}
              <motion.button
                onClick={handleCommandCenterClick}
                className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/20 hover:border-white/30 hover:bg-white/10 transition-all duration-200 rounded-full flex items-center gap-2 text-secondary hover:text-primary group mr-4"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {/* Search Icon */}
                <svg className="w-4 h-4 text-secondary group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                
                {/* Button Text */}
                <span className="text-sm font-medium text-secondary group-hover:text-primary transition-colors">
                  Quick Search
                </span>
                
                {/* Subtle Keyboard Shortcut */}
                <div className="flex items-center gap-1 opacity-60 group-hover:opacity-80 transition-opacity">
                  <kbd className="text-xs font-mono px-1.5 py-0.5 bg-white/10 border border-white/20 rounded text-secondary/70">
                    ⌘K
                  </kbd>
                </div>
              </motion.button>

              {/* Navigation Items */}
              {navItems.map((item, index) => (
            <motion.button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="px-4 py-2 text-secondary hover:text-accent hover:bg-accent/5 transition-all duration-200 text-base font-light rounded-full"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {item.label}
                </motion.button>
              ))}

              {/* Divider */}
              <div className="w-px h-6 bg-accent/30 mx-4" />

              {/* AI Job Analysis Button */}
              <motion.button
                onClick={toggleJobAnalysisDrawer}
                className="relative px-6 py-3 bg-gradient-to-r from-purple-500/10 to-teal-500/10 backdrop-blur-sm border border-purple-400/30 text-primary hover:text-white hover:from-purple-500/20 hover:to-teal-500/20 transition-all duration-300 rounded-full flex items-center gap-3 overflow-hidden group"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                
                {/* Icon */}
                <div className="relative z-10 flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
            </div>
                
                {/* Text */}
                <span className="relative z-10 font-medium text-base whitespace-nowrap">
                  AI Job Analysis
                </span>
              </motion.button>
          </motion.div>
    </motion.nav>
    </motion.div>
    
    {/* Job Analysis Drawer */}
    <JobAnalysisDrawer
      isOpen={showJobAnalysisDrawer}
      onClose={handleCloseDrawer}
      onAnalyze={handleAnalyzeJob}
      isAnalyzing={isAnalyzing}
    />
  </>);
};

export default Navbar;