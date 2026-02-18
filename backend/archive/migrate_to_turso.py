"""
Migration script to transfer data from portfolio_data.json to Turso database
Run this after setting up Turso credentials in .env file
"""

import json
import sys
import os
from pathlib import Path

# Add parent directory to path to import app modules
sys.path.insert(0, str(Path(__file__).parent))

try:
    import libsql
except ImportError:
    print("❌ Error: libsql not installed")
    print("Run: pip install libsql")
    sys.exit(1)

from app.config import get_settings
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

settings = get_settings()


def load_json_data():
    """Load portfolio data from JSON file"""
    json_path = Path(__file__).parent / "app" / "data" / "portfolio_data.json"

    if not json_path.exists():
        print(f"❌ Error: {json_path} not found")
        sys.exit(1)

    with open(json_path, "r", encoding="utf-8") as f:
        return json.load(f)


def run_migration():
    """Run the complete migration"""

    print("=" * 80)
    print("Turso Database Migration")
    print("=" * 80)

    # Validate credentials
    if not settings.turso_database_url or not settings.turso_auth_token:
        print("❌ Error: Turso credentials not configured")
        print("Please set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in .env file")
        sys.exit(1)

    print(f"\n📡 Connecting to Turso database...")
    print(f"   URL: {settings.turso_database_url[:30]}...")

    try:
        # Connect to Turso database using libsql
        client = libsql.connect(
            database=settings.turso_database_url, auth_token=settings.turso_auth_token
        )
        print("✅ Connected successfully\n")
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        sys.exit(1)

    # Load JSON data
    print("📂 Loading portfolio_data.json...")
    data = load_json_data()
    print(f"✅ Data loaded successfully\n")

    # Run schema migration
    print("🏗️  Creating database schema...")
    schema_path = Path(__file__).parent / "migrations" / "001_initial_schema.sql"

    if not schema_path.exists():
        print(f"❌ Error: {schema_path} not found")
        sys.exit(1)

    with open(schema_path, "r", encoding="utf-8") as f:
        schema_sql = f.read()

    try:
        # Remove SQL comments (-- style)
        lines = schema_sql.split("\n")
        cleaned_lines = []
        for line in lines:
            # Remove inline comments
            if "--" in line:
                line = line[: line.index("--")]
            if line.strip():
                cleaned_lines.append(line)

        cleaned_sql = "\n".join(cleaned_lines)

        # Split statements by semicolon
        all_statements = [s.strip() for s in cleaned_sql.split(";") if s.strip()]

        # Separate CREATE TABLE from CREATE INDEX
        table_statements = [s for s in all_statements if "CREATE TABLE" in s.upper()]
        index_statements = [s for s in all_statements if "CREATE INDEX" in s.upper()]

        print(f"   Found {len(all_statements)} total statements")
        print(f"   Executing {len(table_statements)} CREATE TABLE statements...")

        # Execute and commit table creation first
        for statement in table_statements:
            try:
                client.execute(statement)
            except Exception as e:
                print(f"   ⚠️  Table exists: {e}")
                # Continue even if table already exists

        client.commit()
        print(f"   ✅ Tables committed\n")

        # Verify tables were created
        print("🔍 Verifying tables...")
        cursor = client.execute(
            "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
        )
        tables = cursor.fetchall()
        if tables:
            print(f"   Found {len(tables)} tables:")
            for table in tables:
                print(f"      • {table[0]}")
            print()
        else:
            print("   ❌ Error: No tables found!")
            print("   Schema creation failed.\n")
            sys.exit(1)

        # Now create indexes
        if index_statements:
            print(f"📊 Creating {len(index_statements)} indexes...")
            for statement in index_statements:
                try:
                    client.execute(statement)
                except Exception as e:
                    print(f"   ⚠️  Index exists: {e}")
                    # Continue even if index already exists

            client.commit()
            print("   ✅ Indexes created\n")

        print("✅ Schema created successfully\n")

    except Exception as e:
        print(f"❌ Schema creation error: {e}")
        print("   Cannot proceed without schema. Please check:")
        print("   1. Database connection is valid")
        print("   2. migrations/001_initial_schema.sql exists")
        print("   3. SQL syntax in schema file is correct\n")
        import traceback

        traceback.print_exc()
        sys.exit(1)

    # Migrate Profile
    print("👤 Migrating profile data...")
    try:
        profile = data["profile"]
        client.execute(
            """INSERT OR REPLACE INTO profile (id, name, title, summary, location, email)
               VALUES (1, ?, ?, ?, ?, ?)""",
            (
                profile["name"],
                profile["title"],
                profile["summary"],
                profile["location"],
                profile["email"],
            ),
        )

        # Clear existing links and highlights
        client.execute("DELETE FROM profile_links WHERE profile_id = 1")
        client.execute("DELETE FROM profile_highlights WHERE profile_id = 1")

        # Insert links
        for link in profile["links"]:
            client.execute(
                "INSERT INTO profile_links (profile_id, type, url) VALUES (1, ?, ?)",
                (link["type"], link["url"]),
            )

        # Insert highlights
        for i, highlight in enumerate(profile["highlights"]):
            client.execute(
                "INSERT INTO profile_highlights (profile_id, highlight, display_order) VALUES (1, ?, ?)",
                (highlight, i),
            )

        client.commit()
        print(f"   ✅ Profile: {profile['name']}")
        print(f"   ✅ Links: {len(profile['links'])}")
        print(f"   ✅ Highlights: {len(profile['highlights'])}\n")
    except Exception as e:
        print(f"   ❌ Error: {e}\n")

    # Migrate Education
    print("🎓 Migrating education data...")
    try:
        edu = data["education"]
        client.execute(
            """INSERT OR REPLACE INTO education (id, degree, university, graduation, gpa)
               VALUES (1, ?, ?, ?, ?)""",
            (edu["degree"], edu["university"], edu["graduation"], edu.get("gpa")),
        )

        # Clear and insert coursework
        client.execute("DELETE FROM education_coursework WHERE education_id = 1")
        for i, course in enumerate(edu.get("coursework", [])):
            client.execute(
                "INSERT INTO education_coursework (education_id, course, display_order) VALUES (1, ?, ?)",
                (course, i),
            )

        client.commit()
        print(f"   ✅ Degree: {edu['degree']}")
        print(f"   ✅ Coursework: {len(edu.get('coursework', []))}\n")
    except Exception as e:
        print(f"   ❌ Error: {e}\n")

    # Migrate Experience
    print("💼 Migrating experience data...")
    try:
        for exp in data["experience"]:
            client.execute(
                """INSERT OR REPLACE INTO experience 
                   (id, role, company, duration, location, star_situation, star_task,
                    star_action, star_result, star_impact, star_architecture)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    exp["id"],
                    exp["role"],
                    exp["company"],
                    exp["duration"],
                    exp["location"],
                    exp["star"]["situation"],
                    exp["star"]["task"],
                    exp["star"]["action"],
                    exp["star"]["result"],
                    exp["star"]["impact"],
                    exp["star"]["architecture"],
                ),
            )

            # Clear and insert technologies
            client.execute(
                "DELETE FROM experience_technologies WHERE experience_id = ?",
                (exp["id"],),
            )
            for tech in exp["technologies"]:
                client.execute(
                    "INSERT INTO experience_technologies (experience_id, technology) VALUES (?, ?)",
                    (exp["id"], tech),
                )

            # Clear and insert competencies
            client.execute(
                "DELETE FROM experience_competencies WHERE experience_id = ?",
                (exp["id"],),
            )
            for comp in exp.get("competencies", []):
                client.execute(
                    "INSERT INTO experience_competencies (experience_id, competency) VALUES (?, ?)",
                    (exp["id"], comp),
                )

            # Clear and insert soft skills
            client.execute(
                "DELETE FROM experience_soft_skills WHERE experience_id = ?",
                (exp["id"],),
            )
            for skill in exp.get("soft_skills", []):
                client.execute(
                    "INSERT INTO experience_soft_skills (experience_id, soft_skill) VALUES (?, ?)",
                    (exp["id"], skill),
                )

            print(f"   ✅ {exp['role']} at {exp['company']}")

        client.commit()
        print(f"\n   Total: {len(data['experience'])} experiences\n")
    except Exception as e:
        print(f"   ❌ Error: {e}\n")

    # Migrate Projects
    print("🚀 Migrating projects data...")
    try:
        for proj in data["projects"]:
            client.execute(
                """INSERT OR REPLACE INTO projects 
                   (id, title, github_url, star_situation, star_task, star_action,
                    star_result, star_impact, star_architecture, featured)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    proj["id"],
                    proj["title"],
                    proj["github_url"],
                    proj["star"]["situation"],
                    proj["star"]["task"],
                    proj["star"]["action"],
                    proj["star"]["result"],
                    proj["star"]["impact"],
                    proj["star"]["architecture"],
                    1 if proj.get("featured", False) else 0,
                ),
            )

            # Clear and insert technologies
            client.execute(
                "DELETE FROM project_technologies WHERE project_id = ?", (proj["id"],)
            )
            for tech in proj["technologies"]:
                client.execute(
                    "INSERT INTO project_technologies (project_id, technology) VALUES (?, ?)",
                    (proj["id"], tech),
                )

            featured_mark = "⭐" if proj.get("featured") else "  "
            print(f"   ✅ {featured_mark} {proj['title']}")

        client.commit()
        print(f"\n   Total: {len(data['projects'])} projects\n")
    except Exception as e:
        print(f"   ❌ Error: {e}\n")

    # Migrate Skills
    print("🛠️  Migrating skills data...")
    try:
        skills = data["skills"]
        skill_count = 0

        # Clear existing skills
        client.execute("DELETE FROM skills")

        for category_key, skill_list in skills.items():
            # Convert snake_case to Title Case for display
            category_name = category_key.replace("_", " ").title()

            for skill in skill_list:
                client.execute(
                    "INSERT INTO skills (category, skill) VALUES (?, ?)",
                    (category_name, skill),
                )
                skill_count += 1

        client.commit()
        print(f"   ✅ Total: {skill_count} skills across {len(skills)} categories\n")
    except Exception as e:
        print(f"   ❌ Error: {e}\n")

    # Migrate Publications
    print("📚 Migrating publications data...")
    try:
        for pub in data["publications"]:
            client.execute(
                """INSERT OR REPLACE INTO publications 
                   (id, title, outlet, date, related_project_id)
                   VALUES (?, ?, ?, ?, ?)""",
                (
                    pub["id"],
                    pub["title"],
                    pub["outlet"],
                    pub["date"],
                    pub.get("related_project_id"),
                ),
            )
            print(f"   ✅ {pub['title']}")

        client.commit()
        print(f"\n   Total: {len(data['publications'])} publications\n")
    except Exception as e:
        print(f"   ❌ Error: {e}\n")

    # Verify migration
    print("🔍 Verifying migration...")
    try:
        counts = {}
        tables = ["profile", "experience", "projects", "skills", "publications"]

        for table in tables:
            cursor = client.execute(f"SELECT COUNT(*) FROM {table}")
            result = cursor.fetchone()
            counts[table] = result[0] if result else 0

        print(f"""
   Profile:      {counts["profile"]} ✅
   Experience:   {counts["experience"]} ✅
   Projects:     {counts["projects"]} ✅
   Skills:       {counts["skills"]} ✅
   Publications: {counts["publications"]} ✅
        """)
    except Exception as e:
        print(f"   ❌ Verification error: {e}\n")

    print("=" * 80)
    print("✅ Migration completed successfully!")
    print("=" * 80)
    print("\nNext steps:")
    print("1. Verify data in Turso: turso db shell portfolio-db")
    print("2. Test backend with new database connection")
    print("3. Update .env files for deployment (Render, Vercel)")
    print()


if __name__ == "__main__":
    try:
        run_migration()
    except KeyboardInterrupt:
        print("\n\n❌ Migration cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Migration failed: {e}")
        import traceback

        traceback.print_exc()
        sys.exit(1)
