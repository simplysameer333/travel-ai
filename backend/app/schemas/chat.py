from typing import Literal, Optional
from pydantic import BaseModel


class ChatMessageSchema(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessageSchema]
    session_id: Optional[str] = None  # persisted in browser, used as LangGraph thread_id
    user_id: Optional[str] = None     # set server-side from JWT if authenticated
