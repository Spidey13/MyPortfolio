"""
Sync New Items from Turso to TypeScript
APPEND-ONLY: Only adds new items, never modifies existing content
"""

import sys
import os
from pathlib import Path
import re
import json
import argparse
from typing import Dict, Any, List, Set
from datetime import datetime
import shutil

# Add parent directory to path
backend_path = Path(__file__).parent.parent
sys.path.insert(0, str(backend_path))

from dotenv import load_dotenv

load_dotenv()

try:
    from app.database import get_database
    from app.config import get_settings
except ImportError as e:
    print(f"❌ Error importing modules: {e}")
    sys.exit(1)


def extract_ids_from_typescript(ts_file: Path, pattern: str) -> Set[str]:
    """
    Extract IDs from TypeScript file
    pattern example: r'id:\s*"(p\d+)"' for projects
                     r'id:\s*(\d+),' for experience
    """
    if not ts_file.exists():
        return set()

    content = ts_file.read_text()
    matches = re.findall(pattern, content)
    return set(matches)


def format_string_for_ts(s: str) -> str:
    """Escape and format string for TypeScript"""
    if s is None:
        return "null"
    # Escape quotes and special characters
    s = s.replace("\\", "\\\\")
    s = s.replace('"', '\\"')
    s = s.replace("\n", "\\n")
    return f'"{s}"'


def format_project_as_typescript(proj: Dict[str, Any], indent: str = "  ") -> str:
    """Convert database project to TypeScript format"""
    technologies_str = json.dumps(proj["technologies"])
    featured_str = str(proj.get("featured", False)).lower()

    return f"""{indent}{{
{indent}  id: {format_string_for_ts(proj["id"])},
{indent}  title: {format_string_for_ts(proj["title"])},
{indent}  github_url: {format_string_for_ts(proj["github_url"])},
{indent}  star: {{
{indent}    situation: {format_string_for_ts(proj["star"]["situation"])},
{indent}    task: {format_string_for_ts(proj["star"]["task"])},
{indent}    action: {format_string_for_ts(proj["star"]["action"])},
{indent}    result: {format_string_for_ts(proj["star"]["result"])},
{indent}    impact: {format_string_for_ts(proj["star"]["impact"])},
{indent}    architecture: {format_string_for_ts(proj["star"]["architecture"])}
{indent}  }},
{indent}  technologies: {technologies_str},
{indent}  featured: {featured_str}
{indent}}}"""


def format_experience_as_typescript(exp: Dict[str, Any], indent: str = "  ") -> str:
    """Convert database experience to TypeScript format"""
    technologies_str = json.dumps(exp["technologies"])
    competencies_str = json.dumps(exp.get("competencies", []))
    soft_skills_str = json.dumps(exp.get("soft_skills", []))

    return f"""{indent}{{
{indent}  id: {exp["id"]},
{indent}  role: {format_string_for_ts(exp["role"])},
{indent}  company: {format_string_for_ts(exp["company"])},
{indent}  duration: {format_string_for_ts(exp["duration"])},
{indent}  location: {format_string_for_ts(exp["location"])},
{indent}  star: {{
{indent}    situation: {format_string_for_ts(exp["star"]["situation"])},
{indent}    task: {format_string_for_ts(exp["star"]["task"])},
{indent}    action: {format_string_for_ts(exp["star"]["action"])},
{indent}    result: {format_string_for_ts(exp["star"]["result"])},
{indent}    impact: {format_string_for_ts(exp["star"]["impact"])},
{indent}    architecture: {format_string_for_ts(exp["star"]["architecture"])}
{indent}  }},
{indent}  technologies: {technologies_str},
{indent}  competencies: {competencies_str},
{indent}  soft_skills: {soft_skills_str}
{indent}}}"""


def format_publication_as_typescript(pub: Dict[str, Any], indent: str = "  ") -> str:
    """Convert database publication to TypeScript format"""
    related_id = (
        format_string_for_ts(pub["related_project_id"])
        if pub.get("related_project_id")
        else "null"
    )

    return f"""{indent}{{
{indent}  id: {pub["id"]},
{indent}  title: {format_string_for_ts(pub["title"])},
{indent}  outlet: {format_string_for_ts(pub["outlet"])},
{indent}  date: {format_string_for_ts(pub["date"])},
{indent}  related_project_id: {related_id}
{indent}}}"""


def format_activity_as_typescript(act: Dict[str, Any], indent: str = "  ") -> str:
    """Convert database activity to TypeScript format"""
    return f"""{indent}{{
{indent}  time: {format_string_for_ts(act["time"])},
{indent}  category: {format_string_for_ts(act["category"])},
{indent}  title: {format_string_for_ts(act["title"])},
{indent}  description: {format_string_for_ts(act["description"])},
{indent}  type: {format_string_for_ts(act["type"])}
{indent}}}"""


