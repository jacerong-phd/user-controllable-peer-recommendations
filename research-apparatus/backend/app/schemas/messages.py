from __future__ import annotations

from pydantic import BaseModel

from app.schemas.people import PersonSchema


class MessageImpactSchema(BaseModel):
    likes: int = 0


class MessageSchema(BaseModel):
    person: PersonSchema
    datetime: str
    message: str
    impact: MessageImpactSchema | None = None
    replies: list[MessageSchema] = []