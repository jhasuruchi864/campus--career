import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings

logger = logging.getLogger(__name__)

db_url = settings.DATABASE_URL

# Normalize postgres:// to postgresql:// (Supabase dashboard copies start with postgres://)
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

# Helper to mask sensitive credentials in logs
def _mask_url(url: str) -> str:
    import re
    return re.sub(r"://([^:]+):([^@]+)@", r"://\1:******@", url)

# Establish database engine with Supabase / PostgreSQL or local SQLite fallback
try:
    if db_url.startswith("sqlite"):
        engine = create_engine(db_url, connect_args={"check_same_thread": False})
    else:
        connect_args = {}
        # Ensure SSL requirement for cloud Supabase / PostgreSQL endpoints
        if ("supabase.com" in db_url or "supabase.co" in db_url) and "sslmode" not in db_url:
            connect_args["sslmode"] = "require"

        engine = create_engine(
            db_url,
            pool_pre_ping=True,      # Tests connection liveness before each checkout
            pool_recycle=300,        # Recycles connections every 5 mins to prevent drops by Supabase pooler
            pool_size=10,
            max_overflow=20,
            connect_args=connect_args
        )
        # Test connection validity
        with engine.connect() as conn:
            logger.info(f"Successfully connected to PostgreSQL database: {_mask_url(db_url)}")
except Exception as e:
    logger.warning(
        f"Could not connect to configured DB ({_mask_url(db_url)}): {e}. "
        "Falling back to local SQLite database for local execution."
    )
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
