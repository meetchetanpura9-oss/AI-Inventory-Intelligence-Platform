from contextlib import contextmanager
from uuid import UUID

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.exceptions import DatabaseException
from app.customer_search.models import CustomerSearch


class CustomerSearchRepository:

    @contextmanager
    def _transaction(self, db: Session):
        try:
            yield
            db.commit()
        except IntegrityError:
            db.rollback()
            raise DatabaseException()
        except Exception:
            db.rollback()
            raise DatabaseException()

    def create_search(self, db: Session, search: CustomerSearch) -> CustomerSearch:
        with self._transaction(db):
            db.add(search)
        db.refresh(search)
        return search

    def get_search_by_id(self, db: Session, search_id: UUID) -> CustomerSearch | None:
        return (
            db.query(CustomerSearch)
            .filter(CustomerSearch.id == search_id)
            .first()
        )

    def get_failed_searches(self, db: Session) -> list[CustomerSearch]:
        return (
            db.query(CustomerSearch)
            .filter(CustomerSearch.found.is_(False))
            .all()
        )

    def get_successful_searches(self, db: Session) -> list[CustomerSearch]:
        return (
            db.query(CustomerSearch)
            .filter(CustomerSearch.found.is_(True))
            .all()
        )


repository = CustomerSearchRepository()
