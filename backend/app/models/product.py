from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    DateTime
)

from datetime import datetime

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

    selling_price = Column(Float)

    cost_price = Column(Float)

    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )