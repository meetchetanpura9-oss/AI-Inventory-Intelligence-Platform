from contextlib import contextmanager
from sqlalchemy import func
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from fastapi import HTTPException
from app.models.inventory import Inventory
from app.core.exceptions import DatabaseException


class InventoryRepository:

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

    def create(self, db: Session, inventory: Inventory):
        existing_inventory = (
            db.query(Inventory)
            .filter(Inventory.product_id == inventory.product_id)
            .first()
        )
        if existing_inventory:
            raise HTTPException(
                status_code=400,
                detail="Inventory already exists for this product."
            )
        with self._transaction(db):
            db.add(inventory)
        db.refresh(inventory)
        return inventory

    def create_for_product(
        self,
        db: Session,
        product_id: int,
        quantity: int = 0,
        minimum_stock: int = 10,
        maximum_stock: int = 100,
    ) -> Inventory:
        inventory = Inventory(
            product_id=product_id,
            quantity=quantity,
            minimum_stock=minimum_stock,
            maximum_stock=maximum_stock,
        )
        db.add(inventory)
        return inventory

    def get_all(self, db: Session):
        return db.query(Inventory).all()

    def get_by_id(self, db: Session, inventory_id: int):
        return (
            db.query(Inventory)
            .filter(Inventory.id == inventory_id)
            .first()
        )

    def get_by_product_id(self, db: Session, product_id: int):
        return (
            db.query(Inventory)
            .filter(Inventory.product_id == product_id)
            .first()
        )

    def update(self, db: Session, inventory: Inventory):
        with self._transaction(db):
            pass
        db.refresh(inventory)
        return inventory

    def delete(self, db: Session, inventory: Inventory):
        with self._transaction(db):
            db.delete(inventory)
        return inventory

    def delete_by_product(self, db: Session, product_id: int):
        inventory = self.get_by_product_id(db, product_id)
        if inventory:
            with self._transaction(db):
                db.delete(inventory)

    def get_low_stock(self, db: Session):
        return (
            db.query(Inventory)
            .filter(Inventory.quantity < Inventory.minimum_stock)
            .all()
        )

    def get_out_of_stock(self, db: Session):
        return (
            db.query(Inventory)
            .filter(Inventory.quantity == 0)
            .all()
        )

    def get_dashboard_stats(self, db: Session):
        total_products = db.query(Inventory).count()
        total_stock = db.query(func.sum(Inventory.quantity)).scalar() or 0
        low_stock_items = (
            db.query(Inventory)
            .filter(Inventory.quantity < Inventory.minimum_stock)
            .count()
        )
        out_of_stock_items = (
            db.query(Inventory)
            .filter(Inventory.quantity == 0)
            .count()
        )
        return {
            "total_products": total_products,
            "total_stock": total_stock,
            "low_stock_items": low_stock_items,
            "out_of_stock_items": out_of_stock_items
        }


repository = InventoryRepository()
