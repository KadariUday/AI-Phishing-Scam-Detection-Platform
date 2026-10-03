"""
MongoDB Integration for PhishGuard AI.
Handles persistence of Users (username, email, password string) and
Timestamped User Activity History ('at what time they did what').
"""

import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from apps.api.app.core.config import settings

logger = logging.getLogger("phishguard.mongodb")

class MongoDBManager:
    """Manages asynchronous MongoDB connection and collections for Users and Activity History."""

    def __init__(self):
        self.client: Optional[AsyncIOMotorClient] = None
        self.db: Optional[AsyncIOMotorDatabase] = None
        self.is_connected: bool = False

    async def connect(self) -> bool:
        """Initializes connection to MongoDB with timeout."""
        if not settings.MONGODB_ENABLED:
            logger.info("MongoDB persistence is disabled via configuration.")
            return False

        try:
            self.client = AsyncIOMotorClient(
                settings.MONGODB_URL,
                serverSelectionTimeoutMS=settings.MONGODB_TIMEOUT_MS,
                connectTimeoutMS=settings.MONGODB_TIMEOUT_MS
            )
            self.db = self.client[settings.MONGODB_DB_NAME]
            
            # Ping database to verify connection
            await self.client.admin.command('ping')
            self.is_connected = True
            print(f"\n[+] MongoDB Atlas: Successfully Connected to database '{settings.MONGODB_DB_NAME}'")
            logger.info(f"MongoDB database '{settings.MONGODB_DB_NAME}' is successfully connected.")

            # Ensure indexes
            await self._setup_indexes()
            return True
        except Exception as e:
            self.is_connected = False
            print(f"\n[!] MongoDB Warning: Connection failed: {e}")
            logger.warning(
                f"MongoDB connection to {settings.MONGODB_URL} was not established: {e}. "
                "Application will operate with local SQL persistence and buffer MongoDB operations safely."
            )
            return False

    async def _setup_indexes(self):
        """Creates indexes on users and activity history collections."""
        if not self.is_connected or self.db is None:
            return
        try:
            # Users collection: unique email index
            await self.db.users.create_index("email", unique=True)
            # History collection: index on email and timestamp for rapid chronological queries
            await self.db.activity_history.create_index([("email", 1), ("timestamp", -1)])
            await self.db.activity_history.create_index("timestamp")
            logger.info("MongoDB indexes verified on 'users' and 'activity_history' collections.")
        except Exception as e:
            logger.warning(f"Failed to create MongoDB indexes: {e}")

    async def close(self):
        """Closes MongoDB connection."""
        if self.client:
            self.client.close()
            self.is_connected = False
            logger.info("MongoDB connection closed.")

    # =========================================================================
    # USER PERSISTENCE (username, email, password string)
    # =========================================================================
    async def save_user(
        self,
        username: str,
        email: str,
        password: str,
        role: str = "USER",
        user_id: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        """
        Saves or updates user with username, email, and password stored as strings in MongoDB.
        """
        now_iso = datetime.now(timezone.utc).isoformat()
        user_doc = {
            "username": str(username).strip(),
            "email": str(email).strip().lower(),
            "password": str(password),
            "role": str(role).upper(),
            "updated_at": now_iso
        }
        if user_id:
            user_doc["user_id"] = str(user_id)

        if not self.is_connected or self.db is None:
            logger.debug(f"[MongoDB Offline] Mock-saved user: {email}")
            return user_doc

        try:
            result = await self.db.users.update_one(
                {"email": user_doc["email"]},
                {
                    "$set": user_doc,
                    "$setOnInsert": {"created_at": now_iso}
                },
                upsert=True
            )
            logger.info(f"MongoDB: Successfully saved user '{username}' ({email}) in 'users' collection.")
            return user_doc
        except Exception as e:
            logger.error(f"MongoDB Error saving user {email}: {e}")
            return None

    async def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Retrieves a user document from MongoDB by email."""
        if not self.is_connected or self.db is None:
            return None
        try:
            doc = await self.db.users.find_one({"email": email.strip().lower()})
            if doc and "_id" in doc:
                doc["_id"] = str(doc["_id"])
            return doc
        except Exception as e:
            logger.error(f"MongoDB Error fetching user {email}: {e}")
            return None

    # =========================================================================
    # ACTIVITY HISTORY PERSISTENCE ("at what time they did what")
    # =========================================================================
    async def log_activity(
        self,
        email: str,
        username: str,
        action: str,
        description: str,
        target_payload: Optional[str] = None,
        risk_level: Optional[str] = None,
        risk_score: Optional[float] = None,
        metadata: Optional[Dict[str, Any]] = None,
        user_id: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        """
        Logs a user action with precise timestamp recording 'at what time they did what'.
        Example actions: USER_SIGNUP, USER_LOGIN, SCAN_URL, SCAN_MESSAGE, SCAN_EMAIL, EXPORT_REPORT.
        """
        now_dt = datetime.now(timezone.utc)
        now_iso = now_dt.isoformat()
        readable_time = now_dt.strftime("%Y-%m-%d %H:%M:%S UTC")

        history_doc = {
            "user_id": str(user_id) if user_id else None,
            "username": str(username or "Anonymous"),
            "email": str(email or "anonymous@phishguard.ai").strip().lower(),
            "action": str(action).upper(),
            "description": str(description),
            "target_payload": str(target_payload) if target_payload else None,
            "risk_level": str(risk_level) if risk_level else "N/A",
            "risk_score": float(risk_score) if risk_score is not None else 0.0,
            "timestamp": now_iso,
            "readable_time": readable_time,
            "metadata": metadata or {}
        }

        if not self.is_connected or self.db is None:
            logger.debug(f"[MongoDB Offline] Activity recorded for {email}: {action} at {readable_time}")
            return history_doc

        try:
            insert_result = await self.db.activity_history.insert_one(history_doc)
            history_doc["_id"] = str(insert_result.inserted_id)
            logger.info(f"MongoDB: Recorded action '{action}' for {email} at {readable_time}")
            return history_doc
        except Exception as e:
            logger.error(f"MongoDB Error logging activity for {email}: {e}")
            return None

    async def get_activity_history(
        self,
        email: Optional[str] = None,
        limit: int = 50,
        action: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Fetches chronological history showing what actions were performed and at what time.
        """
        if not self.is_connected or self.db is None:
            return []

        try:
            query = {}
            if email:
                query["email"] = email.strip().lower()
            if action:
                query["action"] = action.upper()

            cursor = self.db.activity_history.find(query).sort("timestamp", -1).limit(limit)
            results = []
            async for doc in cursor:
                doc["_id"] = str(doc["_id"])
                results.append(doc)
            return results
        except Exception as e:
            logger.error(f"MongoDB Error retrieving history: {e}")
            return []

    async def get_stats(self) -> Dict[str, Any]:
        """Returns overview statistics of users and logged activity in MongoDB."""
        if not self.is_connected or self.db is None:
            return {
                "connected": False,
                "database": settings.MONGODB_DB_NAME,
                "users_count": 0,
                "history_events_count": 0,
                "status": "MongoDB server offline or unconfigured"
            }

        try:
            users_count = await self.db.users.count_documents({})
            events_count = await self.db.activity_history.count_documents({})
            return {
                "connected": True,
                "database": settings.MONGODB_DB_NAME,
                "users_count": users_count,
                "history_events_count": events_count,
                "status": "active"
            }
        except Exception as e:
            return {
                "connected": False,
                "database": settings.MONGODB_DB_NAME,
                "error": str(e),
                "status": "error"
            }

# Singleton Instance
mongodb = MongoDBManager()
