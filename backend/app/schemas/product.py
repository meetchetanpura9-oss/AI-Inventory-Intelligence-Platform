from pydantic import BaseModel


class ProductCreate(BaseModel):

    sku: str

    product_name: str

    brand: str | None = None

    category: str | None = None

    subcategory: str | None = None

    unit: str | None = None

    mrp: float | None = None

    selling_price: float

    cost_price: float | None = None


class ProductResponse(ProductCreate):

    id: int

    class Config:
        from_attributes = True