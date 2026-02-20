-- Portfolio Database Schema Migration
-- Version: 001
-- Description: Initial schema for portfolio data and analytics

-- ============================================================================
-- PORTFOLIO DATA TABLES
-- ============================================================================

-- Profile table
CREATE TABLE profile (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    location TEXT NOT NULL,
    email TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Profile links
CREATE TABLE profile_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    url TEXT NOT NULL,
    FOREIGN KEY (profile_id) REFERENCES profile(id)
);

-- Profile highlights
CREATE TABLE profile_highlights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id INTEGER NOT NULL,
    highlight TEXT NOT NULL,
    display_order INTEGER,
    FOREIGN KEY (profile_id) REFERENCES profile(id)
);

-- Education
CREATE TABLE education (
    id INTEGER PRIMARY KEY,
    degree TEXT NOT NULL,
    university TEXT NOT NULL,
    graduation TEXT NOT NULL,
    gpa TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Education coursework
CREATE TABLE education_coursework (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    education_id INTEGER NOT NULL,
    course TEXT NOT NULL,
    display_order INTEGER,
    FOREIGN KEY (education_id) REFERENCES education(id)
);

-- Experience
CREATE TABLE experience (
    id INTEGER PRIMARY KEY,
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    duration TEXT NOT NULL,
    location TEXT NOT NULL,
    star_situation TEXT NOT NULL,
    star_task TEXT NOT NULL,
    star_action TEXT NOT NULL,
    star_result TEXT NOT NULL,
    star_impact TEXT NOT NULL,
    star_architecture TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Experience technologies
CREATE TABLE experience_technologies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    experience_id INTEGER NOT NULL,
    technology TEXT NOT NULL,
    FOREIGN KEY (experience_id) REFERENCES experience(id)
);

-- Experience competencies
CREATE TABLE experience_competencies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    experience_id INTEGER NOT NULL,
    competency TEXT NOT NULL,
    FOREIGN KEY (experience_id) REFERENCES experience(id)
);

-- Experience soft skills
CREATE TABLE experience_soft_skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    experience_id INTEGER NOT NULL,
    soft_skill TEXT NOT NULL,
    FOREIGN KEY (experience_id) REFERENCES experience(id)
);

-- Projects
CREATE TABLE projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    github_url TEXT NOT NULL,
    star_situation TEXT NOT NULL,
    star_task TEXT NOT NULL,
    star_action TEXT NOT NULL,
    star_result TEXT NOT NULL,
    star_impact TEXT NOT NULL,
    star_architecture TEXT NOT NULL,
    featured BOOLEAN DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Project technologies
CREATE TABLE project_technologies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id TEXT NOT NULL,
    technology TEXT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Skills
CREATE TABLE skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    skill TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Publications
CREATE TABLE publications (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    outlet TEXT NOT NULL,
    date TEXT NOT NULL,
    related_project_id TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (related_project_id) REFERENCES projects(id)
);

-- ============================================================================
-- ANALYTICS TABLES
-- ============================================================================

-- Analytics events (general event tracking)
CREATE TABLE analytics_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    event_data TEXT,  -- JSON string
    user_agent TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- AI query logs (detailed AI interaction tracking)
CREATE TABLE ai_query_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    query_text TEXT NOT NULL,
    agent_used TEXT NOT NULL,
    response_time REAL NOT NULL,
    tokens_used INTEGER,
    cached BOOLEAN DEFAULT 0,
    follow_up_query_id INTEGER,
    error_occurred BOOLEAN DEFAULT 0,
    error_message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (follow_up_query_id) REFERENCES ai_query_logs(id)
);

-- Cache performance tracking
CREATE TABLE cache_performance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    query_hash TEXT NOT NULL UNIQUE,
    hit_count INTEGER DEFAULT 0,
    miss_count INTEGER DEFAULT 0,
    last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Analytics indexes
CREATE INDEX idx_analytics_session ON analytics_events(session_id);
CREATE INDEX idx_analytics_timestamp ON analytics_events(timestamp);
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);

-- AI query log indexes
CREATE INDEX idx_ai_query_session ON ai_query_logs(session_id);
CREATE INDEX idx_ai_query_timestamp ON ai_query_logs(timestamp);
CREATE INDEX idx_ai_query_agent ON ai_query_logs(agent_used);
CREATE INDEX idx_ai_query_cached ON ai_query_logs(cached);

-- Cache performance indexes
CREATE INDEX idx_cache_query_hash ON cache_performance(query_hash);
CREATE INDEX idx_cache_last_accessed ON cache_performance(last_accessed);

-- Portfolio data indexes (for efficient queries)
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_experience_company ON experience(company);
CREATE INDEX idx_skills_category ON skills(category);
