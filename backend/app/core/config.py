import os
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

# APP_ENV controls which .env file is loaded (dev | uat | prod).
# Default: "dev" locally; Railway sets APP_ENV=prod automatically via its Variables.
_env = os.getenv("APP_ENV", "dev")

# Env file resolution:
#   dev  → .env.dev  (falls back to .env if absent)
#   uat  → .env.uat
#   prod → no file needed; Railway injects all vars as OS env vars
_env_files = (f".env.{_env}", ".env")


class Settings(BaseSettings):
    # ── Database ──────────────────────────────────────────────────────────────
    MONGO_URI: Optional[str] = None
    DATABASE_NAME: str = "travel_ai"

    # ── OpenAI ────────────────────────────────────────────────────────────────
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"

    # ── Auth ──────────────────────────────────────────────────────────────────
    # JWT_SECRET_KEY is the Railway-style name; JWT_SECRET is the legacy fallback
    JWT_SECRET_KEY: str = "change-me-in-production"
    JWT_REFRESH_SECRET: str = "change-refresh-secret-in-production"

    # ── LangSmith (optional) ──────────────────────────────────────────────────
    LANGSMITH_API_KEY: str = ""
    LANGSMITH_ENDPOINT: str = "https://api.smith.langchain.com"
    LANGSMITH_PROJECT: str = "travel-ai"
    LANGSMITH_TRACING: str = "false"

    # ── Email ─────────────────────────────────────────────────────────────────
    RESEND_API_KEY: str = ""

    # ── CORS / URLs ───────────────────────────────────────────────────────────
    FRONTEND_URL: str = "http://localhost:3000"

    model_config = SettingsConfigDict(
        env_file=_env_files,
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
