from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.permissions.dependencies import require_roles
from app.permissions.roles import UserRole
from app.analytics.schemas import (
    DashboardSummaryResponse,
    SalesAnalyticsResponse,
    PurchaseAnalyticsResponse,
    InventoryAnalyticsResponse,
    TransactionAnalyticsResponse,
    TopSellingProductResponse,
    TopDemandProductResponse,
    LowStockResponse,
    ProfitResponse,
)
from app.analytics.service import service

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)

can_read_analytics = require_roles(
    UserRole.ADMIN,
    UserRole.STORE_MANAGER,
    UserRole.STAFF,
    UserRole.VIEWER,
)


@router.get(
    "/dashboard",
    response_model=DashboardSummaryResponse,
    dependencies=[Depends(can_read_analytics)]
)
def get_dashboard_summary(db: Session = Depends(get_db)):
    """
    Get the overall inventory intelligence dashboard summary.
    """
    return service.dashboard(db)


@router.get(
    "/sales",
    response_model=list[SalesAnalyticsResponse],
    dependencies=[Depends(can_read_analytics)]
)
def get_sales_analytics(db: Session = Depends(get_db)):
    """
    Get sales analytics per product (total quantity sold and revenue),
    sorted by revenue highest first.
    """
    return service.sales(db)


@router.get(
    "/purchases",
    response_model=list[PurchaseAnalyticsResponse],
    dependencies=[Depends(can_read_analytics)]
)
def get_purchase_analytics(db: Session = Depends(get_db)):
    """
    Get purchase analytics per product (total purchased quantity and spend),
    sorted by spend highest first.
    """
    return service.purchases(db)


@router.get(
    "/inventory",
    response_model=list[InventoryAnalyticsResponse],
    dependencies=[Depends(can_read_analytics)]
)
def get_inventory_analytics(db: Session = Depends(get_db)):
    """
    Get current stock metrics and inventory values for every product.
    """
    return service.inventory(db)


@router.get(
    "/transactions",
    response_model=list[TransactionAnalyticsResponse],
    dependencies=[Depends(can_read_analytics)]
)
def get_transaction_analytics(db: Session = Depends(get_db)):
    """
    Get transaction counts and quantities grouped by business type.
    """
    return service.transactions(db)


@router.get(
    "/top-selling",
    response_model=list[TopSellingProductResponse],
    dependencies=[Depends(can_read_analytics)]
)
def get_top_selling_products(db: Session = Depends(get_db)):
    """
    Get the top 10 selling products based on total quantity sold.
    """
    return service.top_selling(db)


@router.get(
    "/top-demand",
    response_model=list[TopDemandProductResponse],
    dependencies=[Depends(can_read_analytics)]
)
def get_top_demand_products(db: Session = Depends(get_db)):
    """
    Get the top 10 products sorted by their global demand score.
    """
    return service.top_demand(db)


@router.get(
    "/low-stock",
    response_model=list[LowStockResponse],
    dependencies=[Depends(can_read_analytics)]
)
def get_low_stock_products(db: Session = Depends(get_db)):
    """
    Get products that are currently low on stock (stock <= minimum).
    """
    return service.low_stock(db)


@router.get(
    "/profit",
    response_model=ProfitResponse,
    dependencies=[Depends(can_read_analytics)]
)
def get_profit_report(db: Session = Depends(get_db)):
    """
    Get the today and total overall business profit report.
    """
    return service.profit(db)
