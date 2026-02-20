"""
Seed Database from TypeScript Files
ONE-TIME script to populate Turso database with current polished TypeScript content
"""

import sys
import os
from pathlib import Path
import json
import re
import argparse
from typing import Dict, Any, List
from datetime import datetime

# Add parent directory to path
backend_path = Path(__file__).parent.parent
sys.path.insert(0, str(backend_path))

from dotenv import load_dotenv

load_dotenv()

try:
    import libsql
    from app.config import get_settings
except ImportError as e:
    print(f"❌ Error importing modules: {e}")
    sys.exit(1)


def get_db_connection():
    """Get Turso database connection"""
    settings = get_settings()

    if not settings.has_turso:
        print("❌ Turso database not configured")
        sys.exit(1)

    try:
        client = libsql.connect(
            database=settings.turso_database_url, auth_token=settings.turso_auth_token
        )
        return client
    except Exception as e:
        print(f"❌ Cannot connect to Turso database: {e}")
        sys.exit(1)


def parse_typescript_const(content: str, const_name: str) -> Any:
    """
    Extract a TypeScript const export value
    Example: export const PROFILE: Profile = { ... }
    """
    # Pattern to match export const NAME = { ... } or [ ... ]
    pattern = rf"export const {const_name}(?::\s*\w+(?:\[\])?)?\s*=\s*([\{{\[][\s\S]*?^(?=\}};|\];)[\}}\]])"

    match = re.search(pattern, content, re.MULTILINE)
    if not match:
        return None

    ts_value = match.group(1) + ("};" if "{" in match.group(1)[:10] else "];")

    # Convert TypeScript to JSON
    json_str = convert_ts_to_json(ts_value)

    try:
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"⚠️  JSON decode error for {const_name}: {e}")
        print(f"    First 200 chars: {json_str[:200]}")
        return None


def convert_ts_to_json(ts_code: str) -> str:
    """Convert TypeScript object/array to valid JSON"""
    # Remove trailing commas before } or ]
    result = re.sub(r",(\s*[\}\]])", r"\1", ts_code)

    # Add quotes to unquoted object keys (but not inside strings)
    # This is complex, so we'll use a simple approach
    result = re.sub(r"(\n\s*)(\w+):", r'\1"\2":', result)

    # Handle boolean/null
    result = result.replace(": true", ": true")
    result = result.replace(": false", ": false")
    result = result.replace(": null", ": null")

    # Remove TypeScript type assertions and comments
    result = re.sub(r"//.*?\n", "\n", result)

    return result


def parse_all_typescript_files() -> Dict[str, Any]:
    """Parse all TypeScript data files"""
    frontend_data_dir = Path("frontend/src/data")

    if not frontend_data_dir.exists():
        print(f"❌ Frontend data directory not found: {frontend_data_dir}")
        sys.exit(1)

    data = {}

    print("📖 Parsing TypeScript files...")

    # Profile and Education
    profile_file = frontend_data_dir / "profile.ts"
    if profile_file.exists():
        content = profile_file.read_text()
        data["profile"] = parse_typescript_const(content, "PROFILE")
        data["education"] = parse_typescript_const(content, "EDUCATION")
        print(f"   ✓ profile.ts")

    # Experience
    exp_file = frontend_data_dir / "experience.ts"
    if exp_file.exists():
        content = exp_file.read_text()
        data["experience"] = parse_typescript_const(content, "EXPERIENCE")
        print(f"   ✓ experience.ts")

    # Projects
    proj_file = frontend_data_dir / "projects.ts"
    if proj_file.exists():
        content = proj_file.read_text()
        data["projects"] = parse_typescript_const(content, "PROJECTS")
        print(f"   ✓ projects.ts")

    # Skills
    skills_file = frontend_data_dir / "skills.ts"
    if skills_file.exists():
        content = skills_file.read_text()
        data["skills"] = parse_typescript_const(content, "SKILLS")
        print(f"   ✓ skills.ts")

    # Publications
    pubs_file = frontend_data_dir / "publications.ts"
    if pubs_file.exists():
        content = pubs_file.read_text()
        data["publications"] = parse_typescript_const(content, "PUBLICATIONS")
        print(f"   ✓ publications.ts")

    # Activities
    act_file = frontend_data_dir / "activities.ts"
    if act_file.exists():
        content = act_file.read_text()
        data["activities"] = parse_typescript_const(content, "ACTIVITIES")
        print(f"   ✓ activities.ts")

    return data


