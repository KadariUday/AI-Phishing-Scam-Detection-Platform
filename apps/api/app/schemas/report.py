from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class ReportRequest(BaseModel):
    title: Optional[str] = "PhishGuard AI Threat Forensic Report"
    include_raw_features: bool = True

class ReportResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    scan_id: str
    title: str
    summary: Optional[str] = None
    report_format: str = "PDF"
    download_url: str
    created_at: datetime
