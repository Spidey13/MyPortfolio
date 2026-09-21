/**
 * AI Chat Endpoint
 * Vercel Serverless Function
 * Handles all AI chat and job analysis requests
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { routeQuery } from './_lib/router';
import { AgentFactory } from './_lib/agents';
import {
  trackAIGeneration,
  shutdownAnalytics,
  newTraceId,
} from './_lib/analytics';
import { GEMINI_MODEL, GEMINI_PROVIDER } from './_lib/gemini';
import { checkRateLimit } from './_lib/rateLimit';

const agentFactory = new AgentFactory();

function getHeader(req: VercelRequest, name: string): string | undefined {
  const value = req.headers[name];
  return Array.isArray(value) ? value[0] : value;
}

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
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, X-PostHog-Distinct-ID, X-PostHog-Session-ID'
  );

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
  const traceId = newTraceId();
  const distinctId = getHeader(req, 'x-posthog-distinct-id');
  const sessionId = getHeader(req, 'x-posthog-session-id');

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

    console.log(`[Chat] Query: "${message.substring(0, 100)}..."`);

    // Route query to appropriate agent
    const agentType = await routeQuery(message);
    console.log(`[Chat] Routed to: ${agentType}`);

    // Process query with selected agent
    const result = await agentFactory.processQuery(agentType, message, context);

    // Calculate response time
    const responseTime = Date.now() - startTime;
    result.processing_time = responseTime;

    trackAIGeneration({
      distinctId,
      sessionId,
      traceId,
      model: result.llm?.model ?? GEMINI_MODEL,
      provider: result.llm?.provider ?? GEMINI_PROVIDER,
      // Prefer the measured LLM latency; fall back to whole-request time.
      latencyMs: result.llm?.latencyMs ?? responseTime,
      inputTokens: result.llm?.inputTokens,
      outputTokens: result.llm?.outputTokens,
      inputLength: message.length,
      outputLength: result.response?.length,
      agent: agentType,
      isError: Boolean(result.error),
      errorMessage: result.error,
      degraded: Boolean(result.degraded),
    });

    console.log(
      `[Chat] Response generated in ${responseTime}ms${result.degraded ? ' (DEGRADED)' : ''}`
    );

    // Return response
    return res.status(200).json(result);

  } catch (error: any) {
    console.error('[Chat] Error:', error);

    const responseTime = Date.now() - startTime;

    // Track error
    trackAIGeneration({
      distinctId,
      sessionId,
      traceId,
      model: GEMINI_MODEL,
      provider: GEMINI_PROVIDER,
      latencyMs: responseTime,
      inputLength:
        typeof req.body?.message === 'string' ? req.body.message.length : undefined,
      agent: 'error',
      isError: true,
      errorMessage: error?.message,
      degraded: true,
    });

    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred processing your request',
      response: "I'm experiencing technical difficulties. Please try again in a moment.",
      agent_used: 'Error Handler',
      degraded: true,
      error_kind: 'handler_exception',
      processing_time: responseTime,
      timestamp: new Date().toISOString()
    });
  } finally {
    // Vercel freezes the process as soon as the response is sent, so buffered
    // events are lost unless they are flushed here, on both paths.
    await shutdownAnalytics();
  }
}
