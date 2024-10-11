from datetime import (
    datetime,
    timedelta,
)

from fastapi import (
    Depends,
    HTTPException,
    status,
)
from fastapi.security import (
    OAuth2PasswordBearer,
    OAuth2PasswordRequestForm,
)
from jose import (
    JWTError,
    jwt,
)
from passlib.context import CryptContext

from app.backend.config import settings
from app.constants import (
    AUTH_URL,
    TOKEN_TYPE,
)
from app.schemas.auth import (
    TokenSchema,
    UserSchema,
)
from app.utils import read_data_file


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=(AUTH_URL + "/tokens"), auto_error=False)


async def get_current_user(
    token: str = Depends(oauth2_scheme)
) -> UserSchema | None:
    """Decode token to obtain user information."""

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    if token is None:
        raise credentials_exception
    
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=settings.JWT_ALG)

        email: str = payload.get("sub")
        expires_at: str = payload.get("expires_at")
        
        if email is None:
            raise credentials_exception
        elif datetime.strptime(expires_at, "%Y-%m-%d %H:%M:%S") < datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expired"
            )
    except JWTError:
        raise credentials_exception
    
    user = AuthService().get_user(email=email)

    if user is None:
        raise credentials_exception
    
    return UserSchema(
        person_id=user.person_id,
        username=user.username,
        email=user.email
    )


class HashingMixin:
    """Hashing and verifying passwords."""

    @staticmethod
    def bcrypt(password: str) -> str:
        """Generate a bcrypt hashed password."""

        return pwd_context.hash(password)
    
    @staticmethod
    def verify(plain_password: str, hashed_password: str) -> bool:
        """Verify a password against a hash."""
        
        return pwd_context.verify(plain_password, hashed_password)


class AuthService(HashingMixin):
    """Authentication service."""

    def __init__(self):
        self.users = read_data_file('users.csv')
    
    def authenticate(
        self, login: OAuth2PasswordRequestForm = Depends()
    ) -> TokenSchema | None:
        """Generate token."""

        login_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="We didn't find such combination of email and password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
        user = self.get_user(email=login.username)

        if user is None:
            raise login_exception

        if not self.verify(login.password, user.hashed_password):
            raise login_exception
        elif user.disabled:
            raise HTTPException(status_code=400, detail="Inactive user")
        else:
            access_token = self._create_access_token(user.email)
            return TokenSchema(access_token=access_token, token_type=TOKEN_TYPE)
    
    def get_user(
        self,
        username: str = None,
        person_id: int = None,
        email: str = None
    ) -> UserSchema | None:
        num_params = sum([
            1 if param is not None else 0 for param in [username, person_id, email]
        ])

        if num_params == 0:
            raise Exception("Set a username, a person's ID, or an e-mail to search for a user.")
        elif num_params > 1:
            raise Exception("Set only one parameter to search for a user.")

        q = None

        if username is not None:
            q = self.users['username'].str.lower() == username.lower()
        elif person_id is not None:
            q = self.users['person_id'] == person_id
        else:
            q = self.users['email'].str.lower() == email.lower()

        result = self.users.loc[q]

        user = (
            None if result.shape[0] == 0
            else UserSchema(**result.to_dict(orient='records')[0])
        )

        return user
    
    def _create_access_token(
            self,
            email: str,
            expires_delta: int = settings.JWT_EXP
        ) -> str:
        """Encode user information and expiration time."""

        expires_at = datetime.utcnow() + timedelta(minutes=expires_delta)

        jwt_data = {
            "sub": email,
            "expires_at": expires_at.strftime("%Y-%m-%d %H:%M:%S")
        }

        return jwt.encode(jwt_data, settings.JWT_SECRET, algorithm=settings.JWT_ALG)
