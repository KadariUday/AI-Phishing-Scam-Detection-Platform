from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from apps.api.app.db.session import get_db
from apps.api.app.db.mongodb import mongodb
from apps.api.app.models.scan import Scan
from apps.api.app.models.user import User
from apps.api.app.models.audit import AuditLog
from apps.api.app.schemas.scan import (
    URLScanRequest, MessageScanRequest, EmailScanRequest,
    ScanResponse, ScanListItem
)
from apps.api.app.api.v1.deps import get_current_user, get_optional_user
from apps.api.app.ml.url_detector import url_detector
from apps.api.app.ml.nlp_detector import nlp_detector
from apps.api.app.services.risk_engine import risk_engine
from apps.api.app.services.xai_service import xai_service

router = APIRouter(prefix="/scans", tags=["Scans"])

@router.post("/url", response_model=ScanResponse)
async def scan_url(
    payload: URLScanRequest,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    """Analyzes a suspicious URL for phishing, homograph attacks, and structural anomalies."""
    target_url = payload.url.strip()
    
    # 1. Run URL Detector
    detector_result = url_detector.analyze(target_url)
    indicators = detector_result["threat_indicators"]
    features = detector_result["features"]
    ml_score = detector_result["ml_score"]
    heuristic_score = detector_result["heuristic_score"]

    # 2. Risk Engine
    risk_assessment = risk_engine.evaluate_url_risk(
        ml_score=ml_score,
        heuristic_score=heuristic_score,
        indicator_count=len(indicators)
    )

    # 3. Explainable AI
    explanations, recommendations = xai_service.generate_url_explanations(
        features=features,
        indicators=indicators,
        risk_level=risk_assessment["risk_level"]
    )

    # 4. Persist Scan Record (SQL)
    scan = Scan(
        user_id=current_user.id if current_user else None,
        scan_type="URL",
        target_text=target_url,
        target_domain=detector_result["domain"],
        risk_score=risk_assessment["risk_score"],
        risk_level=risk_assessment["risk_level"],
        classification=risk_assessment["classification"],
        confidence=risk_assessment["confidence"],
        ml_score=ml_score,
        heuristic_score=heuristic_score,
        features=features,
        threat_indicators=[ind.model_dump() for ind in indicators],
        explanations=explanations,
        recommendations=recommendations,
        is_flagged=(risk_assessment["risk_score"] >= 70)
    )
    db.add(scan)
    await db.commit()
    await db.refresh(scan)

    # 5. Log to MongoDB Activity History ('at what time they did what')
    await mongodb.log_activity(
        email=current_user.email if current_user else "guest.analyst@phishguard.ai",
        username=current_user.full_name if current_user else "Guest Analyst",
        action="SCAN_URL",
        description=f"Analyzed URL: {target_url[:75]}",
        target_payload=target_url,
        risk_level=risk_assessment["risk_level"],
        risk_score=float(risk_assessment["risk_score"]),
        metadata={
            "domain": detector_result.get("domain"),
            "classification": risk_assessment["classification"],
            "threat_count": len(indicators)
        },
        user_id=current_user.id if current_user else None
    )

    return scan


@router.post("/message", response_model=ScanResponse)
async def scan_message(
    payload: MessageScanRequest,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    """Analyzes an SMS, WhatsApp, or chat message for urgency, scam indicators, and phishing URLs."""
    raw_text = payload.text.strip()
    
    # 1. Run NLP Detector
    nlp_result = nlp_detector.analyze(text=raw_text)
    indicators = nlp_result["threat_indicators"]
    signals = nlp_result["signals"]
    nlp_ml_score = nlp_result["nlp_ml_score"]
    heuristic_score = nlp_result["heuristic_intent_score"]
    max_url_risk = nlp_result["max_url_risk"]

    # 2. Risk Engine
    risk_assessment = risk_engine.evaluate_text_risk(
        nlp_ml_score=nlp_ml_score,
        heuristic_intent_score=heuristic_score,
        max_embedded_url_risk=max_url_risk,
        indicator_count=len(indicators)
    )

    # 3. Explainable AI
    explanations, recommendations = xai_service.generate_text_explanations(
        signals=signals,
        indicators=indicators,
        risk_level=risk_assessment["risk_level"]
    )

    # 4. Persist Scan Record (SQL)
    scan = Scan(
        user_id=current_user.id if current_user else None,
        scan_type="MESSAGE",
        target_text=raw_text,
        target_domain=None,
        risk_score=risk_assessment["risk_score"],
        risk_level=risk_assessment["risk_level"],
        classification=risk_assessment["classification"],
        confidence=risk_assessment["confidence"],
        ml_score=nlp_ml_score,
        intent_score=heuristic_score,
        heuristic_score=heuristic_score,
        features=signals,
        threat_indicators=[ind.model_dump() for ind in indicators],
        explanations=explanations,
        recommendations=recommendations,
        is_flagged=(risk_assessment["risk_score"] >= 70)
    )
    db.add(scan)
    await db.commit()
    await db.refresh(scan)

    # 5. Log to MongoDB Activity History ('at what time they did what')
    await mongodb.log_activity(
        email=current_user.email if current_user else "guest.analyst@phishguard.ai",
        username=current_user.full_name if current_user else "Guest Analyst",
        action="SCAN_MESSAGE",
        description=f"Analyzed message payload: {raw_text[:70]}...",
        target_payload=raw_text[:250],
        risk_level=risk_assessment["risk_level"],
        risk_score=float(risk_assessment["risk_score"]),
        metadata={
            "classification": risk_assessment["classification"],
            "nlp_score": nlp_ml_score,
            "threat_count": len(indicators)
        },
        user_id=current_user.id if current_user else None
    )

    return scan


@router.post("/email", response_model=ScanResponse)
async def scan_email(
    payload: EmailScanRequest,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    """Analyzes an email (sender, subject, body) for impersonation, deceptive language, and threats."""
    sender = payload.sender or ""
    subject = payload.subject or ""
    body = payload.body.strip()

    # 1. Run NLP Detector
    nlp_result = nlp_detector.analyze(text=body, sender=sender, subject=subject)
    indicators = nlp_result["threat_indicators"]
    signals = nlp_result["signals"]
    nlp_ml_score = nlp_result["nlp_ml_score"]
    heuristic_score = nlp_result["heuristic_intent_score"]
    max_url_risk = nlp_result["max_url_risk"]

    # 2. Risk Engine
    risk_assessment = risk_engine.evaluate_text_risk(
        nlp_ml_score=nlp_ml_score,
        heuristic_intent_score=heuristic_score,
        max_embedded_url_risk=max_url_risk,
        indicator_count=len(indicators)
    )

    # 3. Explainable AI
    explanations, recommendations = xai_service.generate_text_explanations(
        signals=signals,
        indicators=indicators,
        risk_level=risk_assessment["risk_level"]
    )

    # 4. Persist Scan Record (SQL)
    scan = Scan(
        user_id=current_user.id if current_user else None,
        scan_type="EMAIL",
        target_text=f"From: {sender}\nSubject: {subject}\n\n{body}",
        target_domain=sender.split("@")[-1] if "@" in sender else None,
        risk_score=risk_assessment["risk_score"],
        risk_level=risk_assessment["risk_level"],
        classification=risk_assessment["classification"],
        confidence=risk_assessment["confidence"],
        ml_score=nlp_ml_score,
        intent_score=heuristic_score,
        heuristic_score=heuristic_score,
        features=signals,
        threat_indicators=[ind.model_dump() for ind in indicators],
        explanations=explanations,
        recommendations=recommendations,
        is_flagged=(risk_assessment["risk_score"] >= 70)
    )
    db.add(scan)
    await db.commit()
    await db.refresh(scan)

    # 5. Log to MongoDB Activity History ('at what time they did what')
    await mongodb.log_activity(
        email=current_user.email if current_user else "guest.analyst@phishguard.ai",
        username=current_user.full_name if current_user else "Guest Analyst",
        action="SCAN_EMAIL",
        description=f"Analyzed email from '{sender or 'Unknown'}' with subject '{subject or '(No Subject)'}'",
        target_payload=f"From: {sender} | Subj: {subject}",
        risk_level=risk_assessment["risk_level"],
        risk_score=float(risk_assessment["risk_score"]),
        metadata={
            "sender": sender,
            "subject": subject,
            "classification": risk_assessment["classification"]
        },
        user_id=current_user.id if current_user else None
    )

    return scan


@router.get("/mongodb/history", response_model=List[Dict[str, Any]])
async def get_mongodb_activity_history(
    limit: int = Query(50, ge=1, le=200),
    action: Optional[str] = None,
    current_user: Optional[User] = Depends(get_optional_user)
):
    """
    Retrieves chronological activity audit trail from MongoDB collection 'activity_history'.
    Shows what actions were performed and at what time.
    """
    email_filter = current_user.email if (current_user and current_user.role != "ADMIN") else None
    history = await mongodb.get_activity_history(email=email_filter, limit=limit, action=action)
    return history


@router.get("/mongodb/stats", response_model=Dict[str, Any])
async def get_mongodb_stats():
    """Returns MongoDB connectivity status, database name, and document counts."""
    return await mongodb.get_stats()


@router.get("", response_model=List[ScanListItem])
async def list_scans(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    scan_type: Optional[str] = None,
    risk_level: Optional[str] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    """Retrieves paginated scan history with optional filters."""
    query = select(Scan).order_by(desc(Scan.created_at)).offset(skip).limit(limit)

    if current_user:
        query = query.where(Scan.user_id == current_user.id)
    if scan_type:
        query = query.where(Scan.scan_type == scan_type.upper())
    if risk_level:
        query = query.where(Scan.risk_level == risk_level.upper())
    if search:
        query = query.where(Scan.target_text.ilike(f"%{search}%"))

    result = await db.execute(query)
    scans = result.scalars().all()
    return scans


@router.get("/{scan_id}", response_model=ScanResponse)
async def get_scan_by_id(
    scan_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    """Retrieves full details of a specific scan."""
    query = select(Scan).where(Scan.id == scan_id)
    result = await db.execute(query)
    scan = result.scalar_one_or_none()

    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan assessment not found."
        )

    return scan


@router.delete("/{scan_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_scan(
    scan_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    """Deletes a scan entry to protect user privacy."""
    query = select(Scan).where(Scan.id == scan_id)
    result = await db.execute(query)
    scan = result.scalar_one_or_none()

    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan not found."
        )

    await db.delete(scan)
    await db.commit()
    return None
