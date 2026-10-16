import os
from typing import List, Union
from pydantic import AnyHttpUrl, validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Campus Connect API"
    API_V1_STR: str = "/api/v1"
    
    # Security: Read from ENV, with strong fallback for local dev
    SECRET_KEY: str = os.getenv(
        "SECRET_KEY", 
        "campus-connect-super-secure-production-jwt-key-2026-min-32-chars-long"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # Database: Environment variable configured
    # Compatible with Supabase Transaction pooler, Session pooler, or Direct PostgreSQL
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://postgres:postgres@localhost:5432/campus_connect"
    )

    # Supabase Cloud Project Configuration (Optional for client SDKs / Storage)
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://fthdfeoxobozohixmfte.supabase.co")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0aGRmZW94b2Jvem9oaXhtZnRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5NjA5MzEsImV4cCI6MjEwNzUzNjkzMX0.LZXrAh1WmUlfnfqeSI12UOL9NLT6PJ3BBkWubXH_jLc")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0aGRmZW94b2Jvem9oaXhtZnRlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTk2MDkzMSwiZXhwIjoyMTA3NTM2OTMxfQ.zMAWdFB5rUkA40naZwB5MA_w3htB2yvzxnL22NSd_7Q")

    # CORS configuration
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="allow"
    )


settings = Settings()