def append_to_typescript_array(
    ts_file: Path, new_items_ts: str, backup: bool = True
) -> bool:
    """
    Append new items to TypeScript array
    Finds the closing ]; and inserts new items before it
    """
    if not ts_file.exists():
        print(f"   ❌ File not found: {ts_file}")
        return False

    # Backup original file
    if backup:
        backup_file = Path(str(ts_file) + ".backup")
        shutil.copy2(ts_file, backup_file)
        print(f"   💾 Backup: {backup_file.name}")

    content = ts_file.read_text()

    # Find the last item in the array and add comma if needed
    # Look for pattern: }  <-- last closing brace before ];
    # or }] <-- if no spaces

    # Find the closing ];
    closing_pattern = r"\];"
    match = re.search(closing_pattern, content)

    if not match:
        print(f"   ❌ Could not find closing ]; in {ts_file.name}")
        return False

    # Find position to insert (before ];)
    insert_pos = match.start()

    # Check if we need to add comma to previous item
    # Look backwards for the last }
    content_before = content[:insert_pos]
    last_brace = content_before.rfind("}")

    if last_brace != -1:
        # Check if there's already a comma
        text_after_brace = content[last_brace + 1 : insert_pos].strip()
        if not text_after_brace.startswith(","):
            # Add comma after last brace
            content = content[: last_brace + 1] + "," + content[last_brace + 1 :]
            insert_pos += 1  # Adjust for added comma

    # Insert new items
    # Add newline before if needed
    if not content[insert_pos - 1] == "\n":
        new_items_ts = "\n" + new_items_ts

    # Add comma after new items
    if new_items_ts and not new_items_ts.rstrip().endswith(","):
        new_items_ts = new_items_ts.rstrip() + ",\n"

    new_content = content[:insert_pos] + new_items_ts + content[insert_pos:]

    # Write back
    ts_file.write_text(new_content)

    return True


def sync_projects(dry_run: bool = False) -> int:
    """Sync new projects from database to TypeScript"""
    print("\n📦 Syncing projects...")

    ts_file = Path("frontend/src/data/projects.ts")

    # Get existing IDs from TypeScript
    existing_ids = extract_ids_from_typescript(ts_file, r'id:\s*"(p\d+)"')
    print(f"   Found {len(existing_ids)} existing projects in TypeScript")

    # Get all projects from database
    db = get_database()
    db_projects = db.get_projects()
    db_ids = {p["id"] for p in db_projects}
    print(f"   Found {len(db_ids)} projects in database")

    # Find new projects
    new_ids = db_ids - existing_ids

    if not new_ids:
        print("   ✅ No new projects to sync")
        return 0

    new_projects = [p for p in db_projects if p["id"] in new_ids]

    print(f"   → {len(new_projects)} new project(s) to add:")
    for proj in new_projects:
        print(f"      + {proj['id']}: {proj['title']}")

    if dry_run:
        print("   [DRY RUN] Would append to projects.ts")
        return len(new_projects)

    # Generate TypeScript code
    new_items_ts = ""
    for proj in new_projects:
        new_items_ts += format_project_as_typescript(proj) + ",\n"

    # Append to file
    if append_to_typescript_array(ts_file, new_items_ts):
        print(f"   ✅ Appended {len(new_projects)} project(s) to {ts_file.name}")
        return len(new_projects)
    else:
        print(f"   ❌ Failed to append projects")
        return 0


def sync_experience(dry_run: bool = False) -> int:
    """Sync new experience from database to TypeScript"""
    print("\n💼 Syncing experience...")

    ts_file = Path("frontend/src/data/experience.ts")

    # Get existing IDs from TypeScript
    existing_ids = extract_ids_from_typescript(ts_file, r"id:\s*(\d+),")
    existing_ids = {int(id_str) for id_str in existing_ids}
    print(f"   Found {len(existing_ids)} existing experiences in TypeScript")

    # Get all experience from database
    db = get_database()
    db_experience = db.get_experience()
    db_ids = {exp["id"] for exp in db_experience}
    print(f"   Found {len(db_ids)} experiences in database")

    # Find new experiences
    new_ids = db_ids - existing_ids

    if not new_ids:
        print("   ✅ No new experiences to sync")
        return 0

    new_experiences = [exp for exp in db_experience if exp["id"] in new_ids]

    print(f"   → {len(new_experiences)} new experience(s) to add:")
    for exp in new_experiences:
        print(f"      + {exp['id']}: {exp['role']} at {exp['company']}")

    if dry_run:
        print("   [DRY RUN] Would append to experience.ts")
        return len(new_experiences)

    # Generate TypeScript code
    new_items_ts = ""
    for exp in new_experiences:
        new_items_ts += format_experience_as_typescript(exp) + ",\n"

    # Append to file
    if append_to_typescript_array(ts_file, new_items_ts):
        print(f"   ✅ Appended {len(new_experiences)} experience(s) to {ts_file.name}")
        return len(new_experiences)
    else:
        print(f"   ❌ Failed to append experiences")
        return 0


