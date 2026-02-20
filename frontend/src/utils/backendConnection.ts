// Backend connection utilities
import { log, withPerformance } from './logger';

// Vercel serverless functions are at /api
export const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const testBackendConnection = async (): Promise<boolean> => {
  return withPerformance('testBackendConnection', async () => {
    try {
      const start = performance.now();
      // Use relative path for Vercel deployment
      const response = await fetch(`${BACKEND_URL}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const duration = performance.now() - start;
      
      log.apiCall('GET', '/api/health', duration, response.status);
      
      if (response.ok) {
        log.info('Backend connection successful');
      } else {
        log.warn('Backend health check failed', { status: response.status });
      }
      
      return response.ok;
    } catch (error) {
      log.error('Backend connection failed', error as Error, {
        component: 'backendConnection',
        action: 'testConnection'
      });
      return false;
    }
  });
};

export const analyzeJobMatch = async (jobDescription: string) => {
  try {
    // OPTIMIZED: Removed portfolioData param - backend already has it
    const analysisPrompt = `Please analyze how well my profile matches this job description:

${jobDescription}`;
    
    const response = await fetch(`${BACKEND_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: analysisPrompt
        // REMOVED: context: { portfolioData } - backend loads data dynamically
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    // FIXED: Map backend response structure to frontend expectations
    const kanbanData = result.kanban_data || result.viewport_content?.kanban_data || {};
    const summaryData = result.summary_data || result.viewport_content?.summary_data || {};
    const matchScore = summaryData.matchPercentage || 0;
    
    return {
      // Map kanban data to flat structure
      technicalSkills: kanbanData.technicalSkills || [],
      relevantExperience: kanbanData.relevantExperience || [],
      projectEvidence: kanbanData.projectEvidence || [],
      quantifiableImpact: kanbanData.quantifiableImpact || [],
      
      // Map match score
      matchScore: matchScore,
      
      // Include summary data
      summary: summaryData,
      
      // Legacy fields
      match_score: `${matchScore}%`,
      analysis: result.response || '',
      agent_used: result.agent_used || 'strategic-fit',
    };
  } catch (error) {
    console.error('Job analysis failed:', error);
    throw error;
  }
};

export const chatWithAI = async (message: string) => {
  try {
    // OPTIMIZED: Removed portfolioData param - backend already has it
    const response = await fetch(`${BACKEND_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message
        // REMOVED: context: { portfolioData } - backend loads data dynamically
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('AI chat failed:', error);
    throw error;
  }
};