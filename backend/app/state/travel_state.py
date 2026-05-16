"""Typed state shared across all nodes in the TravelAI multi-agent graph."""
from __future__ import annotations

from typing import Annotated, Any, Literal, Optional
from typing_extensions import TypedDict
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages

# Intent types — determines which handler node executes
IntentType = Literal["simple_search", "trip_planning", "full_itinerary", "general"]


class TravelState(TypedDict):
    # Conversation history — reducer appends new messages, never replaces
    messages: Annotated[list[BaseMessage], add_messages]

    # Optional authenticated user ID for checkpointing
    user_id: Optional[str]

    # Set by intent_classifier node
    intent: Optional[IntentType]

    # Entities extracted from the user query:
    # travel_mode, origin, destination, departure_date, return_date,
    # travelers, budget_tier, trip_style, duration_days, international
    intent_data: Optional[dict[str, Any]]

    # Raw results gathered by handler nodes (flights, hotels, etc.)
    search_results: Optional[dict[str, Any]]
