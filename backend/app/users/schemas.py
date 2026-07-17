from datetime import datetime

from pydantic import BaseModel, Field

from app.permissions.roles import UserRole


class UserUpdate(BaseModel):
    full_name: str | None = Field(default=None, min_length=2, max_length=150)
    email: str | None = Field(default=None, min_length=5, max_length=255)
    phone: str | None = Field(default=None, min_length=10, max_length=50)


class UserRoleUpdate(BaseModel):
    role: UserRole


class UserStatusUpdate(BaseModel):
    is_active: bool


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str
    role: UserRole | str
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserListResponse(BaseModel):
    total: int
    page: int
    limit: int
    users: list[UserResponse]


class UserStatisticsResponse(BaseModel):
    total: int
    active: int
    inactive: int
    admins: int
    store_managers: int
    staff: int
    viewers: int


class MessageResponse(BaseModel):
    message: str

