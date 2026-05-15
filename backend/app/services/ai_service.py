"""OpenAI-powered travel query parser with LangSmith tracing and query cache."""

from __future__ import annotations

import json
import logging
import re
from datetime import date, timedelta
from typing import Any

import openai
from langsmith.wrappers import wrap_openai

from app.core.config import settings
from app.schemas.search import (
    BusSearchRequest,
    FlightSearchRequest,
    HotelSearchRequest,
    TrainSearchRequest,
)
from app.services import search_service

log = logging.getLogger(__name__)

# Lazy client — initialized on first use so the server starts without OPENAI_API_KEY set.
_client: openai.AsyncOpenAI | None = None

def _get_client() -> openai.AsyncOpenAI:
    global _client
    if _client is None:
        if not settings.OPENAI_API_KEY:
            raise RuntimeError("OPENAI_API_KEY is not configured. Set it in Railway environment variables.")
        _client = wrap_openai(openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY))
    return _client

# In-process LLM cache: normalized_query → parsed intent dict.
# Avoids repeat API calls for identical queries within the same server session.
_intent_cache: dict[str, dict[str, Any]] = {}


def _normalize(query: str, today: date) -> str:
    """Cache key = date + normalised query. Changing date or system prompt auto-busts cache."""
    clean = re.sub(r"\s+", " ", query.strip().lower())
    return f"{today.isoformat()}|{clean}"

_SYSTEM_PROMPT = """\
You are a travel search assistant for Indian travelers.
Parse the user's natural language travel query and return ONLY a valid JSON object — no markdown, no explanation.

Today's date: {today}

JSON schema (use null for unknown fields):
{{
  "intent": "flight" | "hotel" | "train" | "bus",
  "from_city": string | null,
  "to_city": string | null,
  "city": string | null,
  "travel_date": "YYYY-MM-DD" | null,
  "return_date": "YYYY-MM-DD" | null,
  "check_in": "YYYY-MM-DD" | null,
  "check_out": "YYYY-MM-DD" | null,
  "travelers": integer,
  "nights": integer | null,
  "budget_total": integer | null,
  "ai_message": string
}}

Rules:
- Default travelers to 1
- If no date given, use 2 weeks from today
- "trip to X" with no transport → intent = "flight"
- "hotel in X" or "stay in X" → intent = "hotel", populate city
- Budget "₹15k" or "under ₹15,000" → budget_total = 15000; "₹40k" → 40000
- For hotel queries, if no nights given default to 2; derive check_out from check_in + nights
- DEFAULT to return trip: if no trip type is mentioned, assume round trip and set return_date = 3–7 days after travel_date (use 7 days if no duration hint is given). Only set return_date = null when the user explicitly says "one way", "one side", "single", "onward only", or similar
- ai_message: 1-sentence friendly summary of what you understood (mention route/city, one-way vs return, and budget if given)
- Return ONLY valid JSON
"""


async def parse_and_search(query: str) -> dict[str, Any]:
    today = date.today()
    default_date = today + timedelta(weeks=2)
    cache_key = _normalize(query, today)

    if cache_key in _intent_cache:
        intent_data = _intent_cache[cache_key]
        print(f"[AI] Cache hit for: {cache_key!r}")
    else:
        response = await _get_client().chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": _SYSTEM_PROMPT.format(today=today.isoformat())},
                {"role": "user", "content": query},
            ],
            response_format={"type": "json_object"},
            temperature=0,
        )
        raw = response.choices[0].message.content or "{}"
        intent_data = json.loads(raw)
        _intent_cache[cache_key] = intent_data
        print(f"[AI] Cache stored for: {cache_key!r}")

    intent: str = intent_data.get("intent", "flight")
    results: list[dict[str, Any]] = []

    try:
        if intent == "flight":
            req = FlightSearchRequest(
                from_city=intent_data.get("from_city") or "Delhi",
                to_city=intent_data.get("to_city") or "Mumbai",
                departure_date=intent_data.get("travel_date") or default_date.isoformat(),
                return_date=intent_data.get("return_date"),
                travelers=int(intent_data.get("travelers") or 1),
            )
            results = await search_service.search_flights(req)

        elif intent == "hotel":
            nights = int(intent_data.get("nights") or 2)
            check_in_str: str = intent_data.get("check_in") or default_date.isoformat()
            check_in = date.fromisoformat(check_in_str)
            check_out_str: str = intent_data.get("check_out") or (check_in + timedelta(days=nights)).isoformat()
            req_h = HotelSearchRequest(
                city=intent_data.get("city") or intent_data.get("to_city") or "Goa",
                check_in=check_in_str,
                check_out=check_out_str,
                guests=int(intent_data.get("travelers") or 1),
            )
            results = await search_service.search_hotels(req_h)

        elif intent == "train":
            req_t = TrainSearchRequest(
                from_city=intent_data.get("from_city") or "Delhi",
                to_city=intent_data.get("to_city") or "Mumbai",
                travel_date=intent_data.get("travel_date") or default_date.isoformat(),
            )
            results = await search_service.search_trains(req_t)

        elif intent == "bus":
            req_b = BusSearchRequest(
                from_city=intent_data.get("from_city") or "Bangalore",
                to_city=intent_data.get("to_city") or "Mysore",
                travel_date=intent_data.get("travel_date") or default_date.isoformat(),
            )
            results = await search_service.search_buses(req_b)

    except Exception:
        results = []

    # Filter by budget if provided
    budget = intent_data.get("budget_total")
    if budget and results:
        price_key = "total_price" if intent in ("flight", "hotel") else "price"
        affordable = [r for r in results if r.get(price_key, 0) <= budget]
        if affordable:
            results = affordable

    return {
        "intent": intent_data,
        "results": results,
        "ai_message": intent_data.get("ai_message", "Here are the best options I found for you!"),
    }
