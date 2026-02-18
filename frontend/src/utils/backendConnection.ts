// Backend connection utilities
import { log, withPerformance } from './logger';

export const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || '';

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

export const analyzeJobMatch = async (jobDescription: string, portfolioData: any) => {
  try {
    // Use the chat endpoint with a strategic fit analysis prompt
    const analysisPrompt = `Please analyze how well my profile matches this job description and provide a strategic fit analysis:

${jobDescription}

Please analyze my skills, experience, and projects against the job requirements and provide:
1. Match percentage/score
2. Key strengths that align
3. Areas where I excel
4. Potential gaps to address
5. Strategic recommendations`;
    
    // Updated endpoint: /api/chat (removed /v1)
    const response = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: analysisPrompt,
        context: { portfolioData }
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Extract match score from response if possible
    const responseText = result.response || '';
    const matchScoreMatch = responseText.match(/(\d+)\s*%/);
    const matchScore = matchScoreMatch ? matchScoreMatch[1] + '%' : 'Analysis completed';
    
    return {
      match_score: matchScore,
      analysis: responseText,
      agent_used: result.agent_used || 'strategic-fit',
      viewport_content: result.viewport_content
    };
  } catch (error) {
    console.error('Job analysis failed:', error);
    throw error;
  }
};

export const chatWithAI = async (message: string, portfolioData: any) => {
  try {
    // Updated endpoint: /api/chat (removed /v1)
    const response = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        context: { portfolioData }
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