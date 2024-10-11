from typing import Final

import os


APP_PATH: Final = os.path.dirname(os.path.realpath(__file__))
DATA_PATH: Final = os.path.join(
    os.sep.join(APP_PATH.split(os.sep)[:-1]) ,'data'
)

# Open API parameters
OPEN_API_TITLE: Final = "So-STRAP API Hub"
OPEN_API_DESCRIPTION: Final = "Supports the business logic of the So-STRAP app (the frontend)."

# Authentication service constants
AUTH_TAGS: Final[list[str] | None] = ["Authentication"]
AUTH_URL: Final = "users"

TOKEN_TYPE: Final = "bearer"

# People service constants
PEOPLE_TAGS: Final[list[str] | None] = ["People"]
PEOPLE_URL: Final = "people"

# Community service constants
COMMUNITY_TAGS: Final[list[str] | None] = ["Community"]
COMMUNITY_URL: Final = "community"