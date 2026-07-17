from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.orm import Session

from app.auth.models import User
from app.database.dependencies import get_db
from app.permissions.dependencies import require_admin, require_roles
from app.permissions.roles import UserRole
from app.users.schemas import (
    MessageResponse,
    UserListResponse,
    UserResponse,
    UserRoleUpdate,
    UserStatisticsResponse,
    UserUpdate,
)
from app.users.service import service

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)

can_read_users = require_roles(
    UserRole.ADMIN,
)


@router.get("", response_model=UserListResponse, dependencies=[Depends(can_read_users)])
def get_users(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    search: str | None = None,
    role: UserRole | None = None,
    active: bool | None = None,
    sort: str = Query(default="created_at", pattern="^(name|full_name|email|created_at|role)$"),
    order: str = Query(default="asc", pattern="^(asc|desc)$"),
    db: Session = Depends(get_db),
):
    users, total = service.get_users(
        db=db,
        page=page,
        limit=limit,
        search=search,
        role=role,
        active=active,
        sort=sort,
        order=order,
    )
    return {
        "total": total,
        "page": page,
        "limit": limit,
        "users": users,
    }


@router.get("/statistics", response_model=UserStatisticsResponse, dependencies=[Depends(can_read_users)])
def get_user_statistics(db: Session = Depends(get_db)):
    return service.statistics(db)


@router.get("/active", response_model=UserListResponse, dependencies=[Depends(can_read_users)])
def get_active_users(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    users, total = service.get_users(db, page, limit, None, None, True, "created_at", "asc")
    return {"total": total, "page": page, "limit": limit, "users": users}


@router.get("/inactive", response_model=UserListResponse, dependencies=[Depends(can_read_users)])
def get_inactive_users(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    users, total = service.get_users(db, page, limit, None, None, False, "created_at", "asc")
    return {"total": total, "page": page, "limit": limit, "users": users}


@router.get("/admins", response_model=UserListResponse, dependencies=[Depends(can_read_users)])
def get_admins(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    users, total = service.get_users(db, page, limit, None, UserRole.ADMIN, None, "created_at", "asc")
    return {"total": total, "page": page, "limit": limit, "users": users}


@router.get("/staff", response_model=UserListResponse, dependencies=[Depends(can_read_users)])
def get_staff(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    users, total = service.get_users(db, page, limit, None, UserRole.STAFF, None, "created_at", "asc")
    return {"total": total, "page": page, "limit": limit, "users": users}


@router.get("/store-managers", response_model=UserListResponse, dependencies=[Depends(can_read_users)])
def get_store_managers(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    users, total = service.get_users(db, page, limit, None, UserRole.STORE_MANAGER, None, "created_at", "asc")
    return {"total": total, "page": page, "limit": limit, "users": users}


@router.get("/{user_id}", response_model=UserResponse, dependencies=[Depends(can_read_users)])
def get_user(user_id: int, db: Session = Depends(get_db)):
    return service.get_user(db, user_id)


@router.put("/{user_id}", response_model=UserResponse, dependencies=[Depends(require_admin)])
def update_user(
    user_id: int,
    request: UserUpdate,
    db: Session = Depends(get_db),
):
    return service.update_user(db, user_id, request)


@router.patch("/{user_id}/role", response_model=UserResponse, dependencies=[Depends(require_admin)])
def change_user_role(
    user_id: int,
    request_body: UserRoleUpdate,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    return service.change_role(
        db=db,
        user_id=user_id,
        role=request_body.role,
        changed_by=current_user,
        ip_address=request.client.host if request.client else None,
    )


@router.patch("/{user_id}/activate", response_model=UserResponse, dependencies=[Depends(require_admin)])
def activate_user(user_id: int, db: Session = Depends(get_db)):
    return service.activate_user(db, user_id)


@router.patch("/{user_id}/deactivate", response_model=UserResponse, dependencies=[Depends(require_admin)])
def deactivate_user(user_id: int, db: Session = Depends(get_db)):
    return service.deactivate_user(db, user_id)


@router.delete("/{user_id}", response_model=MessageResponse, dependencies=[Depends(require_admin)])
def delete_user(user_id: int, db: Session = Depends(get_db)):
    service.delete_user(db, user_id)
    return {"message": "User deleted successfully"}
