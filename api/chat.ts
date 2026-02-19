/**
 * AI Chat Endpoint
 * Vercel Serverless Function
 * Handles all AI chat and job analysis requests
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { routeQuery } from '@/lib/router';
import { AgentFactory } from '@/lib/agents';
import { trackAIQuery, trackAgentUsage } from '@/lib/analytics';

const agentFactory = new AgentFactory();

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = Date.now();
  let sessionId: string | undefined;

  try {
    // Parse request body
    const { message, context } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Message is required and must be a string'
      });
    }

    // Extract session ID if provided
    sessionId = context?.sessionId || req.headers['x-session-id'] as string;

    console.log(`[Chat] Query: "${message.substring(0, 100)}..."`);

    // Route query to appropriate agent
    const agentType = await routeQuery(message);
    console.log(`[Chat] Routed to: ${agentType}`);

    // Track agent usage
    await trackAgentUsage(agentType, sessionId);

    // Process query with selected agent
    const result = await agentFactory.processQuery(agentType, message, context);

    // Calculate response time
    const responseTime = Date.now() - startTime;
    result.processing_time = responseTime;

    // Track query for analytics
    await trackAIQuery({
      sessionId,
      query: message,
      agent: agentType,
      responseTime,
      cached: result.cached,
      error: result.error
    });

    console.log(`[Chat] Response generated in ${responseTime}ms`);

    // Return response
    return res.status(200).json(result);

  } catch (error: any) {
    console.error('[Chat] Error:', error);

    const responseTime = Date.now() - startTime;

    // Track error
    await trackAIQuery({
      sessionId,
      query: req.body?.message || 'unknown',
      agent: 'error',
      responseTime,
      error: error.message
    });

    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred processing your request',
      response: "I'm experiencing technical difficulties. Please try again in a moment.",
      agent_used: 'Error Handler',
      processing_time: responseTime,
      timestamp: new Date().toISOString()
    });
  }
}
