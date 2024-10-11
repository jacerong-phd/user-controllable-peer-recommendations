from __future__ import annotations

from pydantic import BaseModel


class TreatmentSchema(BaseModel):
    id: int
    parent: TreatmentSchema | None = None
    name: str
    type: str
