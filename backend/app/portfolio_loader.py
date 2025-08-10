"""
Portfolio data loader with validation and caching
"""

import json
import os
import logging
from typing import Dict, Any, Optional
from .models import PortfolioData

logger = logging.getLogger(__name__)


class PortfolioLoader:
    """Loads and validates portfolio data from JSON file"""

    def __init__(self, data_file: str = "app/data/portfolio_data.json"):
        self.data_file = data_file
        self._portfolio_data: Optional[PortfolioData] = None
        self._raw_data: Optional[Dict[str, Any]] = None
        self._load_and_validate()

    def _load_and_validate(self) -> None:
        """Load and validate portfolio data on initialization"""
        try:
            # Check if file exists
            if not os.path.exists(self.data_file):
                raise FileNotFoundError(
                    f"Portfolio data file not found: {self.data_file}"
                )

            # Load JSON data
            with open(self.data_file, "r", encoding="utf-8") as f:
                self._raw_data = json.load(f)

            # Validate using Pydantic model
            self._portfolio_data = PortfolioData(**self._raw_data)

            logger.info(
                f"✅ Portfolio data loaded and validated successfully from {self.data_file}"
            )
            logger.info(
                f"📊 Data summary: {len(self._portfolio_data.projects)} projects, "
                f"{len(self._portfolio_data.experience)} experiences, "
                f"{len(self._portfolio_data.publications)} publications"
            )

        except FileNotFoundError as e:
            logger.error(f"❌ Portfolio data file not found: {e}")
            raise
        except json.JSONDecodeError as e:
            logger.error(f"❌ Invalid JSON in portfolio data file: {e}")
            raise
        except Exception as e:
            logger.error(f"❌ Portfolio data validation failed: {e}")
            raise

    @property
    def portfolio_data(self) -> PortfolioData:
        """Get validated portfolio data"""
        if self._portfolio_data is None:
            raise RuntimeError("Portfolio data not loaded")
        return self._portfolio_data

    @property
    def raw_data(self) -> Dict[str, Any]:
        """Get raw portfolio data as dictionary"""
        if self._raw_data is None:
            raise RuntimeError("Portfolio data not loaded")
        return self._raw_data

    def get_profile_summary(self) -> str:
        """Get a formatted profile summary for AI agents"""
        profile = self.portfolio_data.profile
        return f"""
Name: {profile.name}
Title: {profile.title}
Summary: {profile.summary}
Location: {profile.location}
Education: {self.portfolio_data.education.degree} from {self.portfolio_data.education.university}

Key Highlights:
{chr(10).join([f"- {highlight}" for highlight in profile.highlights])}

Key Experience:
{chr(10).join([f"- {exp.role} at {exp.company}: {exp.star.situation[:100]}..." for exp in self.portfolio_data.experience])}

Featured Projects:
{chr(10).join([f"- {proj.title}: {proj.star.situation[:100]}..." for proj in self.portfolio_data.projects if proj.featured])}
"""

    def get_skills_summary(self) -> str:
        """Get a formatted skills summary for AI agents"""
        skills = self.portfolio_data.skills
        return f"""
Languages & Tools: {", ".join(skills.languages_and_tools)}
Databases: {", ".join(skills.databases)}
ML & NLP: {", ".join(skills.ml_and_nlp)}
Cloud & MLOps: {", ".join(skills.cloud_and_mlops)}
Visualization: {", ".join(skills.visualization)}
"""

    def get_core_competencies_summary(self) -> str:
        """Get a formatted core competencies summary for AI agents"""
        summary = "Core Competencies (from experience):\n"
        for exp in self.portfolio_data.experience:
            if exp.competencies:
                summary += f"\n{exp.role} at {exp.company}:\n"
                for comp in exp.competencies:
                    summary += f"- {comp}\n"
        return summary

    def get_soft_skills_summary(self) -> str:
        """Get a formatted soft skills summary for AI agents"""
        summary = "Soft Skills (from experience):\n"
        for exp in self.portfolio_data.experience:
            if exp.soft_skills:
                summary += f"\n{exp.role} at {exp.company}:\n"
                for skill in exp.soft_skills:
                    summary += f"- {skill}\n"
        return summary

    def get_projects_summary(self) -> str:
        """Get a formatted projects summary for AI agents"""
        projects = self.portfolio_data.projects
        return "\n\n".join(
            [
                f"Project: {proj.title}\n"
                f"Situation: {proj.star.situation}\n"
                f"Task: {proj.star.task}\n"
                f"Action: {proj.star.action}\n"
                f"Result: {proj.star.result}\n"
                f"Impact: {proj.star.impact}\n"
                f"Technologies: {', '.join(proj.technologies)}"
                for proj in projects
            ]
        )

    def reload(self) -> None:
        """Reload and revalidate portfolio data"""
        logger.info("🔄 Reloading portfolio data...")
        self._load_and_validate()


# Global portfolio loader instance
_portfolio_loader: Optional[PortfolioLoader] = None


def get_portfolio_loader() -> PortfolioLoader:
    """Get the global portfolio loader instance"""
    global _portfolio_loader
    if _portfolio_loader is None:
        _portfolio_loader = PortfolioLoader()
    return _portfolio_loader


def get_portfolio_data() -> PortfolioData:
    """Get validated portfolio data"""
    return get_portfolio_loader().portfolio_data


def get_raw_portfolio_data() -> Dict[str, Any]:
    """Get raw portfolio data as dictionary"""
    return get_portfolio_loader().raw_data
