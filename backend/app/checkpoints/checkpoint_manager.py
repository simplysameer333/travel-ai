"""
LangGraph checkpoint manager.
Uses MongoDB for persistent per-user conversation state.
Falls back to in-memory MemorySaver if the mongodb package is not installed.
"""
from __future__ import annotations

import logging
from typing import Any

log = logging.getLogger(__name__)

_checkpointer: Any = None


async def init_checkpointer() -> Any:
    """Initialise and return the checkpointer. Call once at app startup."""
    global _checkpointer
    if _checkpointer is not None:
        return _checkpointer

    try:
        from langgraph.checkpoint.mongodb.aio import AsyncMongoDBSaver  # type: ignore[import]
        from app.db.database import get_client
        from app.core.config import settings

        client = get_client()
        saver = AsyncMongoDBSaver(client=client, db_name=settings.DATABASE_NAME)
        # Create indexes / collections
        await saver.setup()
        _checkpointer = saver
        log.info("LangGraph checkpointer: MongoDB (persistent per-user state)")
    except Exception as exc:
        log.warning(
            "MongoDB checkpointer unavailable (%s). "
            "Falling back to MemorySaver — conversation state will not persist across restarts.",
            exc,
        )
        from langgraph.checkpoint.memory import MemorySaver  # type: ignore[import]
        _checkpointer = MemorySaver()

    return _checkpointer


def get_checkpointer() -> Any:
    """Return the already-initialised checkpointer (must call init_checkpointer first)."""
    if _checkpointer is None:
        # Sync fallback for environments where startup was skipped
        from langgraph.checkpoint.memory import MemorySaver
        return MemorySaver()
    return _checkpointer
