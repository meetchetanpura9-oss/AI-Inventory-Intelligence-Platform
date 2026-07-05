from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.core.exceptions import InsufficientStockException, ProductNotFoundException
from app.schemas.sale import SaleCreate, SaleResponse
from app.services.sale_service import service

router = APIRouter(
    prefix="/sales",
    tags=["Sales"]
)


@router.post("", response_model=SaleResponse, status_code=201)
def create_sale(
    request: SaleCreate,
    db: Session = Depends(get_db)
):
    try:
        return service.create_sale(db, request)
    except InsufficientStockException:
        return JSONResponse(
            status_code=400,
            content={"detail": "Insufficient stock"}
        )
    except ProductNotFoundException:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )


@router.get("", response_model=list[SaleResponse])
def get_sales(
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    return service.get_sales(db, limit=limit, offset=offset)


@router.get("/{sale_id}", response_model=SaleResponse)
def get_sale(
    sale_id: int,
    db: Session = Depends(get_db)
):
    sale = service.get_sale(db, sale_id)
    if not sale:
        raise HTTPException(status_code=404, detail="Sale record not found")
    return sale


@router.get(
    "/product/{product_id}",
    response_model=list[SaleResponse],
    include_in_schema=False
)
def get_product_sales(
    product_id: int,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    return service.get_product_sales(
        db,
        product_id,
        limit=limit,
        offset=offset
    )
