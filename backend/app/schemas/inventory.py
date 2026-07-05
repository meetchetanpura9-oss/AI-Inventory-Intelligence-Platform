from datetime import datetime
from pydantic import BaseModel, Field


class InventoryCreate(BaseModel):
    product_id: int
    quantity: int = 0
    minimum_stock: int = 10
    maximum_stock: int = 100


class InventoryResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    minimum_stock: int
    maximum_stock: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AddStockRequest(BaseModel):
    quantity: int = Field(
        ...,
        gt=0,
        description="Quantity to add"
    )
    reference: str | None = Field(default=None, max_length=100)
    remarks: str | None = Field(default=None)


class LowStockResponse(BaseModel):
    product: str
    quantity: int

    class Config:
        from_attributes = True


class OutOfStockResponse(BaseModel):
    product: str

    class Config:
        from_attributes = True


class InventoryDashboardResponse(BaseModel):
    total_products: int
    total_stock: int
    low_stock_items: int
    out_of_stock_items: int

    class Config:
        from_attributes = True