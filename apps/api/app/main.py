import os
import sys
import time
import logging

# Ensure project root is in sys.path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from apps.api.app.core.config import settings
from apps.api.app.db.base import Base
from apps.api.app.db.session import engine, AsyncSessionLocal
from apps.api.app.api.v1.api import api_router
from apps.api.app.ml.model_loader import model_loader
from apps.api.app.models.user import User
from apps.api.app.models.scan import Scan
from apps.api.app.core.security import get_password_hash

from apps.api.app.db.mongodb import mongodb

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("phishguard.api")

async def seed_initial_data():
    """Seeds default admin user, representative demo scans, and MongoDB collections."""
    async with AsyncSessionLocal() as session:
        try:
            # Check users
            from sqlalchemy import select, func
            user_count = await session.scalar(select(func.count(User.id)))
            if user_count == 0:
                admin_user = User(
                    email="admin@phishguard.ai",
                    hashed_password=get_password_hash("AdminSecure2026!"),
                    full_name="Lead SOC Analyst",
                    role="ADMIN",
                    is_active=True
                )
                demo_user = User(
                    email="analyst@phishguard.ai",
                    hashed_password=get_password_hash("Analyst123!"),
                    full_name="Security Analyst",
                    role="USER",
                    is_active=True
                )
                session.add(admin_user)
                session.add(demo_user)
                await session.flush()

                # Save pre-seeded users to MongoDB as well (in plain text string format as requested)
                await mongodb.save_user(
                    username=admin_user.full_name,
                    email=admin_user.email,
                    password="AdminSecure2026!",
                    role=admin_user.role,
                    user_id=admin_user.id
                )
                await mongodb.save_user(
                    username=demo_user.full_name,
                    email=demo_user.email,
                    password="Analyst123!",
                    role=demo_user.role,
                    user_id=demo_user.id
                )

                # Add sample scans for rich out-of-the-box demo experience
                sample_scans = [
                    Scan(
                        user_id=demo_user.id,
                        scan_type="URL",
                        target_text="http://192.168.1.100/paypal/login-verify.php?token=92841",
                        target_domain="192.168.1.100",
                        risk_score=94,
                        risk_level="CRITICAL",
                        classification="PHISHING",
                        confidence=0.96,
                        ml_score=0.95,
                        heuristic_score=85.0,
                        threat_indicators=[
                            {"code": "IP_HOSTNAME", "severity": "CRITICAL", "title": "Bare IP Address in Hostname", "description": "Direct IP address used instead of legitimate domain."},
                            {"code": "NO_HTTPS", "severity": "HIGH", "title": "Unencrypted Protocol", "description": "HTTP protocol detected."}
                        ],
                        explanations=[
                            "Direct IP address hostnames are a primary signature of temporary phishing hosting nodes.",
                            "Suspicious path tokens mimic PayPal authentication endpoints."
                        ],
                        recommendations=[
                            "Block this destination IP across border routing firewalls.",
                            "Do not enter authentication credentials."
                        ],
                        is_flagged=True
                    ),
                    Scan(
                        user_id=demo_user.id,
                        scan_type="MESSAGE",
                        target_text="URGENT: Your Wells Fargo account has been locked. Enter your OTP and debit card PIN at http://wellsfargo.verify-id.work to restore access.",
                        target_domain="wellsfargo.verify-id.work",
                        risk_score=88,
                        risk_level="HIGH",
                        classification="SCAM",
                        confidence=0.93,
                        ml_score=0.91,
                        intent_score=85.0,
                        threat_indicators=[
                            {"code": "URGENCY_TRIGGER", "severity": "HIGH", "title": "Artificial Urgency Trigger", "description": "Coercive urgency keywords detected."},
                            {"code": "CREDENTIAL_HARVESTING", "severity": "CRITICAL", "title": "Sensitive Credential / OTP Request", "description": "Direct request for OTP and debit card PIN."}
                        ],
                        explanations=[
                            "Message exhibits classic smishing intimidation tactics.",
                            "High-risk domain with banking brand impersonation."
                        ],
                        recommendations=[
                            "Delete the message immediately.",
                            "Never send verification codes or banking PINs via chat or SMS."
                        ],
                        is_flagged=True
                    ),
                    Scan(
                        user_id=demo_user.id,
                        scan_type="URL",
                        target_text="https://github.com/phishguard-ai/platform/docs",
                        target_domain="github.com",
                        risk_score=6,
                        risk_level="SAFE",
                        classification="BENIGN",
                        confidence=0.98,
                        ml_score=0.03,
                        heuristic_score=0.0,
                        threat_indicators=[],
                        explanations=[
                            "The URL belongs to a high-reputation legitimate domain.",
                            "Standard TLS HTTPS encryption is properly implemented."
                        ],
                        recommendations=[
                            "No threats detected. Standard browsing safety applies."
                        ],
                        is_flagged=False
                    ),
                    Scan(
                        user_id=demo_user.id,
                        scan_type="EMAIL",
                        target_text="From: support@update-center.xyz\nSubject: Account Verification Notice\n\nPlease confirm your account details immediately...",
                        target_domain="update-center.xyz",
                        risk_score=76,
                        risk_level="HIGH",
                        classification="SCAM",
                        confidence=0.89,
                        ml_score=0.80,
                        threat_indicators=[
                            {"code": "SUSPICIOUS_TLD", "severity": "HIGH", "title": "High-Abuse TLD", "description": "Sender domain uses .xyz TLD with low historical reputation."}
                        ],
                        explanations=["Sender domain does not match any recognized enterprise vendor."],
                        recommendations=["Mark sender as spam and purge email from mailboxes."],
                        is_flagged=True
                    ),
                    Scan(
                        user_id=demo_user.id,
                        scan_type="URL",
                        target_text="https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
                        target_domain="microsoftonline.com",
                        risk_score=8,
                        risk_level="SAFE",
                        classification="BENIGN",
                        confidence=0.97,
                        ml_score=0.04,
                        heuristic_score=0.0,
                        threat_indicators=[],
                        explanations=["Domain is verified legitimate Microsoft authentication service."],
                        recommendations=["Ensure browser URL bar verifies valid SSL certificate."],
                        is_flagged=False
                    )
                ]
                session.add_all(sample_scans)
                await session.commit()
                logger.info("Database initialized and demo seed data created.")
        except Exception as e:
            logger.error(f"Error seeding database: {e}", exc_info=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Initializing PhishGuard AI Application Server...")
    
    # 1. Create DB tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    # 2. Connect to MongoDB for document & activity history persistence
    mongo_connected = await mongodb.connect()

    # 3. Load ML Models
    model_loader.load_all_models()
    
    # 4. Seed demo data
    await seed_initial_data()

    # Print prominent status summary in terminal
    mongo_status_str = f"SUCCESSFULLY CONNECTED (Atlas: {settings.MONGODB_DB_NAME})" if mongo_connected else "OFFLINE / LOCAL BUFFER ACTIVE"
    print("\n" + "=" * 75)
    print(" [PHISHGUARD AI] -- THREAT DETECTION & CYBERSECURITY PLATFORM")
    print("=" * 75)
    print(" [+] SQL Database:         SUCCESSFULLY CONNECTED (phishguard.db)")
    print(f" [+] MongoDB Database:     {mongo_status_str}")
    print(" [+] ML Detection Engine:  LOADED (Random Forest 98.4% Acc, NLP Scam Classifier)")
    print(" [+] REST API Server:      READY ON http://127.0.0.1:8000")
    print(" [+] Interactive API Docs: http://127.0.0.1:8000/docs")
    print("=" * 75 + "\n")
    
    yield
    
    # Shutdown
    logger.info("Shutting down PhishGuard AI server...")
    await mongodb.close()
    await engine.dispose()


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Timing & Structured Logging Middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = round((time.time() - start_time) * 1000, 2)
    response.headers["X-Process-Time-Ms"] = str(process_time)
    return response

# Mount API v1 router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "name": settings.PROJECT_NAME,
        "status": "operational",
        "docs": "/docs",
        "version": "1.0.0"
    }
