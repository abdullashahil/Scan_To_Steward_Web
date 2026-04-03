"""
Migration runner for Supabase PostgreSQL database.
Creates migration tracking table and runs pending migrations.
"""
import os
import sys
import logging
from pathlib import Path

# Add parent directory to path to import db module
sys.path.insert(0, str(Path(__file__).parent.parent))

# Load environment variables before importing db
from dotenv import load_dotenv
load_dotenv()

from db import init_db, get_db, close_db, is_db_connected

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

MIGRATIONS_DIR = Path(__file__).parent


def create_migrations_table():
    """Create the migrations tracking table if it doesn't exist."""
    with get_db() as cursor:
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS schema_migrations (
                id SERIAL PRIMARY KEY,
                migration_name VARCHAR(255) NOT NULL UNIQUE,
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        logger.info("Migrations table created/verified")


def get_applied_migrations():
    """Get list of already applied migration names."""
    with get_db() as cursor:
        cursor.execute("SELECT migration_name FROM schema_migrations ORDER BY applied_at;")
        return {row['migration_name'] for row in cursor.fetchall()}


def get_pending_migrations():
    """Get list of pending migration files (SQL files not yet applied)."""
    applied = get_applied_migrations()
    
    # Get all .sql files in migrations directory, sorted alphabetically
    migration_files = sorted([
        f for f in MIGRATIONS_DIR.iterdir() 
        if f.is_file() and f.suffix == '.sql'
    ])
    
    pending = []
    for migration_file in migration_files:
        if migration_file.name not in applied:
            pending.append(migration_file)
    
    return pending


def run_migration(migration_file):
    """Execute a single migration file."""
    migration_name = migration_file.name
    
    logger.info(f"Running migration: {migration_name}")
    
    # Read migration file
    sql_content = migration_file.read_text()
    
    with get_db() as cursor:
        # Execute migration SQL
        cursor.execute(sql_content)
        
        # Record migration as applied
        cursor.execute(
            "INSERT INTO schema_migrations (migration_name) VALUES (%s);",
            (migration_name,)
        )
    
    logger.info(f"✅ Migration completed: {migration_name}")


def run_migrations():
    """Main function to run all pending migrations."""
    logger.info("Starting migration runner...")
    
    # Initialize database connection
    if not init_db():
        logger.error("Failed to connect to database. Exiting.")
        sys.exit(1)
    
    if not is_db_connected():
        logger.error("Database not connected. Exiting.")
        sys.exit(1)
    
    try:
        # Create migrations tracking table
        create_migrations_table()
        
        # Get and run pending migrations
        pending = get_pending_migrations()
        
        if not pending:
            logger.info("No pending migrations. Database is up to date.")
            return
        
        logger.info(f"Found {len(pending)} pending migration(s)")
        
        for migration_file in pending:
            run_migration(migration_file)
        
        logger.info("All migrations completed successfully!")
        
    except Exception as e:
        logger.error(f"Migration failed: {e}")
        raise
    finally:
        close_db()


if __name__ == "__main__":
    run_migrations()