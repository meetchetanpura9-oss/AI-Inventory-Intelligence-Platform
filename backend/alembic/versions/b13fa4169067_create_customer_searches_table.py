"""create_customer_searches_table

Revision ID: b13fa4169067
Revises: 1ed61ac487df
Create Date: 2026-07-04 14:09:50.207964

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'b13fa4169067'
down_revision: Union[str, Sequence[str], None] = '1ed61ac487df'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        'customer_searches',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('customer_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('searched_keyword', sa.String(length=255), nullable=False),
        sa.Column('searched_product', sa.String(length=255), nullable=True),
        sa.Column('city', sa.String(length=100), nullable=True),
        sa.Column('state', sa.String(length=100), nullable=True),
        sa.Column('area', sa.String(length=100), nullable=True),
        sa.Column('latitude', sa.Float(), nullable=True),
        sa.Column('longitude', sa.Float(), nullable=True),
        sa.Column('dark_store_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('found', sa.Boolean(), nullable=False),
        sa.Column('weather', sa.String(length=50), nullable=True),
        sa.Column('festival', sa.String(length=100), nullable=True),
        sa.Column('temperature', sa.Float(), nullable=True),
        sa.Column('device', sa.String(length=50), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(
        'idx_customer_searches_searched_keyword',
        'customer_searches',
        ['searched_keyword'],
        unique=False,
    )
    op.create_index(
        'idx_customer_searches_city',
        'customer_searches',
        ['city'],
        unique=False,
    )
    op.create_index(
        'idx_customer_searches_created_at',
        'customer_searches',
        ['created_at'],
        unique=False,
    )
    op.create_index(
        'idx_customer_searches_found',
        'customer_searches',
        ['found'],
        unique=False,
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index('idx_customer_searches_found', table_name='customer_searches')
    op.drop_index('idx_customer_searches_created_at', table_name='customer_searches')
    op.drop_index('idx_customer_searches_city', table_name='customer_searches')
    op.drop_index('idx_customer_searches_searched_keyword', table_name='customer_searches')
    op.drop_table('customer_searches')
