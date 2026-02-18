# Portfolio Management Scripts

Tools for viewing, editing, and managing your portfolio content in Turso database.

---

## ⚡ NEW: Append-Only Sync System

### ONE-TIME SETUP

```bash
# 1. Apply Activities migration
python scripts/apply_migration.py 002_add_activities_table.sql

# 2. Seed database with TypeScript content
python scripts/seed_from_typescript.py

# 3. Verify
python scripts/view_portfolio.py
```

### ONGOING WORKFLOW

```bash
# 1. Import new content
python scripts/import_from_claude.py imports/new_project.json

# 2. Sync to TypeScript (append-only!)
python scripts/sync_new_items.py

# 3. Deploy
git add frontend/src/data/ && git commit && git push
```

---

## 🎯 Quick Start

### View Your Current Content
```bash
cd backend

# View everything
python scripts/view_portfolio.py

# View specific section
python scripts/view_portfolio.py projects
python scripts/view_portfolio.py experience
```

### Export for Claude Review
```bash
# Export in Claude-friendly format
python scripts/view_portfolio.py --export-for-claude exports/review.txt

# Open review.txt, copy to Claude, ask for improvements
```

### Import Claude's Improvements
```bash
# Save Claude's JSON response to a file, then:
python scripts/import_from_claude.py imports/new_project.json

# Verify changes
python scripts/view_portfolio.py projects
```

---

## 📁 Scripts Overview

### 1. `view_portfolio.py` - View & Export Data

**View all content:**
```bash
python scripts/view_portfolio.py
```

**View specific section:**
```bash
python scripts/view_portfolio.py profile
python scripts/view_portfolio.py education
python scripts/view_portfolio.py experience
python scripts/view_portfolio.py projects
python scripts/view_portfolio.py skills
python scripts/view_portfolio.py publications
```

**Export to JSON:**
```bash
python scripts/view_portfolio.py --export backup.json
```

**Export for Claude review:**
```bash
python scripts/view_portfolio.py --export-for-claude review.txt
```

---

### 2. `import_from_claude.py` - Import New Content

**Import with auto-detection:**
```bash
python scripts/import_from_claude.py imports/new_content.json
```

**Import with specific type:**
```bash
python scripts/import_from_claude.py imports/new_project.json --type project
python scripts/import_from_claude.py imports/new_experience.json --type experience
python scripts/import_from_claude.py imports/new_publication.json --type publication
```

**Dry run (preview without changes):**
```bash
python scripts/import_from_claude.py imports/new_content.json --dry-run
```

**Force import (skip confirmation):**
```bash
python scripts/import_from_claude.py imports/new_content.json --force
```

---

## 📚 Templates & Guides

### Content Templates
- `templates/CONTENT_TEMPLATE.md` - Structure for new content
- `templates/CLAUDE_EXAMPLES.md` - Ready-to-use Claude prompts

### Directories
- `exports/` - Store exported data here
- `imports/` - Place JSON files to import here
- `templates/` - Templates and examples

---

## 🔄 Complete Workflow

### Scenario 1: Add a New Project

**Step 1: Create draft**
```json
{
  "id": "p6",
  "title": "My New Project",
  "github_url": "https://github.com/user/project",
  "featured": true,
  "star": {
    "situation": "[Brief context]",
    "task": "[What needed to be done]",
    "action": "[What you did]",
    "result": "[Outcomes]",
    "impact": "[Value delivered]",
    "architecture": "[Technical design]"
  },
  "technologies": ["Python", "FastAPI", "React"]
}
```

**Step 2: Get Claude's help**
- Open Claude chat
- Use prompts from `templates/CLAUDE_EXAMPLES.md`
- Get improved STAR descriptions

**Step 3: Import**
```bash
# Save Claude's response to file
echo '[JSON]' > imports/new_project.json

# Import
python scripts/import_from_claude.py imports/new_project.json --type project

# Verify
python scripts/view_portfolio.py projects
```

---

### Scenario 2: Improve Existing Content

**Step 1: Export current content**
```bash
python scripts/view_portfolio.py --export-for-claude exports/current.txt
```

**Step 2: Ask Claude for improvements**
```
I'm applying for [role] at [company type].
Here's my current portfolio:
[Paste from current.txt]

Please review and improve:
1. [Specific project/experience]
2. [Another item]

Make them more compelling for recruiters.
Return as JSON.
```

**Step 3: Import improvements**
```bash
python scripts/import_from_claude.py imports/improved.json
```

