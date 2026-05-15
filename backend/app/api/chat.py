"""
Travel Buddy chat endpoint — streaming SSE responses via LangGraph agent.
"""
import json
import logging

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.agents.travel_agent import build_lc_messages, get_travel_agent
from app.schemas.chat import ChatRequest

log = logging.getLogger(__name__)

router = APIRouter(prefix="/api/chat", tags=["Chat"])


@router.post("/stream")
async def chat_stream(request: ChatRequest):
    """
    Stream Travel Buddy responses as Server-Sent Events.
    Each event: data: {"token": "..."}\n\n
    Final event: data: [DONE]\n\n
    """
    lc_messages = build_lc_messages([m.model_dump() for m in request.messages])

    async def generate():
        try:
            agent = get_travel_agent()
            async for event in agent.astream_events(
                {"messages": lc_messages},
                version="v2",
            ):
                if event["event"] != "on_chat_model_stream":
                    continue
                chunk = event["data"].get("chunk")
                if chunk is None:
                    continue
                content = chunk.content
                # content can be str or list (structured output)
                if isinstance(content, str) and content:
                    yield f"data: {json.dumps({'token': content})}\n\n"
                elif isinstance(content, list):
                    for part in content:
                        if isinstance(part, dict) and part.get("type") == "text":
                            text = part.get("text", "")
                            if text:
                                yield f"data: {json.dumps({'token': text})}\n\n"
        except Exception as exc:
            log.exception("Travel Buddy stream error")
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
