import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from apps.api.app.db.base import Base

class Scan(Base):
    __tablename__ = "scans"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    
    scan_type = Column(String(50), nullable=False, index=True)  # "URL", "MESSAGE", "EMAIL"
    target_text = Column(Text, nullable=False)
    target_domain = Column(String(255), nullable=True, index=True)
    
    risk_score = Column(Integer, nullable=False, index=True)  # 0 to 100
    risk_level = Column(String(50), nullable=False, index=True)  # "SAFE", "LOW", "MEDIUM", "HIGH", "CRITICAL"
    classification = Column(String(100), nullable=False)  # "BENIGN", "SUSPICIOUS", "PHISHING", "SCAM"
    confidence = Column(Float, nullable=False)  # 0.0 to 1.0
    
    ml_score = Column(Float, nullable=True)
    intent_score = Column(Float, nullable=True)
    heuristic_score = Column(Float, nullable=True)
    
    # Detailed JSON structures
    features = Column(JSON, nullable=True)
    threat_indicators = Column(JSON, nullable=True)
    explanations = Column(JSON, nullable=True)
    recommendations = Column(JSON, nullable=True)
    
    is_flagged = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)

    # Relationships
    user = relationship("User", back_populates="scans")
    reports = relationship("Report", back_populates="scan", cascade="all, delete-orphan")
