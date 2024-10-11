from fastapi import (
    APIRouter,
    Depends,
)

from app.constants import (
    COMMUNITY_TAGS,
    COMMUNITY_URL,
)
from app.schemas.auth import UserSchema
from app.schemas.messages import (
    MessageSchema
)
from app.services.auth import get_current_user
from app.services.community import CommunityService


router = APIRouter(prefix=("/" + COMMUNITY_URL), tags=COMMUNITY_TAGS)


@router.get("/feed", response_model=list[MessageSchema])
async def feed(
    user: UserSchema = Depends(get_current_user)
) -> list[MessageSchema]:
    return CommunityService().feed()