/**
 * Gemini API Wrapper
 * Handles all interactions with Google's Gemini API
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Lazy-initialize to ensure env vars are loaded
let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

export interface GeminiResponse {
  text: string;
  error?: string;
}

export async function callGemini(
  systemPrompt: string,
  userMessage: string,
  context?: Record<string, any>
): Promise<GeminiResponse> {
  try {
    const model = getGenAI().getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2048,
      }
    });

    // Build the full prompt with system instructions and context
    let fullPrompt = systemPrompt + '\n\n';
    
    if (context && Object.keys(context).length > 0) {
      fullPrompt += 'CONTEXT:\n';
      for (const [key, value] of Object.entries(context)) {
        fullPrompt += `${key}:\n${typeof value === 'string' ? value : JSON.stringify(value, null, 2)}\n\n`;
      }
    }
    
    fullPrompt += `USER QUERY:\n${userMessage}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return { text };
  } catch (error: any) {
    console.error('Gemini API error:', error);
    return {
      text: '',
      error: error.message || 'Failed to generate response'
    };
  }
}

export async function callGeminiForRouting(
  query: string
): Promise<string> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return 'profile'; // Default fallback
    }

    const model = getGenAI().getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.1, // Lower for routing
        maxOutputTokens: 50,
      }
    });

    const prompt = `Route the following user query to the most appropriate agent:
Query: "${query}"

Available agents:
- profile: For questions about personal background, education, skills, "about me"
- project: For questions about specific projects, technical work, implementations
- career: For career advice, professional development, industry insights
- demo: For interactive demonstrations, live project showcases
- strategic_fit: For job description analysis, requirements matching, hiring fit

Respond with ONLY the agent name, nothing else.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim().toLowerCase();

    // Validate agent name
    const validAgents = ['profile', 'project', 'career', 'demo', 'strategic_fit'];
    if (validAgents.includes(text)) {
      return text;
    }

    return 'profile'; // Default fallback
  } catch (error) {
    console.error('Routing error:', error);
    return 'profile';
  }
}
