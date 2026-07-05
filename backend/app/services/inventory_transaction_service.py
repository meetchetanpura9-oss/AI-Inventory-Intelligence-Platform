from sqlalchemy.orm import Session

from app.models.inventory_transaction import InventoryTransaction
from app.repositories.inventory_transaction_repository import repository


class InventoryTransactionService:

    def create_transaction(
        self,
        db: Session,
        product_id: int,
        transaction_type: str,
        quantity: int,
        reference: str | None = None,
        remarks: str | None = None
    ):
        transaction = InventoryTransaction(
            product_id=product_id,
            transaction_type=transaction_type,
            quantity=quantity,
            reference=reference,
            remarks=remarks
        )
        return repository.create(db, transaction)

    def get_transaction_history(
        self,
        db: Session,
        limit: int = 50,
        offset: int = 0
    ):
        return repository.get_all(db, limit=limit, offset=offset)

    def get_product_transaction_history(
        self,
        db: Session,
        product_id: int,
        limit: int = 50,
        offset: int = 0
    ):
        return repository.get_by_product_id(
            db,
            product_id,
            limit=limit,
            offset=offset
        )


service = InventoryTransactionService()
