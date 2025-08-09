from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
import uvicorn
import logging
from typing import Optional, Dict, Any
from datetime import datetime

# Import our custom modules
from app.config import get_settings
from app.agents import router
from app.services import PortfolioService
from app.portfolio_loader import get_raw_portfolio_data
from app.middleware import (
    ErrorHandlingMiddleware,
    RateLimitMiddleware,
    SecurityMiddleware,
    RequestValidationMiddleware,
    MonitoringMiddleware,
    get_monitoring_metrics,
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get settings
settings = get_settings()

# Initialize FastAPI app
app = FastAPI(
    title="AI Portfolio Backend",
    description="Backend for the AI-Powered Portfolio Website - The Conversational Canvas",
    version="1.0.0",
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
)

# Add custom middleware in order
app.add_middleware(ErrorHandlingMiddleware)
app.add_middleware(
    RateLimitMiddleware, requests_per_minute=settings.rate_limit_requests
)
app.add_middleware(SecurityMiddleware)
app.add_middleware(
    RequestValidationMiddleware, max_request_size=settings.max_request_size
)
app.add_middleware(MonitoringMiddleware)

# Configure CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
portfolio_service = PortfolioService()


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler for unhandled exceptions"""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred",
            "timestamp": datetime.utcnow().isoformat(),
            "path": str(request.url.path),
        },
    )


# Pydantic models with enhanced validation
class MessageRequest(BaseModel):
    message: str = Field(
        ..., min_length=1, max_length=10000, description="User message"
    )
    context: Optional[Dict[str, Any]] = Field(
        default=None, description="Additional context"
    )


class MessageResponse(BaseModel):
    response: str = Field(..., description="AI response")
    viewport_content: Optional[Dict[str, Any]] = Field(
        default=None, description="Viewport content"
    )
    agent_used: Optional[str] = Field(
        default=None, description="Agent used for processing"
    )


class ResumeResponse(BaseModel):
    profile: Dict[str, Any] = Field(..., description="Profile information")
    experience: list = Field(..., description="Work experience")
    projects: list = Field(..., description="Projects")
    skills: Dict[str, Any] = Field(..., description="Skills information")
    publications: list = Field(..., description="Publications")


class HealthResponse(BaseModel):
    status: str = Field(..., description="Service status")
    message: str = Field(..., description="Status message")
    google_api_configured: bool = Field(
        ..., description="Google API configuration status"
    )
    langchain_configured: bool = Field(
        ..., description="LangChain configuration status"
    )
    uptime: str = Field(..., description="Service uptime")
    version: str = Field(..., description="API version")


class MetricsResponse(BaseModel):
    total_requests: int = Field(..., description="Total requests processed")
    total_errors: int = Field(..., description="Total errors encountered")
    error_rate: float = Field(..., description="Error rate percentage")
    avg_response_time: float = Field(
        ..., description="Average response time in seconds"
    )
    min_response_time: float = Field(
        ..., description="Minimum response time in seconds"
    )
    max_response_time: float = Field(
        ..., description="Maximum response time in seconds"
    )


# Track startup time
startup_time = datetime.utcnow()


@app.get("/", response_model=Dict[str, str])
async def root():
    """Root endpoint for health check"""
    return {
        "message": "AI Portfolio Backend - The Conversational Canvas",
        "status": "running",
        "version": "1.0.0",
        "owner": settings.portfolio_owner,
        "title": settings.portfolio_title,
    }


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Enhanced health check endpoint"""
    uptime = datetime.utcnow() - startup_time

    return HealthResponse(
        status="healthy",
        message="Backend is running successfully! ✨",
        google_api_configured=settings.has_google_api,
        langchain_configured=settings.has_langchain_api,
        uptime=str(uptime),
        version="1.0.0",
    )


@app.get("/metrics", response_model=MetricsResponse)
async def get_metrics():
    """Get application metrics"""
    metrics = get_monitoring_metrics()
    return MetricsResponse(**metrics)


@app.get("/api/v1/resume", response_model=ResumeResponse)
async def get_resume():
    """
    Get structured resume data for the portfolio
    """
    try:
        logger.info("Fetching resume data")
        portfolio_data = portfolio_service.get_complete_portfolio_data()

        # Validate required fields
        required_fields = [
            "profile",
            "experience",
            "projects",
            "skills",
            "publications",
        ]
        missing_fields = [
            field for field in required_fields if field not in portfolio_data
        ]

        if missing_fields:
            logger.error(f"Missing required fields in portfolio data: {missing_fields}")
            raise HTTPException(
                status_code=500,
                detail=f"Invalid portfolio data structure. Missing: {missing_fields}",
            )

        logger.info("Resume data fetched successfully")
        return ResumeResponse(
            profile=portfolio_data["profile"],
            experience=portfolio_data["experience"],
            projects=portfolio_data["projects"],
            skills=portfolio_data["skills"],
            publications=portfolio_data["publications"],
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving resume data: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500, detail=f"Error retrieving resume data: {str(e)}"
        )


@app.post("/api/v1/chat", response_model=MessageResponse)
async def chat_endpoint(request: MessageRequest):
    """
    Main chat endpoint for processing conversational commands using LangChain agents
    """
    try:
        user_message = request.message.strip()
        context = request.context or {}

        logger.info(f"Processing chat request: {user_message[:100]}...")

        if not user_message:
            logger.warning("Empty message received")
            return MessageResponse(
                response="Please provide a message for me to process.",
                viewport_content={"type": "error", "message": "Empty message"},
            )

        # Validate message length
        if len(user_message) > 10000:
            logger.warning(f"Message too long: {len(user_message)} characters")
            return MessageResponse(
                response="Message is too long. Please keep it under 10,000 characters.",
                viewport_content={"type": "error", "message": "Message too long"},
            )

        # Process through LangChain router agent
        result = router.process_query(user_message, context)

        response_text = result.get(
            "response", "I apologize, but I couldn't process your request."
        )
        agent_used = result.get("agent_used", "unknown")

        logger.info(f"Chat processed successfully by {agent_used}")

        return MessageResponse(
            response=response_text,
            viewport_content=result.get("viewport_content"),
            agent_used=agent_used,
        )

    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}", exc_info=True)
        return MessageResponse(
            response=f"I encountered an error while processing your request: {str(e)}",
            viewport_content={"type": "error", "message": str(e)},
            agent_used="error",
        )


