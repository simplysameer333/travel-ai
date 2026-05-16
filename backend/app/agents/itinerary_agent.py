"""Itinerary agent — generates a day-by-day trip framework."""
from __future__ import annotations

from typing import Any
from app.tools.mock_data import generate_itinerary_framework


async def build(
    destination: str,
    duration_days: int,
    trip_style: str = "standard",
) -> dict[str, Any]:
    return generate_itinerary_framework(destination, duration_days, trip_style)
