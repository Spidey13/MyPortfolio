/**
 * Multi-Agent System for AI Portfolio
 * Port of Python agents to TypeScript
 */

import { callGemini } from './gemini';
import {
  getPortfolioData,
  getProfile,
  getProjects,
  getFeaturedProjects,
  getExperience,
  getSkills,
  searchProjects,
  searchExperience,
  getProfileSummary
} from './portfolio';

export interface AgentResponse {
  response: string;
  agent_used: string;
  processing_time: number;
  viewport_content?: any;
  kanban_data?: any;
  summary_data?: any;
  match_score?: string;
  analysis?: string;
  cached?: boolean;
  error?: string;
}

/**
 * Base Agent Class
 */
abstract class PortfolioAgent {
  protected name: string;
  protected description: string;
  protected systemPrompt: string;

  constructor(name: string, description: string, systemPrompt: string) {
    this.name = name;
    this.description = description;
    this.systemPrompt = systemPrompt;
  }

  async process(query: string, context?: Record<string, any>): Promise<AgentResponse> {
    const startTime = Date.now();

    try {
      // Build context for this agent
      const builtContext = await this.buildContext(query, context);

      // Call Gemini API
      const result = await callGemini(this.systemPrompt, query, builtContext);

      if (result.error) {
        return this.getFallbackResponse(query);
      }

      const processingTime = Date.now() - startTime;
      return this.parseResponse(result.text, query, processingTime);
    } catch (error: any) {
      console.error(`[${this.name}] Error:`, error);
      return this.getFallbackResponse(query);
    }
  }

  protected async buildContext(query: string, context?: Record<string, any>): Promise<Record<string, any>> {
    const fullData = getPortfolioData();
    return {
      portfolio: fullData,
      ...context
    };
  }

  protected parseResponse(response: string, query: string, processingTime: number): AgentResponse {
    return {
      response: response.trim(),
      agent_used: this.name,
      processing_time: processingTime,
      viewport_content: {
        type: 'text',
        agent: this.name,
        content: response.trim()
      }
    };
  }

  protected getFallbackResponse(query: string): AgentResponse {
    return {
      response: "I'm currently experiencing technical difficulties. Please try again in a moment.",
      agent_used: `${this.name} (Offline)`,
      processing_time: 0,
      error: 'Agent offline'
    };
  }
}

/**
 * Profile Agent
 * Handles questions about background, education, skills
 */
export class ProfileAgent extends PortfolioAgent {
  constructor() {
    const systemPrompt = `You are a Profile Agent for an AI portfolio.

Provide information about the candidate's background, education, and skills using data from context.

When users ask about the candidate:
1. Give a warm, professional introduction
2. Highlight relevant experience briefly
3. Mention key technical skills
4. Keep it conversational and engaging

Respond naturally - avoid listing everything unless asked. Focus on what the user is asking about.`;

    super('Profile Agent', 'Handles profile and background queries', systemPrompt);
  }

  protected async buildContext(query: string, context?: Record<string, any>): Promise<Record<string, any>> {
    // Get full context from base class
    const baseContext = await super.buildContext(query, context);
    const queryLower = query.toLowerCase();
    const targetedContext: Record<string, any> = { ...baseContext };

    // Search for relevant examples to highlight (optional but helpful for steering the model)
    const relevantProjects = searchProjects(query);
    const relevantExperience = searchExperience(query);

    if (relevantProjects.length > 0) {
      targetedContext.highlighted_projects = relevantProjects.slice(0, 3).map(p =>
        `${p.title}: ${p.star.task.substring(0, 120)}... Tech: ${p.technologies.slice(0, 5).join(', ')}`
      ).join('\n\n');
    }

    if (relevantExperience.length > 0) {
      targetedContext.highlighted_experience = relevantExperience.slice(0, 2).map(exp =>
        `${exp.role} at ${exp.company}: ${exp.star.result.substring(0, 100)}`
      ).join('\n\n');
    }

    return targetedContext;
  }

