"""
Analytics service for tracking events and AI interactions
Integrates with Turso database and PostHog for comprehensive analytics
"""

import logging
import hashlib
import json
from typing import Dict, Any, Optional
from datetime import datetime
import asyncio
from functools import wraps

logger = logging.getLogger(__name__)

# Try to import PostHog
try:
    from posthog import Posthog
    POSTHOG_AVAILABLE = True
except ImportError:
    POSTHOG_AVAILABLE = False
    logger.warning("PostHog not installed. Run: pip install posthog")

from .config import get_settings
from .database import get_database

settings = get_settings()


class AnalyticsService:
    """Service for logging analytics events to database and PostHog"""
    
    def __init__(self):
        self.db = get_database()
        self.posthog = None
        
        # Initialize PostHog if enabled and available
        if settings.posthog_enabled and settings.posthog_api_key and POSTHOG_AVAILABLE:
            try:
                self.posthog = Posthog(
                    api_key=settings.posthog_api_key,
                    host=settings.posthog_host
                )
                logger.info("✅ PostHog analytics initialized")
            except Exception as e:
                logger.error(f"Failed to initialize PostHog: {e}")
                self.posthog = None
        elif not settings.posthog_enabled:
            logger.info("ℹ️  PostHog analytics disabled in settings")
        else:
            logger.warning("⚠️  PostHog not configured properly")
    
    def _send_to_posthog(self, event_name: str, distinct_id: str, properties: Dict[str, Any]):
        """Send event to PostHog (non-blocking)"""
        if not self.posthog:
            return
        
        try:
            self.posthog.capture(
                distinct_id=distinct_id,
                event=event_name,
                properties=properties
            )
        except Exception as e:
            logger.error(f"Error sending to PostHog: {e}")
    
    def generate_query_hash(self, query: str) -> str:
        """Generate a hash for caching purposes"""
        return hashlib.md5(query.lower().strip().encode()).hexdigest()
    
    # ============================================================================
    # EVENT LOGGING
    # ============================================================================
    
    def log_event(
        self,
        session_id: str,
        event_type: str,
        event_data: Optional[Dict[str, Any]] = None,
        user_agent: Optional[str] = None
    ):
        """
        Log a general analytics event
        
        Args:
            session_id: Unique session identifier
            event_type: Type of event (e.g., 'page_view', 'project_clicked')
            event_data: Additional event metadata
            user_agent: User agent string
        """
        # Log to database
        if self.db.is_available():
            self.db.log_analytics_event(
                session_id=session_id,
                event_type=event_type,
                event_data=event_data,
                user_agent=user_agent
            )
        
        # Send to PostHog
        if self.posthog:
            properties = event_data or {}
            properties["user_agent"] = user_agent
            self._send_to_posthog(
                event_name=event_type,
                distinct_id=session_id,
                properties=properties
            )
    
    def log_ai_query(
        self,
        session_id: str,
        query_text: str,
        agent_used: str,
        response_time: float,
        tokens_used: Optional[int] = None,
        cached: bool = False,
        error_occurred: bool = False,
        error_message: Optional[str] = None
    ) -> Optional[int]:
        """
        Log an AI query interaction
        
        Args:
            session_id: Unique session identifier
            query_text: The user's query
            agent_used: Which agent processed the query
            response_time: Response time in seconds
            tokens_used: Number of tokens consumed
            cached: Whether response was cached
            error_occurred: Whether an error occurred
            error_message: Error message if applicable
            
        Returns:
            Query ID from database (if available)
        """
        query_id = None
        
        # Log to database
        if self.db.is_available():
            query_id = self.db.log_ai_query(
                session_id=session_id,
                query_text=query_text,
                agent_used=agent_used,
                response_time=response_time,
                tokens_used=tokens_used,
                cached=cached,
                error_occurred=error_occurred,
                error_message=error_message
            )
        
        # Send to PostHog
        if self.posthog:
            self._send_to_posthog(
                event_name="ai_query",
                distinct_id=session_id,
                properties={
                    "agent_used": agent_used,
                    "response_time": response_time,
                    "tokens_used": tokens_used,
                    "cached": cached,
                    "error_occurred": error_occurred,
                    "query_length": len(query_text),
                    "query_hash": self.generate_query_hash(query_text)
                }
            )
        
        return query_id
    
    def log_cache_hit(self, query: str):
        """Log a cache hit"""
        query_hash = self.generate_query_hash(query)
        
        if self.db.is_available():
            self.db.update_cache_performance(query_hash, hit=True)
        
        if self.posthog:
            self._send_to_posthog(
                event_name="cache_hit",
                distinct_id="system",
                properties={"query_hash": query_hash}
            )
    
    def log_cache_miss(self, query: str):
        """Log a cache miss"""
        query_hash = self.generate_query_hash(query)
        
        if self.db.is_available():
            self.db.update_cache_performance(query_hash, hit=False)
        
        if self.posthog:
            self._send_to_posthog(
                event_name="cache_miss",
                distinct_id="system",
                properties={"query_hash": query_hash}
            )
    
    # ============================================================================
    # SPECIFIC EVENT TYPES
    # ============================================================================
    
    def log_job_analysis(
        self,
        session_id: str,
        match_score: int,
        processing_time: float,
        job_description_length: int
    ):
        """Log a job analysis event"""
        self.log_event(
            session_id=session_id,
            event_type="job_analysis",
            event_data={
                "match_score": match_score,
                "processing_time": processing_time,
                "job_description_length": job_description_length
            }
        )
    
    def log_project_view(
        self,
        session_id: str,
        project_id: str,
        project_title: str
    ):
        """Log a project view event"""
        self.log_event(
            session_id=session_id,
            event_type="project_viewed",
            event_data={
                "project_id": project_id,
                "project_title": project_title
            }
        )
    
    def log_contact_action(
        self,
        session_id: str,
        contact_method: str
    ):
        """Log a contact action event"""
        self.log_event(
            session_id=session_id,
            event_type="contact_initiated",
            event_data={"method": contact_method}
        )
    
    # ============================================================================
    # ANALYTICS QUERIES
    # ============================================================================
    
    def get_query_analytics(
        self,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        agent: Optional[str] = None
    ) -> Dict[str, Any]:
        """Get analytics for AI queries"""
        if not self.db.is_available():
            return {}
        
        return self.db.get_query_analytics(
            start_date=start_date,
            end_date=end_date,
            agent=agent
        )
    
    def get_cache_analytics(self) -> Dict[str, Any]:
        """Get cache performance analytics"""
        if not self.db.is_available():
            return {}
        
        return self.db.get_cache_analytics()
    
    def shutdown(self):
        """Shutdown analytics service"""
        if self.posthog:
            try:
                self.posthog.shutdown()
                logger.info("PostHog client shut down")
            except Exception as e:
                logger.error(f"Error shutting down PostHog: {e}")


