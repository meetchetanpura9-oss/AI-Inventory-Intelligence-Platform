from pydantic import BaseModel


class DashboardSummaryResponse(BaseModel):
    total_products: int
    total_stock: int
    inventory_value: float
    sales_today: float
    purchase_today: float
    profit: float
    low_stock_items: int
    out_of_stock_items: int

    class Config:
        from_attributes = True


class SalesAnalyticsResponse(BaseModel):
    product_id: int
    product_name: str
    total_quantity_sold: int
    total_revenue: float

    class Config:
        from_attributes = True


class PurchaseAnalyticsResponse(BaseModel):
    product_id: int
    product_name: str
    purchased_quantity: int
    total_spend: float

    class Config:
        from_attributes = True


class InventoryAnalyticsResponse(BaseModel):
    product_id: int
    product_name: str
    current_stock: int
    minimum_stock: int
    maximum_stock: int
    inventory_value: float

    class Config:
        from_attributes = True


class TransactionAnalyticsResponse(BaseModel):
    transaction_type: str
    transaction_count: int
    total_quantity_moved: int

    class Config:
        from_attributes = True


class TopSellingProductResponse(BaseModel):
    product_id: int
    product_name: str
    quantity_sold: int
    total_revenue: float

    class Config:
        from_attributes = True


class TopDemandProductResponse(BaseModel):
    product_id: int
    product_name: str
    demand_score: float
    demand_level: str

    class Config:
        from_attributes = True


class LowStockResponse(BaseModel):
    product_id: int
    product_name: str
    current_stock: int
    minimum_stock: int

    class Config:
        from_attributes = True


class ProfitResponse(BaseModel):
    today_profit: float
    total_profit: float

    class Config:
        from_attributes = True
