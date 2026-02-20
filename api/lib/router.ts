/**
 * Query Router
 * Routes user queries to the most appropriate AI agent
 */

import { callGeminiForRouting } from './gemini';

export type AgentType = 'profile' | 'project' | 'career' | 'demo' | 'strategic_fit';

interface RouteResult {
  agent: AgentType;
  confidence: number;
}

/**
 * Keyword patterns for routing with weighted scoring
 */
const KEYWORD_PATTERNS = {
  profile: {
    high: ['about', 'who are you', 'tell me about yourself', 'background', 'education'],
    medium: ['profile', 'skills', 'experience summary']
  },
  project: {
    high: ['project', 'github', 'built', 'developed', 'technical'],
    medium: ['code', 'implementation', 'portfolio']
  },
  career: {
    high: ['career advice', 'job search', 'interview prep'],
    medium: ['career', 'advice', 'development']
  },
  demo: {
    high: ['demo', 'live', 'show me', 'walkthrough'],
    medium: ['interactive', 'demonstration']
  },
  strategic_fit: {
    high: [
      'job description',
      'requirements',
      'position',
      'role requirements',
      'fit analysis',
      'analyze this job'
    ],
    medium: ['analyze', 'match', 'qualification', 'hiring']
  }
};

/**
 * Get keyword-based routing with confidence score
 */
function getKeywordRoute(query: string): RouteResult {
  const queryLower = query.toLowerCase();
  const scores: Record<AgentType, number> = {
    profile: 0,
    project: 0,
    career: 0,
    demo: 0,
    strategic_fit: 0
  };

  // Calculate weighted scores
  for (const [agent, keywords] of Object.entries(KEYWORD_PATTERNS)) {
    const highWeight = keywords.high || [];
    const mediumWeight = keywords.medium || [];

    // High weight keywords (1.0)
    for (const word of highWeight) {
      if (queryLower.includes(word)) {
        scores[agent as AgentType] += 1.0;
      }
    }

    // Medium weight keywords (0.5)
    for (const word of mediumWeight) {
      if (queryLower.includes(word)) {
        scores[agent as AgentType] += 0.5;
      }
    }
  }

  // Find best match
  let bestAgent: AgentType = 'profile';
  let bestScore = 0;

  for (const [agent, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestAgent = agent as AgentType;
    }
  }

  // Normalize confidence to 0-1 range
  const confidence = Math.min(bestScore / 3.0, 1.0);

  return {
    agent: bestAgent,
    confidence
  };
}

/**
 * Route query to appropriate agent
 * Uses multi-tier routing: prefix detection (instant) → keyword matching (fast) → LLM fallback (accurate)
 */
export async function routeQuery(query: string): Promise<AgentType> {
  // TIER 0: Prefix detection for known prompt formats (instant, no false positives)
  // Job analysis queries always start with this prefix and contain a full job description
  // which pollutes keyword scoring with generic tech words.
  const JOB_ANALYSIS_PREFIXES = [
    'please analyze how well my profile matches this job description',
    'analyze how well my profile matches this job description',
    'analyze this job description',
    'analyze this job',
    'job fit analysis'
  ];
  const queryLower = query.toLowerCase().trim();
  for (const prefix of JOB_ANALYSIS_PREFIXES) {
    if (queryLower.startsWith(prefix)) {
      console.log(`[Router] Prefix match → strategic_fit`);
      return 'strategic_fit';
    }
  }

  // TIER 1: Keyword matching (fast, no API call)
  // For keyword matching, only use the first ~200 chars to avoid JD body pollution
  const keywordRoute = getKeywordRoute(query.slice(0, 200));

  // High confidence - use keyword match
  if (keywordRoute.confidence > 0.8) {
    console.log(`[Router] Fast route to ${keywordRoute.agent} (confidence: ${keywordRoute.confidence.toFixed(2)})`);
    return keywordRoute.agent;
  }

  // Medium confidence - use keyword match but log for verification
  if (keywordRoute.confidence > 0.5) {
    console.log(`[Router] Medium confidence to ${keywordRoute.agent} (${keywordRoute.confidence.toFixed(2)})`);
  }

  // TIER 2: LLM routing for ambiguous queries
  try {
    const llmAgent = await callGeminiForRouting(query);
    console.log(`[Router] LLM route to ${llmAgent}`);
    return llmAgent as AgentType;
  } catch (error) {
    console.error('[Router] LLM routing failed, using keyword fallback:', error);
    return keywordRoute.agent;
  }
}

/**
 * Get agent description for logging/debugging
 */
export function getAgentDescription(agent: AgentType): string {
  const descriptions: Record<AgentType, string> = {
    profile: 'Profile Agent - Personal background, education, skills',
    project: 'Project Agent - Technical work, implementations',
    career: 'Career Agent - Professional development, advice',
    demo: 'Demo Agent - Interactive demonstrations',
    strategic_fit: 'Strategic Fit Agent - Job analysis, requirements matching'
  };
  return descriptions[agent];
}
