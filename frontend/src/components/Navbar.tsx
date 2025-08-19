import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeJobMatch } from '../utils/backendConnection';
import JobAnalysisDrawer from './JobAnalysisDrawer';
import { trackJobAnalysis, trackSectionView } from '../utils/analytics';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    // Track section view
    trackSectionView(sectionId);
    
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
    // Close mobile menu after navigation
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleAnalyzeJob = async (jobDescription: string) => {
    setIsAnalyzing(true);
    
    // Track job analysis initiation
    trackJobAnalysis();
    
    try {
      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const result = await analyzeJobMatch(jobDescription, portfolioData || {});
      console.log('Job Analysis Result:', result);
      
      // Track successful analysis with match score
      trackJobAnalysis(typeof result.match_score === 'number' ? result.match_score : undefined);
      
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
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      alert(`⚠️ Backend offline - Please ensure the backend server is running on ${apiBaseUrl}`);
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
      {/* Desktop Navbar */}
      <motion.div
        className={`fixed bottom-8 left-0 right-0 z-30 flex justify-center ${className} hidden lg:flex`}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.nav
          className="bg-white border-2 border-accent/60 shadow-lg shadow-accent/10 overflow-hidden rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="flex items-center justify-center gap-4 xl:gap-8 px-6 xl:px-8 py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {/* Quick Search Button */}
            <motion.button
              onClick={handleCommandCenterClick}
              className="px-3 xl:px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/20 hover:border-white/30 hover:bg-white/10 transition-all duration-200 rounded-full flex items-center gap-2 text-secondary hover:text-primary group"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* <img src="/vite.svg" alt="Search" className="w-4 h-4" /> */}
              <span className="text-sm font-medium hidden xl:inline">Quick Search</span>
              <kbd className="text-xs font-mono px-1.5 py-0.5 bg-white/10 border border-white/20 rounded text-secondary/70 hidden xl:inline">
                ⌘K
              </kbd>
            </motion.button>

            {/* Navigation Items */}
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="px-3 xl:px-4 py-2 text-secondary hover:text-accent hover:bg-accent/5 transition-all duration-200 text-sm xl:text-base font-light rounded-full"
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
            <div className="w-px h-6 bg-accent/30" />

            {/* AI Job Analysis Button */}
            <motion.button
              onClick={toggleJobAnalysisDrawer}
              className="relative px-4 xl:px-6 py-2 xl:py-3 bg-gradient-to-r from-purple-500/10 to-teal-500/10 backdrop-blur-sm border border-purple-400/30 text-primary hover:text-white hover:from-purple-500/20 hover:to-teal-500/20 transition-all duration-300 rounded-full flex items-center gap-2 xl:gap-3 overflow-hidden group"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <img src="/vite.svg" alt="AI Analysis" className="w-4 xl:w-5 h-4 xl:h-5 relative z-10" />
              <span className="relative z-10 font-medium text-sm xl:text-base whitespace-nowrap hidden lg:inline">
                AI Analysis
              </span>
            </motion.button>
          </motion.div>
        </motion.nav>
      </motion.div>

      {/* Mobile Navbar */}
      <motion.div
        className={`fixed top-0 left-0 right-0 z-30 lg:hidden ${className}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav className="bg-white/95 backdrop-blur-md border-b border-accent/20 shadow-lg">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Logo/Brand */}
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <img src="/vite.svg" alt="Portfolio" className="w-8 h-8" />
              <span className="font-bold text-lg text-primary">Portfolio</span>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={toggleMobileMenu}
              className="p-2 text-secondary hover:text-primary transition-colors rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <motion.span
                  className="w-5 h-0.5 bg-current mb-1 rounded-full"
                  animate={isMobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="w-5 h-0.5 bg-current mb-1 rounded-full"
                  animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="w-5 h-0.5 bg-current rounded-full"
                  animate={isMobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </motion.button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                className="border-t border-accent/20 bg-white/95 backdrop-blur-md"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{ overflow: 'hidden' }}
              >
                <div className="px-4 py-4 space-y-2">
                  {/* Quick Search */}
                  <motion.button
                    onClick={() => {
                      handleCommandCenterClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-secondary hover:text-primary hover:bg-accent/5 rounded-lg transition-all duration-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <img src="/vite.svg" alt="Search" className="w-5 h-5" />
                    <span className="font-medium">Quick Search</span>
                    <kbd className="ml-auto text-xs font-mono px-2 py-1 bg-gray-100 border border-gray-200 rounded text-gray-500">
                      ⌘K
                    </kbd>
                  </motion.button>

                  {/* Navigation Items */}
                  {navItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-secondary hover:text-primary hover:bg-accent/5 rounded-lg transition-all duration-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + (index + 1) * 0.05 }}
                    >
                      <img src="/vite.svg" alt={item.label} className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </motion.button>
                  ))}

                  {/* Divider */}
                  <div className="h-px bg-accent/20 my-2" />

                  {/* AI Job Analysis */}
                  <motion.button
                    onClick={() => {
                      toggleJobAnalysisDrawer();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left bg-gradient-to-r from-purple-500/10 to-teal-500/10 border border-purple-400/30 text-primary rounded-lg transition-all duration-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + (navItems.length + 2) * 0.05 }}
                  >
                    <img src="/vite.svg" alt="AI Analysis" className="w-5 h-5" />
                    <span className="font-medium">AI Job Analysis</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </motion.div>

      {/* Job Analysis Drawer */}
      <JobAnalysisDrawer
        isOpen={showJobAnalysisDrawer}
        onClose={handleCloseDrawer}
        onAnalyze={handleAnalyzeJob}
        isAnalyzing={isAnalyzing}
      />
    </>
  );
};

export default Navbar;