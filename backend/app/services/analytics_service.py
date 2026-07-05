from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.product import Product
from app.models.inventory import Inventory
from app.models.inventory_transaction import InventoryTransaction
from app.models.sale import Sale
from app.models.purchase import Purchase


class AnalyticsService:

    def get_dashboard_stats(self, db: Session):
        total_products = db.query(Product).count()
        total_stock = db.query(func.sum(Inventory.quantity)).scalar() or 0

        inventory_value = (
            db.query(func.sum(Inventory.quantity * func.coalesce(Product.cost_price, 0)))
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

        profit = (
            db.query(func.sum(Sale.quantity * (Sale.selling_price - func.coalesce(Product.cost_price, 0))))
            .join(Product)
            .filter(func.date(Sale.created_at) == func.current_date())
            .scalar()
        ) or 0.0

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
            "out_of_stock_items": out_of_stock_items,
            "inventory_value": inventory_value,
            "sales_today": sales_today,
            "purchase_today": purchase_today,
            "profit": profit
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
            .all()
        )
        return [
            {
                "product_id": r.product_id,
                "product_name": r.product_name,
                "total_quantity_sold": r.total_quantity_sold or 0,
                "total_revenue": r.total_revenue or 0.0
            }
            for r in results
        ]

    def get_purchases_analytics(self, db: Session):
        results = (
            db.query(
                Product.id.label("product_id"),
                Product.product_name.label("product_name"),
                func.sum(Purchase.quantity).label("total_quantity_purchased"),
                func.sum(Purchase.quantity * Purchase.cost_price).label("total_spend")
            )
            .join(Purchase)
            .group_by(Product.id, Product.product_name)
            .all()
        )
        return [
            {
                "product_id": r.product_id,
                "product_name": r.product_name,
                "total_quantity_purchased": r.total_quantity_purchased or 0,
                "total_spend": r.total_spend or 0.0
            }
            for r in results
        ]

    def get_inventory_analytics(self, db: Session):
        results = (
            db.query(
                Product.id.label("product_id"),
                Product.product_name.label("product_name"),
                Inventory.quantity.label("quantity"),
                Inventory.minimum_stock.label("minimum_stock"),
                Inventory.maximum_stock.label("maximum_stock"),
                (Inventory.quantity * Product.cost_price).label("inventory_value")
            )
            .join(Inventory)
            .all()
        )
        return [
            {
                "product_id": r.product_id,
                "product_name": r.product_name,
                "quantity": r.quantity,
                "minimum_stock": r.minimum_stock,
                "maximum_stock": r.maximum_stock,
                "inventory_value": r.inventory_value or 0.0
            }
            for r in results
        ]

    def get_transactions_analytics(self, db: Session):
        results = (
            db.query(
                InventoryTransaction.transaction_type.label("transaction_type"),
                func.count(InventoryTransaction.id).label("transaction_count"),
                func.sum(InventoryTransaction.quantity).label("total_quantity_moved")
            )
            .group_by(InventoryTransaction.transaction_type)
            .all()
        )
        return [
            {
                "transaction_type": r.transaction_type,
                "transaction_count": r.transaction_count or 0,
                "total_quantity_moved": r.total_quantity_moved or 0
            }
            for r in results
        ]


service = AnalyticsService()
