from datetime import datetime
from pydantic import BaseModel, Field


class PurchaseBase(BaseModel):
    product_id: int
    quantity: int = Field(
        ...,
        gt=0,
        description="Quantity must be greater than zero"
    )
    cost_price: float = Field(
        ...,
        gt=0.0,
        description="Cost price must be greater than zero"
    )
    supplier_name: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Supplier name cannot be empty"
    )


class PurchaseCreate(PurchaseBase):
    pass


class ProductInfo(BaseModel):
    id: int
    product_name: str
    sku: str

    class Config:
        from_attributes = True


class PurchaseResponse(PurchaseBase):
    id: int
    created_at: datetime
    product: ProductInfo | None = None

    class Config:
        from_attributes = True
