import uuid
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from apps.api.app.core.config import settings
from apps.api.app.core.security import verify_password, get_password_hash, create_access_token
from apps.api.app.db.session import get_db
from apps.api.app.db.mongodb import mongodb
from apps.api.app.models.user import User
from apps.api.app.models.audit import AuditLog
from apps.api.app.schemas.auth import UserCreate, UserResponse, Token, UserLogin
from apps.api.app.api.v1.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Registers a new user account with strict one-email-one-user validation.
    Prevents duplicate accounts for the same email address.
    """
    clean_email = user_in.email.strip().lower()
    
    # 1. Check SQL Database
    existing = await db.execute(select(User).where(User.email == clean_email))
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This email address is already registered. Only one account per email is allowed. Please sign in directly with your password."
        )

    # 2. Check MongoDB to enforce cross-database uniqueness
    mongo_user = await mongodb.get_user_by_email(clean_email)
    if mongo_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This email address is already registered in the system. Please sign in directly with your password."
        )

    user = User(
        id=str(uuid.uuid4()),
        email=clean_email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name.strip() if user_in.full_name else "Security Analyst",
        role="USER",
        is_active=True
    )
    db.add(user)
    
    # Audit log (SQL)
    audit = AuditLog(
        user_id=user.id,
        action="REGISTER",
        resource="auth",
        details=f"User account created for {user.email}"
    )
    db.add(audit)
    
    await db.commit()
    await db.refresh(user)

    # 3. Save to MongoDB
    await mongodb.save_user(
        username=user.full_name or "Security Analyst",
        email=user.email,
        password=user_in.password,
        role=user.role,
        user_id=user.id
    )

    # 4. Log Signup Event to MongoDB Activity Ledger
    await mongodb.log_activity(
        email=user.email,
        username=user.full_name or "Security Analyst",
        action="USER_SIGNUP",
        description=f"User account created for {user.full_name} ({user.email})",
        user_id=user.id
    )

    return user


@router.post("/login", response_model=Token)
async def login(
    user_in: UserLogin,
    db: AsyncSession = Depends(get_db)
):
    """
    Authenticates a registered user.
    Once registered, the user is permanently saved and can always log in with the same details.
    """
    clean_email = user_in.email.strip().lower()
    
    result = await db.execute(select(User).where(User.email == clean_email))
    user = result.scalar_one_or_none()

    # If not found in SQL database, check if user exists in MongoDB backup
    if not user:
        mongo_user = await mongodb.get_user_by_email(clean_email)
        if mongo_user:
            # Check password against MongoDB record
            stored_pwd = mongo_user.get("password")
            if stored_pwd == user_in.password:
                # Re-sync user into SQLite persistence
                user = User(
                    id=mongo_user.get("user_id") or str(uuid.uuid4()),
                    email=clean_email,
                    hashed_password=get_password_hash(user_in.password),
                    full_name=mongo_user.get("username", "Security Analyst"),
                    role=mongo_user.get("role", "USER"),
                    is_active=True
                )
                db.add(user)
                await db.commit()
                await db.refresh(user)
            else:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Incorrect password. Please verify your credentials.",
                    headers={"WWW-Authenticate": "Bearer"},
                )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No account found with this email address. Only registered users can log in. Please sign up first.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password. Please verify your credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is currently disabled."
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )

    # Audit log (SQL)
    audit = AuditLog(
        user_id=user.id,
        action="LOGIN",
        resource="auth",
        details="User successfully logged in"
    )
    db.add(audit)
    await db.commit()

    # Update / sync user in MongoDB
    await mongodb.save_user(
        username=user.full_name or "Security Analyst",
        email=user.email,
        password=user_in.password,
        role=user.role,
        user_id=user.id
    )

    # Log Login Activity in MongoDB
    await mongodb.log_activity(
        email=user.email,
        username=user.full_name or "Security Analyst",
        action="USER_LOGIN",
        description="Operator session authenticated and verified",
        user_id=user.id
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "user": user
    }


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    """Fetches currently authenticated user profile."""
    return current_user
