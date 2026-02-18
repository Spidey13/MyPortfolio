"""
Vercel Serverless Handler for FastAPI Application
This file adapts the FastAPI app for Vercel's serverless environment
"""

import sys
from pathlib import Path

# Add parent directory to path so we can import from app/
backend_path = Path(__file__).parent.parent
sys.path.insert(0, str(backend_path))

# Import the FastAPI app
from main import app

# Export the FastAPI app as 'app' for Vercel
# Vercel will automatically handle the ASGI interface
__all__ = ["app"]
