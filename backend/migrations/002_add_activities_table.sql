-- Migration 002: Add Activities Table
-- Description: Add timeline/activities support to portfolio database

-- Activities/Timeline table
CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    time TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('GitHub', 'ArXiv', 'Course', 'Deploy', 'Research', 'Learning')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('milestone', 'research', 'learning', 'past')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);
CREATE INDEX IF NOT EXISTS idx_activities_category ON activities(category);
CREATE INDEX IF NOT EXISTS idx_activities_created ON activities(created_at);
