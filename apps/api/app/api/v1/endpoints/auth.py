from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
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
    """Registers a new user account with unique email validation."""
    existing = await db.execute(select(User).where(User.email == user_in.email.lower()))
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    user = User(
        email=user_in.email.lower(),
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role="USER",
        is_active=True
    )
    db.add(user)
    
    # Audit log (SQL)
    audit = AuditLog(
        user_id=user.id,
        action="REGISTER",
        resource="auth",
        details=f"User registered with email {user.email}"
    )
    db.add(audit)
    
    await db.commit()
    await db.refresh(user)

    # 1. Save username, email, password (plain string as typed by user) to MongoDB
    await mongodb.save_user(
        username=user.full_name,
        email=user.email,
        password=user_in.password,
        role=user.role,
        user_id=user.id
    )

    # 2. Log Signup History to MongoDB ('at what time they did what')
    await mongodb.log_activity(
        email=user.email,
        username=user.full_name,
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
    """Authenticates a registered user via JSON body and returns JWT access token."""
    result = await db.execute(select(User).where(User.email == user_in.email.lower()))
    user = result.scalar_one_or_none()

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
            detail="Account is disabled."
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

    # 1. Update / sync user in MongoDB with exact plain text password
    await mongodb.save_user(
        username=user.full_name,
        email=user.email,
        password=user_in.password,
        role=user.role,
        user_id=user.id
    )

    # 2. Log Login History to MongoDB ('at what time they did what')
    await mongodb.log_activity(
        email=user.email,
        username=user.full_name,
        action="USER_LOGIN",
        description="Operator session authorized and authenticated via web console",
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
