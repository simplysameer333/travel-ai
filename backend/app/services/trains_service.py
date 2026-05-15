"""Mock train search."""

from __future__ import annotations

import random
from typing import Any

from app.schemas.search import TrainSearchRequest


def _fmt(d) -> str:  # noqa: ANN001
    return d.strftime("%d %b %Y") if hasattr(d, "strftime") else str(d)


_TRAINS = [
    {"name": "Rajdhani Express", "number": "12301", "classes": ["1A", "2A", "3A"], "base_fares": [4_500, 2_800, 1_900]},
    {"name": "Shatabdi Express", "number": "12002", "classes": ["CC", "EC"],       "base_fares": [1_200, 2_200]},
    {"name": "Duronto Express",  "number": "12213", "classes": ["2A", "3A", "SL"], "base_fares": [2_600, 1_700, 550]},
    {"name": "Vande Bharat",     "number": "22435", "classes": ["CC", "EC"],       "base_fares": [1_500, 2_800]},
    {"name": "Garib Rath",       "number": "12909", "classes": ["3A", "SL"],       "base_fares": [980, 350]},
]


async def search_trains(req: TrainSearchRequest) -> list[dict[str, Any]]:
    results: list[dict[str, Any]] = []

    for train in _TRAINS:
        duration_mins = random.randint(90, 480)
        hours, mins = divmod(duration_mins, 60)
        dep_hour = random.randint(4, 23)

        for seat_class, base_fare in zip(train["classes"], train["base_fares"]):
            results.append({
                "train_name": train["name"],
                "train_number": train["number"],
                "from": req.from_city,
                "to": req.to_city,
                "travel_date": _fmt(req.travel_date),
                "departure_time": f"{dep_hour:02d}:{random.choice(['00', '15', '30', '45'])}",
                "duration": f"{hours}h {mins}m",
                "class": seat_class,
                "price": base_fare + random.randint(-100, 300),
                "currency": "INR",
                "seats_available": random.randint(0, 120),
                "tatkal_available": random.choice([True, False]),
            })

    results.sort(key=lambda x: x["price"])
    return results[:5]
