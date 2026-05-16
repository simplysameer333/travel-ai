"""Buses agent — returns intercity bus options.
Replace generate_buses() with RedBus / Abhibus API when ready.
"""
from __future__ import annotations

from typing import Any
from app.tools.mock_data import generate_buses


async def search(
    origin: str,
    destination: str,
    date: str = "",
    passengers: int = 1,
) -> dict[str, Any]:
    options = generate_buses(origin, destination, date, passengers)
    return {
        "options": options,
        "cheapest": min((b["price_per_person"] for b in options), default=0),
        "note": "Bus timings are mostly overnight for long routes.",
    }
