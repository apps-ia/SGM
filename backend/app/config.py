"""
Configuration pour l'application NOIA_SGM
"""
import os
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Paramètres de l'application"""

    # API OpenAI
    openai_api_key: str
    openai_model: str = "gpt-4"  # À modifier vers GPT-5 quand disponible

    # Configuration serveur
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = False

    # CORS
    cors_origins: list[str] = ["*"]

    # Sécurité
    api_key_header: str = "X-API-Key"
    allowed_api_keys: Optional[list[str]] = None

    # Paramètres OpenAI
    max_tokens: int = 2000
    temperature: float = 0.3  # Température basse pour des réponses précises

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
