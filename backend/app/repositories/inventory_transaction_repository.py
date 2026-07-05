from contextlib import contextmanager
from sqlalchemy import desc
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models.inventory_transaction import InventoryTransaction
from app.core.exceptions import DatabaseException


class InventoryTransactionRepository:

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

    def create(self, db: Session, transaction: InventoryTransaction):
        with self._transaction(db):
            db.add(transaction)
        db.refresh(transaction)
        return transaction

    def get_all(self, db: Session, limit: int = 50, offset: int = 0):
        return (
            db.query(InventoryTransaction)
            .order_by(desc(InventoryTransaction.created_at))
            .offset(offset)
            .limit(limit)
            .all()
        )

    def get_by_product_id(
        self,
        db: Session,
        product_id: int,
        limit: int = 50,
        offset: int = 0
    ):
        return (
            db.query(InventoryTransaction)
            .filter(InventoryTransaction.product_id == product_id)
            .order_by(desc(InventoryTransaction.created_at))
            .offset(offset)
            .limit(limit)
            .all()
        )

    def delete_by_product(self, db: Session, product_id: int):
        with self._transaction(db):
            db.query(InventoryTransaction).filter(
                InventoryTransaction.product_id == product_id
            ).delete()


repository = InventoryTransactionRepository()
