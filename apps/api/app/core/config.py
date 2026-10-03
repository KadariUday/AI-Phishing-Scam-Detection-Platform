import os
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    PROJECT_NAME: str = "PhishGuard AI Backend API"
    ENVIRONMENT: str = "development"
    API_V1_STR: str = "/api/v1"
    
    # Security
    JWT_SECRET_KEY: str = "phishguard-dev-super-secret-jwt-signing-key-replace-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours for dev convenience
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
    ]
    
    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        return ["http://localhost:3000", "http://127.0.0.1:3000"]

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./phishguard.db"
    DATABASE_SYNC_URL: str = "sqlite:///./phishguard.db"

    # MongoDB Configuration
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "phishguard_db"
    MONGODB_ENABLED: bool = True
    MONGODB_TIMEOUT_MS: int = 3000

    # ML Artifacts Paths
    # Project root is 4 levels up from this file (apps/api/app/core/config.py)
    _PROJECT_ROOT: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
    MODEL_ARTIFACTS_DIR: str = os.path.join(_PROJECT_ROOT, "ml", "artifacts")
    URL_MODEL_PATH: str = os.path.join(MODEL_ARTIFACTS_DIR, "url_phishing_model.joblib")
    URL_SCALER_PATH: str = os.path.join(MODEL_ARTIFACTS_DIR, "url_scaler.joblib")
    URL_FEATURE_NAMES_PATH: str = os.path.join(MODEL_ARTIFACTS_DIR, "url_features.json")
    NLP_MODEL_PATH: str = os.path.join(MODEL_ARTIFACTS_DIR, "nlp_scam_model.joblib")
    NLP_VECTORIZER_PATH: str = os.path.join(MODEL_ARTIFACTS_DIR, "nlp_vectorizer.joblib")
    METRICS_MANIFEST_PATH: str = os.path.join(MODEL_ARTIFACTS_DIR, "model_metrics.json")

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 120
    SCAN_RATE_LIMIT_PER_MINUTE: int = 60

settings = Settings()
