from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    ForeignKey,
    DateTime,
    CheckConstraint,
    Index,
    func
)
from sqlalchemy.orm import relationship

from app.database.base import Base


class Sale(Base):

    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)

    product_id = Column(
        Integer,
        ForeignKey("products.id"),
        nullable=False
    )

    quantity = Column(
        Integer,
        nullable=False
    )

    selling_price = Column(
        Float,
        nullable=False
    )

    customer_name = Column(
        String(100),
        nullable=False
    )

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False
    )

    # Relationships
    product = relationship(
        "Product",
        back_populates="sales"
    )

    __table_args__ = (
        CheckConstraint(
            "quantity > 0",
            name="chk_sale_quantity"
        ),
        CheckConstraint(
            "selling_price >= 0",
            name="chk_sale_selling_price"
        ),
        Index(
            "idx_sales_product_id",
            "product_id"
        ),
        Index(
            "idx_sales_customer_name",
            "customer_name"
        ),
        Index(
            "idx_sales_created_at",
            "created_at"
        ),
    )
