"""
Four handler nodes — one per intent type.
Each node gathers data from specialized agents, then calls the LLM to
format a streaming response. Token events from the LLM are captured by
astream_events in the chat endpoint and forwarded to the SSE client.
"""
from __future__ import annotations

import asyncio
import json
import logging
from typing import Any

from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

from app.prompts.system_prompts import (
    GENERAL_ADVISOR,
    ITINERARY_BUILDER,
    SIMPLE_SEARCH,
    TRIP_PLANNER,
)
from app.state.travel_state import TravelState

log = logging.getLogger(__name__)

_formatter_llm: ChatOpenAI | None = None


def _get_llm() -> ChatOpenAI:
    global _formatter_llm
    if _formatter_llm is None:
        from app.core.config import settings
        _formatter_llm = ChatOpenAI(
            model=settings.OPENAI_MODEL,
            api_key=settings.OPENAI_API_KEY,
            streaming=True,
            temperature=0.7,
        )
    return _formatter_llm


def _last_user_msg(state: TravelState) -> str:
    for msg in reversed(state["messages"]):
        if hasattr(msg, "type") and msg.type == "human":
            return str(msg.content)
        if isinstance(msg, HumanMessage):
            return str(msg.content)
    return ""


def _dump(obj: Any) -> str:
    return json.dumps(obj, indent=2, ensure_ascii=False)


# ─────────────────────────────────────────────────────────────────────────────
# Node 1 — Simple Search
# Handles: "book flight", "train to X", "hotels in Y", "rent a car"
# ─────────────────────────────────────────────────────────────────────────────

async def simple_search_node(state: TravelState) -> dict:
    from app.agents import (
        buses_agent, cars_agent, flights_agent, hotels_agent, trains_agent,
    )

    d = state.get("intent_data") or {}
    mode = (d.get("travel_mode") or "flight").lower()
    origin      = d.get("origin", "Delhi")
    destination = d.get("destination", "")
    dep_date    = d.get("departure_date", "")
    ret_date    = d.get("return_date", "")
    travelers   = int(d.get("travelers") or 1)
    query       = _last_user_msg(state)

    results: dict[str, Any] = {}

    try:
        if mode == "flight":
            results = await flights_agent.search(origin, destination, dep_date, travelers,
                                                  return_date=ret_date)
        elif mode == "train":
            results = await trains_agent.search(origin, destination, dep_date, travelers)
        elif mode == "bus":
            results = await buses_agent.search(origin, destination, dep_date, travelers)
        elif mode == "car":
            results = await cars_agent.search(destination or origin, dep_date, ret_date)
        elif mode == "hotel":
            nights = int(d.get("duration_days") or 2)
            from datetime import datetime, timedelta
            checkin  = dep_date
            checkout = ret_date or (
                (datetime.strptime(dep_date, "%Y-%m-%d") + timedelta(days=nights)).strftime("%Y-%m-%d")
                if dep_date else ""
            )
            results = await hotels_agent.search(destination, checkin, checkout, travelers,
                                                  d.get("budget_tier") or "standard")
        else:
            results = await flights_agent.search(origin, destination, dep_date, travelers)
    except Exception as exc:
        log.exception("simple_search_node agent error: %s", exc)
        results = {"error": str(exc)}

    prompt = SIMPLE_SEARCH.format(
        user_query=query,
        travel_mode=mode,
        origin=origin or "—",
        destination=destination or "—",
        departure_date=dep_date or "flexible",
        travelers=travelers,
        results_json=_dump(results),
    )

    llm = _get_llm()
    response = await llm.ainvoke([SystemMessage(content=prompt)] + state["messages"])

    return {
        "messages": [response],
        "search_results": results,
    }


# ─────────────────────────────────────────────────────────────────────────────
# Node 2 — Trip Planner
# Handles: "plan trip to Goa", "travel options Delhi to Manali"
# Explores ALL transport modes + hotels + packages + budget
# ─────────────────────────────────────────────────────────────────────────────

