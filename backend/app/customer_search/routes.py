from fastapi import APIRouter, Depends, Query, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.customer_search.schemas import (
    CustomerSearchCreate,
    CustomerSearchResponse,
    SearchHistoryResponse,
    FailedSearchResponse,
    TopProductResponse,
    TopFailedProductResponse,
    CityAnalyticsResponse,
    AreaAnalyticsResponse,
)
from app.customer_search.service import service
from app.database.dependencies import get_db

router = APIRouter(tags=["Customer Search"])


@router.post(
    "/search",
    response_model=CustomerSearchResponse,
    responses={
        status.HTTP_404_NOT_FOUND: {"model": CustomerSearchResponse},
    },
)
def search_product(
    request: CustomerSearchCreate,
    db: Session = Depends(get_db),
):
    result = service.search_product(db, request)
    status_code = status.HTTP_200_OK if result.found else status.HTTP_404_NOT_FOUND
    return JSONResponse(
        status_code=status_code,
        content=result.model_dump(mode="json"),
    )


@router.get(
    "/search/history",
    response_model=list[SearchHistoryResponse],
)
def get_search_history(
    db: Session = Depends(get_db),
):
    return service.get_search_history(db)


@router.get(
    "/search/failed",
    response_model=list[FailedSearchResponse],
)
def get_failed_searches(
    db: Session = Depends(get_db),
):
    return service.get_failed_searches(db)


@router.get(
    "/search/top-products",
    response_model=list[TopProductResponse],
)
def get_top_products(
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return service.get_top_products(db, limit=limit)


@router.get(
    "/search/top-failed",
    response_model=list[TopFailedProductResponse],
)
def get_top_failed_products(
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return service.get_top_failed_products(db, limit=limit)


@router.get(
    "/search/cities",
    response_model=list[CityAnalyticsResponse],
)
def get_city_analytics(
    db: Session = Depends(get_db),
):
    return service.get_city_analytics(db)


@router.get(
    "/search/areas",
    response_model=list[AreaAnalyticsResponse],
)
def get_area_analytics(
    db: Session = Depends(get_db),
):
    return service.get_area_analytics(db)

