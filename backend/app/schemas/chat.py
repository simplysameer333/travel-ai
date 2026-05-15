from typing import Literal
from pydantic import BaseModel


class ChatMessageSchema(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessageSchema]
