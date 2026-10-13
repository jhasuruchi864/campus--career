import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings

logger = logging.getLogger(__name__)

db_url = settings.DATABASE_URL

# Fallback mechanism if PostgreSQL is configured but server is not running locally
try:
    if db_url.startswith("sqlite"):
        engine = create_engine(db_url, connect_args={"check_same_thread": False})
    else:
        engine = create_engine(db_url, pool_pre_ping=True)
        # Test connection
        with engine.connect() as conn:
            pass
except Exception as e:
    logger.warning(f"Could not connect to configured DB ({db_url}): {e}. Using local SQLite fallback for dev/testing.")
    fallback_url = "sqlite:///./campus_connect.db"
    engine = create_engine(fallback_url, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """Dependency that provides an independent transactional database session per request."""
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
