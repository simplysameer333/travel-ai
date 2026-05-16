"""Budget agent — estimates total trip cost across all spend categories."""
from __future__ import annotations

from typing import Any
from app.tools.mock_data import estimate_budget, _is_international


async def estimate(
    origin: str,
    destination: str,
    nights: int,
    passengers: int = 1,
    trip_style: str = "standard",
) -> dict[str, Any]:
    intl = _is_international(origin, destination)
    return estimate_budget(origin, destination, nights, passengers, trip_style, intl)
