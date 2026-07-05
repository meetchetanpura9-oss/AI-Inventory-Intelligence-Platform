from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    ForeignKey,
    DateTime,
    CheckConstraint,
    Index,
    func
)
from sqlalchemy.orm import relationship

from app.database.base import Base


class InventoryTransaction(Base):

    __tablename__ = "inventory_transactions"

    id = Column(Integer, primary_key=True, index=True)

    product_id = Column(
        Integer,
        ForeignKey("products.id"),
        nullable=False
    )

    transaction_type = Column(
        String(20),
        nullable=False
    )

    quantity = Column(
        Integer,
        nullable=False
    )

    reference = Column(
        String(100),
        nullable=True
    )

    remarks = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False
    )

    # Relationships
    product = relationship(
        "Product",
        back_populates="transactions"
    )

    __table_args__ = (
        CheckConstraint(
            "transaction_type IN ('IN', 'OUT', 'ADJUSTMENT')",
            name="chk_transaction_type"
        ),
        CheckConstraint(
            "quantity > 0",
            name="chk_transaction_quantity"
        ),
        Index(
            "idx_inv_trans_product_id",
            "product_id"
        ),
        Index(
            "idx_inv_trans_reference",
            "reference"
        ),
        Index(
            "idx_inv_trans_created_at",
            "created_at"
        ),
    )
