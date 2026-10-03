from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from apps.api.app.db.session import get_db
from apps.api.app.models.scan import Scan
from apps.api.app.models.user import User
from apps.api.app.models.report import Report
from apps.api.app.schemas.report import ReportRequest, ReportResponse
from apps.api.app.api.v1.deps import get_optional_user
from apps.api.app.services.report_service import report_service

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.post("/{scan_id}", response_model=ReportResponse)
async def generate_report_entry(
    scan_id: str,
    payload: ReportRequest = ReportRequest(),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_optional_user)
):
    """Generates and registers a forensic audit report entry for a given scan."""
    query = select(Scan).where(Scan.id == scan_id)
    result = await db.execute(query)
    scan = result.scalar_one_or_none()

    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan record not found."
        )

    title = payload.title or f"PhishGuard Forensic Report - {scan.scan_type} Scan"
    summary = f"Risk Level: {scan.risk_level} ({scan.risk_score}/100) - Classification: {scan.classification}"

    report = Report(
        scan_id=scan.id,
        user_id=current_user.id if current_user else None,
        title=title,
        summary=summary,
        report_format="PDF",
        file_path=f"/api/v1/reports/{scan.id}/download",
        metadata_json={
            "risk_score": scan.risk_score,
            "confidence": scan.confidence,
            "classification": scan.classification,
        }
    )
    db.add(report)
    await db.commit()
    await db.refresh(report)

    return {
        "id": report.id,
        "scan_id": scan.id,
        "title": report.title,
        "summary": report.summary,
        "report_format": report.report_format,
        "download_url": f"/api/v1/reports/{scan.id}/download",
        "created_at": report.created_at
    }


@router.get("/{scan_id}/download")
async def download_scan_pdf(
    scan_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Generates and streams the binary PDF report for a scan."""
    query = select(Scan).where(Scan.id == scan_id)
    result = await db.execute(query)
    scan = result.scalar_one_or_none()

    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan record not found."
        )

    scan_dict = {
        "id": scan.id,
        "scan_type": scan.scan_type,
        "target_text": scan.target_text,
        "target_domain": scan.target_domain,
        "risk_score": scan.risk_score,
        "risk_level": scan.risk_level,
        "classification": scan.classification,
        "confidence": scan.confidence,
        "threat_indicators": scan.threat_indicators or [],
        "explanations": scan.explanations or [],
        "recommendations": scan.recommendations or [],
        "created_at": scan.created_at.isoformat() if scan.created_at else ""
    }

    pdf_bytes = report_service.generate_pdf_report(scan_dict)

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=PhishGuard_Report_{scan.id[:8]}.pdf"
        }
    )
