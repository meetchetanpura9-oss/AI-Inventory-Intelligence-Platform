from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.schemas.analytics import (
    DashboardStatsResponse,
    ProductSalesAnalytics,
    ProductPurchasesAnalytics,
    ProductInventoryAnalytics,
    TransactionTypeAnalytics
)
from app.services.analytics_service import service

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("/dashboard", response_model=DashboardStatsResponse)
def get_dashboard_stats(db: Session = Depends(get_db)):
    return service.get_dashboard_stats(db)


@router.get("/sales", response_model=list[ProductSalesAnalytics])
def get_sales_analytics(db: Session = Depends(get_db)):
    return service.get_sales_analytics(db)


@router.get("/purchases", response_model=list[ProductPurchasesAnalytics])
def get_purchases_analytics(db: Session = Depends(get_db)):
    return service.get_purchases_analytics(db)


@router.get("/inventory", response_model=list[ProductInventoryAnalytics])
def get_inventory_analytics(db: Session = Depends(get_db)):
    return service.get_inventory_analytics(db)


@router.get("/transactions", response_model=list[TransactionTypeAnalytics])
def get_transactions_analytics(db: Session = Depends(get_db)):
    return service.get_transactions_analytics(db)
