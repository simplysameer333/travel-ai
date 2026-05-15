import logging
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Request

from app.db.database import db
from app.utils.email import send_verification_email, send_welcome_email
from app.utils.security import generate_verification_token, hash_password, hash_token

logger = logging.getLogger(__name__)


class RegistrationError(Exception):
    def __init__(self, message: str, status_code: int = 400) -> None:
        self.message = message
        self.status_code = status_code
        super().__init__(message)


async def register_user(
    *,
    full_name: str,
    email: str,
    password: str,
    accepted_terms: bool,
    accepted_privacy_policy: bool,
    marketing_opt_in: bool,
    request: Optional[Request] = None,
) -> dict:
    email = email.lower().strip()
    full_name = full_name.strip()

    existing = await db["users"].find_one({"email": email})
    if existing:
        logger.info("Registration blocked — email already registered (not disclosed to caller)")
        # Generic error to prevent user enumeration
        raise RegistrationError("Unable to create account. Please try again or contact support.")

    raw_token = generate_verification_token()
    token_hash = hash_token(raw_token)
    now = datetime.now(timezone.utc)

    doc = {
        "full_name": full_name,
        "email": email,
        "password_hash": hash_password(password),
        "is_verified": False,
        "verification_token_hash": token_hash,
        "verification_expires_at": now + timedelta(hours=24),
        "created_at": now,
        "updated_at": now,
        "last_login_at": None,
        "google_auth": False,
        "status": "pending",
        "failed_attempts": 0,
        "accepted_terms": accepted_terms,
        "accepted_privacy_policy": accepted_privacy_policy,
        "marketing_opt_in": marketing_opt_in,
        "terms_accepted_at": now if accepted_terms else None,
        "registration_ip": request.client.host if request and request.client else None,
    }

    result = await db["users"].insert_one(doc)
    logger.info("User registered — id=%s", str(result.inserted_id))

    send_verification_email(email, full_name, raw_token)

    return {"message": "Account created. Please check your email to verify your account."}


async def verify_email_token(raw_token: str) -> str:
    """Returns 'verified' | 'already_verified' | 'expired' | 'invalid'."""
    token_hash = hash_token(raw_token)
    now = datetime.now(timezone.utc)

    user = await db["users"].find_one({"verification_token_hash": token_hash})
    if not user:
        return "invalid"

    if user.get("is_verified"):
        return "already_verified"

    expires = user.get("verification_expires_at")
    if expires:
        exp_aware = expires.replace(tzinfo=timezone.utc) if expires.tzinfo is None else expires
        if exp_aware < now:
            return "expired"

    await db["users"].update_one(
        {"_id": user["_id"]},
        {"$set": {
            "is_verified": True,
            "status": "active",
            "verification_token_hash": None,
            "verification_expires_at": None,
            "updated_at": now,
        }},
    )

    logger.info("Email verified — user id=%s", str(user["_id"]))
    send_welcome_email(user["email"], user["full_name"])
    return "verified"


async def resend_verification_email(email: str) -> None:
    """Always returns silently to prevent enumeration."""
    email = email.lower().strip()
    user = await db["users"].find_one({"email": email})

    if not user or user.get("is_verified"):
        return

    now = datetime.now(timezone.utc)
    raw_token = generate_verification_token()
    token_hash = hash_token(raw_token)

    await db["users"].update_one(
        {"_id": user["_id"]},
        {"$set": {
            "verification_token_hash": token_hash,
            "verification_expires_at": now + timedelta(hours=24),
            "updated_at": now,
        }},
    )

    send_verification_email(email, user["full_name"], raw_token)
    logger.info("Verification email resent — user id=%s", str(user["_id"]))
