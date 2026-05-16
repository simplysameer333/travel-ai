"""
TravelAI multi-agent graph.

Graph flow:
  START
    → intent_classifier          (classifies query, extracts entities)
    → [conditional route]
        → simple_search          (single transport / hotel lookup)
        → trip_planner           (multi-mode trip comparison)
        → itinerary_builder      (full day-by-day itinerary + visa + budget)
        → general_advisor        (travel advice, general questions)
    → END

Each handler node calls specialized agent functions internally,
then invokes the formatter LLM whose tokens are streamed via astream_events.
"""
from __future__ import annotations

import logging
from typing import Any

from langgraph.graph import END, START, StateGraph

from app.nodes.handlers import (
    general_advisor_node,
    itinerary_builder_node,
    simple_search_node,
    trip_planner_node,
)
from app.nodes.intent_node import intent_classifier_node, route_by_intent
from app.state.travel_state import TravelState

log = logging.getLogger(__name__)

# Human-readable status messages emitted to the SSE client before each node runs
NODE_STATUS: dict[str, str] = {
    "intent_classifier": "Understanding your request...",
    "simple_search":     "Searching for the best options...",
    "trip_planner":      "Planning your trip across all transport modes...",
    "itinerary_builder": "Building your personalised itinerary...",
    "general_advisor":   None,  # type: ignore[assignment]  # No status for general chat
}

# Only stream LLM tokens from these nodes (not from intent_classifier)
STREAMING_NODES = {"simple_search", "trip_planner", "itinerary_builder", "general_advisor"}

_compiled_graph: Any = None


def _build_graph() -> StateGraph:
    builder = StateGraph(TravelState)

    builder.add_node("intent_classifier",  intent_classifier_node)
    builder.add_node("simple_search",      simple_search_node)
    builder.add_node("trip_planner",       trip_planner_node)
    builder.add_node("itinerary_builder",  itinerary_builder_node)
    builder.add_node("general_advisor",    general_advisor_node)

    builder.add_edge(START, "intent_classifier")

    builder.add_conditional_edges(
        "intent_classifier",
        route_by_intent,
        {
            "simple_search":     "simple_search",
            "trip_planner":      "trip_planner",
            "itinerary_builder": "itinerary_builder",
            "general_advisor":   "general_advisor",
        },
    )

    for node in ("simple_search", "trip_planner", "itinerary_builder", "general_advisor"):
        builder.add_edge(node, END)

    return builder


async def init_travel_graph() -> None:
    """Compile the graph with checkpointer. Called once at FastAPI startup."""
    global _compiled_graph
    from app.checkpoints.checkpoint_manager import init_checkpointer

    checkpointer = await init_checkpointer()
    _compiled_graph = _build_graph().compile(checkpointer=checkpointer)
    log.info("TravelAI multi-agent graph compiled and ready.")


def get_travel_graph() -> Any:
    """Return the compiled graph singleton."""
    global _compiled_graph
    if _compiled_graph is None:
        # Sync compile without checkpointer — for environments where startup was skipped
        from app.checkpoints.checkpoint_manager import get_checkpointer
        _compiled_graph = _build_graph().compile(checkpointer=get_checkpointer())
        log.warning("Graph compiled outside startup — using fallback checkpointer.")
    return _compiled_graph
