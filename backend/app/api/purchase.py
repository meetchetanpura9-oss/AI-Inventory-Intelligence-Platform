from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.core.exceptions import ProductNotFoundException
from app.schemas.purchase import PurchaseCreate, PurchaseResponse
from app.services.purchase_service import service

router = APIRouter(
    prefix="/purchase",
    tags=["Purchase"]
)


@router.post("", response_model=PurchaseResponse, status_code=201)
def create_purchase(
    request: PurchaseCreate,
    db: Session = Depends(get_db)
):
    try:
        return service.create_purchase(db, request)
    except ProductNotFoundException:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )


@router.get("", response_model=list[PurchaseResponse])
def get_purchases(
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    return service.get_purchases(db, limit=limit, offset=offset)


@router.get("/{purchase_id}", response_model=PurchaseResponse)
def get_purchase(
    purchase_id: int,
    db: Session = Depends(get_db)
):
    purchase = service.get_purchase(db, purchase_id)
    if not purchase:
        raise HTTPException(status_code=404, detail="Purchase record not found")
    return purchase


@router.get(
    "/product/{product_id}",
    response_model=list[PurchaseResponse],
    include_in_schema=False
)
def get_product_purchases(
    product_id: int,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    return service.get_product_purchases(
        db,
        product_id,
        limit=limit,
        offset=offset
    )
