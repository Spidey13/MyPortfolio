"""
LangChain Multi-Agent System for AI Portfolio Backend
Enhanced with better error handling, performance, and robustness
"""

import logging
import json
import time
from typing import Dict, Any
from langchain.schema import SystemMessage, HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI

from .config import get_settings
from .portfolio_loader import get_portfolio_loader
from .cache import query_cache

logger = logging.getLogger(__name__)
# Import analytics service
try:
    from .analytics import get_analytics_service

    analytics = get_analytics_service()
    ANALYTICS_AVAILABLE = True
except Exception as e:
    logger.warning(f"Analytics not available: {e}")
    analytics = None
    ANALYTICS_AVAILABLE = False

settings = get_settings()

# Get portfolio data loader
portfolio_loader = get_portfolio_loader()


class PortfolioAgent:
    """Base class for portfolio agents with enhanced error handling"""

    def __init__(self, name: str, description: str, system_prompt: str):
        self.name = name
        self.description = description
        self.system_prompt = system_prompt
        self.llm = None
        self._initialize_llm()

    def _initialize_llm(self):
        """Initialize the language model with error handling"""
        try:
            if not settings.has_google_api:
                logger.warning(f"[FAIL] {self.name}: No API key")
                return

            self.llm = ChatGoogleGenerativeAI(
                model=settings.google_model,
                temperature=0.3,
                google_api_key=settings.google_api_key,
                max_retries=1,  # OPTIMIZED: Reduced from 3 to prevent quota exhaustion
                timeout=30,
            )
            logger.info(f"[AI] {self.name}: Ready")
        except Exception as e:
            logger.error(f"{self.name}: Failed to initialize LLM: {str(e)}")
            self.llm = None

    def process(self, query: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Process with caching (OPTIMIZED to reduce API calls)"""

        # Check cache first (only for non-contextual queries)
        if not context and settings.cache_enabled:
            cached = query_cache.get(query, self.name)
            if cached:
                # Log cache hit
                if analytics and ANALYTICS_AVAILABLE:
                    try:
                        analytics.log_cache_hit(query)
                    except Exception as e:
                        logger.error(f"Error logging cache hit: {e}")

                cached["cached"] = True
                cached["processing_time"] = 0.0
                return cached
            else:
                # Log cache miss
                if analytics and ANALYTICS_AVAILABLE:
                    try:
                        analytics.log_cache_miss(query)
                    except Exception as e:
                        logger.error(f"Error logging cache miss: {e}")

        # Process normally
        result = self._process_uncached(query, context)

        # Cache successful responses (only if no context and no errors)
        if not context and settings.cache_enabled and "error" not in result:
            query_cache.set(query, self.name, result)

        # Log AI query to analytics
        if analytics and ANALYTICS_AVAILABLE:
            try:
                session_id = (
                    context.get("session_id", "unknown") if context else "unknown"
                )
                analytics.log_ai_query(
                    session_id=session_id,
                    query_text=query[:500],  # Truncate long queries
                    agent_used=self.name,
                    response_time=result.get("processing_time", 0),
                    tokens_used=result.get("tokens_used"),
                    cached=result.get("cached", False),
                    error_occurred="error" in result,
                    error_message=result.get("error"),
                )
            except Exception as e:
                logger.error(f"Error logging AI query: {e}")

        return result

    def _process_uncached(
        self, query: str, context: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Process a query and return structured response with enhanced error handling"""
        start_time = time.time()

        if not self.llm:
            return {
                "response": "Google API key not configured. Please set GOOGLE_API_KEY environment variable.",
                "viewport_content": {
                    "type": "error",
                    "message": "Configuration required",
                },
                "agent_used": self.name,
                "processing_time": time.time() - start_time,
            }

        try:
            # Prepare messages
            messages = [
                SystemMessage(content=self.system_prompt),
                HumanMessage(
                    content=f"User Query: {query}\nContext: {json.dumps(context or {}, indent=2)}"
                ),
            ]

            logger.info(f"{self.name}: Processing query: {query[:100]}...")

            # Process with timing and error handling
            response = self.llm(messages)

            processing_time = time.time() - start_time

            logger.info(
                f"{self.name}: Query processed successfully in {processing_time:.3f}s"
            )

            return self._parse_response(response.content, query, processing_time)

        except Exception as e:
            processing_time = time.time() - start_time
            error_str = str(e)

            # OPTIMIZED: Detect 429 rate limit errors specifically
            if (
                "429" in error_str
                or "quota" in error_str.lower()
                or "rate limit" in error_str.lower()
            ):
                logger.error(f"{self.name}: Rate limit hit - {error_str}")
                return {
                    "response": "I'm currently experiencing high demand. Please try again in a few moments, or ask a simpler question.",
                    "viewport_content": {
                        "type": "error",
                        "message": "Rate limit reached. Please wait before retrying.",
                        "retry_after": 60,
                    },
                    "agent_used": self.name,
                    "processing_time": processing_time,
                    "error_type": "rate_limit",
                }

            logger.error(
                f"{self.name}: Error processing request: {str(e)}", exc_info=True
            )

            return {
                "response": "I encountered an error while processing your request. Please try again or contact support if the issue persists.",
                "viewport_content": {
                    "type": "error",
                    "message": f"Processing error: {str(e)}",
                    "agent": self.name,
                },
                "agent_used": self.name,
                "processing_time": processing_time,
                "error": str(e),
            }

    def _parse_response(
        self, response: str, query: str, processing_time: float
    ) -> Dict[str, Any]:
        """Parse agent response into structured format with enhanced validation"""
        try:
            # Basic response validation
            if not response or not response.strip():
                logger.warning(f"{self.name}: Empty response received")
                return {
                    "response": "I apologize, but I couldn't generate a proper response. Please try rephrasing your question.",
                    "viewport_content": {
                        "type": "error",
                        "message": "Empty response from AI",
                        "agent": self.name,
                    },
                    "agent_used": self.name,
                    "processing_time": processing_time,
                }

            # Clean and validate response
            response = response.strip()

            return {
                "response": response,
                "viewport_content": {
                    "type": "text",
                    "agent": self.name,
                    "content": response,
                },
                "agent_used": self.name,
                "processing_time": processing_time,
            }

        except Exception as e:
            logger.error(f"{self.name}: Error parsing response: {str(e)}")
            return {
                "response": "I apologize, but there was an error processing the response. Please try again.",
                "viewport_content": {
                    "type": "error",
                    "message": f"Response parsing error: {str(e)}",
                    "agent": self.name,
                },
                "agent_used": self.name,
                "processing_time": processing_time,
            }


# In backend/app/agents.py


class ProfileAgent(PortfolioAgent):
    """Agent specialized in handling profile and about me queries"""

    def __init__(self):
        # Store minimal data for fallback
        self.profile_summary = portfolio_loader.get_profile_summary()
        self.skills_summary = portfolio_loader.get_skills_summary()

        # OPTIMIZED: Compact system prompt - load data dynamically
        system_prompt = """You are a Profile Agent for an AI portfolio.

When answering questions:
1. Use SPECIFIC EXAMPLES from the context provided (project names, companies, technologies)
2. When asked about experience/projects, cite actual project titles and proof of skills
3. Keep responses concise (2-3 sentences) but include concrete examples
4. If context provides "relevant_examples", prioritize mentioning those specific items

Be direct and specific. Focus on what the user asks about."""
        super().__init__(
            "Profile Agent", "Handles profile and background queries", system_prompt
        )

    def process(self, query: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Override to add targeted context and fallback"""
        try:
            # Add only relevant context dynamically
            query_lower = query.lower()
            targeted_context = {}

            # Always include basic profile
            profile = portfolio_loader.portfolio_data.profile
            targeted_context["profile"] = (
                f"{profile.name}, {profile.title}. {profile.summary[:200]}"
            )

            if (
                "skill" in query_lower
                or "technolog" in query_lower
                or "stack" in query_lower
            ):
                targeted_context["skills"] = self.skills_summary
            elif "education" in query_lower or "degree" in query_lower:
                edu = portfolio_loader.portfolio_data.education
                targeted_context["education"] = (
                    f"{edu.degree} from {edu.university}, GPA: {edu.gpa}"
                )
            elif (
                "experience" in query_lower
                or "work" in query_lower
                or "project" in query_lower
                or "mlops" in query_lower
                or "ml" in query_lower
                or "ai" in query_lower
            ):
                # Search for relevant projects and experience
                relevant_items = []

                # Extract keywords from query
                keywords = query_lower.split()
                projects = portfolio_loader.portfolio_data.projects
                experience = portfolio_loader.portfolio_data.experience

                # Search projects for matches
                for proj in projects:
                    proj_text = f"{proj.title} {proj.star.situation} {proj.star.task} {' '.join(proj.technologies)}".lower()
                    if any(keyword in proj_text for keyword in keywords):
                        relevant_items.append(
                            f"PROJECT: {proj.title}\n"
                            f"What: {proj.star.task[:120]}\n"
                            f"Technologies: {', '.join(proj.technologies[:8])}\n"
                            f"Impact: {proj.star.result[:100]}"
                        )

                # Search experience for matches
                for exp in experience:
                    exp_text = f"{exp.company} {exp.role} {exp.star.result}".lower()
                    if any(keyword in exp_text for keyword in keywords):
                        relevant_items.append(
                            f"EXPERIENCE: {exp.role} at {exp.company}\n"
                            f"Duration: {exp.duration}\n"
                            f"Achievement: {exp.star.result[:100]}"
                        )

                if relevant_items:
                    targeted_context["relevant_examples"] = "\n\n".join(
                        relevant_items[:4]
                    )  # Limit to 4 items
                else:
                    # Fallback to featured projects
                    featured = [p for p in projects if p.featured][:2]
                    targeted_context["featured_projects"] = "\n\n".join(
                        [
                            f"{p.title}: {p.star.task[:80]}... Technologies: {', '.join(p.technologies[:5])}"
                            for p in featured
                        ]
                    )

            # Merge with provided context
            full_context = context or {}
            full_context.update(targeted_context)

            # Call parent's caching-enabled process method
            return super().process(query, full_context)
        except Exception as e:
            # Log the error for debugging
            logger.error(f"ProfileAgent process error: {str(e)}", exc_info=True)
            # If AI fails, return static data
            return self._get_fallback_response(query)

    def _parse_response(
        self, response: str, query: str, processing_time: float
    ) -> Dict[str, Any]:
        """Override to catch the 'error' response from the parent class"""
        # FIXED: Call parent's _parse_response first to get the dict
        parsed_response = super()._parse_response(response, query, processing_time)

        # If the parent class returned the generic error message, use fallback instead
        if "I encountered an error" in parsed_response.get("response", ""):
            return self._get_fallback_response(query)

        return parsed_response

    def _get_fallback_response(self, query: str) -> Dict[str, Any]:
        """Generate a static response when AI is down"""
        # Simple keyword matching
        query_lower = query.lower()

        if (
            "skill" in query_lower
            or "stack" in query_lower
            or "technolog" in query_lower
        ):
            content = (
                f"Here is an overview of my technical skills:\n\n{self.skills_summary}"
            )
        else:
            content = f"I am currently operating in offline mode, but here is my profile summary:\n\n{self.profile_summary}"

        return {
            "response": content,
            "viewport_content": {
                "type": "text",
                "agent": self.name,
                "content": content,
            },
            "agent_used": "Profile Agent (Offline)",
            "processing_time": 0.0,
        }


class ProjectAgent(PortfolioAgent):
    """Agent specialized in handling project-related queries"""

    def __init__(self):
        # OPTIMIZED: Compact system prompt - load data dynamically
        system_prompt = """You are a Project Agent for an AI portfolio.

Provide technical details about projects using data from context.
Be concise. Focus on what the user asks about - don't list all projects."""
        super().__init__(
            "Project Agent", "Handles project and technical queries", system_prompt
        )

    def process(self, query: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Override to add relevant projects only"""
        query_lower = query.lower()
        projects = portfolio_loader.portfolio_data.projects

        # Find mentioned projects or use featured
        relevant_projects = []
        for project in projects:
            if project.title.lower() in query_lower:
                relevant_projects.append(project)

        if not relevant_projects:
            # Default to featured projects only
            relevant_projects = [p for p in projects if p.featured][:3]

        context = context or {}
        context["projects"] = "\n\n".join(
            [
                f"Project: {p.title}\n"
                f"Technologies: {', '.join(p.technologies[:5])}\n"
                f"Result: {p.star.result[:200]}"
                for p in relevant_projects
            ]
        )

        return super().process(query, context)

    def _parse_response(
        self, response: str, query: str, processing_time: float
    ) -> Dict[str, Any]:
        """Enhanced parsing for project-specific responses"""
        try:
            base_response = super()._parse_response(response, query, processing_time)

            # Add project-specific viewport content
            base_response["viewport_content"]["type"] = "project_info"
            base_response["viewport_content"]["agent"] = self.name

            return base_response

        except Exception as e:
            logger.error(f"{self.name}: Error in project response parsing: {str(e)}")
            return super()._parse_response(response, query, processing_time)


class CareerAgent(PortfolioAgent):
    """Agent specialized in career advice and professional development"""

    def __init__(self):
        system_prompt = f"""
You are the Career Agent for {settings.portfolio_owner}'s AI portfolio.
Your role is to provide career advice, professional development guidance, and industry insights.

Expertise Areas:
- AI/ML Career Development
- Data Science Industry Trends
- Technical Interview Preparation
- Professional Networking
- Skill Development Roadmaps

When users ask about career advice, provide:
1. Practical, actionable guidance
2. Industry-relevant insights
3. Personal experience when applicable
4. Resource recommendations

Always respond in a supportive, professional tone. Focus on helping users achieve their career goals.

Keep responses encouraging and practical.
"""
        super().__init__(
            "Career Agent",
            "Handles career and professional development queries",
            system_prompt,
        )


class DemoAgent(PortfolioAgent):
    """Agent specialized in handling demo and interactive project queries"""

    def __init__(self):
        system_prompt = f"""
You are the Demo Agent for {settings.portfolio_owner}'s AI portfolio.
Your role is to guide users through interactive project demonstrations and technical walkthroughs.

Demo Capabilities:
- Live project demonstrations
- Code walkthroughs
- Technical explanations
- Interactive Q&A about implementations

When users ask about demos, provide:
1. Clear instructions for accessing demos
2. Technical context and background
3. Key features to explore
4. Interactive guidance

Always respond in an engaging, technical tone. Encourage exploration and experimentation.

Keep responses focused on the interactive aspects and user engagement.
"""
        super().__init__(
            "Demo Agent", "Handles demo and interactive project queries", system_prompt
        )


class StrategicFitAgent(PortfolioAgent):
    """Agent specialized in strategic fit analysis and job matching"""

    def __init__(self):
        # OPTIMIZED: Compact system prompt - load data dynamically per request
        system_prompt = """You are a Strategic Fit Analyst for a portfolio.

Analyze job requirements against candidate qualifications using the portfolio data provided in the context.

Return structured JSON with this format:
{
  "kanban_data": {
    "technicalSkills": [{"id": "1", "title": "[Skill]", "description": "[Match]", "score": "Excellent/High/Good"}],
    "relevantExperience": [{"id": "1", "title": "[Role]", "description": "[Details]", "score": "Excellent/High/Good"}],
    "projectEvidence": [{"id": "1", "title": "[Project]", "description": "[Fit]", "score": "Excellent/High/Good"}],
    "quantifiableImpact": [{"id": "1", "title": "[Metric]", "description": "[Impact]", "score": "Excellent/High/Good"}]
  },
  "summary_data": {
    "overallMatch": "Excellent Fit/Good Fit/Partial Fit",
    "matchPercentage": 85,
    "executiveSummary": "[2-3 sentences]",
    "keyStrengths": ["str1", "str2"],
    "competitiveAdvantages": ["adv1", "adv2"],
    "interviewHighlights": ["q1", "q2"]
  },
  "match_score": "85%",
  "analysis": "[Brief text]"
}

Be concise. Focus on job-relevant data only."""
        super().__init__(
            "Strategic Fit Agent",
            "Handles job analysis and strategic fit queries",
            system_prompt,
        )

    def process(self, query: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Override to inject portfolio data only when needed"""
        # Load portfolio data dynamically per request for job analysis
        if self._is_job_analysis_query(query):
            portfolio_context = self._get_relevant_portfolio_data(query)
            context = context or {}
            context.update(portfolio_context)

        return super().process(query, context)

    def _is_job_analysis_query(self, query: str) -> bool:
        """Check if query is a job analysis request"""
        query_lower = query.lower()
        return any(
            keyword in query_lower
            for keyword in [
                "job description",
                "requirements",
                "position",
                "role",
                "hiring",
                "job posting",
                "analyze this",
                "fit analysis",
            ]
        )

    def _get_relevant_portfolio_data(self, query: str) -> Dict[str, Any]:
        """Load only relevant portfolio sections based on query"""
        query_lower = query.lower()
        data = {}

        # Always include core profile for job analysis
        profile = portfolio_loader.portfolio_data.profile
        data["profile"] = f"{profile.name}, {profile.title}. {profile.summary}"

        # Always include skills for job matching
        data["skills"] = portfolio_loader.get_skills_summary()

        # Include featured projects only (not all projects)
        featured_projects = [
            p for p in portfolio_loader.portfolio_data.projects if p.featured
        ]
        data["featured_projects"] = "\n\n".join(
            [
                f"- {p.title}: {p.star.result[:150]}... Technologies: {', '.join(p.technologies[:5])}"
                for p in featured_projects[:3]
            ]
        )

        # Include core competencies
        data["competencies"] = portfolio_loader.get_core_competencies_summary()[
            :500
        ]  # Truncate

        return data

    def _parse_response(
        self, response: str, query: str, processing_time: float
    ) -> Dict[str, Any]:
        """Enhanced parsing for strategic fit responses"""
        try:
            base_response = super()._parse_response(response, query, processing_time)

            # Check if this is a job description analysis query
            is_job_analysis = any(
                keyword in query.lower()
                for keyword in [
                    "job description",
                    "requirements",
                    "position",
                    "role",
                    "hiring",
                    "job posting",
                    "analyze this",
                    "fit analysis",
                ]
            )

            if is_job_analysis:
                # Set strategic fit analysis type
                base_response["viewport_content"]["type"] = "strategic_fit_analysis"

                # Try to extract JSON data from response
                try:
                    if "{" in response and "}" in response:
                        start = response.find("{")
                        end = response.rfind("}") + 1
                        json_str = response[start:end]
                        structured_data = json.loads(json_str)

                        # Add the complete structured data to the response
                        base_response["kanban_data"] = structured_data.get(
                            "kanban_data", {}
                        )
                        base_response["summary_data"] = structured_data.get(
                            "summary_data", {}
                        )
                        base_response["match_score"] = structured_data.get(
                            "match_score", "0%"
                        )

                        # Keep viewport_content for backward compatibility
                        base_response["viewport_content"]["kanban_data"] = (
                            structured_data.get("kanban_data", {})
                        )
                        base_response["viewport_content"]["summary_data"] = (
                            structured_data.get("summary_data", {})
                        )

                        logger.info(
                            f"Strategic fit analysis parsed successfully with {len(structured_data.get('kanban_data', {}).get('technicalSkills', []))} technical skills"
                        )

                except Exception as json_error:
                    logger.warning(
                        f"Could not parse JSON from strategic fit response: {json_error}"
                    )
                    # Provide default structure if JSON parsing fails
                    base_response["kanban_data"] = {
                        "technicalSkills": [],
                        "relevantExperience": [],
                        "projectEvidence": [],
                        "quantifiableImpact": [],
                    }
                    base_response["summary_data"] = {
                        "overallMatch": "Analysis Failed",
                        "matchPercentage": 0,
                        "executiveSummary": "Could not complete analysis",
                        "keyStrengths": [],
                        "competitiveAdvantages": [],
                        "interviewHighlights": [],
                        "processingTime": f"{processing_time:.1f}s",
                        "agentUsed": "Strategic Fit Agent",
                    }
                    base_response["match_score"] = "0%"
                    base_response["viewport_content"]["kanban_data"] = base_response[
                        "kanban_data"
                    ]
                    base_response["viewport_content"]["summary_data"] = base_response[
                        "summary_data"
                    ]
            else:
                # Regular strategic analysis response
                base_response["viewport_content"]["type"] = "strategic_analysis"

            base_response["viewport_content"]["agent"] = self.name
            return base_response

        except Exception as e:
            logger.error(
                f"{self.name}: Error in strategic fit response parsing: {str(e)}"
            )
            return super()._parse_response(response, query, processing_time)


class RouterAgent:
    """Enhanced router agent with better query classification and error handling"""

    def __init__(self):
        self.agents = {
            "profile": ProfileAgent(),
            "project": ProjectAgent(),
            "career": CareerAgent(),
            "demo": DemoAgent(),
            "strategic_fit": StrategicFitAgent(),
        }
        self.router_llm = None
        self._initialize_router()

    def _initialize_router(self):
        """Initialize the router's language model"""
        try:
            if settings.has_google_api:
                self.router_llm = ChatGoogleGenerativeAI(
                    model=settings.google_model,
                    temperature=0.1,  # Lower temperature for routing
                    google_api_key=settings.google_api_key,
                    max_retries=1,  # OPTIMIZED: Reduced from 2 to prevent quota exhaustion
                    timeout=15,
                )
                logger.info("[ROUTER] Ready")
            else:
                logger.warning("[FAIL] Router: No API key")
        except Exception as e:
            logger.error(f"Failed to initialize router LLM: {str(e)}")

    def _get_keyword_route(self, query: str) -> Dict[str, Any]:
        """Enhanced keyword-based routing with confidence scores"""
        query_lower = query.lower()
        scores = {
            "profile": 0,
            "project": 0,
            "career": 0,
            "demo": 0,
            "strategic_fit": 0,
        }

        # Profile keywords (weighted scoring)
        profile_keywords = {
            "high": [
                "about",
                "who are you",
                "tell me about yourself",
                "background",
                "education",
            ],
            "medium": ["profile", "skills", "experience summary"],
        }

        # Project keywords
        project_keywords = {
            "high": ["project", "github", "built", "developed", "technical"],
            "medium": ["code", "implementation", "portfolio"],
        }

        # Career keywords
        career_keywords = {
            "high": ["career advice", "job search", "interview prep"],
            "medium": ["career", "advice", "development"],
        }

        # Demo keywords
        demo_keywords = {
            "high": ["demo", "live", "show me", "walkthrough"],
            "medium": ["interactive", "demonstration"],
        }

        # Strategic fit keywords (strongest indicators)
        strategic_keywords = {
            "high": [
                "job description",
                "requirements",
                "position",
                "role requirements",
                "fit analysis",
                "analyze this job",
            ],
            "medium": ["analyze", "match", "qualification", "hiring"],
        }

        # Calculate weighted scores
        for agent, keywords in [
            ("profile", profile_keywords),
            ("project", project_keywords),
            ("career", career_keywords),
            ("demo", demo_keywords),
            ("strategic_fit", strategic_keywords),
        ]:
            for weight, words in keywords.items():
                multiplier = 1.0 if weight == "high" else 0.5
                for word in words:
                    if word in query_lower:
                        scores[agent] += multiplier

        best_agent = max(scores.items(), key=lambda x: x[1])
        confidence = min(best_agent[1] / 3.0, 1.0)  # Normalize to 0-1

        return {
            "agent": best_agent[0] if best_agent[1] > 0 else "profile",
            "confidence": confidence,
        }

    def route_query(self, query: str) -> str:
        """Multi-tier routing: keyword → LLM fallback (OPTIMIZED)"""

        # TIER 1: Keyword matching (fast, no API call)
        route = self._get_keyword_route(query)

        # High confidence keyword match - no need for LLM call
        if route["confidence"] > 0.8:
            logger.info(
                f"[FAST-ROUTE] Query routed via keywords to {route['agent']} (confidence: {route['confidence']:.2f})"
            )
            return route["agent"]

        # Medium confidence - log but still use LLM if available
        if route["confidence"] > 0.5:
            logger.info(
                f"[KEYWORD] Medium confidence match: {route['agent']} ({route['confidence']:.2f}), attempting LLM verification"
            )
        else:
            logger.info(
                f"[KEYWORD] Low confidence match: {route['agent']} ({route['confidence']:.2f}), using LLM routing"
            )

        # TIER 2: LLM routing (only for ambiguous queries)
        if not self.router_llm:
            logger.info(
                f"[FALLBACK] No LLM available, using keyword route: {route['agent']}"
            )
            return route["agent"]

        try:
            routing_prompt = f"""
            Route the following user query to the most appropriate agent:
            Query: "{query}"
            
            Available agents:
            - profile: For questions about personal background, education, skills, "about me"
            - project: For questions about projects, technical implementations, code
            - career: For career advice, professional development, industry insights
            - demo: For interactive demonstrations, live projects, walkthroughs
            - strategic_fit: For job analysis, requirements matching, strategic fit assessment
            
            Respond with only the agent name (profile, project, career, demo, or strategic_fit).
            """

            messages = [
                SystemMessage(content=routing_prompt),
                HumanMessage(content=query),
            ]

            # LLM routing for uncertain queries
            response = self.router_llm.invoke(messages)
            agent_name = response.content.strip().lower()

            if agent_name in self.agents:
                logger.info(f"[LLM-ROUTE] Query routed to {agent_name} agent")
                return agent_name
            else:
                logger.warning(
                    f"Invalid agent name returned: {agent_name}, using keyword route: {route['agent']}"
                )
                return route["agent"]

        except Exception as e:
            # On error, use keyword route
            logger.error(
                f"LLM routing failed (using keyword route: {route['agent']}): {str(e)}"
            )
            return route["agent"]

    def process_query(
        self, query: str, context: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Process query with enhanced error handling and monitoring"""
        start_time = time.time()

        try:
            # Route the query
            agent_name = self.route_query(query)
            agent = self.agents.get(agent_name)

            if not agent:
                logger.error(f"Agent not found: {agent_name}")
                return {
                    "response": "I apologize, but I couldn't determine the best way to handle your request. Please try rephrasing your question.",
                    "viewport_content": {"type": "error", "message": "Routing error"},
                    "agent_used": "router_error",
                    "processing_time": time.time() - start_time,
                }

            # Process with the selected agent
            result = agent.process(query, context)

            # Add routing information
            result["routed_to"] = agent_name
            result["total_processing_time"] = time.time() - start_time

            logger.info(
                f"Query processed successfully by {agent_name} in {result['total_processing_time']:.3f}s"
            )

            return result

        except Exception as e:
            processing_time = time.time() - start_time
            logger.error(f"Error in query processing: {str(e)}", exc_info=True)

            return {
                "response": "I encountered an error while processing your request. Please try again.",
                "viewport_content": {"type": "error", "message": str(e)},
                "agent_used": "error",
                "processing_time": processing_time,
            }


# Global router instance
router = RouterAgent()
