"""Cars agent — returns car rental options.
Replace generate_cars() with Zoomcar / Myles / Avis API when ready.
"""
from __future__ import annotations

from typing import Any
from app.tools.mock_data import generate_cars


async def search(
    city: str,
    pickup_date: str = "",
    drop_date: str = "",
    car_type: str = "any",
) -> dict[str, Any]:
    options = generate_cars(city, pickup_date, drop_date, car_type)
    return {
        "options": options,
        "city": city.title(),
        "cheapest_per_day": min((c["price_per_day"] for c in options), default=0),
    }
