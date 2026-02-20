"""
Migration Runner Script
Apply SQL migration files to Turso database
"""

import sys
import os
from pathlib import Path
import argparse

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
        print("Please set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in .env")
        sys.exit(1)

    try:
        client = libsql.connect(
            database=settings.turso_database_url, auth_token=settings.turso_auth_token
        )
        return client
    except Exception as e:
        print(f"❌ Cannot connect to Turso database: {e}")
        sys.exit(1)


def apply_migration(migration_file: Path, dry_run: bool = False):
    """Apply a migration file to the database"""

    if not migration_file.exists():
        print(f"❌ Migration file not found: {migration_file}")
        return False

    print(f"\n📄 Migration file: {migration_file.name}")

    # Read migration SQL
    try:
        sql_content = migration_file.read_text()
    except Exception as e:
        print(f"❌ Error reading migration file: {e}")
        return False

    # Parse SQL statements
    # Remove comments and split by semicolons
    lines = sql_content.split("\n")
    clean_lines = []
    for line in lines:
        # Remove SQL comments
        if "--" in line:
            line = line[: line.index("--")]
        line = line.strip()
        if line:
            clean_lines.append(line)

    clean_sql = " ".join(clean_lines)

    # Split into individual statements
    statements = [s.strip() + ";" for s in clean_sql.split(";") if s.strip()]

    print(f"   Found {len(statements)} SQL statement(s)")

    if dry_run:
        print("\n[DRY RUN] Would execute:")
        for i, stmt in enumerate(statements, 1):
            print(f"\n{i}. {stmt[:100]}{'...' if len(stmt) > 100 else ''}")
        return True

    # Connect to database
    client = get_db_connection()

    # Execute statements
    try:
        for i, statement in enumerate(statements, 1):
            print(f"   Executing statement {i}/{len(statements)}...")
            client.execute(statement)

        client.commit()
        print(f"\n✅ Migration applied successfully!")
        return True

    except Exception as e:
        print(f"\n❌ Error applying migration: {e}")
        print(f"   Failed at statement {i}")
        return False
    finally:
        client.close()


def main():
    """Main function"""
    parser = argparse.ArgumentParser(
        description="Apply SQL migration files to Turso database"
    )
    parser.add_argument(
        "migration", help="Migration file name (e.g., 002_add_activities_table.sql)"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be executed without applying",
    )

    args = parser.parse_args()

    # Find migration file
    migrations_dir = backend_path / "migrations"
    migration_file = migrations_dir / args.migration

    print("🔧 Turso Migration Runner")
    print("=" * 60)

    # Check database connection
    settings = get_settings()
    print(f"📊 Database: {settings.turso_database_url[:50]}...")

    # Apply migration
    success = apply_migration(migration_file, args.dry_run)

    if success and not args.dry_run:
        print("\n" + "=" * 60)
        print("✅ Migration completed successfully!")
        print("\nNext steps:")
        print("  1. Verify tables: turso db shell portfolio-db")
        print("  2. Test with: python scripts/view_portfolio.py")
    elif success and args.dry_run:
        print("\n" + "=" * 60)
        print("✅ Dry run completed. Run without --dry-run to apply.")
    else:
        print("\n" + "=" * 60)
        print("❌ Migration failed. Please check errors above.")
        sys.exit(1)


if __name__ == "__main__":
    main()
