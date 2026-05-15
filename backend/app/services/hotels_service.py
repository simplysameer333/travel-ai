"""Mock hotel search."""

from __future__ import annotations

import random
from typing import Any

from app.schemas.search import HotelSearchRequest


def _fmt(d) -> str:  # noqa: ANN001
    return d.strftime("%d %b %Y") if hasattr(d, "strftime") else str(d)


_TEMPLATES = [
    {"name": "The Grand {city} Palace",       "category": "5-star",  "ppn_range": (8_000, 18_000), "rating_range": (4.3, 4.9), "amenities": ["Free WiFi", "Swimming Pool", "Spa", "Gym", "Restaurant", "Room Service", "Airport Shuttle"], "room_type": "Deluxe King Room"},
    {"name": "Comfort Inn {city}",             "category": "3-star",  "ppn_range": (2_000, 4_500),  "rating_range": (3.5, 4.2), "amenities": ["Free WiFi", "Breakfast Included", "Parking", "24-hr Front Desk"],                                   "room_type": "Standard Double Room"},
    {"name": "Zostel {city}",                  "category": "Hostel",  "ppn_range": (600, 1_400),    "rating_range": (4.0, 4.6), "amenities": ["Free WiFi", "Common Kitchen", "Locker", "Rooftop Area", "Travel Desk"],                              "room_type": "Dormitory Bed"},
    {"name": "Treebo Trend {city} Central",    "category": "Budget",  "ppn_range": (1_200, 2_800),  "rating_range": (3.8, 4.4), "amenities": ["Free WiFi", "AC", "TV", "Daily Housekeeping"],                                                       "room_type": "Superior Twin Room"},
    {"name": "Lemon Tree Hotel {city}",        "category": "4-star",  "ppn_range": (4_500, 8_500),  "rating_range": (4.1, 4.7), "amenities": ["Free WiFi", "Pool", "Gym", "Restaurant", "Bar", "Business Centre"],                                  "room_type": "Premium Room"},
]


async def search_hotels(req: HotelSearchRequest) -> list[dict[str, Any]]:
    nights = max((req.check_out - req.check_in).days, 1)
    results: list[dict[str, Any]] = []

    for t in _TEMPLATES:
        ppn = random.randint(*t["ppn_range"])  # type: ignore[arg-type]
        results.append({
            "name": t["name"].format(city=req.city),  # type: ignore[str-format]
            "city": req.city,
            "category": t["category"],
            "room_type": t["room_type"],
            "check_in": _fmt(req.check_in),
            "check_out": _fmt(req.check_out),
            "nights": nights,
            "guests": req.guests,
            "price_per_night": ppn,
            "total_price": ppn * nights * req.guests,
            "currency": "INR",
            "rating": round(random.uniform(*t["rating_range"]), 1),  # type: ignore[arg-type]
            "amenities": t["amenities"],
            "free_cancellation": random.choice([True, False]),
            "breakfast_included": "Breakfast Included" in t["amenities"],
        })

    results.sort(key=lambda x: x["total_price"])
    return results
