/**
 * Development Server for API Functions
 * Runs Vercel serverless functions locally on port 3001
 */

// MUST load .env BEFORE any other imports
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import type { Request, Response } from 'express';
import chatHandler from './api/chat.js';
import healthHandler from './api/health.js';

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS for development
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Convert Express req/res to Vercel Request/Response format
function createVercelRequest(req: Request): any {
  return {
    method: req.method,
    headers: req.headers,
    body: req.body,
    query: req.query,
    url: req.url,
  };
}

function createVercelResponse(res: Response): any {
  const vercelRes = {
    status: (code: number) => {
      res.status(code);
      return vercelRes;
    },
    json: (data: any) => {
      res.json(data);
      return vercelRes;
    },
    send: (data: any) => {
      res.send(data);
      return vercelRes;
    },
    setHeader: (key: string, value: string) => {
      res.setHeader(key, value);
      return vercelRes;
    },
    end: () => {
      res.end();
      return vercelRes;
    },
  };
  
  return vercelRes;
}

// API Routes
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const vercelReq = createVercelRequest(req);
    const vercelRes = createVercelResponse(res);
    await chatHandler(vercelReq, vercelRes);
  } catch (error) {
    console.error('[Dev Server] Chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/health', async (req: Request, res: Response) => {
  try {
    const vercelReq = createVercelRequest(req);
    const vercelRes = createVercelResponse(res);
    await healthHandler(vercelReq, vercelRes);
  } catch (error) {
    console.error('[Dev Server] Health check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 API Dev Server running on http://localhost:${PORT}`);
  console.log(`   - POST http://localhost:${PORT}/api/chat`);
  console.log(`   - GET  http://localhost:${PORT}/api/health\n`);
});
