from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DB_URL: str
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    CLOUD_NAME: str
    API_KEY: str
    API_SECRET: str

    model_config= SettingsConfigDict(env_file= ".env", env_file_encoding= "utf-8")


settings= Settings()