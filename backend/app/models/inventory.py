from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    DateTime,
    func
)
from sqlalchemy.orm import relationship

from app.database.base import Base


class Inventory(Base):

    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)

    product_id = Column(
        Integer,
        ForeignKey("products.id"),
        unique=True,
        nullable=False,
        index=True
    )

    quantity = Column(Integer, default=0, nullable=False)

    minimum_stock = Column(Integer, default=10, nullable=False)

    maximum_stock = Column(Integer, default=100, nullable=False)

    created_at = Column(
        DateTime,
        server_default=func.now()
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now()
    )

    product = relationship(
        "Product",
        back_populates="inventory"
    )