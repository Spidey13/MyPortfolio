import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { trackPageView, trackEvent, trackChatMessage, trackError } from "./utils/analytics";
import { AnimatePresence } from "framer-motion";

import ScrollProgress from "./components/ScrollProgress";
import SmoothScroll from "./components/SmoothScroll";
import ParallaxBackground from "./components/ParallaxBackground";
import EditorialLayout from "./components/EditorialLayout";
import PageWrapper from "./components/PageWrapper";

import ProjectDetailModal from "./components/ProjectDetailModal";
import StrategicFitAnalysisSection from "./components/StrategicFitAnalysisSection";

// Pages
import ExperiencePage from "./pages/ExperiencePage";
import ProjectCaseStudyPage from "./pages/ProjectCaseStudyPage";
import ProjectsArchivePage from "./pages/ProjectsArchivePage";

// Portfolio data
import { PORTFOLIO_DATA, type PortfolioData } from './data';
import { chatWithAI } from './utils/backendConnection';

function App() {
  // Core state
  const [aiMessage, setAiMessage] = useState("");
  const [chatViewportContent, setChatViewportContent] = useState<{
    type?: string;
    agent?: string;
    content?: string;
  } | null>(null);

  // Portfolio data - using modular static data (no backend sync needed)
  const portfolioData: PortfolioData = PORTFOLIO_DATA;

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);

  // Strategic Fit Analysis state
  const [showStrategicAnalysis, setShowStrategicAnalysis] = useState(false);
  const [strategicAnalysisResult, setStrategicAnalysisResult] =
    useState<any>(null);

  const location = useLocation();

  // Track initial page view and subsequent changes
  useEffect(() => {
    trackPageView(location.pathname, "Prathamesh More - Portfolio");
  }, [location.pathname]);

  // Handle AI chat - optimized with chatWithAI helper
  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    const startTime = Date.now();

    // Track chat query
    trackEvent('chat_query_submitted', {
      query: message,
      query_length: message.length,
    });

    try {
      // Use optimized chatWithAI helper (no portfolioData overhead)
      const result = await chatWithAI(message);
      setAiMessage(result.response);
      // Capture viewport_content for agent label and structured display
      setChatViewportContent(result.viewport_content || null);

      // Track successful response
      const responseTime = Date.now() - startTime;
      trackChatMessage(message.length, result.viewport_content?.agent, false);
      trackEvent('chat_response_received', {
        query: message,
        agent_used: result.viewport_content?.agent || result.agent_used,
        response_time_ms: responseTime,
        response_length: result.response?.length || 0,
      });
    } catch (error) {
      console.error("Chat error:", error);
      trackError('chat_error', (error as Error).message, 'App.handleSendMessage');
      setAiMessage(
        "Sorry, I encountered an error processing your request. Please try again.",
      );
      setChatViewportContent(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle project modal
  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    setShowProjectModal(true);
  };

  const handleCloseProjectModal = () => {
    setShowProjectModal(false);
    setSelectedProject(null);
  };

  // Handle Strategic Fit Analysis
  const handleStrategicAnalysisComplete = (analysisResult: any) => {
    const analysisStartTime = Date.now();
    // Parse the analysis result and convert to Kanban format
    const kanbanData = parseAnalysisToKanban(analysisResult);
    const summaryData = parseAnalysisToSummary(
      analysisResult,
      analysisStartTime,
    );

    setStrategicAnalysisResult({
      kanbanData,
      summaryData,
    });
    setShowStrategicAnalysis(true);

    // Auto-scroll to the analysis section after a brief delay for animation
    setTimeout(() => {
      const el = document.getElementById('strategic-fit-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  };

  const handleCloseStrategicAnalysis = () => {
    setShowStrategicAnalysis(false);
    setStrategicAnalysisResult(null);
  };

  // Helper function to parse AI analysis into Kanban format
  const parseAnalysisToKanban = (analysisResult: any) => {
    console.log("Parsing analysis result for Kanban:", analysisResult);

    // analyzeJobMatch() returns a flat structure: { technicalSkills, relevantExperience, ... }
    // Also check nested kanban_data for raw API responses
    const kanbanData =
      analysisResult.kanban_data ||
      analysisResult.viewport_content?.kanban_data;

    // Prefer flat fields (from analyzeJobMatch), then nested kanban_data
    const ts = analysisResult.technicalSkills || kanbanData?.technicalSkills || [];
    const re = analysisResult.relevantExperience || kanbanData?.relevantExperience || [];
    const pe = analysisResult.projectEvidence || kanbanData?.projectEvidence || [];
    const qi = analysisResult.quantifiableImpact || kanbanData?.quantifiableImpact || [];

    if (ts.length || re.length || pe.length || qi.length) {
      return {
        technicalSkills: ts,
        relevantExperience: re,
        projectEvidence: pe,
        quantifiableImpact: qi,
      };
    }

    // Fallback structure if AI response doesn't have structured data
    console.warn(
      "No structured kanban_data found in AI response, using fallback",
    );
    return {
      technicalSkills: [
        {
          id: "1",
          title: "AI Analysis Failed",
          description:
            "Please try again with a different job description or check backend connection",
          score: "Moderate",
        },
      ],
      relevantExperience: [
        {
          id: "1",
          title: "AI Analysis Failed",
          description:
            "Please try again with a different job description or check backend connection",
          score: "Moderate",
        },
      ],
      projectEvidence: [
        {
          id: "1",
          title: "AI Analysis Failed",
          description:
            "Please try again with a different job description or check backend connection",
          score: "Moderate",
        },
      ],
      quantifiableImpact: [
        {
          id: "1",
          title: "AI Analysis Failed",
          description:
            "Please try again with a different job description or check backend connection",
          score: "Moderate",
        },
      ],
    };
  };

  // Helper function to parse AI analysis into summary format
  const parseAnalysisToSummary = (
    analysisResult: any,
    analysisStartTime?: number,
  ) => {
    console.log("Parsing analysis result for Summary:", analysisResult);

    // analyzeJobMatch() returns { summary: {...}, matchScore: 75, match_score: "75%" }
    // Raw API returns { summary_data: {...}, match_score: "75%" }
    const summaryData =
      analysisResult.summary ||
      analysisResult.summary_data ||
      analysisResult.viewport_content?.summary_data;
    const matchScoreNum = analysisResult.matchScore || 0;
    const matchScoreStr = analysisResult.match_score || `${matchScoreNum}%`;

    if (summaryData && Object.keys(summaryData).length > 0) {
      return {
        overallMatch: summaryData.overallMatch || "Analysis Complete",
        matchPercentage:
          summaryData.matchPercentage ||
          matchScoreNum ||
          parseInt(matchScoreStr.replace("%", "")) ||
          0,
        executiveSummary:
          summaryData.executiveSummary || "Analysis completed successfully.",
        keyStrengths: summaryData.keyStrengths || [],
        competitiveAdvantages: summaryData.competitiveAdvantages || [],
        interviewHighlights: summaryData.interviewHighlights || [],
        processingTime:
          summaryData.processingTime ||
          (analysisStartTime
            ? `${((Date.now() - analysisStartTime) / 1000).toFixed(1)}s`
            : "2.3s"),
        agentUsed:
          summaryData.agentUsed ||
          analysisResult.agent_used ||
          "Strategic Fit Agent",
      };
    }

    // Fallback structure if AI response doesn't have structured data
    console.warn(
      "No structured summary_data found in AI response, using fallback",
    );
    return {
      overallMatch: "Analysis Incomplete",
      matchPercentage: matchScoreNum || parseInt(matchScoreStr.replace("%", "")) || 0,
      executiveSummary:
        "Could not complete the analysis. Please try again with a different job description.",
      keyStrengths: ["Analysis could not be completed"],
      competitiveAdvantages: ["Please try again"],
      interviewHighlights: ["Analysis incomplete - try again"],
      processingTime: "0s",
      agentUsed: analysisResult.agent_used || "Strategic Fit Agent",
    };
  };

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-background text-primary">
        {/* Scroll Progress Indicator */}
        <ScrollProgress />

        {/* Parallax Background Effects */}
        <ParallaxBackground />

        <div className="relative">
          {/* Strategic Fit Analysis Section - Dynamically Inserted at Top */}
          <StrategicFitAnalysisSection
            analysisResult={strategicAnalysisResult}
            isVisible={showStrategicAnalysis}
            onClose={handleCloseStrategicAnalysis}
          />

          {/* Main Editorial Layout */}
          <div>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route
                  path="/"
                  element={
                    <PageWrapper>
                      <EditorialLayout
                        portfolioData={portfolioData}
                        onProjectClick={handleProjectClick}
                        onOpenJobAnalysis={() => setShowStrategicAnalysis(true)}
                        onJobAnalysisComplete={handleStrategicAnalysisComplete}
                        aiMessage={aiMessage}
                        isAnalyzing={isAnalyzing}
                        onSendMessage={handleSendMessage}
                        chatViewportContent={chatViewportContent}
                      />
                    </PageWrapper>
                  }
                />
                <Route 
                  path="/experience/:id" 
                  element={
                    <PageWrapper>
                      <ExperiencePage />
                    </PageWrapper>
                  } 
                />
                <Route 
                  path="/project/:id" 
                  element={
                    <PageWrapper>
                      <ProjectCaseStudyPage />
                    </PageWrapper>
                  } 
                />
                <Route 
                  path="/projects" 
                  element={
                    <PageWrapper>
                      <ProjectsArchivePage onProjectClick={handleProjectClick} />
                    </PageWrapper>
                  } 
                />
              </Routes>
            </AnimatePresence>
          </div>

          {/* Project Detail Modal */}
          <ProjectDetailModal
            project={selectedProject}
            isOpen={showProjectModal}
            onClose={handleCloseProjectModal}
          />
        </div>
      </div>
    </SmoothScroll>
  );
}

export default App;
