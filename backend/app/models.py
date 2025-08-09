"""
Pydantic models for portfolio data validation
"""

from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional, Dict, Any
from enum import Enum


class LinkType(str, Enum):
    github = "github"
    linkedin = "linkedin"
    scholar = "scholar"
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
    email: str = Field(..., regex=r'^[^@]+@[^@]+\.[^@]+$')
    links: List[Link] = Field(..., min_items=1)


class Education(BaseModel):
    degree: str = Field(..., min_length=1, max_length=200)
    university: str = Field(..., min_length=1, max_length=200)
    graduation: str = Field(..., min_length=4, max_length=4)
    gpa: Optional[str] = None
    coursework: List[str] = Field(default=[])


class Experience(BaseModel):
    id: int = Field(..., gt=0)
    role: str = Field(..., min_length=1, max_length=200)
    company: str = Field(..., min_length=1, max_length=200)
    duration: str = Field(..., min_length=1, max_length=100)
    location: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=10, max_length=2000)
    achievements: List[str] = Field(..., min_items=1)
    technologies: List[str] = Field(..., min_items=1)


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
    id: int = Field(..., gt=0)
    title: str = Field(..., min_length=1, max_length=200)
    shortDescription: str = Field(..., min_length=10, max_length=500)
    description: str = Field(..., min_length=20, max_length=2000)
    technologies: List[str] = Field(..., min_items=1)
    githubUrl: str = Field(..., min_length=1)
    achievements: List[str] = Field(..., min_items=1)
    metrics: ProjectMetrics
    category: str = Field(..., min_length=1, max_length=100)
    featured: bool = Field(default=False)


class Skill(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    level: str = Field(..., regex=r'^(Beginner|Intermediate|Advanced|Expert)$')
    years: Optional[int] = Field(None, ge=0, le=20)


class SkillCategory(BaseModel):
    name: str
    level: str


class Skills(BaseModel):
    programming: List[Skill] = Field(..., min_items=1)
    machine_learning: List[SkillCategory] = Field(..., min_items=1)
    web_development: List[SkillCategory] = Field(..., min_items=1)
    data_tools: List[SkillCategory] = Field(..., min_items=1)
    cloud_devops: List[SkillCategory] = Field(..., min_items=1)


class Publication(BaseModel):
    id: int = Field(..., gt=0)
    title: str = Field(..., min_length=1, max_length=300)
    authors: List[str] = Field(..., min_items=1)
    journal: Optional[str] = None
    conference: Optional[str] = None
    year: int = Field(..., ge=2020, le=2025)
    type: str = Field(..., regex=r'^(Journal Article|Conference Paper|Book Chapter|Preprint)$')
    description: str = Field(..., min_length=10, max_length=1000)
    keywords: List[str] = Field(..., min_items=1)
    impact: str = Field(..., min_length=1, max_length=500)


class PortfolioData(BaseModel):
    """Complete portfolio data model with validation"""
    profile: Profile
    education: Education
    experience: List[Experience] = Field(..., min_items=1)
    projects: List[Project] = Field(..., min_items=1)
    skills: Skills
    publications: List[Publication] = Field(..., min_items=1)
    core_competencies: List[str] = Field(..., min_items=1)

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