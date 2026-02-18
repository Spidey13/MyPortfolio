"""
Portfolio Data Viewer Script
View your current Turso database content in a readable format
"""

import sys
import os
from pathlib import Path
import json
from typing import Optional, Dict, Any

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
    print("Make sure you're running from the backend directory")
    sys.exit(1)


def print_section(title: str, char: str = "="):
    """Print a formatted section header"""
    print(f"\n{char * 80}")
    print(f"{title:^80}")
    print(f"{char * 80}\n")


def view_profile():
    """View profile information"""
    db = get_database()
    profile = db.get_profile()

    if not profile:
        print("❌ No profile data found")
        return

    print_section("PROFILE", "=")
    print(f"Name:     {profile['name']}")
    print(f"Title:    {profile['title']}")
    print(f"Location: {profile['location']}")
    print(f"Email:    {profile['email']}")

    print("\nSummary:")
    print(f"  {profile['summary']}")

    print("\nLinks:")
    for link in profile.get("links", []):
        print(f"  • {link['type']}: {link['url']}")

    print("\nHighlights:")
    for i, highlight in enumerate(profile.get("highlights", []), 1):
        print(f"  {i}. {highlight}")


def view_education():
    """View education information"""
    db = get_database()
    education = db.get_education()

    if not education:
        print("❌ No education data found")
        return

    print_section("EDUCATION", "=")
    print(f"Degree:      {education['degree']}")
    print(f"University:  {education['university']}")
    print(f"Graduation:  {education['graduation']}")
    if education.get("gpa"):
        print(f"GPA:         {education['gpa']}")

    print("\nCoursework:")
    for i, course in enumerate(education.get("coursework", []), 1):
        print(f"  {i}. {course}")


def view_experience():
    """View work experience"""
    db = get_database()
    experiences = db.get_experience()

    if not experiences:
        print("❌ No experience data found")
        return

    print_section("EXPERIENCE", "=")

    for exp in experiences:
        print(f"\n{'─' * 80}")
        print(f"🏢 {exp['role']} at {exp['company']}")
        print(f"📅 {exp['duration']} | 📍 {exp['location']}")

        print("\n📊 STAR Method:")
        print(f"  Situation:    {exp['star']['situation'][:100]}...")
        print(f"  Task:         {exp['star']['task'][:100]}...")
        print(f"  Action:       {exp['star']['action'][:100]}...")
        print(f"  Result:       {exp['star']['result'][:100]}...")
        print(f"  Impact:       {exp['star']['impact'][:100]}...")
        print(f"  Architecture: {exp['star']['architecture'][:100]}...")

        print("\n💻 Technologies:")
        print(f"  {', '.join(exp['technologies'])}")

        if exp.get("competencies"):
            print("\n🎯 Competencies:")
            print(f"  {', '.join(exp['competencies'])}")

        if exp.get("soft_skills"):
            print("\n🤝 Soft Skills:")
            print(f"  {', '.join(exp['soft_skills'])}")


def view_projects():
    """View projects"""
    db = get_database()
    projects = db.get_projects()

    if not projects:
        print("❌ No projects found")
        return

    print_section("PROJECTS", "=")

    for proj in projects:
        featured = "⭐ FEATURED" if proj.get("featured") else ""
        print(f"\n{'─' * 80}")
        print(f"🚀 {proj['title']} {featured}")
        print(f"🔗 {proj['github_url']}")

        print("\n📊 STAR Method:")
        print(f"  Situation:    {proj['star']['situation'][:100]}...")
        print(f"  Task:         {proj['star']['task'][:100]}...")
        print(f"  Action:       {proj['star']['action'][:100]}...")
        print(f"  Result:       {proj['star']['result'][:100]}...")
        print(f"  Impact:       {proj['star']['impact'][:100]}...")
        print(f"  Architecture: {proj['star']['architecture'][:100]}...")

        print("\n💻 Technologies:")
        print(f"  {', '.join(proj['technologies'])}")


def view_skills():
    """View skills"""
    db = get_database()
    skills = db.get_skills()

    if not skills:
        print("❌ No skills found")
        return

    print_section("SKILLS", "=")

    for category, skill_list in skills.items():
        print(f"\n{category.upper().replace('_', ' ')}:")
        print(f"  {', '.join(skill_list)}")


def view_publications():
    """View publications"""
    db = get_database()
    publications = db.get_publications()

    if not publications:
        print("❌ No publications found")
        return

    print_section("PUBLICATIONS", "=")

    for pub in publications:
        print(f"\n📄 {pub['title']}")
        print(f"   Outlet: {pub['outlet']}")
        print(f"   Date: {pub['date']}")
        if pub.get("related_project_id"):
            print(f"   Related Project: {pub['related_project_id']}")


def export_to_json(output_file: str):
    """Export all data to JSON file"""
    db = get_database()

    data = {
        "profile": db.get_profile(),
        "education": db.get_education(),
        "experience": db.get_experience(),
        "projects": db.get_projects(),
        "skills": db.get_skills(),
        "publications": db.get_publications(),
    }

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Data exported to: {output_file}")


