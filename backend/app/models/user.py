from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class UserDocument(BaseModel):
    """Schema mirroring the MongoDB users collection document."""

    full_name: str
    email: str                              # always lowercase-normalised
    password_hash: Optional[str] = None
    is_verified: bool = False
    verification_token_hash: Optional[str] = None
    verification_expires_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login_at: Optional[datetime] = None
    google_auth: bool = False
    status: str = "pending"               # pending | active | suspended
    failed_attempts: int = 0
    accepted_terms: bool = False
    accepted_privacy_policy: bool = False
    marketing_opt_in: bool = False
    terms_accepted_at: Optional[datetime] = None
    registration_ip: Optional[str] = None


class UserPublic(BaseModel):
    """Fields safe to return to API consumers — no secrets."""

    id: str
    full_name: str
    email: str
    is_verified: bool
    status: str
    google_auth: bool
    created_at: datetime