async def trip_planner_node(state: TravelState) -> dict:
    from app.agents import (
        budget_agent, buses_agent, flights_agent, hotels_agent,
        packages_agent, trains_agent, recommendation_agent,
    )

    d = state.get("intent_data") or {}
    origin      = d.get("origin", "Delhi")
    destination = d.get("destination", "")
    dep_date    = d.get("departure_date", "")
    ret_date    = d.get("return_date", "")
    travelers   = int(d.get("travelers") or 1)
    nights      = int(d.get("duration_days") or 3)
    trip_style  = d.get("trip_style") or "standard"
    budget_tier = d.get("budget_tier") or "standard"
    query       = _last_user_msg(state)

    # Fan out all agent searches in parallel
    flights_task  = flights_agent.search(origin, destination, dep_date, travelers, return_date=ret_date)
    trains_task   = trains_agent.search(origin, destination, dep_date, travelers)
    buses_task    = buses_agent.search(origin, destination, dep_date, travelers)
    hotels_task   = hotels_agent.search(destination, dep_date, ret_date, travelers, budget_tier)
    packages_task = packages_agent.search(destination, origin, travelers, trip_style, nights)
    budget_task   = budget_agent.estimate(origin, destination, nights, travelers, trip_style)

    (
        flights_res, trains_res, buses_res,
        hotels_res, packages_res, budget_res,
    ) = await asyncio.gather(
        flights_task, trains_task, buses_task,
        hotels_task, packages_task, budget_task,
        return_exceptions=True,
    )

    def _safe(r: Any) -> Any:
        return r if not isinstance(r, Exception) else {"error": str(r)}

    results: dict[str, Any] = {
        "flights":  _safe(flights_res),
        "trains":   _safe(trains_res),
        "buses":    _safe(buses_res),
        "hotels":   _safe(hotels_res),
        "packages": _safe(packages_res),
        "budget":   _safe(budget_res),
    }

    # Ranking
    try:
        flights_list = (results["flights"].get("outbound") or []) if isinstance(results["flights"], dict) else []
        trains_list  = (results["trains"].get("options") or []) if isinstance(results["trains"], dict) else []
        buses_list   = (results["buses"].get("options") or []) if isinstance(results["buses"], dict) else []
        ranking = await recommendation_agent.rank_options(flights_list, trains_list, buses_list, trip_style, budget_tier)
        results["ranking"] = ranking
    except Exception:
        pass

    prompt = TRIP_PLANNER.format(
        user_query=query,
        origin=origin,
        destination=destination,
        destination_upper=(destination or "").upper(),
        nights=nights,
        travelers=travelers,
        trip_style=trip_style,
        flights_json=_dump(results.get("flights")),
        trains_json=_dump(results.get("trains")),
        buses_json=_dump(results.get("buses")),
        hotels_json=_dump(results.get("hotels")),
        packages_json=_dump(results.get("packages")),
        budget_json=_dump(results.get("budget")),
    )

    llm = _get_llm()
    response = await llm.ainvoke([SystemMessage(content=prompt)] + state["messages"])

    return {
        "messages": [response],
        "search_results": results,
    }


# ─────────────────────────────────────────────────────────────────────────────
# Node 3 — Itinerary Builder
# Handles: "Plan 10-day China trip", "Europe honeymoon itinerary"
# Full concierge: day-by-day plan, visa, budget breakdown
# ─────────────────────────────────────────────────────────────────────────────

async def itinerary_builder_node(state: TravelState) -> dict:
    from app.agents import (
        budget_agent, flights_agent, hotels_agent, itinerary_agent,
        packages_agent, visa_agent,
    )

    d = state.get("intent_data") or {}
    origin       = d.get("origin", "Delhi")
    destination  = d.get("destination", "")
    dep_date     = d.get("departure_date", "")
    ret_date     = d.get("return_date", "")
    travelers    = int(d.get("travelers") or 1)
    duration     = int(d.get("duration_days") or 7)
    trip_style   = d.get("trip_style") or "standard"
    budget_tier  = d.get("budget_tier") or "standard"
    intl         = bool(d.get("international", False))
    query        = _last_user_msg(state)

    (
        flights_res, hotels_res, packages_res,
        itinerary_res, budget_res, visa_res,
    ) = await asyncio.gather(
        flights_agent.search(origin, destination, dep_date, travelers, return_date=ret_date),
        hotels_agent.search(destination, dep_date, ret_date, travelers, budget_tier),
        packages_agent.search(destination, origin, travelers, trip_style, duration),
        itinerary_agent.build(destination, duration, trip_style),
        budget_agent.estimate(origin, destination, duration - 1, travelers, trip_style),
        visa_agent.get_requirements(destination),
        return_exceptions=True,
    )

    def _safe(r: Any) -> Any:
        return r if not isinstance(r, Exception) else {"error": str(r)}

    results: dict[str, Any] = {
        "flights":   _safe(flights_res),
        "hotels":    _safe(hotels_res),
        "packages":  _safe(packages_res),
        "itinerary": _safe(itinerary_res),
        "budget":    _safe(budget_res),
        "visa":      _safe(visa_res),
    }

    prompt = ITINERARY_BUILDER.format(
        user_query=query,
        origin=origin,
        destination=destination,
        duration_days=duration,
        travelers=travelers,
        trip_style=trip_style,
        budget_tier=budget_tier,
        international=str(intl),
        flights_json=_dump(results.get("flights")),
        hotels_json=_dump(results.get("hotels")),
        packages_json=_dump(results.get("packages")),
        itinerary_json=_dump(results.get("itinerary")),
        budget_json=_dump(results.get("budget")),
        visa_json=_dump(results.get("visa")),
    )

    llm = _get_llm()
    response = await llm.ainvoke([SystemMessage(content=prompt)] + state["messages"])

    return {
        "messages": [response],
        "search_results": results,
    }


# ─────────────────────────────────────────────────────────────────────────────
# Node 4 — General Advisor
# Handles: travel tips, visa questions, general chat
# ─────────────────────────────────────────────────────────────────────────────

async def general_advisor_node(state: TravelState) -> dict:
    llm = _get_llm()
    response = await llm.ainvoke(
        [SystemMessage(content=GENERAL_ADVISOR)] + state["messages"]
    )
    return {"messages": [response]}
