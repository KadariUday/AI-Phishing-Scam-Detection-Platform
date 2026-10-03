from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, HttpUrl, ConfigDict

class ThreatIndicator(BaseModel):
    code: str
    severity: str  # "LOW", "MEDIUM", "HIGH", "CRITICAL"
    title: str
    description: str

class URLScanRequest(BaseModel):
    url: str = Field(..., min_length=1, max_length=2048, description="Target URL to inspect")

class MessageScanRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=10000, description="SMS, WhatsApp, or chat message body")

class EmailScanRequest(BaseModel):
    sender: Optional[str] = Field(None, max_length=255, description="Sender email address or display name")
    subject: Optional[str] = Field(None, max_length=500, description="Email subject line")
    body: str = Field(..., min_length=1, max_length=20000, description="Email body content")

class ScanResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    scan_type: str
    target_text: str
    target_domain: Optional[str] = None
    risk_score: int  # 0 to 100
    risk_level: str  # "SAFE", "LOW", "MEDIUM", "HIGH", "CRITICAL"
    classification: str  # "BENIGN", "SUSPICIOUS", "PHISHING", "SCAM"
    confidence: float  # 0.0 to 1.0
    ml_score: Optional[float] = None
    intent_score: Optional[float] = None
    heuristic_score: Optional[float] = None
    features: Optional[Dict[str, Any]] = None
    threat_indicators: List[ThreatIndicator] = []
    explanations: List[str] = []
    recommendations: List[str] = []
    created_at: datetime

class ScanListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    scan_type: str
    target_text: str
    target_domain: Optional[str] = None
    risk_score: int
    risk_level: str
    classification: str
    confidence: float
    created_at: datetime

class DashboardStats(BaseModel):
    total_scans: int
    safe_scans: int
    low_risk_scans: int
    medium_risk_scans: int
    high_risk_scans: int
    critical_scans: int
    average_risk_score: float
    recent_scans: List[ScanListItem] = []
    threat_breakdown: Dict[str, int] = {}

class AnalyticsResponse(BaseModel):
    total_scans: int
    scan_type_distribution: Dict[str, int]
    risk_level_distribution: Dict[str, int]
    daily_volume: List[Dict[str, Any]]
    top_threat_indicators: List[Dict[str, Any]]
    model_performance: Dict[str, Any]
