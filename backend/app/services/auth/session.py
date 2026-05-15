import logging
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Request

from app.core.security import create_access_token, create_refresh_token
from app.db.database import db
from app.utils.security import hash_token, verify_password

logger = logging.getLogger(__name__)

_MAX_FAILED = 5
_LOCK_MINUTES = 15


class LoginError(Exception):
    def __init__(
        self,
        message: str,
        code: str,
        status_code: int = 401,
        extra: Optional[dict] = None,
    ) -> None:
        self.message = message
        self.code = code
        self.status_code = status_code
        self.extra = extra or {}
        super().__init__(message)


async def login_user(
    email: str,
    password: str,
    request: Optional[Request] = None,
) -> dict:
    email = email.lower().strip()
    ip = request.client.host if request and request.client else None
    now = datetime.now(timezone.utc)

    user = await db["users"].find_one({"email": email})

    # Generic check — never reveal whether the email is registered
    if not user or not user.get("password_hash"):
        logger.info("Login failed — user not found (ip=%s)", ip)
        raise LoginError("Invalid email or password.", code="invalid_credentials")

    # Account lock check
    locked_until = user.get("locked_until")
    if locked_until:
        lu = locked_until.replace(tzinfo=timezone.utc) if locked_until.tzinfo is None else locked_until
        if lu > now:
            logger.warning("Login blocked — account locked (id=%s)", str(user["_id"]))
            raise LoginError(
                "Account temporarily locked due to repeated failed attempts.",
                code="account_locked",
                status_code=423,
                extra={"locked_until": lu.isoformat()},
            )

    # Password check
    if not verify_password(password, user["password_hash"]):
        attempts = user.get("failed_login_attempts", 0) + 1
        update: dict = {
            "failed_login_attempts": attempts,
            "last_failed_login": now,
            "updated_at": now,
        }
        if attempts >= _MAX_FAILED:
            lock_until = now + timedelta(minutes=_LOCK_MINUTES)
            update["locked_until"] = lock_until
            logger.warning("Account locked after %d failed attempts (id=%s)", attempts, str(user["_id"]))
            await db["users"].update_one({"_id": user["_id"]}, {"$set": update})
            raise LoginError(
                "Account temporarily locked due to repeated failed attempts.",
                code="account_locked",
                status_code=423,
                extra={"locked_until": lock_until.isoformat()},
            )
        await db["users"].update_one({"_id": user["_id"]}, {"$set": update})
        logger.info("Failed login attempt %d (id=%s, ip=%s)", attempts, str(user["_id"]), ip)
        raise LoginError("Invalid email or password.", code="invalid_credentials")

    # Verified check
    if not user.get("is_verified"):
        logger.info("Login blocked — email not verified (id=%s)", str(user["_id"]))
        raise LoginError(
            "Please verify your email address before signing in.",
            code="email_not_verified",
            status_code=403,
            extra={"email": email},
        )

    # Status check
    if user.get("status") == "suspended":
        raise LoginError(
            "Your account has been suspended. Please contact support.",
            code="suspended",
            status_code=403,
        )

    # Issue tokens
    user_id = str(user["_id"])
    access_token = create_access_token(user_id, email)
    raw_refresh = create_refresh_token(user_id)

    await db["users"].update_one(
        {"_id": user["_id"]},
        {"$set": {
            "failed_login_attempts": 0,
            "locked_until": None,
            "last_login_at": now,
            "last_login_ip": ip,
            "refresh_token_hash": hash_token(raw_refresh),
            "updated_at": now,
        }},
    )

    logger.info("Login successful (id=%s, ip=%s)", user_id, ip)

    return {
        "access_token": access_token,
        "raw_refresh_token": raw_refresh,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "full_name": user["full_name"],
            "email": email,
            "is_verified": True,
            "status": user.get("status", "active"),
        },
    }


async def logout_user(refresh_token_hash: str) -> None:
    await db["users"].update_one(
        {"refresh_token_hash": refresh_token_hash},
        {"$set": {
            "refresh_token_hash": None,
            "updated_at": datetime.now(timezone.utc),
        }},
    )
