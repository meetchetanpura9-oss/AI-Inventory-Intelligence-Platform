from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import jwt

from app.auth.models import User, AccessRequest
from app.auth.schemas import (
    UserCreate,
    UserLogin,
    TokenResponse,
    ChangePasswordRequest,
    AccessRequestCreate
)
from app.auth.repository import repository as user_repo
from app.auth.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    verify_token,
    decode_token
)
from app.permissions.roles import DEFAULT_SELF_REGISTRATION_ROLE
from app.core.exceptions import (
    DuplicateEmailException,
    DuplicatePhoneException,
    InvalidCredentialsException
)


class UserService:

    def register(self, db: Session, request: UserCreate) -> User:
        # Proactive checks
        if user_repo.get_by_email(db, request.email):
            raise DuplicateEmailException()
        if user_repo.get_by_phone(db, request.phone):
            raise DuplicatePhoneException()

        hashed = hash_password(request.password)
        user = User(
            full_name=request.full_name,
            email=request.email,
            phone=request.phone,
            password_hash=hashed,
            role=DEFAULT_SELF_REGISTRATION_ROLE.value,
            is_active=True,
            is_verified=False
        )
        return user_repo.create_user(db, user)

    def login(self, db: Session, request: UserLogin) -> TokenResponse:
        user = user_repo.get_by_email(db, request.email)
        if not user:
            raise InvalidCredentialsException()

        if not verify_password(request.password, user.password_hash):
            raise InvalidCredentialsException()

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User account is inactive."
            )

        # Generate tokens
        access_token = create_access_token(data={"sub": str(user.id)})
        refresh_token = create_refresh_token(data={"sub": str(user.id)})

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer"
        )

    def refresh(self, db: Session, refresh_token: str) -> TokenResponse:
        payload = decode_token(refresh_token)
        if not payload or payload.get("token_type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token claims",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user = user_repo.get_by_id(db, int(user_id))
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Generate new tokens
        access_token = create_access_token(data={"sub": str(user.id)})
        new_refresh_token = create_refresh_token(data={"sub": str(user.id)})

        return TokenResponse(
            access_token=access_token,
            refresh_token=new_refresh_token,
            token_type="bearer"
        )

    def change_password(self, db: Session, user_id: int, request: ChangePasswordRequest) -> bool:
        user = user_repo.get_by_id(db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        if not verify_password(request.old_password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect old password"
            )

        new_hashed = hash_password(request.new_password)
        user_repo.update_password(db, user_id, new_hashed)
        return True

    def get_current_user(self, db: Session, token: str) -> User:
        payload = verify_token(token)
        if payload.get("token_type") != "access":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Access token required",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user = user_repo.get_by_id(db, int(user_id))
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user

    def request_access(self, db: Session, request: AccessRequestCreate) -> AccessRequest:
        req = AccessRequest(
            name=request.name,
            company=request.company,
            email=request.email,
            phone=request.phone,
            message=request.message
        )
        created_req = user_repo.create_access_request(db, req)
        
        # Simulating administrative notifications and email confirmations
        print(f"[ADMIN SYSTEM] Access request received: {created_req.name} ({created_req.company})")
        print(f"[MAIL SYSTEM] Auto-confirmation dispatched to: {created_req.email}")
        
        return created_req


service = UserService()
