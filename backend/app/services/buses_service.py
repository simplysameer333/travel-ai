"""Mock bus search."""

from __future__ import annotations

import random
from typing import Any

from app.schemas.search import BusSearchRequest


def _fmt(d) -> str:  # noqa: ANN001
    return d.strftime("%d %b %Y") if hasattr(d, "strftime") else str(d)


_OPERATORS = [
    {"operator": "RedBus",         "bus_type": "Volvo Multi-Axle A/C Sleeper", "base_fare": 1_200},
    {"operator": "KSRTC",          "bus_type": "AC Semi-Sleeper",              "base_fare": 650},
    {"operator": "VRL Travels",    "bus_type": "Non-AC Sleeper",               "base_fare": 480},
    {"operator": "SRS Travels",    "bus_type": "Volvo A/C Seater",             "base_fare": 850},
    {"operator": "Orange Travels", "bus_type": "Scania Multi-Axle AC Sleeper", "base_fare": 1_450},
]

_AMENITY_POOL = ["WiFi", "Charging Point", "Blanket", "Water Bottle", "Snacks", "Live Tracking"]


async def search_buses(req: BusSearchRequest) -> list[dict[str, Any]]:
    results: list[dict[str, Any]] = []

    for op in _OPERATORS:
        duration_mins = random.randint(90, 420)
        hours, mins = divmod(duration_mins, 60)
        dep_hour = random.randint(5, 23)

        results.append({
            "operator": op["operator"],
            "bus_type": op["bus_type"],
            "from": req.from_city,
            "to": req.to_city,
            "travel_date": _fmt(req.travel_date),
            "departure_time": f"{dep_hour:02d}:{random.choice(['00', '15', '30', '45'])}",
            "duration": f"{hours}h {mins}m",
            "price": op["base_fare"] + random.randint(-80, 250),
            "currency": "INR",
            "seats_available": random.randint(2, 40),
            "amenities": random.sample(_AMENITY_POOL, k=random.randint(2, 4)),
            "rating": round(random.uniform(3.4, 4.8), 1),
            "boarding_point": f"{req.from_city} Bus Stand",
            "dropping_point": f"{req.to_city} Bus Stand",
        })

    results.sort(key=lambda x: x["price"])
    return results
