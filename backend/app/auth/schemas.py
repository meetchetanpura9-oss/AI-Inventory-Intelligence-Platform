from datetime import datetime
import re
from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.permissions.roles import UserRole


class UserBase(BaseModel):
    full_name: str = Field(
        ...,
        min_length=2,
        max_length=150,
        description="Full name of the user"
    )
    email: str = Field(
        ...,
        min_length=5,
        max_length=255,
        description="Unique email address"
    )
    phone: str = Field(
        ...,
        min_length=10,
        max_length=50,
        description="Unique phone number"
    )
    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str):
        value = value.strip().lower()
        if not re.match(r"^[^@]+@[^@]+\.[^@]+$", value):
            raise ValueError("Invalid email format.")
        return value

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str):
        value = value.strip()
        # E.164 phone format validator
        if not re.match(r"^\+?[1-9]\d{9,14}$", value):
            raise ValueError("Invalid phone format. Must be E.164 format (e.g. +1234567890 or 9876543210 with 10 to 15 digits).")
        return value


class UserCreate(UserBase):
    model_config = ConfigDict(extra="forbid")

    password: str = Field(
        ...,
        min_length=8,
        max_length=100,
        description="Password (minimum 8 characters)"
    )

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str):
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters long.")
        return value


class UserLogin(BaseModel):
    email: str = Field(..., description="Email address")
    password: str = Field(..., description="Password")

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str):
        value = value.strip().lower()
        if not re.match(r"^[^@]+@[^@]+\.[^@]+$", value):
            raise ValueError("Invalid email format.")
        return value


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str
    role: str
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class RegistrationResponse(BaseModel):
    message: str


class CurrentUserResponse(BaseModel):
    id: int
    name: str
    role: str
    email: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshTokenRequest(BaseModel):
    refresh_token: str = Field(..., description="Refresh Token")


class ChangePasswordRequest(BaseModel):
    old_password: str = Field(..., description="Old password")
    new_password: str = Field(
        ...,
        min_length=8,
        max_length=100,
        description="New password (minimum 8 characters)"
    )

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, value: str):
        if len(value) < 8:
            raise ValueError("New password must be at least 8 characters long.")
        return value


class UserUpdate(BaseModel):
    full_name: str | None = Field(default=None, min_length=2, max_length=150)
    phone: str | None = Field(default=None, min_length=10, max_length=50)
    role: UserRole | None = Field(default=None)

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str | None):
        if value is None:
            return value
        value = value.strip()
        if not re.match(r"^\+?[1-9]\d{9,14}$", value):
            raise ValueError("Invalid phone format.")
        return value

    @field_validator("role")
    @classmethod
    def validate_role(cls, value: UserRole | str | None):
        if value is None:
            return value
        if isinstance(value, UserRole):
            return value
        value = value.strip().upper()
        valid_roles = {role.value for role in UserRole}
        if value not in valid_roles:
            raise ValueError(f"Role must be one of {valid_roles}")
        return value


class AccessRequestCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=150, description="Full Name")
    company: str = Field(..., min_length=2, max_length=150, description="Company Name")
    email: str = Field(..., min_length=5, max_length=255, description="Work Email")
    phone: str = Field(..., min_length=10, max_length=50, description="Phone Number")
    message: str | None = Field(default=None, max_length=500, description="Requirements Message")

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str):
        value = value.strip().lower()
        if not re.match(r"^[^@]+@[^@]+\.[^@]+$", value):
            raise ValueError("Invalid email format.")
        return value

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str):
        value = value.strip()
        if not re.match(r"^\+?[1-9]\d{9,14}$", value):
            raise ValueError("Invalid phone format.")
        return value


class AccessRequestResponse(BaseModel):
    id: int
    name: str
    company: str
    email: str
    phone: str
    message: str | None
    created_at: datetime

    class Config:
        from_attributes = True
