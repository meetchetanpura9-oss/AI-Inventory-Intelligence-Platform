from contextlib import contextmanager
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.auth.models import User, AccessRequest
from app.core.exceptions import DuplicateEmailException, DuplicatePhoneException


class UserRepository:

    @contextmanager
    def _transaction(self, db: Session):
        try:
            yield
            db.commit()
        except IntegrityError as e:
            db.rollback()
            error_message = str(e).lower()
            if "email" in error_message:
                raise DuplicateEmailException()
            if "phone" in error_message:
                raise DuplicatePhoneException()
            raise e
        except Exception as e:
            db.rollback()
            raise e

    def create_user(self, db: Session, user: User) -> User:
        with self._transaction(db):
            db.add(user)
        db.refresh(user)
        return user

    def get_by_email(self, db: Session, email: str) -> User | None:
        return db.query(User).filter(User.email == email).first()

    def get_by_phone(self, db: Session, phone: str) -> User | None:
        return db.query(User).filter(User.phone == phone).first()

    def get_by_id(self, db: Session, user_id: int) -> User | None:
        return db.query(User).filter(User.id == user_id).first()

    def update_password(self, db: Session, user_id: int, hashed_password: str) -> User | None:
        user = self.get_by_id(db, user_id)
        if user:
            with self._transaction(db):
                user.password_hash = hashed_password
            db.refresh(user)
        return user

    def update_user(self, db: Session, user_id: int, update_data: dict) -> User | None:
        user = self.get_by_id(db, user_id)
        if user:
            with self._transaction(db):
                for key, value in update_data.items():
                    if value is not None:
                        setattr(user, key, value)
            db.refresh(user)
        return user

    def create_access_request(self, db: Session, req: AccessRequest) -> AccessRequest:
        db.add(req)
        db.commit()
        db.refresh(req)
        return req


repository = UserRepository()
