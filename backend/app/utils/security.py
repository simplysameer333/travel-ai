import hashlib
import secrets

from passlib.context import CryptContext

_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain: str) -> str:
    return _pwd_context.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    return _pwd_context.verify(plain, hashed)


def generate_verification_token() -> str:
    """Cryptographically secure URL-safe token (sent to user via email)."""
    return secrets.token_urlsafe(32)


def hash_token(raw_token: str) -> str:
    """SHA-256 of the raw token — stored in DB so the plaintext never persists."""
    return hashlib.sha256(raw_token.encode()).hexdigest()
