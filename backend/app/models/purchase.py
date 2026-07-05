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


class Purchase(Base):

    __tablename__ = "purchases"

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

    cost_price = Column(
        Float,
        nullable=False
    )

    supplier_name = Column(
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
        back_populates="purchases"
    )

    __table_args__ = (
        CheckConstraint(
            "quantity > 0",
            name="chk_purchase_quantity"
        ),
        CheckConstraint(
            "cost_price > 0",
            name="chk_purchase_cost_price"
        ),
        Index(
            "idx_purchases_product_id",
            "product_id"
        ),
        Index(
            "idx_purchases_supplier_name",
            "supplier_name"
        ),
        Index(
            "idx_purchases_created_at",
            "created_at"
        ),
    )
