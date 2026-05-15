from datetime import datetime, timedelta, timezone
from typing import Any

from jose import jwt

from app.core.config import settings

_ALGORITHM = "HS256"
_ACCESS_EXPIRE_MINUTES = 15
_REFRESH_EXPIRE_DAYS = 7


def create_access_token(user_id: str, email: str) -> str:
    now = datetime.now(timezone.utc)
    return jwt.encode(
        {
            "sub": user_id,
            "email": email,
            "type": "access",
            "iat": now,
            "exp": now + timedelta(minutes=_ACCESS_EXPIRE_MINUTES),
        },
        settings.JWT_SECRET,
        algorithm=_ALGORITHM,
    )


def create_refresh_token(user_id: str) -> str:
    now = datetime.now(timezone.utc)
    return jwt.encode(
        {
            "sub": user_id,
            "type": "refresh",
            "iat": now,
            "exp": now + timedelta(days=_REFRESH_EXPIRE_DAYS),
        },
        settings.JWT_REFRESH_SECRET,
        algorithm=_ALGORITHM,
    )


def decode_access_token(token: str) -> dict[str, Any]:
    return jwt.decode(token, settings.JWT_SECRET, algorithms=[_ALGORITHM])


def decode_refresh_token(token: str) -> dict[str, Any]:
    return jwt.decode(token, settings.JWT_REFRESH_SECRET, algorithms=[_ALGORITHM])
