"""
Professional Structured Logging System for AI Portfolio Backend
Features: JSON formatting, request correlation, performance metrics, security events
"""

import logging
import json
import time
import uuid
from typing import Dict, Any, Optional
from datetime import datetime
from pathlib import Path
from contextvars import ContextVar
import structlog
from structlog.processors import TimeStamper, JSONRenderer
from structlog.stdlib import LoggerFactory, add_log_level
from logging.handlers import RotatingFileHandler
import sys
import os

from .config import get_settings

# Context variables for request correlation
request_id_context: ContextVar[Optional[str]] = ContextVar("request_id", default=None)
user_context: ContextVar[Optional[str]] = ContextVar("user_context", default=None)

settings = get_settings()


class RequestCorrelationProcessor:
    """Add request correlation ID to all logs"""

    def __call__(self, logger, method_name, event_dict):
        request_id = request_id_context.get()
        if request_id:
            event_dict["request_id"] = request_id

        user_id = user_context.get()
        if user_id:
            event_dict["user_id"] = user_id

        return event_dict


class SecurityEventFilter:
    """Filter and flag security-related events"""

    SECURITY_KEYWORDS = [
        "authentication",
        "authorization",
        "login",
        "failed",
        "rate_limit",
        "suspicious",
        "blocked",
        "attack",
        "unauthorized",
        "forbidden",
        "csrf",
        "xss",
    ]

    def __call__(self, logger, method_name, event_dict):
        message = str(event_dict.get("event", "")).lower()

        if any(keyword in message for keyword in self.SECURITY_KEYWORDS):
            event_dict["security_event"] = True
            event_dict["alert_level"] = "high" if "attack" in message else "medium"

        return event_dict


class PerformanceMetricsProcessor:
    """Add performance metrics to relevant logs"""

    def __call__(self, logger, method_name, event_dict):
        # Add system timestamp
        event_dict["timestamp"] = datetime.utcnow().isoformat()

        # Add environment info
        event_dict["environment"] = (
            "production" if not settings.debug else "development"
        )
        event_dict["service"] = "portfolio-backend"
        event_dict["version"] = "1.0.0"

        return event_dict


def setup_structured_logging():
    """Setup professional structured logging with JSON output"""

    # Create logs directory
    logs_dir = Path(__file__).parent.parent / "logs"
    logs_dir.mkdir(exist_ok=True)

    # Configure structlog
    structlog.configure(
        processors=[
            structlog.stdlib.filter_by_level,
            RequestCorrelationProcessor(),
            SecurityEventFilter(),
            PerformanceMetricsProcessor(),
            add_log_level,
            TimeStamper(fmt="ISO", utc=True),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            JSONRenderer(),
        ],
        context_class=dict,
        logger_factory=LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )

    # Configure standard library logging
    logging.basicConfig(
        format="%(message)s",
        stream=sys.stdout,
        level=getattr(logging, settings.log_level.upper(), logging.INFO),
    )

    # Create file handlers with rotation
    file_handler = RotatingFileHandler(
        logs_dir / "app.jsonl",
        maxBytes=10 * 1024 * 1024,  # 10MB
        backupCount=5,
        encoding="utf-8",
    )
    file_handler.setLevel(logging.INFO)

    # Error-specific log file
    error_handler = RotatingFileHandler(
        logs_dir / "errors.jsonl",
        maxBytes=5 * 1024 * 1024,  # 5MB
        backupCount=3,
        encoding="utf-8",
    )
    error_handler.setLevel(logging.ERROR)

    # Security events log file
    security_handler = RotatingFileHandler(
        logs_dir / "security.jsonl",
        maxBytes=5 * 1024 * 1024,  # 5MB
        backupCount=10,  # Keep more security logs
        encoding="utf-8",
    )
    security_handler.setLevel(logging.WARNING)

    # Add handlers to root logger
    root_logger = logging.getLogger()
    root_logger.addHandler(file_handler)
    root_logger.addHandler(error_handler)
    root_logger.addHandler(security_handler)

    # Configure external library loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.error").setLevel(logging.INFO)
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("httpcore").setLevel(logging.WARNING)

    return structlog.get_logger("portfolio-backend")


class SecurityLogger:
    """Specialized logger for security events"""

    def __init__(self):
        self.logger = structlog.get_logger("security")

    def auth_failure(self, ip_address: str, reason: str, **kwargs):
        """Log authentication failures"""
        self.logger.warning(
            "Authentication failure",
            ip_address=ip_address,
            reason=reason,
            security_event=True,
            event_type="auth_failure",
            **kwargs,
        )

    def rate_limit_exceeded(self, ip_address: str, endpoint: str, **kwargs):
        """Log rate limit violations"""
        self.logger.warning(
            "Rate limit exceeded",
            ip_address=ip_address,
            endpoint=endpoint,
            security_event=True,
            event_type="rate_limit",
            **kwargs,
        )

    def suspicious_activity(self, ip_address: str, activity: str, **kwargs):
        """Log suspicious activities"""
        self.logger.error(
            "Suspicious activity detected",
            ip_address=ip_address,
            activity=activity,
            security_event=True,
            event_type="suspicious",
            alert_level="high",
            **kwargs,
        )


class PerformanceLogger:
    """Specialized logger for performance metrics"""

    def __init__(self):
        self.logger = structlog.get_logger("performance")

    def api_request(
        self, method: str, path: str, duration: float, status_code: int, **kwargs
    ):
        """Log API request performance"""
        self.logger.info(
            "API request completed",
            method=method,
            path=path,
            duration_ms=round(duration * 1000, 2),
            status_code=status_code,
            event_type="api_request",
            **kwargs,
        )

    def ai_processing(self, agent: str, duration: float, success: bool, **kwargs):
        """Log AI processing performance"""
        level = "info" if success else "warning"
        getattr(self.logger, level)(
            "AI processing completed",
            agent=agent,
            duration_ms=round(duration * 1000, 2),
            success=success,
            event_type="ai_processing",
            **kwargs,
        )

    def slow_query(self, operation: str, duration: float, **kwargs):
        """Log slow operations"""
        self.logger.warning(
            "Slow operation detected",
            operation=operation,
            duration_ms=round(duration * 1000, 2),
            event_type="slow_operation",
            **kwargs,
        )


# Convenience functions for request correlation
def set_request_id(request_id: str = None):
    """Set request ID for correlation"""
    if request_id is None:
        request_id = str(uuid.uuid4())[:8]
    request_id_context.set(request_id)
    return request_id


def set_user_context(user_id: str):
    """Set user context for correlation"""
    user_context.set(user_id)


def clear_context():
    """Clear all context variables"""
    request_id_context.set(None)
    user_context.set(None)


# Initialize logging system
logger = setup_structured_logging()
security_logger = SecurityLogger()
performance_logger = PerformanceLogger()

# Export commonly used loggers
__all__ = [
    "logger",
    "security_logger",
    "performance_logger",
    "set_request_id",
    "set_user_context",
    "clear_context",
]
