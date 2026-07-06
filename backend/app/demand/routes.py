from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.demand.schemas import ProductDemandCalculateResponse, ProductDemandResponse
from app.demand.service import service

router = APIRouter(prefix="/demand", tags=["Demand Intelligence"])


@router.post(
    "/calculate",
    response_model=ProductDemandCalculateResponse,
    status_code=status.HTTP_200_OK,
)
def calculate_demand(db: Session = Depends(get_db)):
    """
    Calculate and store demand scores for all products, globally and per city/area where search traffic is present.
    """
    return service.calculate_all_demands(db)


@router.get(
    "",
    response_model=List[ProductDemandResponse],
    status_code=status.HTTP_200_OK,
)
def get_all_demands(
    city: Optional[str] = Query(default=None, description="Filter by city (default None returns global demands)"),
    area: Optional[str] = Query(default=None, description="Filter by area (default None returns global demands)"),
    db: Session = Depends(get_db),
):
    """
    List all product demand records, with optional filtering by city and area.
    """
    return service.get_all_demands(db, city=city, area=area)


@router.get(
    "/high",
    response_model=List[ProductDemandResponse],
    status_code=status.HTTP_200_OK,
)
def get_high_demand_products(
    city: Optional[str] = Query(default=None, description="Filter by city (default None returns global demands)"),
    area: Optional[str] = Query(default=None, description="Filter by area (default None returns global demands)"),
    db: Session = Depends(get_db),
):
    """
    List products classified as HIGH demand.
    """
    return service.get_high_demand_products(db, city=city, area=area)


@router.get(
    "/low",
    response_model=List[ProductDemandResponse],
    status_code=status.HTTP_200_OK,
)
def get_low_demand_products(
    city: Optional[str] = Query(default=None, description="Filter by city (default None returns global demands)"),
    area: Optional[str] = Query(default=None, description="Filter by area (default None returns global demands)"),
    db: Session = Depends(get_db),
):
    """
    List products classified as LOW demand.
    """
    return service.get_low_demand_products(db, city=city, area=area)


@router.get(
    "/{product_id}",
    response_model=ProductDemandResponse,
    status_code=status.HTTP_200_OK,
)
def get_product_demand(
    product_id: int,
    city: Optional[str] = Query(default=None, description="Filter by city (default None returns global demands)"),
    area: Optional[str] = Query(default=None, description="Filter by area (default None returns global demands)"),
    db: Session = Depends(get_db),
):
    """
    Retrieve demand details for a single product.
    """
    demand = service.get_product_demand(db, product_id=product_id, city=city, area=area)
    if not demand:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Demand record not found for this product/location combination."
        )
    return demand