def show_summary(data: Dict[str, Any]):
    """Show summary of parsed data"""
    print("\n" + "=" * 60)
    print("📊 PARSED DATA SUMMARY")
    print("=" * 60)

    if data.get("profile"):
        print(f"✓ Profile: {data['profile'].get('name', 'N/A')}")

    if data.get("education"):
        print(f"✓ Education: {data['education'].get('degree', 'N/A')}")

    if data.get("experience"):
        print(f"✓ Experience: {len(data['experience'])} role(s)")
        for exp in data["experience"]:
            print(f"    - {exp.get('role', '?')} at {exp.get('company', '?')}")

    if data.get("projects"):
        print(f"✓ Projects: {len(data['projects'])} project(s)")
        for proj in data["projects"]:
            print(f"    - {proj.get('id', '?')}: {proj.get('title', '?')}")

    if data.get("skills"):
        total_skills = sum(len(v) for v in data["skills"].values())
        print(f"✓ Skills: {len(data['skills'])} categories, {total_skills} skills")

    if data.get("publications"):
        print(f"✓ Publications: {len(data['publications'])} publication(s)")

    if data.get("activities"):
        print(f"✓ Activities: {len(data['activities'])} activity/ies")

    print("=" * 60)


def backup_database(client):
    """Create backup of current database"""
    print("\n💾 Creating database backup...")

    try:
        from app.database import TursoDatabase

        db = TursoDatabase()

        if not db.is_available():
            print("   ⚠️  Database not available, skipping backup")
            return None

        backup_data = db.get_complete_portfolio()

        # Save to file
        backup_dir = Path("backend/backups")
        backup_dir.mkdir(exist_ok=True)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_file = backup_dir / f"turso_backup_{timestamp}.json"

        with open(backup_file, "w") as f:
            json.dump(backup_data, f, indent=2)

        print(f"   ✓ Backup saved to: {backup_file}")
        return backup_file

    except Exception as e:
        print(f"   ⚠️  Backup failed: {e}")
        return None


def clear_portfolio_data(client):
    """Clear existing portfolio data from database"""
    print("\n🗑️  Clearing existing data...")

    tables = [
        "activities",
        "publications",
        "project_technologies",
        "projects",
        "skills",
        "experience_soft_skills",
        "experience_competencies",
        "experience_technologies",
        "experience",
        "education_coursework",
        "education",
        "profile_highlights",
        "profile_links",
        "profile",
    ]

    for table in tables:
        try:
            client.execute(f"DELETE FROM {table}")
            print(f"   ✓ Cleared {table}")
        except Exception as e:
            print(f"   ⚠️  Error clearing {table}: {e}")

    client.commit()


def insert_profile(client, profile_data: Dict[str, Any]):
    """Insert profile data"""
    if not profile_data:
        return

    print("\n   Inserting profile...")

    try:
        # Insert profile
        client.execute(
            """INSERT INTO profile (id, name, title, summary, location, email)
               VALUES (1, ?, ?, ?, ?, ?)""",
            (
                profile_data["name"],
                profile_data["title"],
                profile_data["summary"],
                profile_data["location"],
                profile_data["email"],
            ),
        )

        # Insert links
        for link in profile_data.get("links", []):
            client.execute(
                "INSERT INTO profile_links (profile_id, type, url) VALUES (1, ?, ?)",
                (link["type"], link["url"]),
            )

        # Insert highlights
        for i, highlight in enumerate(profile_data.get("highlights", [])):
            client.execute(
                "INSERT INTO profile_highlights (profile_id, highlight, display_order) VALUES (1, ?, ?)",
                (highlight, i),
            )

        client.commit()
        print("   ✓ Profile inserted")
    except Exception as e:
        print(f"   ❌ Error inserting profile: {e}")


