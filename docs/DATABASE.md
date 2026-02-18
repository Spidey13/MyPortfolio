# Database Guide: Working with Turso

This guide explains how to manage and update your portfolio content using the Turso database.

## Table of Contents
1. [Connecting to the Database](#connecting-to-the-database)
2. [Database Schema](#database-schema)
3. [Common Update Operations](#common-update-operations)
4. [Using DB Client Tools](#using-db-client-tools)
5. [Best Practices](#best-practices)

## Connecting to the Database

### Using Turso CLI
```bash
# Connect to your database
turso db shell portfolio-db

# Run a query
SELECT * FROM projects WHERE featured = 1;

# Exit
.exit
```

### Using DB Client Tools
Turso is SQLite-compatible, so you can use any SQLite client:

**Recommended Tools:**
- **TablePlus** (Mac/Windows) - Beautiful GUI
- **DBeaver** (Cross-platform) - Free and powerful
- **DB Browser for SQLite** (Cross-platform) - Free and simple

**Connection String:**
```
URL: libsql://your-database-url.turso.io
Auth Token: your_turso_auth_token
```

## Database Schema

### Core Portfolio Tables

#### Projects
```sql
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
```

#### Experience
```sql
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
```

### Analytics Tables

#### AI Query Logs
```sql
CREATE TABLE ai_query_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    query_text TEXT NOT NULL,
    agent_used TEXT NOT NULL,
    response_time REAL NOT NULL,
    tokens_used INTEGER,
    cached BOOLEAN DEFAULT 0,
    error_occurred BOOLEAN DEFAULT 0,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Common Update Operations

### Adding a New Project

```sql
-- 1. Insert the project
INSERT INTO projects (
    id, title, github_url, 
    star_situation, star_task, star_action, star_result, star_impact, star_architecture,
    featured
) VALUES (
    'p6',  -- New project ID
    'My New ML Project',
    'https://github.com/yourusername/project',
    'The company needed to classify images...',
    'Build a CNN classifier with 95%+ accuracy',
    'Implemented ResNet architecture, used transfer learning...',
    'Achieved 97% accuracy on test set',
    'Reduced manual labeling time by 80%',
    'PyTorch-based pipeline with FastAPI serving',
    1  -- Set to featured
);

-- 2. Add technologies
INSERT INTO project_technologies (project_id, technology) VALUES
    ('p6', 'Python'),
    ('p6', 'PyTorch'),
    ('p6', 'FastAPI'),
    ('p6', 'Docker');
```

### Updating Existing Project

```sql
-- Update project details
UPDATE projects
SET 
    star_result = 'Updated result with new metrics: 98.5% accuracy',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'p1';

-- Add a new technology to existing project
INSERT INTO project_technologies (project_id, technology) 
VALUES ('p1', 'Kubernetes');
```

### Adding New Experience

```sql
-- 1. Insert experience
INSERT INTO experience (
    id, role, company, duration, location,
    star_situation, star_task, star_action, star_result, star_impact, star_architecture
) VALUES (
    4,  -- New experience ID
    'Senior ML Engineer',
    'Tech Company',
    '01/2026 to Present',
    'San Francisco, CA',
    'The team needed to scale ML infrastructure...',
    'Design and implement scalable ML pipeline',
    'Built Kubernetes-based ML platform with Kubeflow...',
    'Reduced model deployment time from days to hours',
    'Platform now serves 100M+ predictions per day',
    'Microservices architecture with gRPC and Redis'
);

-- 2. Add technologies
INSERT INTO experience_technologies (experience_id, technology) VALUES
    (4, 'Python'),
    (4, 'Kubernetes'),
    (4, 'Kubeflow');

-- 3. Add competencies (optional)
INSERT INTO experience_competencies (experience_id, competency) VALUES
    (4, 'Technical Leadership: MLOps Platform Architecture');
```

### Updating Skills

```sql
-- Add new skills to a category
INSERT INTO skills (category, skill) VALUES
    ('Cloud And Mlops', 'Kubernetes'),
    ('Ml And Nlp', 'Stable Diffusion');

-- View all skills by category
SELECT category, GROUP_CONCAT(skill, ', ') as skills
FROM skills
GROUP BY category;
```

### Feature/Unfeature a Project

```sql
-- Feature a project
UPDATE projects SET featured = 1 WHERE id = 'p3';

-- Unfeature a project
UPDATE projects SET featured = 0 WHERE id = 'p2';

-- View all featured projects
SELECT id, title FROM projects WHERE featured = 1;
```

## Using DB Client Tools

### TablePlus Example

1. **Create New Connection**:
   - Type: SQLite
   - Host: your-database-url.turso.io
   - Use Auth Token: your_turso_auth_token

2. **Run Queries**:
   - Use the SQL editor tab
   - Press Cmd/Ctrl + Enter to execute

3. **Edit Data**:
   - Click on any table in left sidebar
   - Double-click cells to edit
   - Press Cmd/Ctrl + S to save

### DBeaver Example

1. **New Connection**:
   - Database: SQLite
   - Path: Use remote URL with Turso connection

2. **Query Execution**:
   - Right-click table → View Data
   - Use SQL Editor for complex queries

## Best Practices

### 1. Always Use Transactions for Multiple Updates

```sql
BEGIN TRANSACTION;

-- Multiple operations here
INSERT INTO projects (...) VALUES (...);
INSERT INTO project_technologies (...) VALUES (...);

COMMIT;  -- Or ROLLBACK if something went wrong
```

### 2. Verify Changes Before Committing

```sql
-- Check before update
SELECT * FROM projects WHERE id = 'p1';

-- Make update
UPDATE projects SET title = 'New Title' WHERE id = 'p1';

-- Verify
SELECT * FROM projects WHERE id = 'p1';
```

### 3. Backup Before Major Changes

```bash
# Export current data
turso db shell portfolio-db ".dump" > backup-$(date +%Y%m%d).sql

# Or using CLI
turso db backup portfolio-db
```

### 4. Use WHERE Clauses Carefully

```sql
-- ❌ DON'T: This updates ALL projects
UPDATE projects SET featured = 1;

-- ✅ DO: Be specific
UPDATE projects SET featured = 1 WHERE id = 'p3';
```

### 5. Test Queries with SELECT First

```sql
-- First, see what will be affected
SELECT * FROM projects WHERE featured = 0;

-- Then update
UPDATE projects SET featured = 1 WHERE id IN ('p3', 'p4');
```

## Troubleshooting

### Connection Issues

```bash
# Check database exists
turso db list

# Check credentials
turso auth whoami

# Test connection
turso db shell portfolio-db "SELECT 1"
```

### Data Not Showing in Frontend

1. Check backend logs for database connection
2. Verify data in database: `SELECT * FROM projects LIMIT 1`
3. Restart backend to reload data
4. Check browser console for API errors

### Syntax Errors

- Use single quotes for strings: `'value'` not `"value"`
- Boolean values: `1` for true, `0` for false
- NULL for missing values: `NULL` not `null`

## Quick Reference

### View All Data

```sql
-- Projects
SELECT id, title, featured FROM projects ORDER BY id;

-- Experience
SELECT id, role, company FROM experience ORDER BY id;

-- Skills by category
SELECT category, COUNT(*) as count FROM skills GROUP BY category;

-- Recent AI queries
SELECT query_text, agent_used, response_time, cached 
FROM ai_query_logs 
ORDER BY timestamp DESC 
LIMIT 10;
```

### Common Filters

```sql
-- Featured projects only
SELECT * FROM projects WHERE featured = 1;

-- Projects by technology
SELECT DISTINCT p.* 
FROM projects p
JOIN project_technologies pt ON p.id = pt.project_id
WHERE pt.technology = 'Python';

-- Experience at specific company
SELECT * FROM experience WHERE company LIKE '%Indiana%';
```

---

**Need Help?** Check the Turso documentation: https://docs.turso.tech/

**Schema Reference:** See `backend/migrations/001_initial_schema.sql`
