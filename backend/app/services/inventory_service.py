from sqlalchemy.orm import Session

from app.models.inventory import Inventory
from app.models.inventory_transaction import InventoryTransaction
from app.repositories.inventory_repository import repository
from app.core.exceptions import (
    DatabaseException,
    ProductNotFoundException,
    InsufficientStockException
)


class InventoryService:

    def create_inventory(self, db: Session, inventory: Inventory):
        return repository.create(db, inventory)

    def get_inventory_by_product(self, db: Session, product_id: int):
        return repository.get_by_product_id(db, product_id)

    def get_inventory(self, db: Session, inventory_id: int):
        return repository.get_by_id(db, inventory_id)

    def get_all_inventory(self, db: Session):
        return repository.get_all(db)

    def update_inventory(self, db: Session, inventory: Inventory):
        return repository.update(db, inventory)

    def delete_inventory(self, db: Session, inventory: Inventory):
        repository.delete(db, inventory)

    def add_stock(
        self,
        db: Session,
        product_id: int,
        quantity: int,
        reference: str | None = None,
        remarks: str | None = None
    ):
        inventory = repository.get_by_product_id(db, product_id)
        if not inventory:
            raise ProductNotFoundException()

        try:
            inventory.quantity += quantity
            transaction = InventoryTransaction(
                product_id=product_id,
                transaction_type="IN",
                quantity=quantity,
                reference=reference or "Manual Stock Addition",
                remarks=remarks or "Stock added manually"
            )

            db.add(transaction)
            db.commit()
            db.refresh(inventory)

            return inventory
        except Exception:
            db.rollback()
            raise DatabaseException()

    def remove_stock(
        self,
        db: Session,
        product_id: int,
        quantity: int,
        reference: str | None = None,
        remarks: str | None = None
    ):
        inventory = repository.get_by_product_id(db, product_id)
        if not inventory:
            raise ProductNotFoundException()
        if inventory.quantity - quantity < 0:
            raise InsufficientStockException()

        try:
            inventory.quantity -= quantity
            transaction = InventoryTransaction(
                product_id=product_id,
                transaction_type="OUT",
                quantity=quantity,
                reference=reference or "Manual Stock Removal",
                remarks=remarks or "Stock removed manually"
            )

            db.add(transaction)
            db.commit()
            db.refresh(inventory)

            return inventory
        except Exception:
            db.rollback()
            raise DatabaseException()

    def get_low_stock(self, db: Session):
        items = repository.get_low_stock(db)
        return [
            {
                "product": item.product.product_name if item.product else "Unknown Product",
                "quantity": item.quantity
            }
            for item in items
        ]

    def get_out_of_stock(self, db: Session):
        items = repository.get_out_of_stock(db)
        return [
            {
                "product": item.product.product_name if item.product else "Unknown Product"
            }
            for item in items
        ]

    def get_dashboard_stats(self, db: Session):
        return repository.get_dashboard_stats(db)


service = InventoryService()
