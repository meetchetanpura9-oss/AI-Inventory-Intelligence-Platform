from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.product import Product
from app.models.inventory import Inventory
from app.models.sale import Sale
from app.models.purchase import Purchase
from app.models.inventory_transaction import InventoryTransaction
from app.demand.models import ProductDemand


class AnalyticsRepository:

    def get_dashboard_summary(self, db: Session):
        total_products = db.query(Product).count()
        total_stock = db.query(func.sum(Inventory.quantity)).scalar() or 0

        # Inventory Value = SUM(quantity * selling_price)
        inventory_value = (
            db.query(func.sum(Inventory.quantity * Product.selling_price))
            .join(Product)
            .scalar()
        ) or 0.0

        sales_today = (
            db.query(func.sum(Sale.quantity * Sale.selling_price))
            .filter(func.date(Sale.created_at) == func.current_date())
            .scalar()
        ) or 0.0

        purchase_today = (
            db.query(func.sum(Purchase.quantity * Purchase.cost_price))
            .filter(func.date(Purchase.created_at) == func.current_date())
            .scalar()
        ) or 0.0

        # today's profit = today's sales - today's purchases
        profit = sales_today - purchase_today

        low_stock_items = (
            db.query(Inventory)
            .filter(Inventory.quantity <= Inventory.minimum_stock)
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
            "inventory_value": inventory_value,
            "sales_today": sales_today,
            "purchase_today": purchase_today,
            "profit": profit,
            "low_stock_items": low_stock_items,
            "out_of_stock_items": out_of_stock_items
        }

    def get_sales_analytics(self, db: Session):
        results = (
            db.query(
                Product.id.label("product_id"),
                Product.product_name.label("product_name"),
                func.sum(Sale.quantity).label("total_quantity_sold"),
                func.sum(Sale.quantity * Sale.selling_price).label("total_revenue")
            )
            .join(Sale)
            .group_by(Product.id, Product.product_name)
            .order_by(func.sum(Sale.quantity * Sale.selling_price).desc())
            .all()
        )
        return results

    def get_purchase_analytics(self, db: Session):
        results = (
            db.query(
                Product.id.label("product_id"),
                Product.product_name.label("product_name"),
                func.sum(Purchase.quantity).label("purchased_quantity"),
                func.sum(Purchase.quantity * Purchase.cost_price).label("total_spend")
            )
            .join(Purchase)
            .group_by(Product.id, Product.product_name)
            .order_by(func.sum(Purchase.quantity * Purchase.cost_price).desc())
            .all()
        )
        return results

    def get_inventory_analytics(self, db: Session):
        results = (
            db.query(
                Product.id.label("product_id"),
                Product.product_name.label("product_name"),
                Inventory.quantity.label("current_stock"),
                Inventory.minimum_stock.label("minimum_stock"),
                Inventory.maximum_stock.label("maximum_stock"),
                (Inventory.quantity * Product.selling_price).label("inventory_value")
            )
            .join(Inventory)
            .order_by(Product.id)
            .all()
        )
        return results

    def get_transaction_analytics(self, db: Session):
        results = (
            db.query(
                InventoryTransaction.transaction_type.label("transaction_type"),
                func.count(InventoryTransaction.id).label("transaction_count"),
                func.sum(InventoryTransaction.quantity).label("total_quantity_moved")
            )
            .group_by(InventoryTransaction.transaction_type)
            .all()
        )
        return results

    def get_top_selling_products(self, db: Session, limit: int = 10):
        results = (
            db.query(
                Product.id.label("product_id"),
                Product.product_name.label("product_name"),
                func.sum(Sale.quantity).label("quantity_sold"),
                func.sum(Sale.quantity * Sale.selling_price).label("total_revenue")
            )
            .join(Sale)
            .group_by(Product.id, Product.product_name)
            .order_by(func.sum(Sale.quantity).desc())
            .limit(limit)
            .all()
        )
        return results

    def get_top_demand_products(self, db: Session, limit: int = 10):
        # We perform an outer join with product_demands to correctly support products without demand records
        results = (
            db.query(
                Product.id.label("product_id"),
                Product.product_name.label("product_name"),
                func.coalesce(ProductDemand.demand_score, 0.0).label("demand_score"),
                func.coalesce(ProductDemand.demand_level, "LOW").label("demand_level")
            )
            .outerjoin(
                ProductDemand,
                (Product.id == ProductDemand.product_id) &
                ProductDemand.city.is_(None) &
                ProductDemand.area.is_(None)
            )
            .order_by(func.coalesce(ProductDemand.demand_score, 0.0).desc())
            .limit(limit)
            .all()
        )
        return results

    def get_low_stock_products(self, db: Session):
        results = (
            db.query(
                Product.id.label("product_id"),
                Product.product_name.label("product_name"),
                Inventory.quantity.label("current_stock"),
                Inventory.minimum_stock.label("minimum_stock")
            )
            .join(Inventory)
            .filter(Inventory.quantity <= Inventory.minimum_stock)
            .order_by(Inventory.quantity.asc())
            .all()
        )
        return results

    def get_profit_report(self, db: Session):
        sales_today = (
            db.query(func.sum(Sale.quantity * Sale.selling_price))
            .filter(func.date(Sale.created_at) == func.current_date())
            .scalar()
        ) or 0.0

        purchases_today = (
            db.query(func.sum(Purchase.quantity * Purchase.cost_price))
            .filter(func.date(Purchase.created_at) == func.current_date())
            .scalar()
        ) or 0.0

        sales_total = (
            db.query(func.sum(Sale.quantity * Sale.selling_price))
            .scalar()
        ) or 0.0

        purchases_total = (
            db.query(func.sum(Purchase.quantity * Purchase.cost_price))
            .scalar()
        ) or 0.0

        today_profit = sales_today - purchases_today
        total_profit = sales_total - purchases_total

        return {
            "today_profit": today_profit,
            "total_profit": total_profit
        }


repository = AnalyticsRepository()
