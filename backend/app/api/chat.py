"""
AI Scout chat endpoint — multi-agent LangGraph streaming via SSE.

SSE event format (backward-compatible):
  data: {"status": "Searching for options..."}   ← node status update
  data: {"token": "..."}                          ← streamed response token
  data: [DONE]                                    ← stream complete
  data: {"error": "..."}                          ← on failure
"""
import json
import logging
from typing import Optional

from fastapi import APIRouter, Header
from fastapi.responses import StreamingResponse
from langchain_core.messages import AIMessage, HumanMessage
from pydantic import BaseModel

from app.graph.travel_graph import NODE_STATUS, STREAMING_NODES, get_travel_graph
from app.schemas.chat import ChatRequest

log = logging.getLogger(__name__)
router = APIRouter(prefix="/api/chat", tags=["Chat"])


def _build_lc_messages(messages: list[dict]) -> list:
    result = []
    for m in messages:
        if m["role"] == "user":
            result.append(HumanMessage(content=m["content"]))
        elif m["role"] == "assistant":
            result.append(AIMessage(content=m["content"]))
    return result


@router.post("/stream")
async def chat_stream(
    request: ChatRequest,
    authorization: Optional[str] = Header(default=None),
):
    """
    Stream AI Scout responses as Server-Sent Events.
    Uses the multi-agent graph: intent classification → specialized handler → streamed response.
    """
    lc_messages = _build_lc_messages([m.model_dump() for m in request.messages])

    # Derive thread_id for checkpointing (per-user persistence)
    user_id: Optional[str] = request.session_id
    if not user_id and authorization and authorization.startswith("Bearer "):
        try:
            from app.core.security import decode_access_token
            payload = decode_access_token(authorization[7:])
            user_id = payload.get("sub") if payload else None
        except Exception:
            pass
    if not user_id:
        import uuid
        user_id = f"anon-{uuid.uuid4().hex[:12]}"

    async def generate():
        try:
            graph = get_travel_graph()
            config = {"configurable": {"thread_id": user_id}}
            input_state = {
                "messages": lc_messages,
                "user_id": user_id,
                "intent": None,
                "intent_data": None,
                "search_results": None,
            }

            emitted_nodes: set[str] = set()

            async for event in graph.astream_events(input_state, config=config, version="v2"):
                etype = event.get("event", "")
                meta  = event.get("metadata", {})
                node  = meta.get("langgraph_node", "") or event.get("name", "")

                # ── Status update when a significant node starts ──────────────
                if etype == "on_chain_start" and node in NODE_STATUS and node not in emitted_nodes:
                    status_msg = NODE_STATUS.get(node)
                    if status_msg:
                        yield f"data: {json.dumps({'status': status_msg})}\n\n"
                    emitted_nodes.add(node)

                # ── Stream LLM tokens only from handler nodes ─────────────────
                if etype != "on_chat_model_stream":
                    continue
                if node and node not in STREAMING_NODES:
                    continue  # suppress intent_classifier JSON tokens

                chunk = event["data"].get("chunk")
                if chunk is None:
                    continue
                content = chunk.content
                if isinstance(content, str) and content:
                    yield f"data: {json.dumps({'token': content})}\n\n"
                elif isinstance(content, list):
                    for part in content:
                        if isinstance(part, dict) and part.get("type") == "text":
                            text = part.get("text", "")
                            if text:
                                yield f"data: {json.dumps({'token': text})}\n\n"

        except Exception as exc:
            log.exception("AI Scout stream error")
            yield f"data: {json.dumps({'error': str(exc)})}\n\n"
        finally:
            yield "data: [DONE]\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
