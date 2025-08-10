"""
Pydantic models for portfolio data validation
"""

from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional, Dict, Any
from enum import Enum


class LinkType(str, Enum):
    github = "github"
    linkedin = "linkedin"
    publications = "publications"
    resume = "resume"
    website = "website"


class Link(BaseModel):
    type: LinkType
    url: str


class Profile(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    title: str = Field(..., min_length=1, max_length=200)
    summary: str = Field(..., min_length=10, max_length=1000)
    location: str = Field(..., min_length=1, max_length=200)
    email: str = Field(..., pattern=r"^[^@]+@[^@]+\.[^@]+$")
    highlights: List[str] = Field(..., min_items=1)
    links: List[Link] = Field(..., min_items=1)


class Education(BaseModel):
    degree: str = Field(..., min_length=1, max_length=200)
    university: str = Field(..., min_length=1, max_length=200)
    graduation: str = Field(..., min_length=4, max_length=4)
    gpa: Optional[str] = None
    coursework: List[str] = Field(default=[])


class StarFormat(BaseModel):
    situation: str = Field(..., min_length=10, max_length=1000)
    task: str = Field(..., min_length=10, max_length=1000)
    action: str = Field(..., min_length=10, max_length=2000)
    result: str = Field(..., min_length=10, max_length=1000)
    impact: str = Field(..., min_length=10, max_length=1000)
    architecture: str = Field(..., min_length=10, max_length=1000)


class Experience(BaseModel):
    id: int = Field(..., gt=0)
    role: str = Field(..., min_length=1, max_length=200)
    company: str = Field(..., min_length=1, max_length=200)
    duration: str = Field(..., min_length=1, max_length=100)
    location: str = Field(..., min_length=1, max_length=200)
    star: StarFormat
    technologies: List[str] = Field(..., min_items=1)
    competencies: Optional[List[str]] = Field(default=[])
    soft_skills: Optional[List[str]] = Field(default=[])


class ProjectMetrics(BaseModel):
    accuracy: Optional[str] = None
    data_points: Optional[str] = None
    performance: Optional[str] = None
    precision: Optional[str] = None
    processing_speed: Optional[str] = None
    defect_types: Optional[str] = None
    speed_improvement: Optional[str] = None
    uptime: Optional[str] = None
    automation: Optional[str] = None


class Project(BaseModel):
    id: str = Field(..., min_length=1, max_length=10)
    title: str = Field(..., min_length=1, max_length=200)
    github_url: str = Field(..., min_length=1)
    star: StarFormat
    technologies: List[str] = Field(..., min_items=1)
    featured: bool = Field(default=False)


class Skill(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    level: str = Field(..., pattern=r"^(Beginner|Intermediate|Advanced|Expert)$")
    years: Optional[int] = Field(None, ge=0, le=20)


class SkillCategory(BaseModel):
    name: str
    level: str


class CompetencyCategory(BaseModel):
    category: str = Field(..., min_length=1, max_length=100)
    skills: List[str] = Field(..., min_items=1)


class Skills(BaseModel):
    languages_and_tools: List[str] = Field(..., min_items=1)
    databases: List[str] = Field(..., min_items=1)
    ml_and_nlp: List[str] = Field(..., min_items=1)
    cloud_and_mlops: List[str] = Field(..., min_items=1)
    visualization: List[str] = Field(..., min_items=1)


class CoreCompetencies(BaseModel):
    technical_leadership: CompetencyCategory
    problem_solving: CompetencyCategory
    research_innovation: CompetencyCategory
    business_impact: CompetencyCategory


class SoftSkills(BaseModel):
    communication: CompetencyCategory
    adaptability: CompetencyCategory
    leadership: CompetencyCategory
    innovation: CompetencyCategory


class Publication(BaseModel):
    id: int = Field(..., gt=0)
    title: str = Field(..., min_length=1, max_length=300)
    outlet: str = Field(..., min_length=1, max_length=200)
    date: str = Field(..., min_length=1, max_length=50)
    related_project_id: Optional[str] = None


class PortfolioData(BaseModel):
    """Complete portfolio data model with validation"""

    profile: Profile
    education: Education
    experience: List[Experience] = Field(..., min_items=1)
    projects: List[Project] = Field(..., min_items=1)
    skills: Skills
    publications: List[Publication] = Field(..., min_items=1)

    class Config:
        extra = "forbid"  # Don't allow extra fields
        validate_assignment = True  # Validate on assignment


# Kanban and Analysis Models for AI responses
class KanbanCard(BaseModel):
    id: str
    title: str
    description: str
    score: str
    category: Optional[str] = None


class KanbanData(BaseModel):
    technicalSkills: List[KanbanCard] = Field(default=[])
    relevantExperience: List[KanbanCard] = Field(default=[])
    projectEvidence: List[KanbanCard] = Field(default=[])
    quantifiableImpact: List[KanbanCard] = Field(default=[])


class SummaryData(BaseModel):
    overallMatch: str
    matchPercentage: int = Field(..., ge=0, le=100)
    executiveSummary: str
    keyStrengths: List[str] = Field(..., min_items=1)
    competitiveAdvantages: List[str] = Field(..., min_items=1)
    interviewHighlights: List[str] = Field(..., min_items=1)
    processingTime: str
    agentUsed: str


class AnalysisResult(BaseModel):
    """Complete analysis result from AI"""

    kanban_data: KanbanData
    summary_data: SummaryData
    match_score: str
    analysis: str
    agent_used: str
