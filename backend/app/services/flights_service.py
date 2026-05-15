"""Mock flight search — replace with Amadeus API call."""

from __future__ import annotations

import random
from typing import Any

from app.schemas.search import FlightSearchRequest


def _fmt(d) -> str:  # noqa: ANN001
    return d.strftime("%d %b %Y") if hasattr(d, "strftime") else str(d)


# Per-airline baggage policy.
# checkin_options: list of kg values; None = hand-baggage-only fare.
# Guaranteed mix: Air India & Vistara always include check-in; Akasa always hand-baggage only;
# IndiGo & SpiceJet vary so users see both types in a typical result set.
_BAGGAGE: dict[str, dict[str, Any]] = {
    "IndiGo":    {"cabin_kg": 7,  "checkin_options": [None, 15]},      # 50 % hand-baggage
    "Air India": {"cabin_kg": 8,  "checkin_options": [20, 25, 30]},    # always check-in
    "SpiceJet":  {"cabin_kg": 7,  "checkin_options": [None, 15, 20]},  # ~33 % hand-baggage
    "Vistara":   {"cabin_kg": 7,  "checkin_options": [20, 25]},        # always check-in
    "Akasa Air": {"cabin_kg": 7,  "checkin_options": [None]},          # always hand-baggage only
}

AIRLINES = {
    "IndiGo":    3_499,
    "Air India": 5_299,
    "SpiceJet":  3_199,
    "Vistara":   6_099,
    "Akasa Air": 2_999,
}


async def search_flights(req: FlightSearchRequest) -> list[dict[str, Any]]:
    results: list[dict[str, Any]] = []

    for airline, base in AIRLINES.items():
        variance = random.randint(-400, 1_200)
        price = base + variance + (req.travelers - 1) * (base // 2)
        stops = random.choice([0, 0, 1])
        duration_mins = random.randint(80, 280) + stops * 60
        hours, mins = divmod(duration_mins, 60)

        baggage = _BAGGAGE.get(airline, {"cabin_kg": 7, "checkin_options": [15]})
        checkin_kg = random.choice(baggage["checkin_options"])

        dep_hour = random.randint(5, 22)
        dep_min  = random.choice([0, 15, 30, 45])

        result: dict[str, Any] = {
            "airline": airline,
            "flight_number": f"{airline[:2].upper()}{random.randint(100, 999)}",
            "from": req.from_city,
            "to": req.to_city,
            "departure_date": _fmt(req.departure_date),
            "departure_time": f"{dep_hour:02d}:{dep_min:02d}",
            "duration": f"{hours}h {mins}m",
            "stops": stops,
            "stop_city": random.choice(["Delhi", "Mumbai", "Hyderabad"]) if stops else None,
            "price_per_person": price // req.travelers,
            "total_price": price,
            "currency": "INR",
            "class": "Economy",
            "seats_available": random.randint(3, 50),
            "refundable": random.choice([True, False]),
            "trip_type": "Round Trip" if req.return_date else "One Way",
            "baggage_cabin_kg": baggage["cabin_kg"],
            "baggage_checkin_kg": checkin_kg,
        }

        if req.return_date:
            ret_stops        = random.choice([0, 0, 1])
            ret_dur_mins     = random.randint(80, 280) + ret_stops * 60
            ret_hours, ret_m = divmod(ret_dur_mins, 60)
            ret_dep_hour     = random.randint(5, 22)
            ret_dep_min      = random.choice([0, 15, 30, 45])
            result["return_date"]            = _fmt(req.return_date)
            result["return_flight_number"]   = f"{airline[:2].upper()}{random.randint(100, 999)}"
            result["return_departure_time"]  = f"{ret_dep_hour:02d}:{ret_dep_min:02d}"
            result["return_duration"]        = f"{ret_hours}h {ret_m}m"
            result["return_stops"]           = ret_stops

        results.append(result)

    results.sort(key=lambda x: x["total_price"])
    return results
