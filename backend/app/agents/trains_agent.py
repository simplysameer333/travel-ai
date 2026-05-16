"""Trains agent — returns Indian Railways options.
Replace generate_trains() with IRCTC / RailYatri API when ready.
"""
from __future__ import annotations

from typing import Any
from app.tools.mock_data import generate_trains


async def search(
    origin: str,
    destination: str,
    date: str = "",
    passengers: int = 1,
    travel_class: str = "3A",
) -> dict[str, Any]:
    options = generate_trains(origin, destination, date, passengers, travel_class)
    return {
        "options": options,
        "cheapest": min((t["price_per_person"] for t in options), default=0),
        "classes_available": ["SL", "3A", "2A", "1A"],
        "note": "Prices are indicative. Final fare depends on quota and booking date.",
    }
