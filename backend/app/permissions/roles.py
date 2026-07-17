from enum import Enum


class UserRole(str, Enum):
    ADMIN = "ADMIN"
    STORE_MANAGER = "STORE_MANAGER"
    STAFF = "STAFF"
    VIEWER = "VIEWER"


DEFAULT_SELF_REGISTRATION_ROLE = UserRole.VIEWER
