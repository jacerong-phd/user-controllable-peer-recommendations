from pydantic import BaseModel


class UserSchema(BaseModel):
    person_id: int
    username: str
    email: str
    hashed_password: str | None = None
    disabled: bool = False


class TokenSchema(BaseModel):
    access_token: str
    token_type: str
