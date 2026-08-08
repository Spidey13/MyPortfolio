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

/**
 * Overridable without a redeploy, because model retirement is the failure mode that
 * actually bit here: 'gemini-2.0-flash' was retired by Google and every request began
 * 404ing. The old code swallowed that into a canned "technical difficulties" reply at
 * HTTP 200, so the chat was dead with no signal anywhere.
 *
 * Choose a NON-THINKING model. The prompts and the 500/4000 maxOutputTokens budgets
 * below were written for one, and thinking tokens are charged against the same budget:
 * measured on the same prompt at maxOutputTokens=500,
 *   - gemini-3.6-flash      -> 478 thinking + 18 output, finishReason MAX_TOKENS (truncated)
 *   - gemini-flash-latest   -> 480 thinking + 16 output, finishReason MAX_TOKENS (truncated)
 *   - gemini-3.1-flash-lite ->   0 thinking + 49 output, finishReason STOP        (complete)
 * A thinking model here silently returns answers cut off mid-sentence, and would also
 * truncate the Strategic Fit agent's JSON, whose parse errors are swallowed.
 *
 * Also note 'gemini-2.5-flash' is NOT a usable fallback: it appears in ListModels but
 * 404s on v1beta generateContent. Verify any replacement with a real call.
 */
export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
export const GEMINI_PROVIDER = 'google';

/** Observability metadata for one LLM call, forwarded to PostHog by chat.ts. */
export interface GeminiUsage {
  model: string;
  provider: string;
  latencyMs: number;
  inputTokens?: number;
  outputTokens?: number;
}

export interface GeminiResponse {
  text: string;
  error?: string;
  /** Set when the failure is a configuration problem rather than an API fault. */
  errorKind?: 'missing_api_key' | 'api_error';
  usage: GeminiUsage;
}

export async function callGemini(
  systemPrompt: string,
  userMessage: string,
  context?: Record<string, any>,
  maxTokens: number = 500
): Promise<GeminiResponse> {
  const startTime = Date.now();
  const baseUsage: GeminiUsage = {
    model: GEMINI_MODEL,
    provider: GEMINI_PROVIDER,
    latencyMs: 0,
  };

  try {
    const model = getGenAI().getGenerativeModel({
      model: GEMINI_MODEL,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: maxTokens,
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

    return {
      text,
      usage: {
        ...baseUsage,
        latencyMs: Date.now() - startTime,
        inputTokens: response.usageMetadata?.promptTokenCount,
        outputTokens: response.usageMetadata?.candidatesTokenCount,
      },
    };
  } catch (error: any) {
    console.error('Gemini API error:', error);
    const message = error?.message || 'Failed to generate response';
    return {
      text: '',
      error: message,
      // A missing key is a deploy problem, not a flaky upstream. Distinguishing the
      // two is the difference between "retry" and "the chat has been dead for months".
      errorKind: message.includes('GEMINI_API_KEY') ? 'missing_api_key' : 'api_error',
      usage: { ...baseUsage, latencyMs: Date.now() - startTime },
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
      model: GEMINI_MODEL,
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