def insert_education(client, edu_data: Dict[str, Any]):
    """Insert education data"""
    if not edu_data:
        return

    print("   Inserting education...")

    try:
        client.execute(
            """INSERT INTO education (id, degree, university, graduation, gpa)
               VALUES (1, ?, ?, ?, ?)""",
            (
                edu_data["degree"],
                edu_data["university"],
                edu_data["graduation"],
                edu_data.get("gpa"),
            ),
        )

        # Insert coursework
        for i, course in enumerate(edu_data.get("coursework", [])):
            client.execute(
                "INSERT INTO education_coursework (education_id, course, display_order) VALUES (1, ?, ?)",
                (course, i),
            )

        client.commit()
        print("   ✓ Education inserted")
    except Exception as e:
        print(f"   ❌ Error inserting education: {e}")


def insert_experience(client, exp_list: List[Dict[str, Any]]):
    """Insert experience data"""
    if not exp_list:
        return

    print(f"   Inserting {len(exp_list)} experience(s)...")

    for exp in exp_list:
        try:
            # Insert experience
            client.execute(
                """INSERT INTO experience 
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

            # Insert technologies
            for tech in exp.get("technologies", []):
                client.execute(
                    "INSERT INTO experience_technologies (experience_id, technology) VALUES (?, ?)",
                    (exp["id"], tech),
                )

            # Insert competencies
            for comp in exp.get("competencies", []):
                client.execute(
                    "INSERT INTO experience_competencies (experience_id, competency) VALUES (?, ?)",
                    (exp["id"], comp),
                )

            # Insert soft skills
            for skill in exp.get("soft_skills", []):
                client.execute(
                    "INSERT INTO experience_soft_skills (experience_id, soft_skill) VALUES (?, ?)",
                    (exp["id"], skill),
                )

        except Exception as e:
            print(f"   ❌ Error inserting experience {exp.get('id')}: {e}")

    client.commit()
    print(f"   ✓ {len(exp_list)} experience(s) inserted")


def insert_projects(client, proj_list: List[Dict[str, Any]]):
    """Insert projects data"""
    if not proj_list:
        return

    print(f"   Inserting {len(proj_list)} project(s)...")

    for proj in proj_list:
        try:
            # Insert project
            client.execute(
                """INSERT INTO projects 
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

            # Insert technologies
            for tech in proj.get("technologies", []):
                client.execute(
                    "INSERT INTO project_technologies (project_id, technology) VALUES (?, ?)",
                    (proj["id"], tech),
                )

        except Exception as e:
            print(f"   ❌ Error inserting project {proj.get('id')}: {e}")

    client.commit()
    print(f"   ✓ {len(proj_list)} project(s) inserted")


def insert_skills(client, skills_data: Dict[str, List[str]]):
    """Insert skills data"""
    if not skills_data:
        return

    total = sum(len(v) for v in skills_data.values())
    print(f"   Inserting {total} skill(s) across {len(skills_data)} categories...")

    for category, skill_list in skills_data.items():
        for skill in skill_list:
            try:
                client.execute(
                    "INSERT INTO skills (category, skill) VALUES (?, ?)",
                    (category, skill),
                )
            except Exception as e:
                print(f"   ❌ Error inserting skill '{skill}': {e}")

    client.commit()
    print(f"   ✓ {total} skill(s) inserted")


def insert_publications(client, pubs_list: List[Dict[str, Any]]):
    """Insert publications data"""
    if not pubs_list:
        return

    print(f"   Inserting {len(pubs_list)} publication(s)...")

    for pub in pubs_list:
        try:
            client.execute(
                """INSERT INTO publications (id, title, outlet, date, related_project_id)
                   VALUES (?, ?, ?, ?, ?)""",
                (
                    pub["id"],
                    pub["title"],
                    pub["outlet"],
                    pub["date"],
                    pub.get("related_project_id"),
                ),
            )
        except Exception as e:
            print(f"   ❌ Error inserting publication {pub.get('id')}: {e}")

    client.commit()
    print(f"   ✓ {len(pubs_list)} publication(s) inserted")


def insert_activities(client, act_list: List[Dict[str, Any]]):
    """Insert activities data"""
    if not act_list:
        return

    print(f"   Inserting {len(act_list)} activity/ies...")

    for act in act_list:
        try:
            client.execute(
                """INSERT INTO activities (time, category, title, description, type)
                   VALUES (?, ?, ?, ?, ?)""",
                (
                    act["time"],
                    act["category"],
                    act["title"],
                    act["description"],
                    act["type"],
                ),
            )
        except Exception as e:
            print(f"   ❌ Error inserting activity: {e}")

    client.commit()
    print(f"   ✓ {len(act_list)} activity/ies inserted")


def verify_seeded_data(client):
    """Verify data was inserted correctly"""
    print("\n🔍 Verifying seeded data...")

    tables_to_check = [
        ("profile", "SELECT COUNT(*) FROM profile"),
        ("experience", "SELECT COUNT(*) FROM experience"),
        ("projects", "SELECT COUNT(*) FROM projects"),
        ("skills", "SELECT COUNT(DISTINCT category) FROM skills"),
        ("publications", "SELECT COUNT(*) FROM publications"),
        ("activities", "SELECT COUNT(*) FROM activities"),
    ]

    for table_name, query in tables_to_check:
        try:
            cursor = client.execute(query)
            count = cursor.fetchone()[0]
            print(f"   ✓ {table_name}: {count} record(s)")
        except Exception as e:
            print(f"   ⚠️  Error checking {table_name}: {e}")


def main():
    """Main function"""
    parser = argparse.ArgumentParser(
        description="Seed Turso database from TypeScript files (ONE-TIME operation)"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Parse and show summary without seeding database",
    )
    parser.add_argument("--force", action="store_true", help="Skip confirmation prompt")

    args = parser.parse_args()

    print("\n" + "=" * 60)
    print("🌱 SEED TURSO DATABASE FROM TYPESCRIPT")
    print("=" * 60)
    print("\n⚠️  WARNING: This will REPLACE all portfolio data in Turso")
    print("   Current database will be backed up first.\n")

    # Parse TypeScript files
    data = parse_all_typescript_files()

    # Show summary
    show_summary(data)

    if args.dry_run:
        print("\n[DRY RUN] Database would be seeded with above data.")
        print("Run without --dry-run to actually seed the database.")
        return

    # Confirm
    if not args.force:
        response = input("\n❓ Continue with database seeding? (y/N): ")
        if response.lower() != "y":
            print("❌ Cancelled by user")
            return

    # Connect to database
    client = get_db_connection()

    try:
        # Backup
        backup_file = backup_database(client)

        # Clear existing data
        clear_portfolio_data(client)

        # Insert all data
        print("\n📝 Inserting data...")
        insert_profile(client, data.get("profile"))
        insert_education(client, data.get("education"))
        insert_experience(client, data.get("experience", []))
        insert_projects(client, data.get("projects", []))
        insert_skills(client, data.get("skills", {}))
        insert_publications(client, data.get("publications", []))
        insert_activities(client, data.get("activities", []))

        # Verify
        verify_seeded_data(client)

        print("\n" + "=" * 60)
        print("✅ DATABASE SEEDED SUCCESSFULLY!")
        print("=" * 60)
        print("\nYour polished TypeScript content is now in Turso!")
        print("\nNext steps:")
        print("  1. Verify: python scripts/view_portfolio.py")
        print("  2. Test sync: python scripts/sync_new_items.py --dry-run")

        if backup_file:
            print(f"\n💾 Backup saved to: {backup_file}")

    except Exception as e:
        print(f"\n❌ Seeding failed: {e}")
        import traceback

        traceback.print_exc()
        sys.exit(1)
    finally:
        client.close()


if __name__ == "__main__":
    main()
