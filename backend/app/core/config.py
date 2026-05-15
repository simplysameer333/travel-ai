from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Database
    MONGO_URI: Optional[str] = None
    DATABASE_NAME: str = "travel_ai"

    # OpenAI
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"

    # Auth
    JWT_SECRET: str = "change-me-in-production"
    JWT_REFRESH_SECRET: str = "change-refresh-secret-in-production"
    JWT_SECRET_KEY: str = ""  # alias used in Railway env vars

    # LangSmith tracing (optional — tracing is skipped when key is absent)
    LANGSMITH_API_KEY: str = ""
    LANGSMITH_PROJECT: str = "travel-ai"
    LANGSMITH_TRACING: str = "false"

    # Email (Resend)
    RESEND_API_KEY: str = ""

    # Frontend URL (for CORS / email links)
    FRONTEND_URL: str = "http://localhost:3000"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
