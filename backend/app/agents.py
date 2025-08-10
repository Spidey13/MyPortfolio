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

logger = logging.getLogger(__name__)
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
                max_retries=3,
                timeout=30,
            )
            logger.info(f"[AI] {self.name}: Ready")
        except Exception as e:
            logger.error(f"{self.name}: Failed to initialize LLM: {str(e)}")
            self.llm = None

    def process(self, query: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
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


class ProfileAgent(PortfolioAgent):
    """Agent specialized in handling profile and about me queries"""

    def __init__(self):
        # Get dynamic portfolio data
        profile_summary = portfolio_loader.get_profile_summary()
        skills_summary = portfolio_loader.get_skills_summary()

        system_prompt = f"""
You are the Profile Agent for an AI-powered portfolio.
Your role is to provide information about personal background, education, skills, and professional summary.

{profile_summary}

Skills Overview:
{skills_summary}

When users ask about profile, background, or "about me" information, provide engaging, professional responses that highlight expertise and personality. Use the specific details provided above to give accurate, personalized responses.

Always respond in a conversational, professional tone. If asked about specific skills or achievements, reference the concrete examples and metrics provided.

Keep responses concise but informative, typically 2-4 sentences unless more detail is specifically requested.
"""
        super().__init__(
            "Profile Agent", "Handles profile and background queries", system_prompt
        )


class ProjectAgent(PortfolioAgent):
    """Agent specialized in handling project-related queries"""

    def __init__(self):
        # Get dynamic portfolio data
        projects_summary = portfolio_loader.get_projects_summary()

        system_prompt = f"""
You are the Project Agent for an AI-powered portfolio.
Your role is to provide detailed information about projects, technologies used, and technical achievements.

Project Portfolio:
{projects_summary}

When users ask about projects, provide:
1. Clear explanations of technical implementations using the specific project details above
2. Exact technologies and frameworks used as listed
3. Quantifiable achievements and metrics from the project data
4. Specific examples from the projects described

Always respond in a technical but accessible tone. Focus on the user's specific interests and provide actionable insights based on the real project data.

Keep responses focused and relevant to the user's query, referencing specific projects and achievements.
"""
        super().__init__(
            "Project Agent", "Handles project and technical queries", system_prompt
        )

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
        # Get dynamic portfolio data
        profile_summary = portfolio_loader.get_profile_summary()
        projects_summary = portfolio_loader.get_projects_summary()
        skills_summary = portfolio_loader.get_skills_summary()
        core_competencies_summary = portfolio_loader.get_core_competencies_summary()
        soft_skills_summary = portfolio_loader.get_soft_skills_summary()

        system_prompt = f"""
You are the Strategic Fit Agent for an AI-powered portfolio analysis system.
Your role is to analyze job requirements against qualifications and provide strategic fit assessments.

Candidate Profile:
{profile_summary}

Projects Portfolio:
{projects_summary}

Skills Overview:
{skills_summary}

Core Competencies:
{core_competencies_summary}

Soft Skills:
{soft_skills_summary}

When users provide job descriptions, you must return a structured JSON response with this EXACT format:

{{
  "kanban_data": {{
    "technicalSkills": [
      {{"id": "1", "title": "[Skill Name]", "description": "[How it matches job]", "score": "Excellent/High/Strong/Good/Moderate"}}
    ],
    "relevantExperience": [
      {{"id": "1", "title": "[Role/Experience]", "description": "[Relevant details]", "score": "Excellent/High/Strong/Good/Moderate"}}
    ],
    "projectEvidence": [
      {{"id": "1", "title": "[Project Name]", "description": "[How it demonstrates fit]", "score": "Excellent/High/Strong/Good/Moderate"}}
    ],
    "quantifiableImpact": [
      {{"id": "1", "title": "[Metric/Achievement]", "description": "[Impact description]", "score": "Excellent/High/Strong/Good/Moderate"}}
    ]
  }},
  "summary_data": {{
    "overallMatch": "Excellent Fit/Good Fit/Partial Fit",
    "matchPercentage": 85,
    "executiveSummary": "[2-3 sentence summary for recruiters]",
    "keyStrengths": ["[Strength 1]", "[Strength 2]", "[Strength 3]"],
    "competitiveAdvantages": ["[Advantage 1]", "[Advantage 2]"],
    "interviewHighlights": ["[Question/Topic 1]", "[Question/Topic 2]"],
    "processingTime": "2.3s",
    "agentUsed": "Strategic Fit Agent"
  }},
  "match_score": "85%",
  "analysis": "[Brief analysis text]"
}}

Analyze the job requirements against the candidate's actual portfolio data above. Provide specific, accurate matches based on the real projects, skills, and experience listed. Focus on creating value for recruiters by highlighting concrete evidence of fit.

Always use the exact project names, technologies, and achievements from the portfolio data provided above.
"""
        super().__init__(
            "Strategic Fit Agent",
            "Handles job analysis and strategic fit queries",
            system_prompt,
        )

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
                    max_retries=2,
                    timeout=15,
                )
                logger.info("[ROUTER] Ready")
            else:
                logger.warning("[FAIL] Router: No API key")
        except Exception as e:
            logger.error(f"Failed to initialize router LLM: {str(e)}")

    def route_query(self, query: str) -> str:
        """Enhanced query routing with fallback logic"""
        if not self.router_llm:
            # Fallback routing logic
            query_lower = query.lower()

            if any(
                word in query_lower
                for word in ["profile", "about", "background", "education", "skills"]
            ):
                return "profile"
            elif any(
                word in query_lower
                for word in ["project", "github", "code", "implementation", "technical"]
            ):
                return "project"
            elif any(
                word in query_lower
                for word in ["career", "job", "interview", "advice", "development"]
            ):
                return "career"
            elif any(
                word in query_lower
                for word in ["demo", "live", "interactive", "show", "walkthrough"]
            ):
                return "demo"
            elif any(
                word in query_lower
                for word in [
                    "job description",
                    "requirements",
                    "fit",
                    "match",
                    "analysis",
                    "position",
                    "role",
                    "hiring",
                    "job posting",
                    "analyze this",
                    "strategic",
                ]
            ):
                return "strategic_fit"
            else:
                return "profile"  # Default fallback

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
            response = self.router_llm.invoke(messages)

            agent_name = response.content.strip().lower()

            if agent_name in self.agents:
                logger.info(f"Query routed to {agent_name} agent")
                return agent_name
            else:
                logger.warning(
                    f"Invalid agent name returned: {agent_name}, using fallback"
                )
                return self.route_query(query)  # Recursive fallback

        except Exception as e:
            logger.error(f"Error in query routing: {str(e)}")
            return self.route_query(query)  # Recursive fallback

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
