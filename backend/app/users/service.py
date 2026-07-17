import logging

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.auth.models import User
from app.permissions.roles import UserRole
from app.users.repository import repository
from app.users.schemas import UserUpdate

logger = logging.getLogger("audit.users")


class UserService:
    def get_users(
        self,
        db: Session,
        page: int,
        limit: int,
        search: str | None,
        role: UserRole | None,
        active: bool | None,
        sort: str,
        order: str,
    ) -> tuple[list[User], int]:
        role_value = role.value if role else None
        return repository.get_all_users(
            db=db,
            page=page,
            limit=limit,
            search=search,
            role=role_value,
            active=active,
            sort=sort,
            order=order,
        )

    def get_user(self, db: Session, user_id: int) -> User:
        user = repository.get_user_by_id(db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return user

    def update_user(self, db: Session, user_id: int, request: UserUpdate) -> User:
        user = self.get_user(db, user_id)
        update_data = request.model_dump(exclude_unset=True)

        email = update_data.get("email")
        if email:
            existing = repository.get_user_by_email(db, email.lower())
            if existing and existing.id != user.id:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Email already exists."
                )
            update_data["email"] = email.lower()

        phone = update_data.get("phone")
        if phone:
            existing = repository.get_user_by_phone(db, phone)
            if existing and existing.id != user.id:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Phone number already exists."
                )

        return repository.update_user(db, user, update_data)

    def delete_user(self, db: Session, user_id: int) -> User:
        user = self.get_user(db, user_id)
        return repository.delete_user(db, user)

    def activate_user(self, db: Session, user_id: int) -> User:
        user = self.get_user(db, user_id)
        return repository.activate_user(db, user)

    def deactivate_user(self, db: Session, user_id: int) -> User:
        user = self.get_user(db, user_id)
        return repository.deactivate_user(db, user)

    def change_role(
        self,
        db: Session,
        user_id: int,
        role: UserRole,
        changed_by: User,
        ip_address: str | None,
    ) -> User:
        user = self.get_user(db, user_id)
        old_role = user.role
        updated_user = repository.change_role(db, user, role.value)
        logger.info(
            "role_changed user_id=%s old_role=%s new_role=%s changed_by=%s ip=%s",
            user_id,
            old_role,
            role.value,
            changed_by.id,
            ip_address,
        )
        return updated_user

    def statistics(self, db: Session) -> dict:
        users, total = repository.get_all_users(db, page=1, limit=1_000_000)
        return {
            "total": total,
            "active": sum(1 for user in users if user.is_active),
            "inactive": sum(1 for user in users if not user.is_active),
            "admins": sum(1 for user in users if user.role == UserRole.ADMIN.value),
            "store_managers": sum(1 for user in users if user.role == UserRole.STORE_MANAGER.value),
            "staff": sum(1 for user in users if user.role == UserRole.STAFF.value),
            "viewers": sum(1 for user in users if user.role == UserRole.VIEWER.value),
        }


service = UserService()

