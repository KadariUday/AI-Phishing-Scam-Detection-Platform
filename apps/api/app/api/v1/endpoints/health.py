from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from apps.api.app.db.session import get_db
from apps.api.app.ml.model_loader import model_loader

router = APIRouter(prefix="/health", tags=["Health & Observability"])

@router.get("", status_code=status.HTTP_200_OK)
async def health_check():
    """Basic service health check."""
    return {
        "status": "healthy",
        "service": "PhishGuard AI Backend API",
        "version": "1.0.0",
        "ml_models_loaded": model_loader.is_loaded
    }

@router.get("/db", status_code=status.HTTP_200_OK)
async def database_health_check(db: AsyncSession = Depends(get_db)):
    """Verifies active connectivity to the persistence database."""
    try:
        await db.execute(text("SELECT 1"))
        return {
            "status": "healthy",
            "database": "connected"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "error",
            "detail": str(e)
        }
