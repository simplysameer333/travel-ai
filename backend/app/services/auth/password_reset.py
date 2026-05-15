import logging
from datetime import datetime, timedelta, timezone

from app.db.database import db
from app.utils.email import send_password_changed_email, send_password_reset_email
from app.utils.security import generate_verification_token, hash_password, hash_token

logger = logging.getLogger(__name__)


async def request_password_reset(email: str) -> None:
    """Always returns silently — never reveals whether the email is registered."""
    email = email.lower().strip()
    user = await db["users"].find_one({"email": email})
    if not user:
        return

    now = datetime.now(timezone.utc)
    raw_token = generate_verification_token()

    await db["users"].update_one(
        {"_id": user["_id"]},
        {"$set": {
            "reset_token_hash": hash_token(raw_token),
            "reset_token_expires_at": now + timedelta(hours=1),
            "updated_at": now,
        }},
    )

    send_password_reset_email(email, user["full_name"], raw_token)
    logger.info("Password reset requested — user id=%s", str(user["_id"]))


async def perform_password_reset(raw_token: str, new_password: str) -> str:
    """Returns 'ok' | 'expired' | 'invalid'."""
    token_hash = hash_token(raw_token)
    now = datetime.now(timezone.utc)

    user = await db["users"].find_one({"reset_token_hash": token_hash})
    if not user:
        return "invalid"

    expires = user.get("reset_token_expires_at")
    if expires:
        exp = expires.replace(tzinfo=timezone.utc) if expires.tzinfo is None else expires
        if exp < now:
            return "expired"

    await db["users"].update_one(
        {"_id": user["_id"]},
        {"$set": {
            "password_hash": hash_password(new_password),
            "reset_token_hash": None,
            "reset_token_expires_at": None,
            "refresh_token_hash": None,   # invalidate all active sessions
            "updated_at": now,
        }},
    )

    send_password_changed_email(user["email"], user["full_name"])
    logger.info("Password reset completed — user id=%s", str(user["_id"]))
    return "ok"
