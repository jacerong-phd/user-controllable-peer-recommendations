from typing import Any

from fastapi import (
    APIRouter,
    Depends,
)

from app.constants import (
    PEOPLE_TAGS,
    PEOPLE_URL
)
from app.schemas.auth import UserSchema
from app.schemas.people import (
    PersonConditionSchema,
    PersonSchema,
    PersonSymptomSchema,
    PersonTreatmentSchema,
)
from app.services.auth import get_current_user
from app.services.people import PersonService


router = APIRouter(prefix=("/" + PEOPLE_URL), tags=PEOPLE_TAGS)


@router.get("/{person_id}", response_model=PersonSchema)
async def get_person(
    person_id: int,
    user: UserSchema = Depends(get_current_user)
) -> PersonSchema:
    """Get person's profile data by ID."""
    
    return PersonService().get_person_by_id(person_id)


@router.get("/{person_id}/conditions", response_model=list[PersonConditionSchema])
async def get_person_conditions(
    person_id: int,
    user: UserSchema = Depends(get_current_user)
) -> list[PersonConditionSchema]:
    return PersonService().get_person_conditions(person_id)


@router.get("/{person_id}/symptoms", response_model=list[PersonSymptomSchema])
async def get_person_symptoms(
    person_id: int,
    user: UserSchema = Depends(get_current_user)
) -> list[PersonSymptomSchema]:
    return PersonService().get_person_symptoms(person_id)


@router.get("/{person_id}/treatments", response_model=list[PersonTreatmentSchema])
async def get_person_treatments(
    person_id: int,
    user: UserSchema = Depends(get_current_user)
) -> list[PersonTreatmentSchema]:
    return PersonService().get_person_treatments(person_id)


@router.get("/{person_id}/connections")
async def get_person_connections(
    person_id: int,
    user: UserSchema = Depends(get_current_user)
) -> list[dict[str, Any]]:
    return PersonService().get_person_connections(person_id)


@router.get("/{person_id}/connections/{peer_id}")
async def check_person_connection(
    person_id: int,
    peer_id: int,
    user: UserSchema = Depends(get_current_user)
) -> bool:
    """Check if `person_id` and `peer_id` are connected to each other."""
    return PersonService().check_person_connection(person_id, peer_id)


@router.get("/{person_id}/peer-recommendations/likeness")
async def recommend_peers(
    person_id: int,
    demographics: float,
    clinical: float,
    lifestyle: float,
    size: int | None = None,
    user: UserSchema = Depends(get_current_user)
) -> list[dict[str, Any]]:
    return PersonService().get_peer_recommendations(
        person_id=person_id,
        engine='likeness',
        demographics=demographics,
        clinical=clinical,
        lifestyle=lifestyle,
        size=size
    )


@router.get("/{person_id}/peer-recommendations/clinical")
async def recommend_clinically_alike_peers(
    person_id: int,
    conditions: float,
    symptoms: float,
    treatments: float,
    size: int | None = None,
    user: UserSchema = Depends(get_current_user)
) -> list[dict[str, Any]]:
    return PersonService().get_peer_recommendations(
        person_id=person_id,
        engine='clinical',
        conditions=conditions,
        symptoms=symptoms,
        treatments=treatments,
        size=size
    )