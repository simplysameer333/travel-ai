"""
Intent classification node.
Reads the latest user message and classifies it into one of 4 intent types,
extracting structured entities for downstream handler nodes.
"""
from __future__ import annotations

import json
import logging
from datetime import date

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

from app.prompts.system_prompts import INTENT_CLASSIFIER
from app.state.travel_state import TravelState

log = logging.getLogger(__name__)

_classifier_llm: ChatOpenAI | None = None


def _get_classifier_llm() -> ChatOpenAI:
    global _classifier_llm
    if _classifier_llm is None:
        from app.core.config import settings
        _classifier_llm = ChatOpenAI(
            model="gpt-4o-mini",
            api_key=settings.OPENAI_API_KEY,
            streaming=False,
            temperature=0,
        )
    return _classifier_llm


def _last_user_message(state: TravelState) -> str:
    for msg in reversed(state["messages"]):
        if hasattr(msg, "type") and msg.type == "human":
            return str(msg.content)
        if isinstance(msg, HumanMessage):
            return str(msg.content)
    return ""


async def intent_classifier_node(state: TravelState) -> dict:
    """Classify user intent and extract travel entities."""
    user_msg = _last_user_message(state)
    if not user_msg:
        return {"intent": "general", "intent_data": {}}

    today_str = date.today().isoformat()
    prompt = INTENT_CLASSIFIER.format(today=today_str)
    llm = _get_classifier_llm()

    try:
        response = await llm.ainvoke([
            SystemMessage(content=prompt),
            HumanMessage(content=user_msg),
        ])
        raw = str(response.content).strip()
        # Strip markdown code fences if present
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        intent_data: dict = json.loads(raw)
    except Exception as exc:
        log.warning("Intent classification failed (%s) — defaulting to general", exc)
        intent_data = {"intent_type": "general"}

    intent_type = intent_data.pop("intent_type", "general")
    log.info("Intent classified: %s | data: %s", intent_type, intent_data)

    return {"intent": intent_type, "intent_data": intent_data}


def route_by_intent(state: TravelState) -> str:
    """Conditional edge function — returns the next node name based on intent."""
    intent = state.get("intent", "general")
    return {
        "simple_search": "simple_search",
        "trip_planning": "trip_planner",
        "full_itinerary": "itinerary_builder",
        "general": "general_advisor",
    }.get(intent or "general", "general_advisor")