def export_for_claude(output_file: str):
    """Export data in a format optimized for Claude to review and improve"""
    db = get_database()

    data = db.get_complete_portfolio()

    # Create a more readable format for Claude
    output = []

    output.append("=" * 80)
    output.append("PORTFOLIO DATA FOR REVIEW")
    output.append("=" * 80)
    output.append("")
    output.append(
        "Instructions: Please review this portfolio data and suggest improvements"
    )
    output.append("to make it more attractive to recruiters and hiring managers.")
    output.append("")

    # Profile
    profile = data.get("profile", {})
    output.append("\n" + "=" * 80)
    output.append("1. PROFILE")
    output.append("=" * 80)
    output.append(f"\nName: {profile.get('name')}")
    output.append(f"Title: {profile.get('title')}")
    output.append(f"\nSummary:\n{profile.get('summary')}")
    output.append("\nHighlights:")
    for i, h in enumerate(profile.get("highlights", []), 1):
        output.append(f"  {i}. {h}")

    # Experience
    output.append("\n" + "=" * 80)
    output.append("2. EXPERIENCE")
    output.append("=" * 80)
    for exp in data.get("experience", []):
        output.append(f"\n{'─' * 80}")
        output.append(f"Role: {exp['role']}")
        output.append(f"Company: {exp['company']}")
        output.append(f"Duration: {exp['duration']}")
        output.append(f"\nSTAR Method:")
        output.append(f"  Situation: {exp['star']['situation']}")
        output.append(f"  Task: {exp['star']['task']}")
        output.append(f"  Action: {exp['star']['action']}")
        output.append(f"  Result: {exp['star']['result']}")
        output.append(f"  Impact: {exp['star']['impact']}")
        output.append(f"  Architecture: {exp['star']['architecture']}")
        output.append(f"\nTechnologies: {', '.join(exp['technologies'])}")

    # Projects
    output.append("\n" + "=" * 80)
    output.append("3. PROJECTS")
    output.append("=" * 80)
    for proj in data.get("projects", []):
        output.append(f"\n{'─' * 80}")
        output.append(f"Title: {proj['title']}")
        output.append(f"GitHub: {proj['github_url']}")
        output.append(f"Featured: {'Yes' if proj.get('featured') else 'No'}")
        output.append(f"\nSTAR Method:")
        output.append(f"  Situation: {proj['star']['situation']}")
        output.append(f"  Task: {proj['star']['task']}")
        output.append(f"  Action: {proj['star']['action']}")
        output.append(f"  Result: {proj['star']['result']}")
        output.append(f"  Impact: {proj['star']['impact']}")
        output.append(f"  Architecture: {proj['star']['architecture']}")
        output.append(f"\nTechnologies: {', '.join(proj['technologies'])}")

    output.append("\n" + "=" * 80)
    output.append("END OF DATA")
    output.append("=" * 80)

    with open(output_file, "w", encoding="utf-8") as f:
        f.write("\n".join(output))

    print(f"\n✅ Data exported for Claude review: {output_file}")
    print("\n📋 Next steps:")
    print("  1. Copy the contents of this file")
    print("  2. Paste into Claude chat")
    print("  3. Ask: 'Please review and improve this portfolio content for recruiters'")
    print("  4. Use improved content with import_from_claude.py script")


def main():
    """Main function"""
    import argparse

    parser = argparse.ArgumentParser(
        description="View and export your portfolio data from Turso database"
    )
    parser.add_argument(
        "section",
        nargs="?",
        choices=[
            "all",
            "profile",
            "education",
            "experience",
            "projects",
            "skills",
            "publications",
        ],
        default="all",
        help="Section to view (default: all)",
    )
    parser.add_argument(
        "--export", type=str, metavar="FILE", help="Export data to JSON file"
    )
    parser.add_argument(
        "--export-for-claude",
        type=str,
        metavar="FILE",
        help="Export data in format optimized for Claude review",
    )

    args = parser.parse_args()

    # Check database connection
    settings = get_settings()
    if not settings.has_turso:
        print("❌ Turso database not configured")
        print("Please set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in .env")
        sys.exit(1)

    db = get_database()
    if not db.is_available():
        print("❌ Cannot connect to Turso database")
        sys.exit(1)

    print("\n🎯 Portfolio Data Viewer")
    print(f"📊 Connected to: {settings.turso_database_url[:50]}...")

    # Export options
    if args.export:
        export_to_json(args.export)
        return

    if args.export_for_claude:
        export_for_claude(args.export_for_claude)
        return

    # View sections
    if args.section == "all" or args.section == "profile":
        view_profile()

    if args.section == "all" or args.section == "education":
        view_education()

    if args.section == "all" or args.section == "experience":
        view_experience()

    if args.section == "all" or args.section == "projects":
        view_projects()

    if args.section == "all" or args.section == "skills":
        view_skills()

    if args.section == "all" or args.section == "publications":
        view_publications()

    print("\n" + "=" * 80)
    print("✅ Done!")
    print("=" * 80)
    print("\nUseful commands:")
    print("  python scripts/view_portfolio.py projects          # View only projects")
    print("  python scripts/view_portfolio.py --export backup.json")
    print("  python scripts/view_portfolio.py --export-for-claude review.txt")


if __name__ == "__main__":
    main()
