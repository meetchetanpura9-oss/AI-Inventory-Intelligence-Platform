from datetime import datetime
from pydantic import BaseModel, Field


class SaleBase(BaseModel):
    product_id: int
    quantity: int = Field(
        ...,
        gt=0,
        description="Quantity must be greater than zero"
    )
    selling_price: float = Field(
        ...,
        ge=0.0,
        description="Selling price must be greater than or equal to zero"
    )
    customer_name: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Customer name cannot be empty"
    )


class SaleCreate(SaleBase):
    pass


class SaleResponse(SaleBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