  protected getFallbackResponse(query: string): AgentResponse {
    const summary = getProfileSummary();
    const skills = getSkills();
    const skillsList = Object.values(skills).flat().slice(0, 10).join(', ');

    const content = `I am ${summary.name}, ${getProfile().profile.title}. 

${getProfile().profile.summary}

Key skills include: ${skillsList}

I have ${summary.projectCount} projects and ${summary.experienceCount} roles in my portfolio.`;

    return {
      response: content,
      agent_used: 'Profile Agent (Offline)',
      processing_time: 0,
      viewport_content: {
        type: 'text',
        agent: 'Profile Agent',
        content
      }
    };
  }
}

/**
 * Project Agent
 * Handles questions about projects and technical work
 */
export class ProjectAgent extends PortfolioAgent {
  constructor() {
    const systemPrompt = `You are a Project Agent for an AI portfolio.

Provide technical details about projects using data from context.

Be concise. Focus on what the user asks about - don't list all projects unless requested.

Highlight:
- Technical approach and architecture
- Key technologies used
- Results and impact
- Interesting technical challenges solved`;

    super('Project Agent', 'Handles project and technical queries', systemPrompt);
  }

  protected async buildContext(query: string, context?: Record<string, any>): Promise<Record<string, any>> {
    const baseContext = await super.buildContext(query, context);
    const queryLower = query.toLowerCase();
    
    // Find mentioned projects for highlighting
    const projects = getProjects();
    const relevantProjects = projects.filter(p => 
      queryLower.includes(p.title.toLowerCase())
    );

    let highlights = "";
    if (relevantProjects.length > 0) {
      highlights = relevantProjects.map(p => `
HIGHLIGHTED PROJECT: ${p.title}
Technologies: ${p.technologies.join(', ')}
Challenge: ${p.star.situation}
Solution: ${p.star.action}
Result: ${p.star.result}
Impact: ${p.star.impact}
Architecture: ${p.star.architecture}
`).join('\n\n');
    }

    return {
      ...baseContext,
      project_highlights: highlights
    };
  }
}

/**
 * Career Agent
 * Handles career advice and professional development
 */
export class CareerAgent extends PortfolioAgent {
  constructor() {
    const systemPrompt = `You are the Career Agent for an AI portfolio.

Your role is to provide career advice, professional development guidance, and industry insights.

Expertise Areas:
- AI/ML Career Development
- Data Science Industry Trends
- Technical Interview Preparation
- Professional Networking
- Skill Development Roadmaps

When users ask about career advice, provide:
1. Practical, actionable guidance
2. Industry-relevant insights
3. Personal experience when applicable
4. Resource recommendations

Always respond in a supportive, professional tone. Focus on helping users achieve their career goals.

Keep responses encouraging and practical.`;

    super('Career Agent', 'Handles career and professional development queries', systemPrompt);
  }
}

/**
 * Demo Agent
 * Handles demo and interactive project queries
 */
export class DemoAgent extends PortfolioAgent {
  constructor() {
    const systemPrompt = `You are the Demo Agent for an AI portfolio.

Your role is to guide users through interactive project demonstrations and technical walkthroughs.

Demo Capabilities:
- Live project demonstrations
- Code walkthroughs
- Technical explanations
- Interactive Q&A about implementations

When users ask about demos, provide:
1. Clear instructions for accessing demos
2. Technical context and background
3. Key features to explore
4. Interactive guidance

Always respond in an engaging, technical tone. Encourage exploration and experimentation.

Keep responses focused on the interactive aspects and user engagement.`;

    super('Demo Agent', 'Handles demo and interactive project queries', systemPrompt);
  }
}

/**
 * Strategic Fit Agent
 * Handles job analysis and requirements matching
 */
