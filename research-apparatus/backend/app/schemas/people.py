from pydantic import BaseModel

from app.schemas.treatments import TreatmentSchema


class PersonSchema(BaseModel):
    id: int
    username: str
    gender: str
    age: str
    location: str | None
    activity_level: str | None
    smoking_status: str | None
    health_interests: str | None
    personal_interests: str | None
    total_connections: int


class PersonConditionSchema(BaseModel):
    person_id: int
    condition: str
    primary: bool
    diagnosed: bool
    time_since_diagnosis: str


class PersonSymptomSchema(BaseModel):
    person_id: int
    symptom: str
    severity: str | None


class PersonTreatmentSchema(BaseModel):
    person_id: int
    treatment: TreatmentSchema
    prescribed: bool
    purpose: list[str] = list()