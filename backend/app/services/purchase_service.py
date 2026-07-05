from sqlalchemy.orm import Session

from app.core.exceptions import DatabaseException, ProductNotFoundException
from app.models.inventory_transaction import InventoryTransaction
from app.models.purchase import Purchase
from app.repositories.inventory_repository import repository as inventory_repository
from app.repositories.purchase_repository import repository
from app.schemas.purchase import PurchaseCreate


class PurchaseService:

    def create_purchase(self, db: Session, request: PurchaseCreate):
        inventory = inventory_repository.get_by_product_id(
            db,
            request.product_id
        )
        if not inventory:
            raise ProductNotFoundException()

        purchase = Purchase(
            product_id=request.product_id,
            quantity=request.quantity,
            cost_price=request.cost_price,
            supplier_name=request.supplier_name
        )

        try:
            inventory.quantity += request.quantity
            db.add(purchase)
            db.flush()

            transaction = InventoryTransaction(
                product_id=request.product_id,
                transaction_type="IN",
                quantity=request.quantity,
                reference=f"PURCHASE-{purchase.id}",
                remarks=f"Stock replenished from supplier {request.supplier_name}"
            )
            db.add(transaction)
            db.commit()
            db.refresh(purchase)

            return purchase
        except Exception:
            db.rollback()
            raise DatabaseException()

    def get_purchases(self, db: Session, limit: int = 50, offset: int = 0):
        return repository.get_all(db, limit=limit, offset=offset)

    def get_purchase(self, db: Session, purchase_id: int):
        return repository.get_by_id(db, purchase_id)

    def get_product_purchases(
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


service = PurchaseService()
