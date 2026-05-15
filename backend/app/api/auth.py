import logging
import re

from fastapi import APIRouter, Cookie, HTTPException, Request, Response
from pydantic import BaseModel, EmailStr, field_validator

from app.core.limiter import limiter
from app.services.auth.password_reset import perform_password_reset, request_password_reset
from app.services.auth.registration import (
    RegistrationError,
    register_user,
    resend_verification_email,
    verify_email_token,
)
from app.services.auth.session import LoginError, login_user, logout_user
from app.utils.security import hash_token

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

_PASSWORD_RE = re.compile(
    r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\[\]{};:\'",.<>/?\\|`~]).{8,}$'
)


# ── Request / Response schemas ────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    confirm_password: str
    accepted_terms: bool
    accepted_privacy_policy: bool
    marketing_opt_in: bool = False

    @field_validator("full_name")
    @classmethod
    def name_valid(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError("Full name must be at least 2 characters.")
        return v

    @field_validator("password")
    @classmethod
    def password_strong(cls, v: str) -> str:
        if not _PASSWORD_RE.match(v):
            raise ValueError(
                "Password must be at least 8 characters and include uppercase, "
                "lowercase, a number, and a special character."
            )
        return v

    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, v: str, info) -> str:
        if "password" in info.data and v != info.data["password"]:
            raise ValueError("Passwords do not match.")
        return v

    @field_validator("accepted_terms")
    @classmethod
    def terms_required(cls, v: bool) -> bool:
        if not v:
            raise ValueError("You must accept the Terms of Service.")
        return v

    @field_validator("accepted_privacy_policy")
    @classmethod
    def privacy_required(cls, v: bool) -> bool:
        if not v:
            raise ValueError("You must accept the Privacy Policy.")
        return v


class ResendRequest(BaseModel):
    email: EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def password_strong(cls, v: str) -> str:
        if not _PASSWORD_RE.match(v):
            raise ValueError(
                "Password must be at least 8 characters and include uppercase, "
                "lowercase, a number, and a special character."
            )
        return v


# ── Endpoints ────────────────────────────────────────────────────────────────

@router.post("/register", status_code=201)
@limiter.limit("5/15minutes")
async def register(request: Request, body: RegisterRequest):
    try:
        return await register_user(
            full_name=body.full_name,
            email=str(body.email),
            password=body.password,
            accepted_terms=body.accepted_terms,
            accepted_privacy_policy=body.accepted_privacy_policy,
            marketing_opt_in=body.marketing_opt_in,
            request=request,
        )
    except RegistrationError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message)
    except Exception:
        logger.exception("Unexpected error during registration")
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")


@router.get("/verify-email")
async def verify_email(token: str):
    if not token or len(token) < 10:
        raise HTTPException(status_code=400, detail="Invalid token.")
    status = await verify_email_token(token)
    return {"status": status}


@router.post("/resend-verification", status_code=200)
@limiter.limit("5/15minutes")
async def resend_verification(request: Request, body: ResendRequest):
    await resend_verification_email(str(body.email))
    return {"message": "If that email is registered and unverified, a new link has been sent."}


_REFRESH_COOKIE = "refresh_token"
_COOKIE_OPTS = dict(httponly=True, secure=True, samesite="lax", max_age=7 * 24 * 3600, path="/")


@router.post("/login")
@limiter.limit("10/15minutes")
async def login(request: Request, body: LoginRequest, response: Response):
    try:
        result = await login_user(str(body.email), body.password, request)
    except LoginError as exc:
        raise HTTPException(
            status_code=exc.status_code,
            detail={"message": exc.message, "code": exc.code, **exc.extra},
        )
    except Exception:
        logger.exception("Unexpected error during login")
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")

    response.set_cookie(_REFRESH_COOKIE, result["raw_refresh_token"], **_COOKIE_OPTS)
    return {
        "access_token": result["access_token"],
        "token_type": result["token_type"],
        "user": result["user"],
    }


@router.post("/logout", status_code=200)
async def logout(response: Response, refresh_token: str | None = Cookie(default=None)):
    if refresh_token:
        await logout_user(hash_token(refresh_token))
    response.delete_cookie(_REFRESH_COOKIE, path="/")
    return {"message": "Logged out."}


@router.post("/forgot-password", status_code=200)
@limiter.limit("5/15minutes")
async def forgot_password(request: Request, body: ForgotPasswordRequest):
    await request_password_reset(str(body.email))
    return {"message": "If that email is registered, a reset link has been sent."}


@router.post("/reset-password", status_code=200)
@limiter.limit("10/15minutes")
async def reset_password(request: Request, body: ResetPasswordRequest):
    status = await perform_password_reset(body.token, body.new_password)
    if status == "invalid":
        raise HTTPException(status_code=400, detail={"message": "Invalid or already used reset link.", "code": "invalid_token"})
    if status == "expired":
        raise HTTPException(status_code=400, detail={"message": "This reset link has expired.", "code": "expired_token"})
    return {"message": "Password updated successfully."}
