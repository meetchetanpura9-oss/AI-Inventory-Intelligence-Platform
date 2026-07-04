import uuid

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    Index,
    String,
    func,
)
from sqlalchemy.dialects.postgresql import UUID

from app.database.base import Base


class CustomerSearch(Base):

    __tablename__ = "customer_searches"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    customer_id = Column(
        UUID(as_uuid=True),
        nullable=True,
    )

    searched_keyword = Column(
        String(255),
        nullable=False,
    )

    searched_product = Column(
        String(255),
        nullable=True,
    )

    city = Column(
        String(100),
        nullable=True,
    )

    state = Column(
        String(100),
        nullable=True,
    )

    area = Column(
        String(100),
        nullable=True,
    )

    latitude = Column(
        Float,
        nullable=True,
    )

    longitude = Column(
        Float,
        nullable=True,
    )

    dark_store_id = Column(
        UUID(as_uuid=True),
        nullable=True,
    )

    found = Column(
        Boolean,
        nullable=False,
    )

    weather = Column(
        String(50),
        nullable=True,
    )

    festival = Column(
        String(100),
        nullable=True,
    )

    temperature = Column(
        Float,
        nullable=True,
    )

    device = Column(
        String(50),
        nullable=True,
    )

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )

    __table_args__ = (
        Index("idx_customer_searches_searched_keyword", "searched_keyword"),
        Index("idx_customer_searches_city", "city"),
        Index("idx_customer_searches_created_at", "created_at"),
        Index("idx_customer_searches_found", "found"),
    )
