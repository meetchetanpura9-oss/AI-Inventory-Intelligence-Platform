from sqlalchemy.orm import Session

from app.core.exceptions import (
    DatabaseException,
    ProductNotFoundException,
    InsufficientStockException
)
from app.models.inventory_transaction import InventoryTransaction
from app.models.sale import Sale
from app.repositories.inventory_repository import repository as inventory_repository
from app.repositories.sale_repository import repository
from app.schemas.sale import SaleCreate


class SaleService:

    def create_sale(self, db: Session, request: SaleCreate):
        inventory = inventory_repository.get_by_product_id(
            db,
            request.product_id
        )
        if not inventory:
            raise ProductNotFoundException()
        if inventory.quantity - request.quantity < 0:
            raise InsufficientStockException()

        sale = Sale(
            product_id=request.product_id,
            quantity=request.quantity,
            selling_price=request.selling_price,
            customer_name=request.customer_name
        )

        try:
            inventory.quantity -= request.quantity
            db.add(sale)
            db.flush()

            transaction = InventoryTransaction(
                product_id=request.product_id,
                transaction_type="OUT",
                quantity=request.quantity,
                reference=f"SALE-{sale.id}",
                remarks=f"Stock deducted for sale to {request.customer_name}"
            )
            db.add(transaction)
            db.commit()
            db.refresh(sale)

            return sale
        except Exception:
            db.rollback()
            raise DatabaseException()

    def get_sales(self, db: Session, limit: int = 50, offset: int = 0):
        return repository.get_all(db, limit=limit, offset=offset)

    def get_sale(self, db: Session, sale_id: int):
        return repository.get_by_id(db, sale_id)

    def get_product_sales(
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


service = SaleService()
