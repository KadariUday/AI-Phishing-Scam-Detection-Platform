import pytest
from httpx import AsyncClient, ASGITransport
from apps.api.app.main import app

@pytest.mark.asyncio
async def test_health_endpoints():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "ml_models_loaded" in data

@pytest.mark.asyncio
async def test_url_scan_api():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        payload = {"url": "http://192.168.0.1/auth-login/verify.php?id=99"}
        response = await ac.post("/api/v1/scans/url", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "risk_score" in data
        assert "risk_level" in data
        assert data["risk_score"] > 50
        assert len(data["threat_indicators"]) >= 1

@pytest.mark.asyncio
async def test_message_scan_api():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        payload = {"text": "URGENT: Your account is suspended. Send your OTP now."}
        response = await ac.post("/api/v1/scans/message", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["risk_score"] >= 50
        assert data["classification"] in ["SCAM", "SUSPICIOUS"]

@pytest.mark.asyncio
async def test_dashboard_and_analytics_api():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        dash_res = await ac.get("/api/v1/dashboard")
        assert dash_res.status_code == 200
        dash_data = dash_res.json()
        assert "total_scans" in dash_data
        
        analytics_res = await ac.get("/api/v1/analytics")
        assert analytics_res.status_code == 200
        analytics_data = analytics_res.json()
        assert "scan_type_distribution" in analytics_data

@pytest.mark.asyncio
async def test_strict_signup_and_login_flow():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        test_email = "newanalyst_2026@phishguard.ai"
        test_pass = "MySecretPass123!"

        # 1. Unregistered user tries to login -> MUST FAIL
        unreg_res = await ac.post("/api/v1/auth/login", json={
            "email": test_email,
            "password": test_pass
        })
        assert unreg_res.status_code == 401
        assert "sign up first" in unreg_res.json()["detail"].lower()

        # 2. User signs up
        reg_res = await ac.post("/api/v1/auth/register", json={
            "email": test_email,
            "password": test_pass,
            "full_name": "New Analyst User"
        })
        assert reg_res.status_code == 201
        user_data = reg_res.json()
        assert user_data["email"] == test_email

        # 3. User tries login with wrong password -> MUST FAIL
        wrong_pass_res = await ac.post("/api/v1/auth/login", json={
            "email": test_email,
            "password": "WrongPassword999!"
        })
        assert wrong_pass_res.status_code == 401
        assert "incorrect password" in wrong_pass_res.json()["detail"].lower()

        # 4. User logs in with correct registered credentials -> MUST SUCCEED
        login_res = await ac.post("/api/v1/auth/login", json={
            "email": test_email,
            "password": test_pass
        })
        assert login_res.status_code == 200
        token_data = login_res.json()
        assert "access_token" in token_data
        assert token_data["token_type"] == "bearer"
        assert token_data["user"]["email"] == test_email
