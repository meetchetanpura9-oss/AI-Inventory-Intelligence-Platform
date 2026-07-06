from contextlib import contextmanager
from typing import List, Optional
from sqlalchemy import func, desc, asc
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.exceptions import DatabaseException
from app.models.product import Product
from app.models.inventory import Inventory
from app.models.sale import Sale
from app.models.purchase import Purchase
from app.customer_search.models import CustomerSearch
from app.demand.models import ProductDemand


class ProductDemandRepository:

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

    def clear_demands(self, db: Session):
        with self._transaction(db):
            db.query(ProductDemand).delete()

    def save_demands(self, db: Session, demands: List[ProductDemand]):
        with self._transaction(db):
            db.add_all(demands)

    def _apply_location_filters(
        self,
        query,
        city: Optional[str],
        area: Optional[str]
    ):
        if city is None and area is None:
            # Default/Global case: return only global records
            return query.filter(ProductDemand.city.is_(None), ProductDemand.area.is_(None))
        
        # Filtering case: filter by city and/or area if they are provided
        if city is not None:
            query = query.filter(ProductDemand.city == city)
        if area is not None:
            query = query.filter(ProductDemand.area == area)
            
        return query

    def get_all_demands(
        self,
        db: Session,
        city: Optional[str] = None,
        area: Optional[str] = None
    ) -> List[ProductDemand]:
        query = db.query(ProductDemand)
        query = self._apply_location_filters(query, city, area)
        return query.order_by(desc(ProductDemand.demand_score)).all()

    def get_high_demand_products(
        self,
        db: Session,
        city: Optional[str] = None,
        area: Optional[str] = None
    ) -> List[ProductDemand]:
        query = db.query(ProductDemand).filter(ProductDemand.demand_level == "HIGH")
        query = self._apply_location_filters(query, city, area)
        return query.order_by(desc(ProductDemand.demand_score)).all()

    def get_low_demand_products(
        self,
        db: Session,
        city: Optional[str] = None,
        area: Optional[str] = None
    ) -> List[ProductDemand]:
        query = db.query(ProductDemand).filter(ProductDemand.demand_level == "LOW")
        query = self._apply_location_filters(query, city, area)
        return query.order_by(asc(ProductDemand.demand_score)).all()

    def get_product_demand(
        self,
        db: Session,
        product_id: int,
        city: Optional[str] = None,
        area: Optional[str] = None
    ) -> Optional[ProductDemand]:
        query = db.query(ProductDemand).filter(ProductDemand.product_id == product_id)
        query = self._apply_location_filters(query, city, area)
        return query.first()


repository = ProductDemandRepository()
