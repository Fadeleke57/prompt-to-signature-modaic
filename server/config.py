from pydantic import BaseModel
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    modaic_token: str
    gemini_api_key: str
    api_url: str = "http://localhost:8000"
    client_url: str = "http://localhost:3000"

settings = Settings()

    
