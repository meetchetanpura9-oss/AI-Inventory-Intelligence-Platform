from datetime import datetime
from pydantic import BaseModel, Field


class InventoryTransactionBase(BaseModel):
    product_id: int
    transaction_type: str = Field(
        ...,
        pattern="^(IN|OUT|ADJUSTMENT)$",
        description="Transaction type must be IN, OUT, or ADJUSTMENT"
    )
    quantity: int = Field(
        ...,
        gt=0,
        description="Quantity must be greater than zero"
    )
    reference: str | None = Field(default=None, max_length=100)
    remarks: str | None = Field(default=None)


class InventoryTransactionCreate(InventoryTransactionBase):
    pass


class ProductInfo(BaseModel):
    id: int
    product_name: str
    sku: str

    class Config:
        from_attributes = True


class InventoryTransactionResponse(InventoryTransactionBase):
    id: int
    created_at: datetime
    product: ProductInfo | None = None

    class Config:
        from_attributes = True