@app.get("/api/v1/profile")
async def get_profile():
    """Get profile data"""
    try:
        logger.info("Fetching profile data")
        return portfolio_service.resume_service.get_profile_data()
    except Exception as e:
        logger.error(f"Error retrieving profile data: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/projects")
async def get_projects():
    """Get projects data"""
    try:
        logger.info("Fetching projects data")
        return portfolio_service.resume_service.get_projects_data()
    except Exception as e:
        logger.error(f"Error retrieving projects data: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/experience")
async def get_experience():
    """Get experience data"""
    try:
        logger.info("Fetching experience data")
        return portfolio_service.resume_service.get_experience_data()
    except Exception as e:
        logger.error(f"Error retrieving experience data: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/skills")
async def get_skills():
    """Get skills data"""
    try:
        logger.info("Fetching skills data")
        return portfolio_service.resume_service.get_skills_data()
    except Exception as e:
        logger.error(f"Error retrieving skills data: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/publications")
async def get_publications():
    """Get publications data"""
    try:
        logger.info("Fetching publications data")
        return portfolio_service.resume_service.get_publications_data()
    except Exception as e:
        logger.error(f"Error retrieving publications data: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/portfolio-data")
async def get_portfolio_data():
    """Get complete portfolio data from the centralized JSON source"""
    try:
        logger.info("Fetching complete portfolio data")
        portfolio_data = get_raw_portfolio_data()
        logger.info(f"Portfolio data fetched successfully: {len(portfolio_data.get('projects', []))} projects")
        return portfolio_data
    except Exception as e:
        logger.error(f"Error retrieving portfolio data: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving portfolio data: {str(e)}"
        )


# Demo endpoints placeholder
@app.get("/api/v1/demo/{project_id}")
async def get_demo_info(project_id: int):
    """
    Get demo information for a specific project
    This endpoint will be enhanced to serve or proxy live demos
    """
    try:
        logger.info(f"Fetching demo info for project {project_id}")
        projects = portfolio_service.resume_service.get_projects_data()
        project = next((p for p in projects if p["id"] == project_id), None)

        if not project:
            logger.warning(f"Project {project_id} not found")
            raise HTTPException(status_code=404, detail="Project not found")

        return {
            "project_id": project_id,
            "title": project["title"],
            "demo_urls": project.get("demoUrls", []),
            "github_url": project.get("githubUrl", ""),
            "status": "available",
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(
            f"Error retrieving demo info for project {project_id}: {str(e)}",
            exc_info=True,
        )
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    mode = "[DEV]" if settings.debug else "[PROD]"
    logger.info(f"{mode} Starting on {settings.host}:{settings.port}")

    # Use import string for reload functionality
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        reload_dirs=["app"],  # Only watch the app directory (relative to backend/)
        log_level="info" if settings.debug else "warning",
    )
