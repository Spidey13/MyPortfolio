"""
Database service for Turso (LibSQL) integration
Handles connection management and data access for portfolio content and analytics
"""

import os
import json
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime

try:
    import libsql
except ImportError:
    libsql = None

from .config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class TursoDatabase:
    """Turso database client for portfolio data and analytics"""

    def __init__(self):
        self.client = None
        self._initialized = False

        if not settings.turso_database_url or not settings.turso_auth_token:
            logger.warning(
                "Turso credentials not configured. Database features will be disabled."
            )
            return

        if libsql is None:
            logger.error("libsql not installed. Run: pip install libsql")
            return

        try:
            # Connect to Turso database using libsql
            self.client = libsql.connect(
                database=settings.turso_database_url,
                auth_token=settings.turso_auth_token,
            )
            self._initialized = True
            logger.info("✅ Turso database connection initialized")
        except Exception as e:
            logger.error(f"Failed to initialize Turso connection: {e}")
            self.client = None

    def is_available(self) -> bool:
        """Check if database connection is available"""
        return self._initialized and self.client is not None

    def _execute_query(self, query: str, params: tuple = ()) -> List[tuple]:
        """Execute query and return results as list of tuples"""
        cursor = self.client.execute(query, params)
        return cursor.fetchall()

    def _execute_single(self, query: str, params: tuple = ()) -> Optional[tuple]:
        """Execute query and return single result"""
        cursor = self.client.execute(query, params)
        return cursor.fetchone()

    # ============================================================================
    # PORTFOLIO DATA QUERIES
    # ============================================================================

    def get_profile(self) -> Optional[Dict[str, Any]]:
        """Get profile data with links and highlights"""
        if not self.is_available():
            return None

        try:
            # Get profile
            profile_row = self._execute_single(
                "SELECT id, name, title, summary, location, email FROM profile LIMIT 1"
            )
            if not profile_row:
                return None

            profile_id, name, title, summary, location, email = profile_row
            profile = {
                "name": name,
                "title": title,
                "summary": summary,
                "location": location,
                "email": email,
            }

            # Get links
            links = self._execute_query(
                "SELECT type, url FROM profile_links WHERE profile_id = ?",
                (profile_id,),
            )
            profile["links"] = [{"type": link[0], "url": link[1]} for link in links]

            # Get highlights
            highlights = self._execute_query(
                "SELECT highlight FROM profile_highlights WHERE profile_id = ? ORDER BY display_order",
                (profile_id,),
            )
            profile["highlights"] = [h[0] for h in highlights]

            return profile
        except Exception as e:
            logger.error(f"Error fetching profile: {e}", exc_info=True)
            return None

    def get_education(self) -> Optional[Dict[str, Any]]:
        """Get education data with coursework"""
        if not self.is_available():
            return None

        try:
            # Get education
            edu_row = self._execute_single(
                "SELECT id, degree, university, graduation, gpa FROM education LIMIT 1"
            )
            if not edu_row:
                return None

            edu_id, degree, university, graduation, gpa = edu_row
            education = {
                "degree": degree,
                "university": university,
                "graduation": graduation,
                "gpa": gpa,
            }

            # Get coursework
            coursework = self._execute_query(
                "SELECT course FROM education_coursework WHERE education_id = ? ORDER BY display_order",
                (edu_id,),
            )
            education["coursework"] = [c[0] for c in coursework]

            return education
        except Exception as e:
            logger.error(f"Error fetching education: {e}", exc_info=True)
            return None

    def get_experience(self) -> List[Dict[str, Any]]:
        """Get all experience entries with related data"""
        if not self.is_available():
            return []

        try:
            exp_rows = self._execute_query(
                """SELECT id, role, company, duration, location,
                   star_situation, star_task, star_action, star_result, star_impact, star_architecture
                   FROM experience ORDER BY id"""
            )

            experiences = []
            for row in exp_rows:
                (
                    exp_id,
                    role,
                    company,
                    duration,
                    location,
                    situation,
                    task,
                    action,
                    result,
                    impact,
                    architecture,
                ) = row
                exp = {
                    "id": exp_id,
                    "role": role,
                    "company": company,
                    "duration": duration,
                    "location": location,
                    "star": {
                        "situation": situation,
                        "task": task,
                        "action": action,
                        "result": result,
                        "impact": impact,
                        "architecture": architecture,
                    },
                }

                # Get technologies
                tech_rows = self._execute_query(
                    "SELECT technology FROM experience_technologies WHERE experience_id = ?",
                    (exp_id,),
                )
                exp["technologies"] = [t[0] for t in tech_rows]

                # Get competencies
                comp_rows = self._execute_query(
                    "SELECT competency FROM experience_competencies WHERE experience_id = ?",
                    (exp_id,),
                )
                exp["competencies"] = [c[0] for c in comp_rows]

                # Get soft skills
                skills_rows = self._execute_query(
                    "SELECT soft_skill FROM experience_soft_skills WHERE experience_id = ?",
                    (exp_id,),
                )
                exp["soft_skills"] = [s[0] for s in skills_rows]

                experiences.append(exp)

            return experiences
        except Exception as e:
            logger.error(f"Error fetching experience: {e}", exc_info=True)
            return []

    def get_projects(self, featured_only: bool = False) -> List[Dict[str, Any]]:
        """Get all projects with technologies"""
        if not self.is_available():
            return []

        try:
            query = """SELECT id, title, github_url, star_situation, star_task, star_action,
                       star_result, star_impact, star_architecture, featured
                       FROM projects"""
            if featured_only:
                query += " WHERE featured = 1"
            query += " ORDER BY id"

            proj_rows = self._execute_query(query)

            projects = []
            for row in proj_rows:
                (
                    proj_id,
                    title,
                    github_url,
                    situation,
                    task,
                    action,
                    result,
                    impact,
                    architecture,
                    featured,
                ) = row
                proj = {
                    "id": proj_id,
                    "title": title,
                    "github_url": github_url,
                    "star": {
                        "situation": situation,
                        "task": task,
                        "action": action,
                        "result": result,
                        "impact": impact,
                        "architecture": architecture,
                    },
                    "featured": bool(featured),
                }

                # Get technologies
                tech_rows = self._execute_query(
                    "SELECT technology FROM project_technologies WHERE project_id = ?",
                    (proj_id,),
                )
                proj["technologies"] = [t[0] for t in tech_rows]

                projects.append(proj)

            return projects
        except Exception as e:
            logger.error(f"Error fetching projects: {e}", exc_info=True)
            return []

    def get_skills(self) -> Dict[str, List[str]]:
        """Get all skills grouped by category"""
        if not self.is_available():
            return {}

        try:
            skills_rows = self._execute_query(
                "SELECT category, skill FROM skills ORDER BY category, skill"
            )

            skills_by_category = {}
            for row in skills_rows:
                category, skill = row
                if category not in skills_by_category:
                    skills_by_category[category] = []
                skills_by_category[category].append(skill)

            return skills_by_category
        except Exception as e:
            logger.error(f"Error fetching skills: {e}", exc_info=True)
            return {}

    def get_publications(self) -> List[Dict[str, Any]]:
        """Get all publications"""
        if not self.is_available():
            return []

        try:
            pub_rows = self._execute_query(
                "SELECT id, title, outlet, date, related_project_id FROM publications ORDER BY id"
            )

            return [
                {
                    "id": row[0],
                    "title": row[1],
                    "outlet": row[2],
                    "date": row[3],
                    "related_project_id": row[4],
                }
                for row in pub_rows
            ]
        except Exception as e:
            logger.error(f"Error fetching publications: {e}", exc_info=True)
            return []

    def get_activities(self) -> List[Dict[str, Any]]:
        """Get all activities for timeline"""
        if not self.is_available():
            return []

        try:
            activity_rows = self._execute_query(
                """SELECT id, time, category, title, description, type
                   FROM activities
                   ORDER BY id DESC"""
            )

            activities = []
            for row in activity_rows:
                activity_id, time, category, title, description, activity_type = row
                activities.append(
                    {
                        "time": time,
                        "category": category,
                        "title": title,
                        "description": description,
                        "type": activity_type,
                    }
                )

            return activities
        except Exception as e:
            logger.error(f"Error fetching activities: {e}", exc_info=True)
            return []

    def get_complete_portfolio(self) -> Dict[str, Any]:
        """Get all portfolio data in one call"""
        return {
            "profile": self.get_profile(),
            "education": self.get_education(),
            "experience": self.get_experience(),
            "projects": self.get_projects(),
            "skills": self.get_skills(),
            "publications": self.get_publications(),
            "activities": self.get_activities(),
        }

    # ============================================================================
    # ANALYTICS DATA LOGGING
    # ============================================================================

    def log_analytics_event(
        self,
        session_id: str,
        event_type: str,
        event_data: Optional[Dict[str, Any]] = None,
        user_agent: Optional[str] = None,
    ) -> bool:
        """Log a general analytics event"""
        if not self.is_available():
            return False

        try:
            event_data_json = json.dumps(event_data) if event_data else None
            self.client.execute(
                """INSERT INTO analytics_events 
                   (session_id, event_type, event_data, user_agent)
                   VALUES (?, ?, ?, ?)""",
                (session_id, event_type, event_data_json, user_agent),
            )
            self.client.commit()
            return True
        except Exception as e:
            logger.error(f"Error logging analytics event: {e}", exc_info=True)
            return False

    def log_ai_query(
        self,
        session_id: str,
        query_text: str,
        agent_used: str,
        response_time: float,
        tokens_used: Optional[int] = None,
        cached: bool = False,
        error_occurred: bool = False,
        error_message: Optional[str] = None,
    ) -> Optional[int]:
        """Log an AI query with details. Returns query ID."""
        if not self.is_available():
            return None

        try:
            cursor = self.client.execute(
                """INSERT INTO ai_query_logs 
                   (session_id, query_text, agent_used, response_time, tokens_used, 
                    cached, error_occurred, error_message)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    session_id,
                    query_text,
                    agent_used,
                    response_time,
                    tokens_used,
                    1 if cached else 0,
                    1 if error_occurred else 0,
                    error_message,
                ),
            )
            self.client.commit()
            return cursor.lastrowid if hasattr(cursor, "lastrowid") else None
        except Exception as e:
            logger.error(f"Error logging AI query: {e}", exc_info=True)
            return None

    def update_cache_performance(self, query_hash: str, hit: bool) -> bool:
        """Update cache hit/miss counts for a query"""
        if not self.is_available():
            return False

        try:
            # Check if record exists
            existing = self._execute_single(
                "SELECT hit_count, miss_count FROM cache_performance WHERE query_hash = ?",
                (query_hash,),
            )

            if existing:
                # Update existing
                hit_count, miss_count = existing
                if hit:
                    self.client.execute(
                        "UPDATE cache_performance SET hit_count = ?, last_accessed = CURRENT_TIMESTAMP WHERE query_hash = ?",
                        (hit_count + 1, query_hash),
                    )
                else:
                    self.client.execute(
                        "UPDATE cache_performance SET miss_count = ?, last_accessed = CURRENT_TIMESTAMP WHERE query_hash = ?",
                        (miss_count + 1, query_hash),
                    )
            else:
                # Insert new
                if hit:
                    self.client.execute(
                        "INSERT INTO cache_performance (query_hash, hit_count, miss_count) VALUES (?, 1, 0)",
                        (query_hash,),
                    )
                else:
                    self.client.execute(
                        "INSERT INTO cache_performance (query_hash, hit_count, miss_count) VALUES (?, 0, 1)",
                        (query_hash,),
                    )

            self.client.commit()
            return True
        except Exception as e:
            logger.error(f"Error updating cache performance: {e}", exc_info=True)
            return False

    # ============================================================================
    # ANALYTICS QUERIES
    # ============================================================================

    def get_query_analytics(
        self,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        agent: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Get analytics for AI queries"""
        if not self.is_available():
            return {}

        try:
            where_clauses = []
            params = []

            if start_date:
                where_clauses.append("timestamp >= ?")
                params.append(start_date)
            if end_date:
                where_clauses.append("timestamp <= ?")
                params.append(end_date)
            if agent:
                where_clauses.append("agent_used = ?")
                params.append(agent)

            where_sql = " AND ".join(where_clauses) if where_clauses else "1=1"

            # Get summary stats
            stats_row = self._execute_single(
                f"""SELECT 
                    COUNT(*) as total_queries,
                    AVG(response_time) as avg_response_time,
                    SUM(CASE WHEN cached = 1 THEN 1 ELSE 0 END) as cached_queries,
                    SUM(CASE WHEN error_occurred = 1 THEN 1 ELSE 0 END) as error_queries,
                    SUM(tokens_used) as total_tokens
                FROM ai_query_logs
                WHERE {where_sql}""",
                tuple(params),
            )

            if not stats_row:
                return {}

            (
                total_queries,
                avg_response_time,
                cached_queries,
                error_queries,
                total_tokens,
            ) = stats_row
            total_queries = total_queries or 0
            cached_queries = cached_queries or 0
            error_queries = error_queries or 0
            total_tokens = total_tokens or 0

            # Get top queries
            top_queries = self._execute_query(
                f"""SELECT query_text, COUNT(*) as count
                FROM ai_query_logs
                WHERE {where_sql}
                GROUP BY query_text
                ORDER BY count DESC
                LIMIT 10""",
                tuple(params),
            )

            return {
                "total_queries": total_queries,
                "avg_response_time": avg_response_time or 0,
                "cache_hit_rate": (
                    cached_queries / total_queries if total_queries > 0 else 0
                ),
                "error_rate": (
                    error_queries / total_queries if total_queries > 0 else 0
                ),
                "total_tokens": total_tokens,
                "top_queries": [
                    {"query": row[0], "count": row[1]} for row in top_queries
                ],
            }
        except Exception as e:
            logger.error(f"Error getting query analytics: {e}", exc_info=True)
            return {}

    def get_cache_analytics(self) -> Dict[str, Any]:
        """Get cache performance analytics"""
        if not self.is_available():
            return {}

        try:
            stats_row = self._execute_single(
                """SELECT 
                    SUM(hit_count) as total_hits,
                    SUM(miss_count) as total_misses,
                    COUNT(*) as unique_queries
                FROM cache_performance"""
            )

            if not stats_row:
                return {}

            total_hits, total_misses, unique_queries = stats_row
            total_hits = total_hits or 0
            total_misses = total_misses or 0
            unique_queries = unique_queries or 0
            total_requests = total_hits + total_misses

            return {
                "total_hits": total_hits,
                "total_misses": total_misses,
                "hit_rate": total_hits / total_requests if total_requests > 0 else 0,
                "unique_queries": unique_queries,
            }
        except Exception as e:
            logger.error(f"Error getting cache analytics: {e}", exc_info=True)
            return {}


# Global database instance
_db_instance: Optional[TursoDatabase] = None


def get_database() -> TursoDatabase:
    """Get the global database instance"""
    global _db_instance
    if _db_instance is None:
        _db_instance = TursoDatabase()
    return _db_instance
