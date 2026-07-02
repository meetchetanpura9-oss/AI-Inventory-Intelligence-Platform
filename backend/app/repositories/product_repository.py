from contextlib import contextmanager
from sqlalchemy import asc, desc
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models.product import Product
from app.core.exceptions import DuplicateSKUException


class ProductRepository:

    @contextmanager
    def _transaction(self, db: Session):
        try:
            yield
            db.commit()
        except IntegrityError as e:
            db.rollback()
            error_message = str(e).lower()
            if "sku" in error_message:
                raise DuplicateSKUException()
            raise e
        except Exception as e:
            db.rollback()
            raise e

    def create(self, db: Session, product: Product):
        with self._transaction(db):
            db.add(product)
        db.refresh(product)
        return product

    def get_all(
        self,
        db: Session,
        search: str = None,
        category: str = None,
        brand: str = None,
        limit: int = 10,
        offset: int = 0,
        sort_by: str = "id",
        sort_order: str = "asc"
    ):
        query = db.query(Product)

        # Search by product name
        if search:
            query = query.filter(
                Product.product_name.ilike(f"%{search}%")
            )

        # Filter by category
        if category:
            query = query.filter(
                Product.category.ilike(f"%{category}%")
            )

        # Filter by brand
        if brand:
            query = query.filter(
                Product.brand.ilike(f"%{brand}%")
            )

        # Sorting
        if hasattr(Product, sort_by):
            sort_column = getattr(Product, sort_by)
        else:
            sort_column = Product.id

        if sort_order.lower() == "desc":
            query = query.order_by(desc(sort_column))
        else:
            query = query.order_by(asc(sort_column))

        # Pagination
        query = query.offset(offset).limit(limit)

        return query.all()

    def get_by_id(self, db: Session, product_id: int):
        return (
            db.query(Product)
            .filter(Product.id == product_id)
            .first()
        )

    def update(self, db: Session, product: Product):
        with self._transaction(db):
            pass
        db.refresh(product)
        return product

    def delete(self, db: Session, product: Product):
        with self._transaction(db):
            db.delete(product)
        return product