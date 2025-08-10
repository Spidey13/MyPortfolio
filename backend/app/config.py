"""
Configuration management for the AI Portfolio Backend
"""

import os
import logging
from pathlib import Path
from typing import List
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Get the directory where this config file is located (backend/app/)
current_dir = Path(__file__).parent
backend_dir = current_dir.parent  # backend/
project_root = backend_dir.parent  # Portfolio/

# Try to load .env from multiple locations (in order of preference):
# 1. Backend directory (backend/.env)
# 2. Project root directory (Portfolio/.env)
# 3. Current working directory (.env)
env_locations = [backend_dir / ".env", project_root / ".env", Path(".env")]

loaded_env_path = None
for env_path in env_locations:
    if env_path.exists():
        # Load with dotenv first
        result = load_dotenv(env_path)

        # Check for BOM and handle manually if needed
        try:
            with open(env_path, "rb") as f:
                raw_bytes = f.read()
                has_bom = raw_bytes.startswith(b"\xef\xbb\xbf")

            if has_bom:
                with open(
                    env_path, "r", encoding="utf-8-sig"
                ) as f:  # utf-8-sig handles BOM
                    for line_num, line in enumerate(f, 1):
                        line = line.strip()
                        if line and "=" in line and not line.startswith("#"):
                            key, value = line.split("=", 1)
                            key = key.strip()
                            value = value.strip()
                            # Remove any remaining BOM characters
                            key = key.lstrip("\ufeff")
                            os.environ[key] = value
        except Exception:
            pass  # Silent error handling

        loaded_env_path = env_path
        break

# Only show a single status line
google_api_status = "[OK]" if os.getenv("GOOGLE_API_KEY") else "[FAIL]"
print(
    f"Config: API Key {google_api_status} | Model: {os.getenv('GOOGLE_MODEL', 'gemini-2.0-flash')}"
)


class Settings(BaseModel):
    """Application settings"""

    # Google Gemini Configuration
    google_api_key: str = Field(
        default_factory=lambda: os.getenv("GOOGLE_API_KEY", ""),
        description="Google Gemini API key",
    )
    google_model: str = Field(
        default_factory=lambda: os.getenv("GOOGLE_MODEL", "gemini-2.0-flash"),
        description="Google model to use",
    )

    # LangChain Configuration (Core framework - no external API needed)
    # Note: We use LangChain for AI agent orchestration, not LangSmith observability

    # FastAPI Configuration
    cors_origins: List[str] = Field(
        default_factory=lambda: _get_cors_origins(),
        description="Allowed CORS origins",
    )
    debug: bool = Field(
        default_factory=lambda: os.getenv("DEBUG", "true").lower() == "true",
        description="Enable debug mode",
    )

    # Server Configuration
    host: str = Field(default="0.0.0.0", description="Server host")
    port: int = Field(default=8000, description="Server port")

    # Performance Configuration
    max_request_size: int = Field(
        default=10 * 1024 * 1024, description="Max request size in bytes"
    )  # 10MB
    request_timeout: int = Field(default=30, description="Request timeout in seconds")

    # Security Configuration
    rate_limit_requests: int = Field(
        default=100, description="Rate limit requests per minute"
    )
    rate_limit_window: int = Field(
        default=60, description="Rate limit window in seconds"
    )

    # Portfolio Configuration
    portfolio_owner: str = Field(
        default="Prathamesh Pravin More", description="Portfolio owner name"
    )
    portfolio_title: str = Field(
        default="AI/ML Engineer & Data Scientist", description="Portfolio title"
    )

    # Logging Configuration
    log_level: str = Field(default="INFO", description="Logging level")
    log_format: str = Field(
        default="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        description="Log format (legacy - now using structured JSON)",
    )
    log_to_file: bool = Field(default=True, description="Enable file logging")
    log_rotation_size: int = Field(
        default=10 * 1024 * 1024, description="Log file rotation size in bytes"
    )
    log_retention_days: int = Field(
        default=30, description="Log retention period in days"
    )

    @property
    def is_production(self) -> bool:
        """Check if running in production mode"""
        return not self.debug

    @property
    def has_google_api(self) -> bool:
        """Check if Google API is configured"""
        return bool(self.google_api_key)

    @property
    def has_langchain_api(self) -> bool:
        """Check if LangChain is available (always true since we use core framework)"""
        return True


# Global settings instance
settings = Settings()


# Note: Logging is now configured in app/logger.py using structured logging
# This legacy setup_logging function is kept for compatibility but not used

# Simplified status logging
logger = logging.getLogger(__name__)
api_status = "[OK]" if settings.has_google_api else "[FAIL]"
debug_status = "[DEV]" if settings.debug else "[PROD]"
logger.info(
    f"{debug_status} Portfolio Backend | API: {api_status} | Model: {settings.google_model} | LangChain: [OK]"
)
if settings.debug:
    logger.info(f"CORS: {', '.join(settings.cors_origins)}")


def _get_cors_origins() -> List[str]:
    """Get CORS origins from environment variable or use defaults"""
    cors_env = os.getenv("CORS_ORIGINS")
    if cors_env:
        try:
            # Parse JSON array from environment variable
            import json

            origins = json.loads(cors_env)
            if isinstance(origins, list):
                return origins
        except (json.JSONDecodeError, TypeError):
            # Fallback: split by comma if it's a comma-separated string
            origins = [
                origin.strip() for origin in cors_env.split(",") if origin.strip()
            ]
            if origins:
                return origins

    # Default origins for development
    return ["http://localhost:5173", "http://localhost:3000"]


def get_settings() -> Settings:
    """Get application settings"""
    return settings
