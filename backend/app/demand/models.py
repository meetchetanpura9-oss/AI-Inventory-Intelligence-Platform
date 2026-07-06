import uuid

from sqlalchemy import (
    Column,
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database.base import Base


class ProductDemand(Base):

    __tablename__ = "product_demands"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    product_id = Column(
        Integer,
        ForeignKey("products.id", ondelete="CASCADE"),
        nullable=False,
    )

    city = Column(
        String(100),
        nullable=True,
    )

    area = Column(
        String(100),
        nullable=True,
    )

    search_count = Column(
        Integer,
        default=0,
        nullable=False,
    )

    failed_searches = Column(
        Integer,
        default=0,
        nullable=False,
    )

    sales_count = Column(
        Integer,
        default=0,
        nullable=False,
    )

    purchase_count = Column(
        Integer,
        default=0,
        nullable=False,
    )

    current_stock = Column(
        Integer,
        default=0,
        nullable=False,
    )

    demand_score = Column(
        Float,
        default=0.0,
        nullable=False,
    )

    demand_level = Column(
        String(20),
        default="LOW",
        nullable=False,
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # Relationships
    product = relationship("Product", back_populates="demands")

    __table_args__ = (
        Index("idx_product_demands_product_id", "product_id"),
        Index("idx_product_demands_city", "city"),
        Index("idx_product_demands_demand_level", "demand_level"),
    )
