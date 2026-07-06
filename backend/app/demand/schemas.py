from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class ProductInfoSchema(BaseModel):
    id: int
    product_name: str
    sku: str

    class Config:
        from_attributes = True


class ProductDemandResponse(BaseModel):
    id: UUID
    product_id: int
    city: str | None = None
    area: str | None = None
    search_count: int
    failed_searches: int
    sales_count: int
    purchase_count: int
    current_stock: int
    demand_score: float
    demand_level: str
    updated_at: datetime
    product: ProductInfoSchema | None = None

    class Config:
        from_attributes = True


class ProductDemandCalculateResponse(BaseModel):
    status: str
    records_calculated: int
