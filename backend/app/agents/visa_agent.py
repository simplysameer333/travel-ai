"""Visa agent — provides visa requirements for Indian passport holders."""
from __future__ import annotations

from typing import Any
from app.tools.mock_data import get_visa_info


async def get_requirements(destination: str, from_country: str = "India") -> dict[str, Any]:
    return get_visa_info(destination, from_country)
