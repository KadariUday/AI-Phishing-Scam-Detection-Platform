import os
import sys
import pytest
import pytest_asyncio

# Ensure root workspace directory is in sys.path
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from apps.api.app.db.base import Base
from apps.api.app.db.session import engine
from apps.api.app.ml.model_loader import model_loader

@pytest_asyncio.fixture(scope="session", autouse=True)
async def initialize_test_environment():
    """Initializes DB schemas and loads ML models for test execution."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    model_loader.load_all_models()
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
