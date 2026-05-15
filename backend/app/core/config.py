from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    MONGO_URI: Optional[str] = None
    DATABASE_NAME: str = "travel_ai"

    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"

    JWT_SECRET: str = "change-me-in-production"
    JWT_REFRESH_SECRET: str = "change-refresh-secret-in-production"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
