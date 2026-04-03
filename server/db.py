import os
import logging
import psycopg2
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager

logger = logging.getLogger(__name__)

# Global connection pool
_connection = None

def get_db_url():
    """Get database URL from environment variables."""
    return os.getenv("DATABASE_URL")

def init_db():
    """Initialize database connection."""
    global _connection
    db_url = get_db_url()
    
    if not db_url:
        logger.warning("DATABASE_URL not set. Database features will be disabled.")
        return False
    
    try:
        _connection = psycopg2.connect(db_url)
        logger.info("Connected to Supabase PostgreSQL database")
        return True
    except Exception as e:
        logger.error(f"Failed to connect to database: {e}")
        return False

def close_db():
    """Close database connection."""
    global _connection
    if _connection:
        _connection.close()
        _connection = None
        logger.info("Database connection closed")

@contextmanager
def get_db():
    """Context manager for database operations."""
    global _connection
    if not _connection:
        raise Exception("Database not initialized. Call init_db() first.")
    
    cursor = _connection.cursor(cursor_factory=RealDictCursor)
    try:
        yield cursor
        _connection.commit()
    except Exception as e:
        _connection.rollback()
        raise e
    finally:
        cursor.close()

def is_db_connected():
    """Check if database is connected."""
    return _connection is not None

# Health check
def health_check():
    """Perform database health check."""
    if not _connection:
        return {"connected": False, "error": "Not initialized"}
    
    try:
        with _connection.cursor() as cur:
            cur.execute("SELECT 1")
            return {"connected": True, "error": None}
    except Exception as e:
        return {"connected": False, "error": str(e)}