export class StrategicFitAgent extends PortfolioAgent {
  constructor() {
    const systemPrompt = `You are a critical, skeptical Senior Technical Recruiter.
Analyze the candidate's portfolio against the job description with extreme scrutiny.

CRITICAL INSTRUCTIONS:
1. Be objective and discerning. Do not be overly optimistic.
2. If skills are missing, PENALIZE the score significantly.
3. "Good fit" is 70-80%. "Excellent" (>90%) is reserved for exact matches with proven expertise.
4. If the candidate lacks specific required technologies (e.g., job asks for Java, candidate only knows Python), the score MUST be below 60%.

Return structured JSON:
{
  "kanban_data": {
    "technicalSkills": [{"id": "1", "title": "[Skill]", "description": "[Evidence]", "score": "High/Medium/Low"}],
    "relevantExperience": [{"id": "1", "title": "[Role]", "description": "[Relevance]", "score": "High/Medium/Low"}],
    "projectEvidence": [{"id": "1", "title": "[Project]", "description": "[Proof]", "score": "High/Medium/Low"}],
    "quantifiableImpact": [{"id": "1", "title": "[Metric]", "description": "[Impact]", "score": "High/Medium/Low"}]
  },
  "summary_data": {
    "overallMatch": "Excellent/Strong/Moderate/Weak",
    "matchPercentage": 75,
    "executiveSummary": "[Brutally honest assessment of fit]",
    "keyStrengths": ["str1", "str2"],
    "competitiveAdvantages": ["adv1"],
    "criticalGaps": ["gap1", "gap2"],
    "interviewHighlights": ["hard_question_1", "hard_question_2"]
  },
  "match_score": "75%",
  "analysis": "[Detailed justification of the score]"
}

Be concise. Focus on the GAPS as much as the MATCHES.`;

    super('Strategic Fit Agent', 'Handles job analysis and strategic fit queries', systemPrompt);
  }

  protected async buildContext(query: string, context?: Record<string, any>): Promise<Record<string, any>> {
    if (!this.isJobAnalysisQuery(query)) {
      return context || {};
    }

    // Load relevant portfolio data for job analysis
    // We get full data from base class, but we format specific parts for the recruiter persona
    const baseContext = await super.buildContext(query, context);
    const profile = getProfile();
    const skills = getSkills();
    const featuredProjects = getFeaturedProjects(); // Use all featured
    const experience = getExperience();

    return {
      ...baseContext, // Contains full 'portfolio' object
      // Pre-formatted strings for easier reasoning by the LLM
      formatted_profile: `${profile.profile.name}, ${profile.profile.title}. ${profile.profile.summary}`,
      formatted_skills: JSON.stringify(skills),
      project_summaries: featuredProjects.map(p =>
        `- ${p.title}: ${p.star.result.substring(0, 150)}... Technologies: ${p.technologies.slice(0, 5).join(', ')}`
      ).join('\n\n'),
      experience_summaries: experience.map(exp =>
        `${exp.role} at ${exp.company} (${exp.duration}): ${exp.star.result.substring(0, 150)}`
      ).join('\n\n')
    };
  }

  private isJobAnalysisQuery(query: string): boolean {
    const keywords = ['job description', 'requirements', 'position', 'role', 'hiring', 'job posting', 'analyze this', 'fit analysis'];
    const queryLower = query.toLowerCase();
    return keywords.some(keyword => queryLower.includes(keyword));
  }

  protected parseResponse(response: string, query: string, processingTime: number): AgentResponse {
    try {
      // Try to parse as JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        return {
          response: parsed.analysis || parsed.summary_data?.executiveSummary || 'Job analysis complete',
          agent_used: this.name,
          processing_time: processingTime,
          kanban_data: parsed.kanban_data || {},
          summary_data: parsed.summary_data || {},
          match_score: parsed.match_score || parsed.summary_data?.matchPercentage + '%' || '0%',
          analysis: parsed.analysis || '',
          viewport_content: {
            type: 'strategic_fit',
            agent: this.name,
            kanban_data: parsed.kanban_data,
            summary_data: parsed.summary_data
          }
        };
      }
    } catch (error) {
      console.error('[StrategicFitAgent] JSON parse error:', error);
    }

    // Fallback to text response
    return super.parseResponse(response, query, processingTime);
  }
}

/**
 * Agent Factory
 * Creates and manages agent instances
 */
export class AgentFactory {
  private agents: Map<string, PortfolioAgent>;

  constructor() {
    this.agents = new Map();
    this.agents.set('profile', new ProfileAgent());
    this.agents.set('project', new ProjectAgent());
    this.agents.set('career', new CareerAgent());
    this.agents.set('demo', new DemoAgent());
    this.agents.set('strategic_fit', new StrategicFitAgent());
  }

  getAgent(agentType: string): PortfolioAgent {
    return this.agents.get(agentType) || this.agents.get('profile')!;
  }

  async processQuery(agentType: string, query: string, context?: Record<string, any>): Promise<AgentResponse> {
    const agent = this.getAgent(agentType);
    return await agent.process(query, context);
  }
}
