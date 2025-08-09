import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

import CommandPalette from './components/CommandPalette';
import ScrollProgress from './components/ScrollProgress';
import SmoothScroll from './components/SmoothScroll';
import ParallaxBackground from './components/ParallaxBackground';
import HeroSection from './components/HeroSection';

import Navbar from './components/Navbar';
import ProjectDetailModal from './components/ProjectDetailModal';
import StrategicFitAnalysisSection from './components/StrategicFitAnalysisSection';
// Removed scroll animation hooks - using direct whileInView animations instead


// Portfolio data will be loaded dynamically from backend

function App() {
  // Core state
  const [showHero, setShowHero] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [aiMessage, setAiMessage] = useState("");
  const [currentPortfolioData, setCurrentPortfolioData] = useState<any>(null);
  const [portfolioLoading, setPortfolioLoading] = useState(true);
  const [portfolioError, setPortfolioError] = useState<string | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  
  // Strategic Fit Analysis state
  const [showStrategicAnalysis, setShowStrategicAnalysis] = useState(false);
  const [strategicAnalysisResult, setStrategicAnalysisResult] = useState<any>(null);

  // Load portfolio data on component mount
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setPortfolioLoading(true);
        setPortfolioError(null);
        
        const response = await fetch('http://localhost:8000/api/v1/portfolio-data');
        
        if (!response.ok) {
          throw new Error(`Failed to load portfolio data: ${response.status}`);
        }
        
        const data = await response.json();
        setCurrentPortfolioData(data);
        console.log('Portfolio data loaded successfully:', data);
        
      } catch (error) {
        console.error('Error loading portfolio data:', error);
        setPortfolioError('Failed to load portfolio data. Please try again later.');
      } finally {
        setPortfolioLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  // Handle smooth scrolling to sections
  const scrollToSection = (sectionId: string) => {
    // If we're on the hero page, transition to main content first
    if (showHero) {
      setShowHero(false)
      // Wait for the content to render, then scroll to the section
      setTimeout(() => {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 500) // Delay to allow content to render
    } else {
      // If already on main content, scroll directly
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  // Handle AI chat with enhanced loading states
  const handleSendMessage = async () => {
    if (!userInput.trim() || isAnalyzing) return;
    
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // Simulate analysis progress for better UX
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
    
    try {
      const response = await axios.post('http://localhost:8000/api/v1/chat', {
        message: userInput,
        context: { portfolioData: currentPortfolioData }
      })

      const result = response.data
      
      // Complete progress and show results
      setAnalysisProgress(100);
      setTimeout(() => {
        setAiMessage(result.response)
        
        // Strategic fit analysis is now handled by the new Job Analysis system
        
        setIsAnalyzing(false);
        setAnalysisProgress(0);
      }, 500);

    } catch (error) {
      console.error('Chat error:', error)
      setAiMessage("I apologize, but I'm having trouble connecting to the backend. Please ensure the backend server is running on http://localhost:8000")
      setIsAnalyzing(false);
      setAnalysisProgress(0);
      clearInterval(progressInterval);
    }
    
    setUserInput('');
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowCommandPalette(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Handle project modal
  const handleProjectClick = (project: any) => {
    setSelectedProject(project)
    setShowProjectModal(true)
  }

  const handleCloseProjectModal = () => {
    setShowProjectModal(false)
    setSelectedProject(null)
  }

  // Handle Strategic Fit Analysis
  const handleStrategicAnalysisComplete = (analysisResult: any) => {
    // Parse the analysis result and convert to Kanban format
    const kanbanData = parseAnalysisToKanban(analysisResult);
    const summaryData = parseAnalysisToSummary(analysisResult);
    
    setStrategicAnalysisResult({
      kanbanData,
      summaryData
    });
    setShowStrategicAnalysis(true);
  }

  const handleCloseStrategicAnalysis = () => {
    setShowStrategicAnalysis(false);
    setStrategicAnalysisResult(null);
  }

  // Helper function to parse AI analysis into Kanban format
  const parseAnalysisToKanban = (analysisResult: any) => {
    console.log('Parsing analysis result for Kanban:', analysisResult);
    
    // Extract kanban_data from the AI response
    const kanbanData = analysisResult.kanban_data || analysisResult.viewport_content?.kanban_data;
    
    if (kanbanData) {
      return {
        technicalSkills: kanbanData.technicalSkills || [],
        relevantExperience: kanbanData.relevantExperience || [],
        projectEvidence: kanbanData.projectEvidence || [],
        quantifiableImpact: kanbanData.quantifiableImpact || []
      };
    }
    
    // Fallback structure if AI response doesn't have structured data
    console.warn('No structured kanban_data found in AI response, using fallback');
    return {
      technicalSkills: [
        { id: '1', title: 'Analysis Incomplete', description: 'Could not parse technical skills from AI response', score: 'N/A' }
      ],
      relevantExperience: [
        { id: '1', title: 'Analysis Incomplete', description: 'Could not parse experience from AI response', score: 'N/A' }
      ],
      projectEvidence: [
        { id: '1', title: 'Analysis Incomplete', description: 'Could not parse projects from AI response', score: 'N/A' }
      ],
      quantifiableImpact: [
        { id: '1', title: 'Analysis Incomplete', description: 'Could not parse impact metrics from AI response', score: 'N/A' }
      ]
    };
  }

  // Helper function to parse AI analysis into summary format
  const parseAnalysisToSummary = (analysisResult: any) => {
    console.log('Parsing analysis result for Summary:', analysisResult);
    
    // Extract summary_data from the AI response
    const summaryData = analysisResult.summary_data || analysisResult.viewport_content?.summary_data;
    const matchScore = analysisResult.match_score || '0%';
    
    if (summaryData) {
      return {
        overallMatch: summaryData.overallMatch || 'Analysis Complete',
        matchPercentage: summaryData.matchPercentage || parseInt(matchScore.replace('%', '')) || 0,
        executiveSummary: summaryData.executiveSummary || 'Analysis completed successfully.',
        keyStrengths: summaryData.keyStrengths || [],
        competitiveAdvantages: summaryData.competitiveAdvantages || [],
        interviewHighlights: summaryData.interviewHighlights || [],
        processingTime: summaryData.processingTime || '2.3s',
        agentUsed: summaryData.agentUsed || analysisResult.agent_used || 'Strategic Fit Agent'
      };
    }
    
    // Fallback structure if AI response doesn't have structured data
    console.warn('No structured summary_data found in AI response, using fallback');
    return {
      overallMatch: 'Analysis Incomplete',
      matchPercentage: parseInt(matchScore.replace('%', '')) || 0,
      executiveSummary: 'Could not complete the analysis. Please try again with a different job description.',
      keyStrengths: ['Analysis could not be completed'],
      competitiveAdvantages: ['Please try again'],
      interviewHighlights: ['Analysis incomplete - try again'],
      processingTime: '0s',
      agentUsed: analysisResult.agent_used || 'Strategic Fit Agent'
    };
  }

  // Show loading state while portfolio data is being fetched
  if (portfolioLoading) {
    return (
      <div className="min-h-screen bg-background text-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-secondary">Loading portfolio data...</p>
        </div>
      </div>
    );
  }

  // Show error state if portfolio data failed to load
  if (portfolioError || !currentPortfolioData) {
    return (
      <div className="min-h-screen bg-background text-primary flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-primary mb-2">Could not load portfolio data</h2>
          <p className="text-secondary mb-6">{portfolioError || 'Please try again later.'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <SmoothScroll>
    <div className="min-h-screen bg-background text-primary">
      {/* Scroll Progress Indicator */}
      <ScrollProgress />
      
      {/* Parallax Background Effects */}
      <ParallaxBackground />
      
      <div className="relative">
        
        {/* Hero Section */}
        <AnimatePresence>
          {showHero && (
            <HeroSection 
            scrollToSection={scrollToSection} 
          />
          )}
        </AnimatePresence>

        {/* Modern Navbar */}
        {!showHero && <Navbar onNavigate={scrollToSection} portfolioData={currentPortfolioData} onAnalysisComplete={handleStrategicAnalysisComplete} onOpenCommandPalette={() => setShowCommandPalette(true)} />}

        {/* Strategic Fit Analysis Section - Dynamically Inserted at Top */}
        <StrategicFitAnalysisSection
          analysisResult={strategicAnalysisResult}
          isVisible={showStrategicAnalysis}
          onClose={handleCloseStrategicAnalysis}
        />

        {/* Main Content - Animated to slide down when analysis appears */}
        {!showHero && (
          <motion.main 
            className="container mx-auto px-6 py-8 pt-24"
            animate={{
              y: showStrategicAnalysis ? 0 : 0,
              transition: { duration: 0.6, ease: "easeOut" }
            }}
          >
            {/* AI Message Display */}
            {aiMessage && (
              <motion.div
                className="mb-8 max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-surface rounded-xl p-6 border border-accent/20 shadow-lg">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-primary leading-relaxed">{aiMessage}</p>

                    </div>
                  </div>
                </div>
              </motion.div>
            )}



            {/* Portfolio Content */}
            <div className="max-w-7xl mx-auto space-y-32 px-6">
              {/* Modern About Section - Bold & Innovative */}
              <motion.div
                id="about"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                viewport={{ once: true, margin: "-100px" }}
                className="scroll-mt-24 min-h-screen flex items-center"
              >
                <div className="max-w-7xl mx-auto w-full">
                  {/* Bold About Layout */}
                  <div className="relative py-20 lg:py-32">
                    {/* Background Elements */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/3 via-transparent to-accent-secondary/2 rounded-3xl"></div>
                    <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-r from-accent/20 to-accent-secondary/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 left-10 w-24 h-24 bg-gradient-to-r from-accent-secondary/15 to-accent/8 rounded-full blur-2xl"></div>
                  
                  <div className="relative z-10">
                      {/* Hero-Style About Header */}
                      <motion.div 
                        className="text-center mb-20"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      >
                        <div className="inline-block">
                          <span className="text-sm font-bold text-accent uppercase tracking-widest mb-4 block">About Me</span>
                          <h2 className="text-6xl lg:text-8xl font-black text-primary mb-6">
                            Building the
                            <span className="block bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent">
                              Future
                            </span>
                          </h2>
                        </div>
                      </motion.div>
                      
                      {/* Clean Two-Column Layout */}
                      <div className="grid lg:grid-cols-5 gap-12 items-start">
                        {/* Left: Profile Photo Card Only */}
                        <motion.div 
                          className="lg:col-span-2"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6 }}
                        >
                          {/* Clean Profile Photo Card */}
                          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
                            {/* Large Profile Picture */}
                        <motion.div 
                              className="w-40 h-48 bg-gradient-to-br from-accent/10 to-accent-secondary/10 rounded-xl mx-auto mb-6 flex items-center justify-center border border-accent/20"
                              whileHover={{ scale: 1.02 }}
                              transition={{ duration: 0.3 }}
                            >
                              <svg className="w-20 h-20 text-accent/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                        </motion.div>
                        
                            {/* Name & Status */}
                            <h3 className="text-2xl font-bold text-primary mb-3">{currentPortfolioData.profile.name}</h3>
                            <div className="flex items-center justify-center gap-2 mb-6">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-secondary">Available for opportunities</span>
                            </div>
                            
                            {/* Social Links */}
                            <div className="flex justify-center gap-3">
                              {currentPortfolioData.profile.links.map((link: any, index: number) => (
                            <motion.a
                              key={index}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                                  className="w-10 h-10 bg-gray-100 hover:bg-accent hover:text-white rounded-lg flex items-center justify-center transition-all duration-200"
                              whileHover={{ scale: 1.05 }}
                                >
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    {link.type === 'github' && (
                                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                    )}
                                    {link.type === 'linkedin' && (
                                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    )}
                                    {link.type === 'scholar' && (
                                      <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 11a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
                                    )}
                                    {link.type === 'resume' && (
                                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 3v5h5M16 13H8M16 17H8M10 9H8"/>
                                    )}
                              </svg>
                            </motion.a>
                          ))}
                      </div>
                    </div>
                      </motion.div>

                        {/* Right: All Text Content */}
                      <motion.div
                          className="lg:col-span-3 space-y-6"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                        >
                          {/* Strategic Messaging */}
                          <div className="space-y-4">
                            <div className="inline-block">
                              <span className="text-sm font-semibold text-accent uppercase tracking-wider">My Approach</span>
                          </div>
                            <h3 className="text-3xl lg:text-4xl font-bold text-primary leading-tight">
                              Data-Driven Solutions,
                              <span className="text-accent"> Strategic Impact</span>
                            </h3>
                            
                            <p className="text-lg text-secondary leading-relaxed">
                              I transform complex data into actionable insights through systematic research, 
                              advanced machine learning, and strategic product thinking.
                            </p>
                          </div>

                          {/* Core Competencies - Simplified */}
                          <div className="space-y-4">
                            <h4 className="text-lg font-bold text-primary">Core Competencies</h4>
                            <div className="space-y-3">
                              {[
                                { title: "Research & Analysis", desc: "Deep-dive data exploration and insight generation" },
                                { title: "ML Engineering", desc: "Production-ready models and intelligent systems" },
                                { title: "Strategic Product", desc: "Business-aligned solutions with measurable impact" }
                              ].map((item, index) => (
                                <div key={index} className="flex items-start gap-3">
                                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                  <div>
                                    <h5 className="font-semibold text-primary">{item.title}</h5>
                                    <p className="text-sm text-secondary">{item.desc}</p>
                          </div>
                        </div>
                              ))}
                            </div>
                    </div>

                          {/* CTA Buttons */}
                    <motion.div
                            className="flex flex-wrap gap-4 pt-4"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                          >
                            <motion.button
                              onClick={() => {
                                const element = document.getElementById('projects');
                                if (element) element.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className="px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors duration-200"
                              whileHover={{ scale: 1.02 }}
                            >
                              View Case Studies
                            </motion.button>
                            
                            <motion.button
                              onClick={() => {
                                const element = document.getElementById('contact');
                                if (element) element.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-accent hover:text-accent transition-colors duration-200"
                              whileHover={{ scale: 1.02 }}
                            >
                              Get in Touch
                            </motion.button>
                              </motion.div>
                          </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

                            {/* Modern Projects Showcase - Bold & Innovative */}
              <motion.div
                id="projects"
                initial={{ opacity: 0, y: 50, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                viewport={{ once: true, margin: "-100px" }}
                className="scroll-mt-24 min-h-screen flex items-center"
              >
                <div className="max-w-7xl mx-auto w-full">
                  {/* Bold Projects Header */}
                  <div className="relative py-20 lg:py-32">
                    {/* Background Elements */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-accent-secondary/2 via-transparent to-accent/3 rounded-3xl"></div>
                    <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-accent-secondary/10 to-accent/5 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10">
                      {/* Clean Case Studies Header */}
                        <motion.div
                        className="mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                      >
                        <div className="flex items-center gap-4 mb-8">
                          <span className="text-sm font-semibold text-accent uppercase tracking-wider">Selected Work</span>
                          <div className="flex-1 h-px bg-gradient-to-r from-accent/30 to-transparent"></div>
                    </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-6">
                          Case Studies
                        </h2>
                        <p className="text-lg text-secondary max-w-2xl leading-relaxed">
                          Strategic solutions combining data science, machine learning, and product thinking. 
                          Each project demonstrates research methodology and measurable business impact.
                        </p>
                      </motion.div>

                      {/* Clean Case Study Cards */}
                      <div className="space-y-12">
                        {currentPortfolioData.projects.map((project: any, index: number) => (
                          <motion.article
                          key={project.id}
                            className="group cursor-pointer"
                          onClick={() => handleProjectClick(project)}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                          >
                            {/* Clean Project Card */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                              <div className="p-8 lg:p-10">
                                
                                {/* Project Header */}
                                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                      <h3 className="text-2xl lg:text-3xl font-bold text-primary group-hover:text-accent transition-colors duration-200">
                              {project.title}
                            </h3>
                              <motion.div
                                        className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                        whileHover={{ x: 3 }}
                              >
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                              </motion.div>
                            </div>
                                    
                                    {/* Category & Status */}
                                    <div className="flex items-center gap-3">
                                      <span className="px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
                                        {project.category || 'AI/ML'}
                                      </span>
                                      <span className="text-sm text-secondary">2024</span>
                            </div>
                          </div>
                          
                                  {/* Key Metrics - Compact */}
                                  {project.metrics && Object.keys(project.metrics).length > 0 && (
                                    <div className="flex gap-6">
                                      {Object.entries(project.metrics).slice(0, 2).map(([key, value]) => (
                                        <div key={key} className="text-right">
                                          <div className="text-2xl font-bold text-accent">{String(value)}</div>
                                          <div className="text-xs text-secondary uppercase tracking-wider">{key}</div>
                                        </div>
                                      ))}
                            </div>
                          )}
                                </div>

                                {/* Project Description */}
                                <p className="text-lg text-secondary leading-relaxed mb-6">
                                  {project.description}
                                </p>

                                {/* Grid Layout for Details */}
                                <div className="grid md:grid-cols-2 gap-8">
                                  {/* Tech Stack */}
                                  <div>
                                    <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">Technology</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {project.technologies.slice(0, 6).map((tech: string, idx: number) => (
                                        <span 
                                key={idx} 
                                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md border border-gray-200"
                              >
                                {tech}
                                        </span>
                                      ))}
                                      {project.technologies.length > 6 && (
                                        <span className="px-3 py-1 text-sm text-secondary">
                                          +{project.technologies.length - 6}
                              </span>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Process/Approach */}
                                  <div>
                                    <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">Approach</h4>
                                    <div className="space-y-2">
                                      <div className="text-sm text-secondary">• Data Analysis & Feature Engineering</div>
                                      <div className="text-sm text-secondary">• Model Development & Validation</div>
                                      <div className="text-sm text-secondary">• Production Deployment & Monitoring</div>
                                    </div>
                                  </div>
                                </div>

                                {/* Project Action */}
                                <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100">
                                  <div className="text-sm text-secondary">
                                    {project.githubUrl ? 'Open Source' : 'Proprietary'} Project
                                  </div>
                                  <div className="flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all duration-200">
                                    <span>View Case Study</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.article>
                            ))}
                          </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Clean Professional Experience Timeline */}
              <motion.div
                id="experience"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="scroll-mt-24 min-h-screen flex items-center"
              >
                <div className="max-w-6xl mx-auto w-full px-6">
                  <div className="py-20">
                    {/* Experience Header */}
                    <motion.div 
                      className="mb-16"
                initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="flex items-center gap-4 mb-8">
                        <span className="text-sm font-semibold text-accent uppercase tracking-wider">Experience</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-accent/30 to-transparent"></div>
                    </div>
                      <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-6">
                        Professional Journey
                      </h2>
                      <p className="text-lg text-secondary max-w-2xl leading-relaxed">
                        Strategic roles focused on data science research, ML engineering, and product impact. 
                        Building intelligent systems that solve real business problems.
                      </p>
                    </motion.div>

                    {/* Timeline Container */}
                    <div className="relative">
                      {/* Vertical Timeline Line */}
                      <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-accent/20 via-accent/40 to-accent/20 hidden md:block"></div>
                      
                      {/* Experience Items */}
                      <div className="space-y-12">
                    {currentPortfolioData.experience.map((exp: any, index: number) => (
                      <motion.div 
                        key={index}
                            className="relative"
                        initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                          >
                            {/* Timeline Dot */}
                            <div className="absolute left-6 top-8 w-4 h-4 bg-accent rounded-full border-4 border-white shadow-lg hidden md:block"></div>
                            
                            {/* Experience Card */}
                            <div className="md:ml-20 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                              <div className="p-8">
                                {/* Header */}
                                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                                  <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-primary mb-2">
                                      {exp.position}
                                    </h3>
                                    <div className="flex items-center gap-3 mb-3">
                                      <span className="text-lg font-semibold text-accent">
                                        {exp.company}
                                      </span>
                                      <span className="px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
                                        {exp.type || 'Full-time'}
                                      </span>
                                    </div>
                                    <div className="text-sm text-secondary font-medium">
                                      {exp.duration}
                                    </div>
                                  </div>
                                </div>

                                {/* Simplified Description */}
                                <p className="text-secondary leading-relaxed mb-4">
                                  {exp.description}
                                </p>

                                {/* Key Highlights - Reduced */}
                                {exp.achievements && exp.achievements.length > 0 && (
                                  <div className="mb-4">
                                    <div className="space-y-2">
                                      {exp.achievements.slice(0, 2).map((achievement: string, idx: number) => (
                                        <div key={idx} className="flex items-start gap-2">
                                          <div className="w-1 h-1 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                          <span className="text-sm text-secondary">{achievement}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Core Technologies - Simplified */}
                                {exp.technologies && exp.technologies.length > 0 && (
                                  <div>
                                    <div className="flex flex-wrap gap-2">
                                      {exp.technologies.slice(0, 5).map((tech: string, idx: number) => (
                                        <span 
                                          key={idx}
                                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded border border-gray-200"
                                        >
                                          {tech}
                                        </span>
                                      ))}
                                      {exp.technologies.length > 5 && (
                                        <span className="px-2 py-1 text-xs text-secondary">
                                          +{exp.technologies.length - 5}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                      </motion.div>
                    ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Clean Academic Publications */}
              <motion.div
                id="publications"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="scroll-mt-24 min-h-screen flex items-center"
              >
                <div className="max-w-6xl mx-auto w-full px-6">
                  <div className="py-20">
                    {/* Publications Header */}
                    <motion.div 
                      className="mb-16"
                initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="flex items-center gap-4 mb-8">
                        <span className="text-sm font-semibold text-accent uppercase tracking-wider">Research</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-accent/30 to-transparent"></div>
                      </div>
                      <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-6">
                        Publications
                      </h2>
                      <p className="text-lg text-secondary max-w-2xl leading-relaxed">
                        Peer-reviewed contributions to machine learning and natural language processing research, 
                        published in leading conferences and journals.
                      </p>
                    </motion.div>

                    {/* Publications List */}
                    <div className="space-y-8">
                    {currentPortfolioData.publications.map((pub: any, index: number) => (
                        <motion.article
                        key={pub.id}
                          className="group cursor-pointer"
                        initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          viewport={{ once: true }}
                        >
                          {/* Publication Card */}
                          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                            <div className="p-8">
                              {/* Header with Featured Badge */}
                              <div className="flex items-start justify-between gap-4 mb-6">
                          <div className="flex-1">
                                  {/* Publication Title */}
                                  <h3 className="text-2xl font-bold text-primary mb-3 group-hover:text-accent transition-colors duration-200">
                              {pub.title}
                            </h3>
                                  
                                  {/* Authors */}
                                  <div className="text-secondary mb-3">
                                    {pub.authors.join(", ")}
                                  </div>
                                  
                                  {/* Venue & Year */}
                                  <div className="flex items-center gap-3 flex-wrap">
                                    <span className="text-accent font-semibold">
                                      {pub.venue}
                              </span>
                                    <span className="text-secondary">•</span>
                                    <span className="text-secondary">{pub.year}</span>
                            </div>
                          </div>
                                
                                {/* Featured Badge */}
                          {pub.featured && (
                                  <div className="px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
                                    Featured
                                  </div>
                          )}
                        </div>
                        
                              {/* Publication Details */}
                              <div className="grid md:grid-cols-3 gap-6 mb-6">
                                {/* Type & Category */}
                                <div>
                                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Type</h4>
                                  <div className="space-y-1">
                                    <div className="text-sm text-secondary">{pub.type}</div>
                                    <div className="text-sm text-secondary">{pub.category}</div>
                                  </div>
                                </div>
                                
                                {/* DOI */}
                                {pub.doi && (
                                  <div>
                                    <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">DOI</h4>
                                    <div className="text-sm text-secondary font-mono break-all">
                                      {pub.doi}
                                    </div>
                                  </div>
                                )}
                                
                                {/* Access */}
                                <div>
                                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Access</h4>
                          <motion.a
                            href={pub.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all duration-200"
                                    whileHover={{ x: 3 }}
                          >
                                    <span>View Paper</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </motion.a>
                                </div>
                              </div>

                              {/* Quick Stats */}
                              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                                <div className="text-sm text-secondary">
                                  Published in {pub.venue}
                          </div>
                                <div className="text-sm text-accent font-medium">
                                  {pub.type}
                        </div>
                              </div>
                            </div>
                          </div>
                        </motion.article>
                      ))}
                    </div>

                    {/* Research Summary */}
                    <motion.div
                      className="mt-16 text-center"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      <div className="inline-flex items-center gap-6 px-8 py-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-accent">{currentPortfolioData.publications.length}</div>
                          <div className="text-sm text-secondary">Publications</div>
                        </div>
                        <div className="w-px h-8 bg-gray-300"></div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-accent">
                            {currentPortfolioData.publications.filter((pub: any) => pub.type === 'Conference Paper').length}
                          </div>
                          <div className="text-sm text-secondary">Conference Papers</div>
                        </div>
                        <div className="w-px h-8 bg-gray-300"></div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-accent">
                            {currentPortfolioData.publications.filter((pub: any) => pub.featured).length}
                          </div>
                          <div className="text-sm text-secondary">Featured</div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Premium Contact Section */}
              <motion.div
                id="contact"
                initial={{ opacity: 0, scale: 0.9, y: 60 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.0, ease: "easeOut" }}
                viewport={{ once: true, margin: "-80px" }}
                className="scroll-mt-24 min-h-screen flex items-center"
              >
                <div className="w-full max-w-6xl mx-auto">
                <div className="relative group">
                  {/* Hero-Level Interactive Background */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-surface/95 to-background/70 backdrop-blur-xl rounded-3xl border border-accent/15 shadow-2xl"
                    whileHover={{ 
                      scale: 1.002,
                      boxShadow: "0 32px 128px rgba(0, 0, 0, 0.15)"
                    }}
                    transition={{ duration: 0.4 }}
                  />
                  
                  {/* Sophisticated gradient effects */}
                  <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-bl from-accent/8 to-transparent rounded-full blur-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-700"></div>
                  <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-tr from-accent/6 to-transparent rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
                  
                  <div className="relative z-10 p-12 lg:p-16">
                    {/* Hero-Level Section Header */}
                    <motion.div 
                      className="text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.h2 
                        className="text-5xl lg:text-6xl font-bold text-primary mb-6 tracking-tight"
                        whileHover={{ 
                          scale: 1.02,
                          textShadow: "0 0 30px rgba(59, 130, 246, 0.3)"
                        }}
                      >
                        Let's
                        <span className="block text-accent mt-2">Connect</span>
                      </motion.h2>
                      
                      <motion.p 
                        className="text-xl text-secondary max-w-2xl mx-auto leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        Ready to discuss your next project or explore collaboration opportunities? 
                        I'd love to hear from you.
                      </motion.p>
                    </motion.div>
                    {/* Premium Contact Methods */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                      {/* Email Contact Card */}
                      <motion.a
                        href="mailto:prpmore@gmail.com"
                        className="group relative block"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        whileHover={{ 
                          scale: 1.03,
                          y: -8
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Card Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-surface/90 to-background/60 backdrop-blur-sm rounded-2xl border border-accent/20 shadow-xl group-hover:shadow-2xl group-hover:shadow-accent/20 transition-all duration-500" />
                        
                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Card Content */}
                        <div className="relative z-10 p-8 text-center">
                          {/* Icon */}
                      <motion.div 
                            className="w-20 h-20 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-accent/25"
                            whileHover={{ 
                              rotate: 6,
                              scale: 1.1
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          </motion.div>
                          
                          {/* Content */}
                          <h3 className="text-2xl font-bold text-primary mb-2 group-hover:text-accent transition-colors duration-300">
                            Email Me
                          </h3>
                          <p className="text-secondary mb-4 group-hover:text-primary transition-colors duration-300">
                            Drop me a line for projects, collaborations, or just to say hello
                          </p>
                          <div className="text-accent font-semibold text-lg">
                            prpmore@gmail.com
                        </div>
                        </div>

                        {/* Decorative Element */}
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent/80 rounded-full blur-sm group-hover:blur-none transition-all duration-300"></div>
                      </motion.a>

                      {/* Professional Links Card */}
                      <motion.div 
                        className="group relative"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        whileHover={{ 
                          scale: 1.03,
                          y: -8
                        }}
                      >
                        {/* Card Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-surface/90 to-background/60 backdrop-blur-sm rounded-2xl border border-accent/20 shadow-xl group-hover:shadow-2xl group-hover:shadow-accent/20 transition-all duration-500" />
                        
                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Card Content */}
                        <div className="relative z-10 p-8 text-center">
                          {/* Icon */}
                      <motion.div 
                            className="w-20 h-20 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-accent/25"
                            whileHover={{ 
                              rotate: -6,
                              scale: 1.1
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                      </motion.div>
                          
                          {/* Content */}
                          <h3 className="text-2xl font-bold text-primary mb-4 group-hover:text-accent transition-colors duration-300">
                            Connect Online
                          </h3>
                          <p className="text-secondary mb-6 group-hover:text-primary transition-colors duration-300">
                            Find me across professional platforms
                          </p>
                          
                          {/* Professional Links Grid */}
                          <div className="grid grid-cols-2 gap-4">
                      <motion.a
                              href="https://linkedin.com/in/prathameshmore"
                        target="_blank"
                        rel="noopener noreferrer"
                              className="group flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-accent/10 to-accent/5 rounded-xl border border-accent/20 hover:border-accent/40 transition-all duration-300"
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                              <span className="text-accent font-semibold">LinkedIn</span>
                      </motion.a>

                      <motion.a
                              href="https://github.com/prathameshmore"
                        target="_blank"
                        rel="noopener noreferrer"
                              className="group flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-accent/10 to-accent/5 rounded-xl border border-accent/20 hover:border-accent/40 transition-all duration-300"
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                              <span className="text-accent font-semibold">GitHub</span>
                      </motion.a>
                        </div>
                        </div>
                      </motion.div>
                    </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Skills Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <div className="bg-surface rounded-lg p-4 sm:p-6 border border-accent/20">
                  <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6">Core Competencies</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {Object.entries({
                      "Generative AI & LLMs": [
                        { name: "OpenAI GPT Models", proficiency: 95 },
                        { name: "LangChain", proficiency: 90 },
                        { name: "Hugging Face Transformers", proficiency: 85 },
                        { name: "Prompt Engineering", proficiency: 92 },
                        { name: "RAG (Retrieval-Augmented Generation)", proficiency: 88 }
                      ],
                      "Machine Learning & Modeling": [
                        { name: "Scikit-learn", proficiency: 95 },
                        { name: "XGBoost", proficiency: 90 },
                        { name: "Random Forest", proficiency: 88 },
                        { name: "Deep Learning (TensorFlow, PyTorch)", proficiency: 85 },
                        { name: "Feature Engineering", proficiency: 92 }
                      ],
                      "Data Engineering & MLOps": [
                        { name: "Apache Spark", proficiency: 80 },
                        { name: "Docker", proficiency: 85 },
                        { name: "MLflow", proficiency: 78 },
                        { name: "AWS (S3, EC2, Lambda)", proficiency: 82 },
                        { name: "Data Pipelines", proficiency: 88 }
                      ],
                      "Languages & Databases": [
                        { name: "Python", proficiency: 95 },
                        { name: "SQL", proficiency: 90 },
                        { name: "JavaScript", proficiency: 80 },
                        { name: "R", proficiency: 75 },
                        { name: "PostgreSQL", proficiency: 85 }
                      ],
                      "Web & API Development": [
                        { name: "FastAPI", proficiency: 88 },
                        { name: "React", proficiency: 82 },
                        { name: "REST APIs", proficiency: 90 },
                        { name: "Node.js", proficiency: 75 },
                        { name: "Express.js", proficiency: 78 }
                      ],
                      "Tools & Frameworks": [
                        { name: "Git", proficiency: 92 },
                        { name: "Jupyter", proficiency: 95 },
                        { name: "Streamlit", proficiency: 90 },
                        { name: "Plotly", proficiency: 85 },
                        { name: "Pandas", proficiency: 95 }
                      ]
                    }).map(([category, skills], categoryIndex) => (
                      <motion.div
                        key={category}
                        className="space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.2 + categoryIndex * 0.1 }}
                      >
                        <h3 className="text-base sm:text-lg font-semibold text-accent mb-3">{category}</h3>
                        <div className="space-y-3">
                          {skills.map((skill: any, skillIndex: number) => (
                            <motion.div
                              key={skill.name}
                              className="group"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 1.4 + categoryIndex * 0.1 + skillIndex * 0.05 }}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-primary group-hover:text-accent transition-colors duration-200">
                                  {skill.name}
                                </span>
                                <span className="text-xs text-secondary">{skill.proficiency}%</span>
                              </div>
                              <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                                <motion.div
                                  className="h-full bg-gradient-to-r from-accent to-accent/70 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${skill.proficiency}%` }}
                                  transition={{ 
                                    duration: 1.2, 
                                    delay: 1.6 + categoryIndex * 0.1 + skillIndex * 0.05,
                                    ease: [0.25, 0.46, 0.45, 0.94]
                                  }}
                                />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.main>
        )}



        {/* Input Interface - Integrated into AI message area */}
        {!showHero && aiMessage && (
          <motion.div 
            className="fixed bottom-6 left-6 right-6 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="bg-background/95 backdrop-blur-sm border border-accent/20 rounded-xl p-4 shadow-xl relative overflow-hidden">
              {/* Progress bar */}
              {isAnalyzing && (
                <motion.div 
                  className="absolute top-0 left-0 h-1 bg-gradient-to-r from-accent to-accent/60 rounded-t-xl"
                  initial={{ width: 0 }}
                  animate={{ width: `${analysisProgress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              )}
              
              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isAnalyzing && handleSendMessage()}
                    placeholder={isAnalyzing ? "Analyzing strategic fit..." : "Enter job description or ask about strategic fit..."}
                    disabled={isAnalyzing}
                    className="w-full bg-transparent border border-accent/30 rounded-lg px-4 py-2 text-primary placeholder-secondary/60 focus:outline-none focus:border-accent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {isAnalyzing && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <motion.div
                        className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    </div>
                  )}
                </div>
                <motion.button
                  onClick={handleSendMessage}
                  disabled={isAnalyzing || !userInput.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-accent to-accent/80 text-background rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-accent/25"
                  whileHover={!isAnalyzing ? { scale: 1.02, y: -1 } : {}}
                  whileTap={!isAnalyzing ? { scale: 0.98 } : {}}
                >
                  {isAnalyzing ? (
                    <div className="flex items-center space-x-2">
                      <motion.div
                        className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span>Analyzing</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Analyze</span>
                    </div>
                  )}
                </motion.button>
              </div>
              
              {/* Analysis status */}
              {isAnalyzing && (
                <motion.div 
                  className="mt-3 text-xs text-accent/70 flex items-center space-x-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    className="w-2 h-2 bg-accent rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: 0.75 }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                  />
                  <span>Processing strategic fit analysis...</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Command Palette */}
        <CommandPalette 
          isOpen={showCommandPalette} 
          onClose={() => setShowCommandPalette(false)}
          portfolioData={currentPortfolioData}
          onNavigate={scrollToSection}
        />
        
        {/* Project Detail Modal */}
        <ProjectDetailModal
              project={selectedProject}
              isOpen={showProjectModal}
              onClose={handleCloseProjectModal}
            />
      </div>
    </div>
    </SmoothScroll>
  )
}

export default App
