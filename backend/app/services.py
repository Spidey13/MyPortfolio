"""
Business logic services for the AI Portfolio Backend
"""

from typing import Dict, Any, List
from datetime import datetime

from .config import get_settings

settings = get_settings()


class ResumeService:
    """Service for handling resume data and PDF generation"""

    @staticmethod
    def get_profile_data() -> Dict[str, Any]:
        """Get structured profile data"""
        return {
            "name": settings.portfolio_owner,
            "title": settings.portfolio_title,
            "location": "Currently Available for Full-Time Opportunities",
            "contact": {
                "email": "prpmore@gmail.com",
                "phone": "(930) 333-4542",
                "linkedin": "linkedin.com/in/more-prathamesh",
                "github": "github.com/Spidey13",
                "google_scholar": "scholar.google.com",
            },
            "summary": {
                "executive": "Dynamic and results-oriented Machine Learning Engineer with a Master's in Data Science, specializing in the end-to-end development of AI-powered applications. Proven ability to architect scalable data pipelines and deploy advanced NLP models, improving entity extraction F1-score to 0.91. Passionate about leveraging cutting-edge Generative AI and MLOps principles to build innovative, high-impact products.",
                "stats": {
                    "ms_degree": "MS in Data Science",
                    "gpa": "3.85 GPA",
                    "publications": "2 Research Papers",
                    "projects": "15+ AI/ML Projects",
                },
            },
            "core_competencies": [
                "Full-Stack Development",
                "End-to-End Project Ownership",
                "AI/ML Systems Engineering",
                "Cross-functional Communication",
                "API Development",
                "MLOps",
                "Database Management",
                "Problem-Solving",
                "Stakeholder Engagement",
            ],
        }

    @staticmethod
    def get_experience_data() -> List[Dict[str, Any]]:
        """Get structured work experience data"""
        return [
            {
                "id": 1,
                "company": "Indiana University",
                "position": "Data Science Intern",
                "duration": "05/2024 to 10/2024",
                "description": "Architected modular text-mining frameworks and developed self-service analytics dashboards for large-scale academic research.",
                "technologies": [
                    "Python",
                    "LDA",
                    "NMF",
                    "K-Means",
                    "Plotly",
                    "Dash",
                    "Text Mining",
                    "Topic Modeling",
                ],
                "achievements": [
                    "Architected and implemented modular text-mining framework using LDA, NMF, and K-Means algorithms, processing 550+ academic publications and automating thematic analysis workflows",
                    "Developed and deployed self-service analytics dashboards with Plotly and Dash, enabling researchers to perform independent analysis and reducing consultation time by 60%",
                    "Achieved 93% topic coherence through advanced hyperparameter optimization and model validation techniques, significantly improving research insights quality",
                ],
            },
            {
                "id": 2,
                "company": "Dimensionless Technologies",
                "position": "ML Engineer Intern",
                "duration": "04/2023 to 08/2023",
                "description": "Built and deployed scalable NLP pipelines on AWS, optimizing BERT models for production environments.",
                "technologies": [
                    "Python",
                    "AWS",
                    "BERT",
                    "NLP",
                    "Docker",
                    "MLOps",
                    "Entity Recognition",
                    "Cloud Computing",
                ],
                "achievements": [
                    "Engineered and deployed AWS-based NLP pipelines using containerized BERT models, achieving 70% speed improvement over baseline implementations through optimized preprocessing and parallel processing",
                    "Implemented fine-tuned BERT model for entity recognition tasks, achieving 0.84 precision on complex domain-specific datasets and reducing manual annotation requirements",
                    "Designed and executed comprehensive MLOps workflows including automated testing, version control, and deployment pipelines, ensuring 99.5% uptime for production services",
                ],
            },
            {
                "id": 3,
                "company": "Benchmark Computer Solutions",
                "position": "Full Stack Developer Intern",
                "duration": "08/2022 to 12/2022",
                "description": "Developed end-to-end data processing pipelines and improved machine learning model performance for resume parsing applications.",
                "technologies": [
                    "Python",
                    "React",
                    "PostgreSQL",
                    "Machine Learning",
                    "Data Engineering",
                    "Full-Stack Development",
                ],
                "achievements": [
                    "Developed comprehensive resume parsing system using advanced NLP techniques and machine learning models, improving F1-score from 0.78 to 0.91 through feature engineering and model optimization",
                    "Built end-to-end data processing pipelines handling 10,000+ documents daily, reducing manual processing time by 40% and improving data quality through automated validation",
                    "Designed and implemented full-stack web application with React frontend and Python backend, serving 500+ daily users with sub-2-second response times",
                ],
            },
        ]

    @staticmethod
    def get_projects_data() -> List[Dict[str, Any]]:
        """Get structured projects data"""
        return [
            {
                "id": 1,
                "title": "F1 Race Strategy Simulator",
                "tagline": "High-fidelity digital twin for race strategy optimization",
                "description": "Advanced simulation system combining real-time telemetry data with machine learning models to optimize race strategies.",
                "longDescription": "A comprehensive F1 race strategy simulator that leverages machine learning models (XGBoost, CatBoost) to predict optimal pit stop windows, tire strategies, and fuel management. The system processes real-time telemetry data and historical race performance to provide strategic recommendations.",
                "technologies": [
                    "XGBoost",
                    "CatBoost",
                    "Python",
                    "Streamlit",
                    "Pandas",
                    "NumPy",
                    "Plotly",
                ],
                "featured": True,
                "category": "Machine Learning",
                "demoUrls": [
                    "https://f1-strategy-simulator.streamlit.app",
                    "https://f1-pit-optimizer.streamlit.app",
                    "https://f1-telemetry-analyzer.streamlit.app",
                ],
                "githubUrl": "https://github.com/Spidey13/f1-strategy-simulator",
                "metrics": {
                    "accuracy": "94%",
                    "dataPoints": "500K+",
                    "raceScenarios": "50+",
                    "predictionSpeed": "<2s",
                },
            },
            {
                "id": 2,
                "title": "Agentic AI for Multimodal Analysis",
                "tagline": "ReAct pattern implementation for complex reasoning",
                "description": "Sophisticated AI agent system using ReAct patterns for multimodal analysis and reasoning tasks.",
                "longDescription": "An advanced agentic AI system implementing the ReAct (Reasoning + Acting) pattern for complex multimodal analysis. The system can process text, images, and structured data to perform sophisticated reasoning tasks and provide actionable insights.",
                "technologies": [
                    "LangChain",
                    "OpenAI",
                    "Python",
                    "FastAPI",
                    "ReAct Pattern",
                    "Multimodal AI",
                ],
                "featured": True,
                "category": "Artificial Intelligence",
                "demoUrls": [
                    "https://agentic-ai-demo.streamlit.app",
                    "https://multimodal-analyzer.streamlit.app",
                ],
                "githubUrl": "https://github.com/Spidey13/agentic-multimodal-ai",
                "metrics": {
                    "reasoning_accuracy": "92%",
                    "modalities": "3",
                    "response_time": "<5s",
                    "complexity_score": "9/10",
                },
            },
            {
                "id": 3,
                "title": "Wafer Fault Detection System",
                "tagline": "94% F1-score manufacturing quality control",
                "description": "Machine learning system for automated semiconductor wafer fault detection in manufacturing.",
                "longDescription": "Industrial-grade machine learning system for detecting faults in semiconductor wafer manufacturing. Uses ensemble methods and advanced feature engineering to achieve high precision in quality control processes.",
                "technologies": [
                    "Random Forest",
                    "XGBoost",
                    "Python",
                    "MLOps",
                    "Feature Engineering",
                    "Industrial AI",
                ],
                "featured": False,
                "category": "Industrial AI",
                "demoUrls": ["https://wafer-fault-detection.streamlit.app"],
                "githubUrl": "https://github.com/Spidey13/wafer-fault-detection",
                "metrics": {
                    "f1_score": "94%",
                    "precision": "96%",
                    "recall": "92%",
                    "processing_speed": "1000 wafers/min",
                },
            },
        ]

    @staticmethod
    def get_skills_data() -> Dict[str, List[Dict[str, Any]]]:
        """Get structured skills data by category"""
        return {
            "Generative AI & LLMs": [
                {"name": "OpenAI GPT Models", "proficiency": 95},
                {"name": "LangChain", "proficiency": 90},
                {"name": "Hugging Face Transformers", "proficiency": 85},
                {"name": "Prompt Engineering", "proficiency": 92},
                {"name": "RAG (Retrieval-Augmented Generation)", "proficiency": 88},
            ],
            "Machine Learning & Modeling": [
                {"name": "Scikit-learn", "proficiency": 95},
                {"name": "XGBoost", "proficiency": 90},
                {"name": "Random Forest", "proficiency": 88},
                {"name": "Deep Learning (TensorFlow, PyTorch)", "proficiency": 85},
                {"name": "Feature Engineering", "proficiency": 92},
            ],
            "Data Engineering & MLOps": [
                {"name": "Apache Spark", "proficiency": 80},
                {"name": "Docker", "proficiency": 85},
                {"name": "MLflow", "proficiency": 78},
                {"name": "AWS (S3, EC2, Lambda)", "proficiency": 82},
                {"name": "Data Pipelines", "proficiency": 88},
            ],
            "Languages & Databases": [
                {"name": "Python", "proficiency": 95},
                {"name": "SQL", "proficiency": 90},
                {"name": "JavaScript", "proficiency": 80},
                {"name": "R", "proficiency": 75},
                {"name": "PostgreSQL", "proficiency": 85},
            ],
            "Web & API Development": [
                {"name": "FastAPI", "proficiency": 88},
                {"name": "React", "proficiency": 82},
                {"name": "REST APIs", "proficiency": 90},
                {"name": "Node.js", "proficiency": 75},
                {"name": "Express.js", "proficiency": 78},
            ],
            "Tools & Frameworks": [
                {"name": "Git", "proficiency": 92},
                {"name": "Jupyter", "proficiency": 95},
                {"name": "Streamlit", "proficiency": 90},
                {"name": "Plotly", "proficiency": 85},
                {"name": "Pandas", "proficiency": 95},
            ],
        }

    @staticmethod
    def get_publications_data() -> List[Dict[str, Any]]:
        """Get structured publications data"""
        return [
            {
                "id": 1,
                "title": "An Algorithmic Approach for Text Summarization",
                "authors": ["A. Joshi", "P. More", "S. Shah", "M. A. Sahitya"],
                "venue": "2023 International Conference for Advancement in Technology (ICONAT)",
                "year": 2023,
                "type": "Conference Paper",
                "abstract": "With the advent of technology and increase in ease of access to digital devices, there has been a burgeoning increase in the flow and creation of information all across the internet. However, this has led to a lot of saturation and an increased amount of redundant information...",
                "keywords": [
                    "Text Summarization",
                    "Natural Language Processing",
                    "Abstractive Summarization",
                    "Query-based Summarization",
                ],
                "doi": "10.1109/ICONAT57137.2023.10080575",
                "pdfUrl": "https://ieeexplore.ieee.org/abstract/document/10080575",
                "category": "Natural Language Processing",
                "featured": True,
            },
            {
                "id": 2,
                "title": "An Exploratory Text-Mining Approach to Analyzing DEI-Related Issues in Architecture & Design Industry Publications",
                "authors": ["P. More", "Co-authors"],
                "venue": "Design Research Journal (Taylor & Francis)",
                "year": 2025,
                "type": "Journal Article",
                "abstract": "Following the killing of George Floyd, Breonna Taylor and Ahmaud Arbery in 2020, a rise in social consciousness has led design firms to issue statements of commitment, formulate teams, and increase public communication on diversity, equity, and inclusion (DEI)...",
                "keywords": [
                    "Text Mining",
                    "DEI Analysis",
                    "Design Research",
                    "Data Analytics",
                    "Diversity Studies",
                ],
                "doi": "10.1080/14606925.2025.2482556",
                "pdfUrl": "https://www.tandfonline.com/doi/abs/10.1080/14606925.2025.2482556",
                "category": "Data Science",
                "featured": True,
            },
        ]


class PortfolioService:
    """Main portfolio service orchestrator"""

    def __init__(self):
        self.resume_service = ResumeService()

    def get_complete_portfolio_data(self) -> Dict[str, Any]:
        """Get all portfolio data in a structured format"""
        return {
            "profile": self.resume_service.get_profile_data(),
            "experience": self.resume_service.get_experience_data(),
            "projects": self.resume_service.get_projects_data(),
            "skills": self.resume_service.get_skills_data(),
            "publications": self.resume_service.get_publications_data(),
            "last_updated": datetime.now().isoformat(),
        }