def sync_publications(dry_run: bool = False) -> int:
    """Sync new publications from database to TypeScript"""
    print("\n📚 Syncing publications...")

    ts_file = Path("frontend/src/data/publications.ts")

    # Get existing IDs from TypeScript
    existing_ids = extract_ids_from_typescript(ts_file, r"id:\s*(\d+),")
    existing_ids = {int(id_str) for id_str in existing_ids}
    print(f"   Found {len(existing_ids)} existing publications in TypeScript")

    # Get all publications from database
    db = get_database()
    db_publications = db.get_publications()
    db_ids = {pub["id"] for pub in db_publications}
    print(f"   Found {len(db_ids)} publications in database")

    # Find new publications
    new_ids = db_ids - existing_ids

    if not new_ids:
        print("   ✅ No new publications to sync")
        return 0

    new_publications = [pub for pub in db_publications if pub["id"] in new_ids]

    print(f"   → {len(new_publications)} new publication(s) to add:")
    for pub in new_publications:
        print(f"      + {pub['id']}: {pub['title']}")

    if dry_run:
        print("   [DRY RUN] Would append to publications.ts")
        return len(new_publications)

    # Generate TypeScript code
    new_items_ts = ""
    for pub in new_publications:
        new_items_ts += format_publication_as_typescript(pub) + ",\n"

    # Append to file
    if append_to_typescript_array(ts_file, new_items_ts):
        print(
            f"   ✅ Appended {len(new_publications)} publication(s) to {ts_file.name}"
        )
        return len(new_publications)
    else:
        print(f"   ❌ Failed to append publications")
        return 0


def sync_activities(dry_run: bool = False) -> int:
    """Sync new activities from database to TypeScript"""
    print("\n⚡ Syncing activities...")

    ts_file = Path("frontend/src/data/activities.ts")

    # For activities, we don't have IDs in TypeScript
    # We'll compare by title+time combination
    if not ts_file.exists():
        print("   ⚠️  activities.ts not found, skipping")
        return 0

    content = ts_file.read_text()

    # Get all activities from database
    db = get_database()
    db_activities = db.get_activities()

    if not db_activities:
        print("   ✅ No activities in database")
        return 0

    # For now, just report - activities sync is optional
    print(f"   Found {len(db_activities)} activities in database")
    print("   ℹ️  Activities sync not implemented (optional feature)")

    return 0


def main():
    """Main function"""
    parser = argparse.ArgumentParser(
        description="Sync new items from Turso database to TypeScript files (APPEND-ONLY)"
    )
    parser.add_argument(
        "--type",
        choices=["projects", "experience", "publications", "activities", "all"],
        default="all",
        help="Type of content to sync",
    )
    parser.add_argument(
        "--dry-run", action="store_true", help="Preview changes without modifying files"
    )
    parser.add_argument("--force", action="store_true", help="Skip confirmation prompt")

    args = parser.parse_args()

    print("\n" + "=" * 60)
    print("🔄 SYNC NEW ITEMS FROM TURSO TO TYPESCRIPT")
    print("=" * 60)
    print("\n📌 Append-Only Mode: Existing content will NOT be modified")
    print("   Only NEW items from database will be appended\n")

    # Check database connection
    settings = get_settings()
    if not settings.has_turso:
        print("❌ Turso database not configured")
        sys.exit(1)

    db = get_database()
    if not db.is_available():
        print("❌ Cannot connect to Turso database")
        sys.exit(1)

    print(f"✓ Connected to: {settings.turso_database_url[:50]}...")

    # Determine what to sync
    sync_functions = {
        "projects": sync_projects,
        "experience": sync_experience,
        "publications": sync_publications,
        "activities": sync_activities,
    }

    if args.type == "all":
        types_to_sync = list(sync_functions.keys())
    else:
        types_to_sync = [args.type]

    # Dry run or get confirmation
    if args.dry_run:
        print("\n[DRY RUN MODE] - No files will be modified\n")
    elif not args.force:
        print(f"\nWill sync: {', '.join(types_to_sync)}")
        response = input("\n❓ Continue? (y/N): ")
        if response.lower() != "y":
            print("❌ Cancelled by user")
            return

    # Sync each type
    total_synced = 0
    for sync_type in types_to_sync:
        try:
            count = sync_functions[sync_type](dry_run=args.dry_run)
            total_synced += count
        except Exception as e:
            print(f"   ❌ Error syncing {sync_type}: {e}")
            import traceback

            traceback.print_exc()

    # Summary
    print("\n" + "=" * 60)
    if args.dry_run:
        print(f"✅ DRY RUN COMPLETE")
        print(f"   Would append {total_synced} new item(s)")
        print("\nRun without --dry-run to apply changes")
    elif total_synced > 0:
        print(f"✅ SYNC COMPLETE")
        print(f"   Appended {total_synced} new item(s)")
        print("\nNext steps:")
        print("  1. Review changes: git diff frontend/src/data/")
        print("  2. Test frontend: cd frontend && npm run dev")
        print("  3. Commit: git add . && git commit && git push")
    else:
        print("✅ SYNC COMPLETE")
        print("   No new items to sync - everything up to date!")

    print("=" * 60)


if __name__ == "__main__":
    main()
