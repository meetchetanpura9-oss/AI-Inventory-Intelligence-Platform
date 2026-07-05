from pydantic import BaseModel


class DashboardStatsResponse(BaseModel):
    total_products: int
    total_stock: int
    low_stock_items: int
    out_of_stock_items: int
    inventory_value: float
    sales_today: float
    purchase_today: float
    profit: float


class ProductSalesAnalytics(BaseModel):
    product_id: int
    product_name: str
    total_quantity_sold: int
    total_revenue: float


class ProductPurchasesAnalytics(BaseModel):
    product_id: int
    product_name: str
    total_quantity_purchased: int
    total_spend: float


class ProductInventoryAnalytics(BaseModel):
    product_id: int
    product_name: str
    quantity: int
    minimum_stock: int
    maximum_stock: int
    inventory_value: float


class TransactionTypeAnalytics(BaseModel):
    transaction_type: str
    transaction_count: int
    total_quantity_moved: int
