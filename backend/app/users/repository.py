from sqlalchemy import asc, desc, or_
from sqlalchemy.orm import Session

from app.auth.models import User


class UserRepository:
    sortable_fields = {
        "name": User.full_name,
        "full_name": User.full_name,
        "email": User.email,
        "created_at": User.created_at,
        "role": User.role,
    }

    def create_user(self, db: Session, user: User) -> User:
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    def get_user_by_id(self, db: Session, user_id: int) -> User | None:
        return db.query(User).filter(User.id == user_id).first()

    def get_user_by_email(self, db: Session, email: str) -> User | None:
        return db.query(User).filter(User.email == email).first()

    def get_user_by_phone(self, db: Session, phone: str) -> User | None:
        return db.query(User).filter(User.phone == phone).first()

    def get_all_users(
        self,
        db: Session,
        page: int = 1,
        limit: int = 20,
        search: str | None = None,
        role: str | None = None,
        active: bool | None = None,
        sort: str = "created_at",
        order: str = "asc",
    ) -> tuple[list[User], int]:
        query = db.query(User)

        if search:
            pattern = f"%{search}%"
            query = query.filter(
                or_(
                    User.full_name.ilike(pattern),
                    User.email.ilike(pattern),
                    User.phone.ilike(pattern),
                )
            )
        if role:
            query = query.filter(User.role == role)
        if active is not None:
            query = query.filter(User.is_active == active)

        total = query.count()
        sort_column = self.sortable_fields.get(sort, User.created_at)
        direction = desc if order.lower() == "desc" else asc
        users = (
            query.order_by(direction(sort_column))
            .offset((page - 1) * limit)
            .limit(limit)
            .all()
        )
        return users, total

    def update_user(self, db: Session, user: User, update_data: dict) -> User:
        for key, value in update_data.items():
            if value is not None:
                setattr(user, key, value)
        db.commit()
        db.refresh(user)
        return user

    def delete_user(self, db: Session, user: User) -> User:
        user.is_active = False
        db.commit()
        db.refresh(user)
        return user

    def activate_user(self, db: Session, user: User) -> User:
        user.is_active = True
        db.commit()
        db.refresh(user)
        return user

    def deactivate_user(self, db: Session, user: User) -> User:
        user.is_active = False
        db.commit()
        db.refresh(user)
        return user

    def change_role(self, db: Session, user: User, role: str) -> User:
        user.role = role
        db.commit()
        db.refresh(user)
        return user


repository = UserRepository()

