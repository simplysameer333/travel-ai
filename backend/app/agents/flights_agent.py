"""Flights agent — returns flight options for a given route.
Replace generate_flights() call with real Amadeus / Duffel / Skyscanner API when ready.
"""
from __future__ import annotations

from typing import Any
from app.tools.mock_data import generate_flights


async def search(
    origin: str,
    destination: str,
    date: str = "",
    passengers: int = 1,
    cabin: str = "economy",
    return_date: str = "",
) -> dict[str, Any]:
    """Return one-way (and optionally return) flight options."""
    outbound = generate_flights(origin, destination, date, passengers, cabin)
    result: dict[str, Any] = {"outbound": outbound}

    if return_date:
        inbound = generate_flights(destination, origin, return_date, passengers, cabin)
        result["inbound"] = inbound
        result["cheapest_round_trip"] = (
            min(f["price_per_person"] for f in outbound) * 2
            if outbound else 0
        )

    result["cheapest_one_way"] = min((f["price_per_person"] for f in outbound), default=0)
    return result
