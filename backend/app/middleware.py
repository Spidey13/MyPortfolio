"""
Middleware for the AI Portfolio Backend
Includes error handling, rate limiting, security, and monitoring
"""

import time
import logging
from typing import Dict, Any, Optional
from fastapi import Request, Response, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp
import json
from collections import defaultdict
import asyncio
from datetime import datetime, timedelta

from .logger import (
    logger,
    performance_logger,
    security_logger,
    set_request_id,
    clear_context,
)


class ErrorHandlingMiddleware(BaseHTTPMiddleware):
    """Comprehensive error handling middleware"""

    def __init__(self, app: ASGIApp):
        super().__init__(app)

    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        request_id = set_request_id()

        # Get client IP
        client_ip = request.client.host if request.client else "unknown"

        try:
            # Log structured request
            logger.info(
                "Request started",
                method=request.method,
                path=str(request.url.path),
                query_params=str(request.url.query) if request.url.query else None,
                client_ip=client_ip,
                user_agent=request.headers.get("user-agent", "unknown"),
            )

            response = await call_next(request)

            # Calculate processing time
            process_time = time.time() - start_time

            # Log structured response
            performance_logger.api_request(
                method=request.method,
                path=str(request.url.path),
                duration=process_time,
                status_code=response.status_code,
                client_ip=client_ip,
            )

            # Add timing header
            response.headers["X-Process-Time"] = str(process_time)
            response.headers["X-Request-ID"] = request_id

            return response

        except HTTPException as e:
            # Handle FastAPI HTTP exceptions
            process_time = time.time() - start_time

            logger.warning(
                "HTTP exception occurred",
                status_code=e.status_code,
                detail=e.detail,
                method=request.method,
                path=str(request.url.path),
                client_ip=client_ip,
                process_time_ms=round(process_time * 1000, 2),
            )

            return JSONResponse(
                status_code=e.status_code,
                content={
                    "error": "HTTP Error",
                    "message": e.detail,
                    "status_code": e.status_code,
                    "timestamp": datetime.utcnow().isoformat(),
                    "request_id": request_id,
                },
            )

        except Exception as e:
            # Handle unexpected exceptions
            process_time = time.time() - start_time

            logger.error(
                "Unexpected exception in middleware",
                exception_type=type(e).__name__,
                exception_message=str(e),
                method=request.method,
                path=str(request.url.path),
                client_ip=client_ip,
                process_time_ms=round(process_time * 1000, 2),
                exc_info=True,
            )

            return JSONResponse(
                status_code=500,
                content={
                    "error": "Internal Server Error",
                    "message": "An unexpected error occurred",
                    "status_code": 500,
                    "timestamp": datetime.utcnow().isoformat(),
                    "request_id": request_id,
                },
            )
        finally:
            clear_context()


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Rate limiting middleware"""

    def __init__(self, app: ASGIApp, requests_per_minute: int = 20):
        super().__init__(app)
        self.requests_per_minute = requests_per_minute
        self.requests: Dict[str, list] = defaultdict(list)
        self._lock = asyncio.Lock()

    async def dispatch(self, request: Request, call_next):
        # Get client IP
        client_ip = request.client.host if request.client else "unknown"

        async with self._lock:
            now = datetime.utcnow()
            window_start = now - timedelta(minutes=1)

            # Clean old requests
            self.requests[client_ip] = [
                req_time
                for req_time in self.requests[client_ip]
                if req_time > window_start
            ]

            # Check rate limit
            if len(self.requests[client_ip]) >= self.requests_per_minute:
                logger.warning(f"Rate limit exceeded for IP: {client_ip}")
                return JSONResponse(
                    status_code=429,
                    content={
                        "error": "Rate Limit Exceeded",
                        "message": f"Too many requests. Limit: {self.requests_per_minute} per minute",
                        "retry_after": 60,
                        "timestamp": now.isoformat(),
                    },
                )

            # Add current request
            self.requests[client_ip].append(now)

        return await call_next(request)


class SecurityMiddleware(BaseHTTPMiddleware):
    """Security middleware for headers and validation"""

    def __init__(self, app: ASGIApp):
        super().__init__(app)

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        # Add security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = (
            "geolocation=(), microphone=(), camera=()"
        )

        return response


class RequestValidationMiddleware(BaseHTTPMiddleware):
    """Request validation and sanitization middleware"""

    def __init__(self, app: ASGIApp, max_request_size: int = 10 * 1024 * 1024):
        super().__init__(app)
        self.max_request_size = max_request_size

    async def dispatch(self, request: Request, call_next):
        # Check request size
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > self.max_request_size:
            logger.warning(f"Request too large: {content_length} bytes")
            return JSONResponse(
                status_code=413,
                content={
                    "error": "Request Too Large",
                    "message": f"Request size exceeds limit of {self.max_request_size} bytes",
                    "timestamp": datetime.utcnow().isoformat(),
                },
            )

        # Validate content type for POST requests
        if request.method == "POST":
            content_type = request.headers.get("content-type", "")
            if not content_type.startswith("application/json"):
                logger.warning(f"Invalid content type: {content_type}")
                return JSONResponse(
                    status_code=400,
                    content={
                        "error": "Invalid Content Type",
                        "message": "Content-Type must be application/json",
                        "timestamp": datetime.utcnow().isoformat(),
                    },
                )

        return await call_next(request)


class MonitoringMiddleware(BaseHTTPMiddleware):
    """Monitoring and metrics middleware"""

    def __init__(self, app: ASGIApp):
        super().__init__(app)
        self.request_count = 0
        self.error_count = 0
        self.response_times = []
        self.total_tokens_used = 0
        self.total_llm_calls = 0

    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        self.request_count += 1

        try:
            response = await call_next(request)

            # Record response time
            process_time = time.time() - start_time
            self.response_times.append(process_time)

            # Keep only last 1000 response times
            if len(self.response_times) > 1000:
                self.response_times = self.response_times[-1000:]

            # Add metrics headers
            response.headers["X-Request-Count"] = str(self.request_count)
            response.headers["X-Error-Count"] = str(self.error_count)
            response.headers["X-Avg-Response-Time"] = str(
                sum(self.response_times) / len(self.response_times)
                if self.response_times
                else 0
            )

            return response

        except Exception as e:
            self.error_count += 1
            raise e

    def get_metrics(self) -> Dict[str, Any]:
        """Get current metrics"""
        return {
            "total_requests": self.request_count,
            "total_errors": self.error_count,
            "error_rate": self.error_count / self.request_count
            if self.request_count > 0
            else 0,
            "avg_response_time": sum(self.response_times) / len(self.response_times)
            if self.response_times
            else 0,
            "min_response_time": min(self.response_times) if self.response_times else 0,
            "max_response_time": max(self.response_times) if self.response_times else 0,
            "total_tokens_used": self.total_tokens_used,
            "total_llm_calls": self.total_llm_calls,
            "avg_tokens_per_call": self.total_tokens_used / self.total_llm_calls
            if self.total_llm_calls > 0
            else 0,
        }


# Global monitoring instance
monitoring_middleware = MonitoringMiddleware(None)


def get_monitoring_metrics() -> Dict[str, Any]:
    """Get monitoring metrics"""
    return monitoring_middleware.get_metrics()


def track_tokens(tokens: int):
    """Track token usage for monitoring"""
    monitoring_middleware.total_tokens_used += tokens
    monitoring_middleware.total_llm_calls += 1
