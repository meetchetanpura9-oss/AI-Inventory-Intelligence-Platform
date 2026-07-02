from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    DateTime,
    Index,
    func
)

from app.database.base import Base


class Product(Base):

    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    sku = Column(String(50), unique=True, nullable=False)

    barcode = Column(String(50), unique=True)

    product_name = Column(String(255), nullable=False)

    brand = Column(String(100))

    category = Column(String(100))

    subcategory = Column(String(100))

    unit = Column(String(30))

    mrp = Column(Float)

    selling_price = Column(Float, nullable=False)

    cost_price = Column(Float)

    is_active = Column(Boolean, default=True)

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    __table_args__ = (
        Index("ix_products_product_name", "product_name"),
        Index("ix_products_brand", "brand"),
        Index("ix_products_category", "category"),
    )