from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from apps.api.app.db.session import get_db
from apps.api.app.schemas.scan import DashboardStats
from apps.api.app.models.user import User
from apps.api.app.api.v1.deps import get_optional_user
from apps.api.app.services.analytics_service import analytics_service

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("", response_model=DashboardStats)
async def get_dashboard_summary(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_optional_user)
):
    """Retrieves high-level summary cards and recent activity for the user/platform dashboard."""
    stats = await analytics_service.get_dashboard_metrics(
        db=db,
        user_id=current_user.id if current_user else None
    )
    return stats
