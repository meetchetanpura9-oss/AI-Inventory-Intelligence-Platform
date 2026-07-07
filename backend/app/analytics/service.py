from sqlalchemy.orm import Session

from app.analytics.repository import repository


class AnalyticsService:

    def dashboard(self, db: Session):
        """
        Calculates and returns the overall dashboard summary KPIs.
        """
        return repository.get_dashboard_summary(db)

    def sales(self, db: Session):
        """
        Returns sales analytics aggregated per product.
        """
        results = repository.get_sales_analytics(db)
        return [
            {
                "product_id": r.product_id,
                "product_name": r.product_name,
                "total_quantity_sold": r.total_quantity_sold or 0,
                "total_revenue": r.total_revenue or 0.0
            }
            for r in results
        ]

    def purchases(self, db: Session):
        """
        Returns purchase analytics aggregated per product.
        """
        results = repository.get_purchase_analytics(db)
        return [
            {
                "product_id": r.product_id,
                "product_name": r.product_name,
                "purchased_quantity": r.purchased_quantity or 0,
                "total_spend": r.total_spend or 0.0
            }
            for r in results
        ]

    def inventory(self, db: Session):
        """
        Returns inventory metrics for every product.
        """
        results = repository.get_inventory_analytics(db)
        return [
            {
                "product_id": r.product_id,
                "product_name": r.product_name,
                "current_stock": r.current_stock or 0,
                "minimum_stock": r.minimum_stock or 0,
                "maximum_stock": r.maximum_stock or 0,
                "inventory_value": r.inventory_value or 0.0
            }
            for r in results
        ]

    def transactions(self, db: Session):
        """
        Groups and formats transactions by standard business types:
        PURCHASE (IN), SALE (OUT), and ADJUSTMENT.
        """
        db_results = repository.get_transaction_analytics(db)
        results_dict = {r.transaction_type: r for r in db_results}

        mapped_types = [
            ("IN", "PURCHASE"),
            ("OUT", "SALE"),
            ("ADJUSTMENT", "ADJUSTMENT")
        ]

        analytics_list = []
        for db_type, display_type in mapped_types:
            if db_type in results_dict:
                res = results_dict[db_type]
                analytics_list.append({
                    "transaction_type": display_type,
                    "transaction_count": res.transaction_count or 0,
                    "total_quantity_moved": res.total_quantity_moved or 0
                })
            else:
                analytics_list.append({
                    "transaction_type": display_type,
                    "transaction_count": 0,
                    "total_quantity_moved": 0
                })

        return analytics_list

    def top_selling(self, db: Session):
        """
        Returns the top 10 selling products based on total quantity sold.
        """
        results = repository.get_top_selling_products(db, limit=10)
        return [
            {
                "product_id": r.product_id,
                "product_name": r.product_name,
                "quantity_sold": r.quantity_sold or 0,
                "total_revenue": r.total_revenue or 0.0
            }
            for r in results
        ]

    def top_demand(self, db: Session):
        """
        Returns the top 10 highest demand products based on global demand scores.
        """
        results = repository.get_top_demand_products(db, limit=10)
        return [
            {
                "product_id": r.product_id,
                "product_name": r.product_name,
                "demand_score": r.demand_score or 0.0,
                "demand_level": r.demand_level or "LOW"
            }
            for r in results
        ]

    def low_stock(self, db: Session):
        """
        Returns products that are at or below their minimum stock levels.
        """
        results = repository.get_low_stock_products(db)
        return [
            {
                "product_id": r.product_id,
                "product_name": r.product_name,
                "current_stock": r.current_stock or 0,
                "minimum_stock": r.minimum_stock or 0
            }
            for r in results
        ]

    def profit(self, db: Session):
        """
        Returns today's and all-time profit reports.
        """
        return repository.get_profit_report(db)


service = AnalyticsService()
