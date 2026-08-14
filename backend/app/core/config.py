from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "HealthOS API"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    SECRET_KEY: str = "development-secret-key-change-in-production"
    
    # Supabase Configuration
    SUPABASE_URL: Optional[str] = "https://your-project.supabase.co"
    SUPABASE_KEY: Optional[str] = "your-supabase-anon-key"
    
    # PostgreSQL Database URL (Supabase Postgres)
    # Default fallback to local SQLite for offline development if DATABASE_URL is not set
    DATABASE_URL: str = "sqlite:///./healthos_dev.db"

    # CORS Origins configuration
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()
