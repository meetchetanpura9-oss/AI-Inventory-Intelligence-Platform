from contextlib import contextmanager
from sqlalchemy import desc
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models.sale import Sale
from app.core.exceptions import DatabaseException


class SaleRepository:

    @contextmanager
    def _transaction(self, db: Session):
        try:
            yield
            db.commit()
        except IntegrityError as e:
            db.rollback()
            raise DatabaseException()
        except Exception as e:
            db.rollback()
            raise DatabaseException()

    def create(self, db: Session, sale: Sale):
        with self._transaction(db):
            db.add(sale)
        db.refresh(sale)
        return sale

    def get_all(self, db: Session, limit: int = 50, offset: int = 0):
        return (
            db.query(Sale)
            .order_by(desc(Sale.created_at))
            .offset(offset)
            .limit(limit)
            .all()
        )

    def get_by_id(self, db: Session, sale_id: int):
        return (
            db.query(Sale)
            .filter(Sale.id == sale_id)
            .first()
        )

    def get_by_product_id(
        self,
        db: Session,
        product_id: int,
        limit: int = 50,
        offset: int = 0
    ):
        return (
            db.query(Sale)
            .filter(Sale.product_id == product_id)
            .order_by(desc(Sale.created_at))
            .offset(offset)
            .limit(limit)
            .all()
        )


repository = SaleRepository()