---

### Scenario 3: Bulk Update Multiple Items

**Step 1: Export everything**
```bash
python scripts/view_portfolio.py --export backup.json
```

**Step 2: Edit JSON file**
- Open `backup.json` in your editor
- Make changes
- Save individual items to separate files

**Step 3: Import each item**
```bash
python scripts/import_from_claude.py imports/project1.json --type project
python scripts/import_from_claude.py imports/project2.json --type project
python scripts/import_from_claude.py imports/experience1.json --type experience
```

---

## 🎨 Using Claude Effectively

### Best Practices

1. **Provide Context**
   ```
   Context: I'm a [role] with [X] years, targeting [companies].
   Target: [Specific role/level you're applying for]
   ```

2. **Be Specific**
   ```
   Don't: "Improve this project"
   Do: "Make this project showcase my ML expertise for FAANG ML roles"
   ```

3. **Iterate**
   ```
   First draft: Get structure
   Second draft: Add details
   Third draft: Polish and refine
   ```

4. **Verify Accuracy**
   - Claude enhances, you verify
   - Don't use metrics you can't defend
   - Keep your authentic voice

### Example Prompt
```
I'm applying for Senior Backend Engineer at tech startups.

Project: [Name]
What it does: [Description]
Technologies: [List]
Achievements:
- Reduced latency by ~40%
- Handles 10K requests/second
- Deployed on AWS with 99.9% uptime

Please write compelling STAR descriptions that emphasize:
- System design skills
- Performance optimization
- Production reliability
- Scalability

Return as JSON matching the format in CONTENT_TEMPLATE.md
```

---

## 📊 Database Direct Access

### Using Turso CLI
```bash
# Connect to database
turso db shell portfolio-db

# View projects
SELECT id, title, featured FROM projects;

# View all project data
SELECT * FROM projects WHERE id = 'p1';

# Update a project's featured status
UPDATE projects SET featured = 1 WHERE id = 'p2';

# Exit
.exit
```

### Using GUI Tool (Recommended)

**TablePlus (Mac/Windows):**
1. Download from https://tableplus.com
2. Create new connection
3. Type: LibSQL/Turso
4. URL: Your `TURSO_DATABASE_URL`
5. Auth Token: Your `TURSO_AUTH_TOKEN`
6. Connect & edit visually

**DBeaver (Free, Cross-platform):**
1. Download from https://dbeaver.io
2. Create new database connection
3. Use SQLite driver with Turso URL
4. Visual editing interface

---

## 🔧 Troubleshooting

### Error: "Turso database not configured"
**Solution:** Add to `backend/.env`:
```env
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your_token_here
```

### Error: "Module not found"
**Solution:** Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

### Error: "Cannot connect to Turso"
**Solution:** Test connection:
```bash
turso db shell portfolio-db
# If this works, your credentials are correct
```

### Import fails with validation error
**Solution:** Check JSON structure matches template:
```bash
# Validate JSON syntax
python -m json.tool imports/your_file.json

# Compare with template in templates/CONTENT_TEMPLATE.md
```

---

## 🎯 Pro Tips

1. **Regular Backups**
   ```bash
   # Weekly backup
   python scripts/view_portfolio.py --export backups/$(date +%Y%m%d).json
   ```

2. **Version Control**
   ```bash
   # Track changes to imports
   git add imports/
   git commit -m "Added new project"
   ```

3. **Test Before Import**
   ```bash
   # Always dry-run first
   python scripts/import_from_claude.py new.json --dry-run
   ```

4. **Keep Templates**
   - Save your best Claude prompts
   - Document what works for you
   - Build your prompt library

5. **Iterate with Claude**
   - First version is good
   - Second version is better
   - Third version is great
   - Keep iterating until perfect

---

## 📚 Additional Resources

- `CONTENT_TEMPLATE.md` - Content structure guide
- `CLAUDE_EXAMPLES.md` - Ready-to-use prompts
- `../docs/DATABASE.md` - Database schema reference
- `../../docs/SETUP.md` - Setup guide

---

## 🆘 Need Help?

**For content structure:**
```bash
cat scripts/templates/CONTENT_TEMPLATE.md
```

**For Claude prompts:**
```bash
cat scripts/templates/CLAUDE_EXAMPLES.md
```

**For script usage:**
```bash
python scripts/view_portfolio.py --help
python scripts/import_from_claude.py --help
```

**Database schema:**
```bash
cat backend/migrations/001_initial_schema.sql
```
