/**
 * AI Chat Endpoint
 * Vercel Serverless Function
 * Handles all AI chat and job analysis requests
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { routeQuery } from './_lib/router';
import { AgentFactory } from './_lib/agents';
import { trackAIQuery, trackAgentUsage } from './_lib/analytics';
import { checkRateLimit } from './_lib/rateLimit';

const agentFactory = new AgentFactory();

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Add CORS headers
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://my-portfolio-git-feat-0f72e6-prathamesh-mores-projects-3fff7c84.vercel.app',
    'http://localhost:5173'
  ];
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Rate limiting check
  const xForwardedFor = req.headers['x-forwarded-for'];
  let ip = 'unknown';
  if (typeof xForwardedFor === 'string') {
    ip = xForwardedFor.split(',')[0].trim();
  } else if (Array.isArray(xForwardedFor) && xForwardedFor.length > 0) {
    ip = xForwardedFor[0].trim();
  }
  
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    res.setHeader('Retry-After', limit.retryAfter!.toString());
    return res.status(429).json({ error: 'Too Many Requests' });
  }

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

    const isJobAnalysis = message.trim().startsWith('Please analyze how well my profile matches this job description:');
    const maxLength = isJobAnalysis ? 15000 : 500;

    if (message.length > maxLength) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Message is too long'
      });
    }

    if (context && JSON.stringify(context).length > 1000) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Context is too large'
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
