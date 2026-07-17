from fastapi import Cookie, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.auth.models import User
from app.auth.service import service as auth_service
from app.permissions.roles import UserRole

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token", auto_error=False)


def get_current_user(
    db: Session = Depends(get_db),
    token: str | None = Depends(oauth2_scheme),
    access_token: str | None = Cookie(default=None)
) -> User:
    token = token or access_token
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return auth_service.get_current_user(db, token)


def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return current_user


def require_roles(allowed_roles: set[str]):
    def role_checker(
        current_user: User = Depends(get_current_active_user)
    ) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions"
            )
        return current_user

    return role_checker


def require_admin(
    current_user: User = Depends(require_roles({UserRole.ADMIN.value}))
) -> User:
    return current_user


def require_manager(
    current_user: User = Depends(require_roles({UserRole.STORE_MANAGER.value}))
) -> User:
    return current_user


def require_store_manager(
    current_user: User = Depends(require_roles({UserRole.STORE_MANAGER.value}))
) -> User:
    return current_user


def require_analyst(
    current_user: User = Depends(require_roles({UserRole.VIEWER.value}))
) -> User:
    return current_user


def get_current_admin(
    current_user: User = Depends(require_admin)
) -> User:
    return current_user
