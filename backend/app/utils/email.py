import logging
import os

import resend

logger = logging.getLogger(__name__)

resend.api_key = os.getenv("RESEND_API_KEY", "")
_FROM = os.getenv("EMAIL_FROM", "TravelAI <noreply@travelai.in>")
_APP_URL = os.getenv("APP_URL", "http://localhost:3000")

_CARD = (
    "font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;"
    "background:#ffffff;border-radius:16px;overflow:hidden;"
    "box-shadow:0 4px 24px rgba(0,0,0,0.08);"
)
_HEADER = (
    '<div style="background:linear-gradient(135deg,#0ea5e9,#2563eb);padding:32px 40px;text-align:center">'
    '<h1 style="color:#fff;margin:0;font-size:22px;font-weight:800;letter-spacing:-.5px">✈️ TravelAI</h1>'
    '<p style="color:rgba(255,255,255,.75);margin:4px 0 0;font-size:11px;letter-spacing:.15em">SMART · CHEAP · FAST</p>'
    "</div>"
)
_FOOTER = (
    '<div style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e2e8f0;text-align:center">'
    '<p style="color:#94a3b8;font-size:12px;margin:0">'
    f'© 2025 TravelAI · <a href="{_APP_URL}/support" style="color:#0ea5e9;text-decoration:none">Support</a></p>'
    "</div>"
)
_BTN_BLUE = (
    "display:inline-block;background:linear-gradient(135deg,#0ea5e9,#2563eb);"
    "color:#fff;font-weight:700;font-size:15px;padding:14px 36px;"
    "border-radius:12px;text-decoration:none"
)
_BTN_GREEN = (
    "display:inline-block;background:linear-gradient(135deg,#10b981,#059669);"
    "color:#fff;font-weight:700;font-size:15px;padding:14px 36px;"
    "border-radius:12px;text-decoration:none"
)


def _send(to: str, subject: str, html: str) -> bool:
    if not resend.api_key:
        logger.warning("RESEND_API_KEY not set — skipping email to %s", to)
        return False
    try:
        resend.Emails.send({"from": _FROM, "to": [to], "subject": subject, "html": html})
        logger.info("Email sent: subject=%r to=%s", subject, to)
        return True
    except Exception:
        logger.exception("Failed to send email to %s", to)
        return False


def send_verification_email(to: str, full_name: str, raw_token: str) -> bool:
    link = f"{_APP_URL}/verify-email?token={raw_token}"
    html = f"""
    <div style="{_CARD}">{_HEADER}
      <div style="padding:40px">
        <h2 style="color:#0f172a;margin:0 0 8px;font-size:20px;font-weight:700">Hi {full_name},</h2>
        <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 28px">
          Thanks for joining TravelAI! Verify your email to activate your account and discover
          AI-powered travel deals across India.
        </p>
        <a href="{link}" style="{_BTN_BLUE}">Verify Email Address →</a>
        <p style="color:#94a3b8;font-size:13px;margin:28px 0 0;line-height:1.6">
          This link expires in <strong>24 hours</strong>.<br>
          If you didn't create a TravelAI account, ignore this email.
        </p>
      </div>{_FOOTER}
    </div>"""
    return _send(to, "Verify your TravelAI account ✈️", html)


def send_welcome_email(to: str, full_name: str) -> bool:
    html = f"""
    <div style="{_CARD}">{_HEADER}
      <div style="padding:40px">
        <h2 style="color:#0f172a;margin:0 0 8px;font-size:20px;font-weight:700">
          Welcome aboard, {full_name}! 🎉
        </h2>
        <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 28px">
          Your email is verified. You're all set to explore India's best travel deals —
          flights, trains, buses and hotels — powered by AI.
        </p>
        <a href="{_APP_URL}" style="{_BTN_GREEN}">Start Exploring →</a>
      </div>{_FOOTER}
    </div>"""
    return _send(to, "Welcome to TravelAI ✈️ — you're verified!", html)


def send_password_reset_email(to: str, full_name: str, raw_token: str) -> bool:
    link = f"{_APP_URL}/reset-password?token={raw_token}"
    html = f"""
    <div style="{_CARD}">{_HEADER}
      <div style="padding:40px">
        <h2 style="color:#0f172a;margin:0 0 8px;font-size:20px;font-weight:700">Reset your password</h2>
        <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 8px">
          Hi {full_name}, we received a request to reset your TravelAI password.
        </p>
        <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 28px">
          Click the button below to choose a new password.
        </p>
        <a href="{link}" style="{_BTN_BLUE}">Reset Password →</a>
        <p style="color:#94a3b8;font-size:13px;margin:28px 0 0;line-height:1.6">
          This link expires in <strong>1 hour</strong>.<br>
          If you didn't request a password reset, you can safely ignore this email — your
          account remains secure.
        </p>
      </div>{_FOOTER}
    </div>"""
    return _send(to, "Reset your TravelAI password 🔐", html)


def send_password_changed_email(to: str, full_name: str) -> bool:
    html = f"""
    <div style="{_CARD}">{_HEADER}
      <div style="padding:40px">
        <h2 style="color:#0f172a;margin:0 0 8px;font-size:20px;font-weight:700">
          Password updated ✓
        </h2>
        <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 28px">
          Hi {full_name}, your TravelAI password was successfully changed.<br>
          All existing sessions have been signed out for your security.
        </p>
        <a href="{_APP_URL}/login" style="{_BTN_BLUE}">Sign In →</a>
        <p style="color:#ef4444;font-size:13px;margin:28px 0 0;line-height:1.6">
          If you didn't make this change, contact support immediately.
        </p>
      </div>{_FOOTER}
    </div>"""
    return _send(to, "Your TravelAI password has been changed 🔐", html)
