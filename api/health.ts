/**
 * Health Check Endpoint
 * Vercel Serverless Function
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'AI Portfolio Backend',
      version: '2.0.0',
      ai: {
        gemini: !!process.env.GEMINI_API_KEY,
        posthog: !!process.env.POSTHOG_API_KEY
      },
      uptime: process.uptime(),
      memory: process.memoryUsage()
    };

    res.status(200).json(health);
  } catch (error: any) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
