import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings

logger = logging.getLogger(__name__)

import re
import urllib.parse

def normalize_db_url(url: str) -> str:
    """Ensures compatible psycopg2 driver scheme and auto-encodes password special characters."""
    if not url:
        return url
    
    # Normalize postgresql schemes to use installed psycopg2 driver
    if url.startswith("postgres://"):
        url = "postgresql+psycopg2://" + url[len("postgres://"):]
    elif url.startswith("postgresql://"):
        url = "postgresql+psycopg2://" + url[len("postgresql://"):]

    # Safely handle unencoded special characters in password (such as '@')
    match = re.match(r"^(postgresql(?:\+psycopg2)?://)([^:]+):(.*)@([^@/]+)(/.*)?$", url)
    if match:
        scheme, user, raw_password, host_port, rest = match.groups()
        if not scheme.startswith("postgresql+psycopg2://"):
            scheme = "postgresql+psycopg2://"
        unquoted = urllib.parse.unquote(raw_password)
        encoded_password = urllib.parse.quote(unquoted, safe="")
        url = f"{scheme}{user}:{encoded_password}@{host_port}{rest or ''}"
    
    return url

db_url = normalize_db_url(settings.DATABASE_URL)

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
