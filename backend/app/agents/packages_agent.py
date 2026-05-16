"""Packages agent — returns bundled holiday package options.
Replace generate_packages() with MakeMyTrip / Thomas Cook / Yatra API when ready.
"""
from __future__ import annotations

from typing import Any
from app.tools.mock_data import generate_packages


async def search(
    destination: str,
    origin: str = "Delhi",
    passengers: int = 1,
    trip_style: str = "standard",
    duration_days: int = 0,
) -> dict[str, Any]:
    options = generate_packages(destination, origin, passengers, trip_style)
    return {
        "options": options,
        "destination": destination.title(),
        "cheapest_per_person": min((p["price_per_person"] for p in options), default=0),
        "note": "Package prices include flights + hotel + listed inclusions.",
    }
