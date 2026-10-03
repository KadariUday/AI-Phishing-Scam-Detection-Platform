import pytest
import pytest_asyncio
from apps.api.app.db.mongodb import mongodb

@pytest.mark.asyncio
async def test_mongodb_save_and_retrieve_user():
    """Verifies user persistence in MongoDB storing username, email, and password as strings."""
    test_email = "mongo_tester@phishguard.ai"
    test_username = "Mongo Test Analyst"
    test_password = "$2b$12$e8Ym...hashedpasswordstring..."

    # 1. Save user to MongoDB
    user_doc = await mongodb.save_user(
        username=test_username,
        email=test_email,
        password=test_password,
        role="USER"
    )

    assert user_doc is not None
    assert user_doc["username"] == test_username
    assert user_doc["email"] == test_email
    assert isinstance(user_doc["password"], str)
    assert user_doc["password"] == test_password
    assert "updated_at" in user_doc


@pytest.mark.asyncio
async def test_mongodb_activity_history_logging():
    """Verifies that user activity is timestamped and recorded ('at what time they did what')."""
    test_email = "history_analyst@phishguard.ai"
    test_username = "History Analyst"
    test_action = "SCAN_URL"
    test_desc = "Analyzed phishing candidate https://secure-bank-login.xyz"

    # Log action
    history_entry = await mongodb.log_activity(
        email=test_email,
        username=test_username,
        action=test_action,
        description=test_desc,
        target_payload="https://secure-bank-login.xyz",
        risk_level="CRITICAL",
        risk_score=95.5,
        metadata={"domain": "secure-bank-login.xyz"}
    )

    assert history_entry is not None
    assert history_entry["email"] == test_email
    assert history_entry["username"] == test_username
    assert history_entry["action"] == test_action
    assert history_entry["description"] == test_desc
    assert history_entry["risk_level"] == "CRITICAL"
    assert history_entry["risk_score"] == 95.5
    # Verify timestamp records exact time
    assert "timestamp" in history_entry
    assert "readable_time" in history_entry
    assert "UTC" in history_entry["readable_time"]


@pytest.mark.asyncio
async def test_mongodb_stats_reporting():
    """Verifies that MongoDB stats return database name and connectivity status."""
    stats = await mongodb.get_stats()
    assert "database" in stats
    assert stats["database"] == "phishguard_db"
    assert "connected" in stats
