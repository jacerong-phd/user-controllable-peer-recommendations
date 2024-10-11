from typing import Any

from fastapi import (
    APIRouter,
    Depends,
)
from fastapi.security import OAuth2PasswordRequestForm

from app.constants import (
    AUTH_TAGS,
    AUTH_URL
)
from app.schemas.auth import (
    UserSchema,
    TokenSchema,
)
from app.services.auth import (
    AuthService,
    get_current_user,
)


router = APIRouter(prefix=("/" + AUTH_URL), tags=AUTH_TAGS)


@router.get("/me")
async def get_my_account(
    user: UserSchema = Depends(get_current_user)
) -> dict[str, Any]:
    return {
        "id": user.person_id,
        "username": user.username,
    }


@router.post("/tokens", response_model=TokenSchema)
async def authenticate(
    login: OAuth2PasswordRequestForm = Depends()
) -> TokenSchema | None:
    """User authentication.

    Raises:
        HTTPException: 401 Unauthorized
        HTTPException: 404 Not Found

    Returns:
        Access token.
    """    
    
    return AuthService().authenticate(login)