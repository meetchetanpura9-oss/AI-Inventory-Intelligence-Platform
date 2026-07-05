from contextlib import contextmanager
from sqlalchemy import desc
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models.purchase import Purchase
from app.core.exceptions import DatabaseException


class PurchaseRepository:

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

    def create(self, db: Session, purchase: Purchase):
        with self._transaction(db):
            db.add(purchase)
        db.refresh(purchase)
        return purchase

    def get_all(self, db: Session, limit: int = 50, offset: int = 0):
        return (
            db.query(Purchase)
            .order_by(desc(Purchase.created_at))
            .offset(offset)
            .limit(limit)
            .all()
        )

    def get_by_id(self, db: Session, purchase_id: int):
        return (
            db.query(Purchase)
            .filter(Purchase.id == purchase_id)
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
            db.query(Purchase)
            .filter(Purchase.product_id == product_id)
            .order_by(desc(Purchase.created_at))
            .offset(offset)
            .limit(limit)
            .all()
        )


repository = PurchaseRepository()
