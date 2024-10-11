from pydantic_settings import BaseSettings


class Config(BaseSettings):
    """API configuration parameters."""
    JWT_ALG: str
    JWT_SECRET: str
    JWT_EXP: int
    
    CORS_ORIGINS: list[str]
    CORS_HEADERS: list[str]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Config()