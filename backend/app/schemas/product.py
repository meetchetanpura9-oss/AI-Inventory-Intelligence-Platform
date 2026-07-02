from datetime import datetime
from pydantic import BaseModel, Field, field_validator, model_validator


class ProductCreate(BaseModel):

    sku: str = Field(
        ...,
        min_length=3,
        max_length=20,
        description="Unique SKU of the product"
    )

    product_name: str = Field(
        ...,
        min_length=3,
        max_length=100,
        description="Product Name"
    )

    brand: str | None = Field(
        default=None,
        min_length=2,
        max_length=50
    )

    category: str | None = Field(
        default=None,
        min_length=2,
        max_length=50
    )

    subcategory: str | None = Field(
        default=None,
        min_length=2,
        max_length=50
    )

    unit: str | None = Field(
        default=None,
        min_length=1,
        max_length=20
    )

    mrp: float | None = Field(
        default=None,
        gt=0,
        description="Maximum Retail Price"
    )

    selling_price: float = Field(
        ...,
        gt=0,
        description="Selling Price"
    )

    cost_price: float | None = Field(
        default=None,
        gt=0,
        description="Cost Price"
    )

    # --------------------------
    # SKU Validation
    # --------------------------

    @field_validator("sku")
    @classmethod
    def validate_sku(cls, value: str):

        value = value.strip().upper()

        if " " in value:
            raise ValueError("SKU cannot contain spaces.")

        return value

    # --------------------------
    # Product Name Validation
    # --------------------------

    @field_validator("product_name")
    @classmethod
    def validate_product_name(cls, value: str):

        return value.strip()

    # --------------------------
    # Business Validation
    # --------------------------

    @model_validator(mode="after")
    def validate_prices(self):

        if self.mrp is not None:

            if self.selling_price > self.mrp:
                raise ValueError(
                    "Selling Price cannot be greater than MRP."
                )

        if self.cost_price is not None:

            if self.cost_price > self.selling_price:
                raise ValueError(
                    "Cost Price cannot be greater than Selling Price."
                )

        return self


class ProductResponse(ProductCreate):

    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True