"""Hotels agent — returns accommodation options.
Replace generate_hotels() with Booking.com / Agoda / MakeMyTrip API when ready.
"""
from __future__ import annotations

from typing import Any
from app.tools.mock_data import generate_hotels


async def search(
    city: str,
    checkin: str = "",
    checkout: str = "",
    guests: int = 1,
    budget_tier: str = "standard",
) -> dict[str, Any]:
    options = generate_hotels(city, checkin, checkout, guests, budget_tier)
    return {
        "options": options,
        "city": city.title(),
        "cheapest_per_night": min((h["nightly_rate"] for h in options), default=0),
        "note": "Rates are per night. Final price depends on availability.",
    }
