from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.backend.config import settings
from app.constants import (
    OPEN_API_DESCRIPTION,
    OPEN_API_TITLE,
)
from app.routers import (
    people,
    auth,
    community,
)


app = FastAPI(
    title=OPEN_API_TITLE,
    description=OPEN_API_DESCRIPTION,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"),
    allow_headers=settings.CORS_HEADERS,
)


app.include_router(people.router)
app.include_router(auth.router)
app.include_router(community.router)