# Global analytics service instance
_analytics_service: Optional[AnalyticsService] = None


def get_analytics_service() -> AnalyticsService:
    """Get the global analytics service instance"""
    global _analytics_service
    if _analytics_service is None:
        _analytics_service = AnalyticsService()
    return _analytics_service


# ============================================================================
# DECORATOR FOR TRACKING AI CALLS
# ============================================================================

def track_ai_call(agent_name: str):
    """
    Decorator to automatically track AI agent calls
    
    Usage:
        @track_ai_call("ProfileAgent")
        def process_query(self, query: str, context: Dict = None):
            ...
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            import time
            start_time = time.time()
            
            # Get session_id from context if available
            context = kwargs.get('context', {})
            session_id = context.get('session_id', 'unknown')
            
            # Get query text
            query = args[1] if len(args) > 1 else kwargs.get('query', 'unknown')
            
            error_occurred = False
            error_message = None
            
            try:
                result = func(*args, **kwargs)
                response_time = time.time() - start_time
                
                # Extract tokens if available
                tokens_used = result.get('tokens_used') if isinstance(result, dict) else None
                cached = result.get('cached', False) if isinstance(result, dict) else False
                
                # Log the call
                analytics = get_analytics_service()
                analytics.log_ai_query(
                    session_id=session_id,
                    query_text=str(query)[:500],  # Truncate long queries
                    agent_used=agent_name,
                    response_time=response_time,
                    tokens_used=tokens_used,
                    cached=cached,
                    error_occurred=False
                )
                
                return result
                
            except Exception as e:
                response_time = time.time() - start_time
                error_occurred = True
                error_message = str(e)
                
                # Log the error
                analytics = get_analytics_service()
                analytics.log_ai_query(
                    session_id=session_id,
                    query_text=str(query)[:500],
                    agent_used=agent_name,
                    response_time=response_time,
                    error_occurred=True,
                    error_message=error_message
                )
                
                raise
        
        return wrapper
    return decorator
