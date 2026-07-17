from fastapi import Depends, HTTPException, status

from app.auth.dependencies import get_current_active_user
from app.auth.models import User
from app.permissions.roles import UserRole


def require_roles(*allowed_roles: UserRole | str):
    allowed = {
        role.value if isinstance(role, UserRole) else str(role)
        for role in allowed_roles
    }

    def role_checker(
        current_user: User = Depends(get_current_active_user)
    ) -> User:
        if current_user.role not in allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions"
            )
        return current_user

    return role_checker


def require_admin(
    current_user: User = Depends(require_roles(UserRole.ADMIN))
) -> User:
    return current_user


def require_manager(
    current_user: User = Depends(require_roles(UserRole.STORE_MANAGER))
) -> User:
    return current_user


def require_store_manager(
    current_user: User = Depends(require_roles(UserRole.STORE_MANAGER))
) -> User:
    return current_user


def require_staff(
    current_user: User = Depends(require_roles(UserRole.STAFF))
) -> User:
    return current_user


def require_viewer(
    current_user: User = Depends(require_roles(UserRole.VIEWER))
) -> User:
    return current_user

