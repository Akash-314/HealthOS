import os
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# Determine Database Engine URL
db_url = settings.DATABASE_URL
connect_args = {}

# Configure SSL for remote PostgreSQL / Supabase connections if applicable
if "supabase.co" in db_url or "supabase.com" in db_url:
    if "sslmode" not in db_url:
        connect_args["sslmode"] = "require"

if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

# Create Primary SQLAlchemy Database Engine
try:
    engine = create_engine(
        db_url,
        connect_args=connect_args,
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20
    )
except Exception as err:
    print(f"PostgreSQL connection engine setup notice: {err}. Using local SQLite fallback.")
    db_url = "sqlite:///./healthos_fallback.db"
    engine = create_engine(db_url, connect_args={"check_same_thread": False})

# Session factory for DB interactions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative Base class for ORM models
Base = declarative_base()


def init_db():
    """
    Initializes database tables by creating all defined ORM models (Patients, Hospitals, Beds, etc.)
    if they do not already exist.
    """
    try:
        # Import models so they are registered with Base metadata
        import app.models  # noqa
        Base.metadata.create_all(bind=engine)
        print("Database schema tables initialized successfully.")
    except Exception as e:
        print(f"Database table initialization notice: {e}")


def get_db() -> Generator:
    """
    FastAPI dependency that provides a transactional database session per request.
    Automatically closes the session when the request completes.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_supabase_client():
    """
    Helper function returning an initialized Supabase Python SDK Client.
    Uses SUPABASE_URL and SUPABASE_KEY from environment.
    """
    try:
        from supabase import create_client, Client
        if settings.SUPABASE_URL and settings.SUPABASE_KEY and "your-project" not in settings.SUPABASE_URL:
            supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
            return supabase
    except Exception as e:
        print(f"Supabase client initialization notice: {e}")
    return None
