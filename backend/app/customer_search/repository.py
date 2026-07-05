from contextlib import contextmanager
from uuid import UUID

from sqlalchemy import func
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

    def get_search_history(self, db: Session) -> list[CustomerSearch]:
        return (
            db.query(CustomerSearch)
            .order_by(CustomerSearch.created_at.desc())
            .all()
        )

    def get_failed_searches(self, db: Session) -> list[CustomerSearch]:
        return (
            db.query(CustomerSearch)
            .filter(CustomerSearch.found.is_(False))
            .order_by(CustomerSearch.created_at.desc())
            .all()
        )

    def get_successful_searches(self, db: Session) -> list[CustomerSearch]:
        return (
            db.query(CustomerSearch)
            .filter(CustomerSearch.found.is_(True))
            .order_by(CustomerSearch.created_at.desc())
            .all()
        )

    def get_top_products(self, db: Session, limit: int = 10) -> list[tuple]:
        return (
            db.query(
                CustomerSearch.searched_product,
                func.count(CustomerSearch.id).label("search_count")
            )
            .filter(CustomerSearch.searched_product.isnot(None))
            .group_by(CustomerSearch.searched_product)
            .order_by(func.count(CustomerSearch.id).desc())
            .limit(limit)
            .all()
        )

    def get_top_failed_products(self, db: Session, limit: int = 10) -> list[tuple]:
        return (
            db.query(
                CustomerSearch.searched_keyword,
                func.count(CustomerSearch.id).label("search_count")
            )
            .filter(CustomerSearch.found.is_(False))
            .group_by(CustomerSearch.searched_keyword)
            .order_by(func.count(CustomerSearch.id).desc())
            .limit(limit)
            .all()
        )

    def get_city_analytics(self, db: Session) -> list[tuple]:
        return (
            db.query(
                CustomerSearch.city,
                func.count(CustomerSearch.id).label("search_count")
            )
            .filter(CustomerSearch.city.isnot(None))
            .group_by(CustomerSearch.city)
            .order_by(func.count(CustomerSearch.id).desc())
            .all()
        )

    def get_area_analytics(self, db: Session) -> list[tuple]:
        return (
            db.query(
                CustomerSearch.area,
                func.count(CustomerSearch.id).label("search_count")
            )
            .filter(CustomerSearch.area.isnot(None))
            .group_by(CustomerSearch.area)
            .order_by(func.count(CustomerSearch.id).desc())
            .all()
        )


repository = CustomerSearchRepository()

