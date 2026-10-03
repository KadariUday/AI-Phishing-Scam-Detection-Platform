from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from apps.api.app.db.session import get_db
from apps.api.app.schemas.scan import AnalyticsResponse
from apps.api.app.services.analytics_service import analytics_service

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("", response_model=AnalyticsResponse)
async def get_analytics(
    db: AsyncSession = Depends(get_db)
):
    """Retrieves threat distributions, volume trends, top indicators, and ML model performance."""
    analytics_data = await analytics_service.get_full_analytics(db=db)
    return analytics_data
