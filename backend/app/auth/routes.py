from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import ValidationError

from app.database.dependencies import get_db
from app.auth.models import User
from app.auth.schemas import (
    UserCreate,
    UserResponse,
    UserLogin,
    TokenResponse,
    RefreshTokenRequest,
    ChangePasswordRequest,
    RegistrationResponse,
    CurrentUserResponse,
    AccessRequestCreate,
    AccessRequestResponse
)
from app.auth.service import service as auth_service
from app.auth.dependencies import get_current_active_user
from app.users.schemas import UserUpdate

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register", response_model=RegistrationResponse, status_code=201)
def register(
    request: UserCreate,
    db: Session = Depends(get_db)
):
    auth_service.register(db, request)
    return {"message": "Registration successful"}


@router.post("/login", response_model=TokenResponse, status_code=200)
def login(
    request: UserLogin,
    response: Response,
    db: Session = Depends(get_db)
):
    tokens = auth_service.login(db, request)
    response.set_cookie(
        key="access_token",
        value=tokens.access_token,
        httponly=True,
        samesite="lax",
        secure=False,
    )
    return tokens


@router.post("/token", response_model=TokenResponse, status_code=200)
def token(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    try:
        login_request = UserLogin(email=form_data.username, password=form_data.password)
    except ValidationError as e:
        raise HTTPException(
            status_code=400,
            detail="Invalid email or password format."
        )
    tokens = auth_service.login(db, login_request)
    response.set_cookie(
        key="access_token",
        value=tokens.access_token,
        httponly=True,
        samesite="lax",
        secure=False,
    )
    return tokens


@router.post("/refresh", response_model=TokenResponse, status_code=200)
def refresh(
    request: RefreshTokenRequest,
    db: Session = Depends(get_db)
):
    return auth_service.refresh(db, request.refresh_token)


@router.post("/change-password", status_code=200)
def change_password(
    request: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    auth_service.change_password(db, current_user.id, request)
    return {"message": "Password changed successfully."}


@router.get("/profile", response_model=CurrentUserResponse)
def get_profile(
    current_user: User = Depends(get_current_active_user)
):
    return {
        "id": current_user.id,
        "name": current_user.full_name,
        "role": current_user.role,
        "email": current_user.email
    }


@router.post("/logout", status_code=200)
def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        httponly=True,
        samesite="lax",
        secure=False,
    )
    return {"message": "Logged out successfully"}


@router.put("/profile", response_model=CurrentUserResponse)
def update_profile(
    request: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    from app.users.service import service as user_service
    updated_user = user_service.update_user(db, current_user.id, request)
    return {
        "id": updated_user.id,
        "name": updated_user.full_name,
        "role": updated_user.role,
        "email": updated_user.email
    }


@router.post("/request-access", response_model=AccessRequestResponse, status_code=201)
def request_access(
    request: AccessRequestCreate,
    db: Session = Depends(get_db)
):
    return auth_service.request_access(db, request)
