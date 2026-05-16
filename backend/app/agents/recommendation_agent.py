"""Recommendation agent — scores and ranks travel options by user profile."""
from __future__ import annotations

from typing import Any


def _score_flight(f: dict, trip_style: str, budget_tier: str) -> float:
    score = 0.0
    # Price score (lower = better, normalise roughly)
    price = f.get("price_per_person", 99999)
    score += max(0, 100 - price / 500)
    # Duration score
    dur_str = f.get("duration", "3h 00m")
    try:
        h, m = dur_str.replace("h", "").replace("m", "").split()
        dur_hours = int(h) + int(m) / 60
        score += max(0, 30 - dur_hours * 3)
    except Exception:
        pass
    # Non-stop bonus
    if f.get("stops", 0) == 0:
        score += 20
    # Refundable bonus for premium
    if budget_tier in ("premium", "luxury") and f.get("refundable"):
        score += 10
    return round(score, 1)


async def rank_options(
    flights: list[dict],
    trains: list[dict],
    buses: list[dict],
    trip_style: str = "standard",
    budget_tier: str = "standard",
) -> dict[str, Any]:
    scored_flights = sorted(
        [{"option": f, "score": _score_flight(f, trip_style, budget_tier), "mode": "flight"} for f in flights],
        key=lambda x: -x["score"],
    )
    scored_trains = [
        {"option": t, "score": 60.0, "mode": "train"}
        for t in trains
    ]
    scored_buses = [
        {"option": b, "score": 30.0, "mode": "bus"}
        for b in buses
    ]

    all_scored = scored_flights[:2] + scored_trains[:1] + scored_buses[:1]
    all_scored.sort(key=lambda x: -x["score"])

    return {
        "top_recommendation": all_scored[0] if all_scored else None,
        "ranked": all_scored,
        "recommendation_reason": _reason(all_scored, trip_style, budget_tier),
    }


def _reason(ranked: list[dict], trip_style: str, budget_tier: str) -> str:
    if not ranked:
        return "Search again with specific dates for the best recommendations."
    top = ranked[0]
    mode = top["mode"]
    if mode == "flight":
        price = top["option"].get("price_per_person", 0)
        return f"Best value flight at ₹{price:,}/person — fastest option for this route."
    if mode == "train":
        price = top["option"].get("price_per_person", 0)
        return f"Train at ₹{price:,}/person — comfortable, scenic, and budget-friendly."
    if mode == "bus":
        price = top["option"].get("price_per_person", 0)
        return f"Bus at ₹{price:,}/person — most economical choice."
    return "Review all options and choose based on your comfort and budget preference."
