from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.core.exceptions import InsufficientStockException

from app.models.inventory import Inventory

from app.schemas.inventory import (
    InventoryCreate,
    InventoryResponse,
    AddStockRequest,
    LowStockResponse,
    OutOfStockResponse,
    InventoryDashboardResponse
)

from app.services.inventory_service import service


router = APIRouter(
    prefix="/inventory",
    tags=["Inventory"]
)


@router.post(
    "",
    response_model=InventoryResponse,
    status_code=201
)
def create_inventory(
    inventory: InventoryCreate,
    db: Session = Depends(get_db)
):

    db_inventory = Inventory(**inventory.model_dump())

    return service.create_inventory(
        db,
        db_inventory
    )


@router.get(
    "",
    response_model=list[InventoryResponse]
)
def get_all_inventory(
    db: Session = Depends(get_db)
):

    return service.get_all_inventory(db)


@router.get(
    "/product/{product_id}",
    response_model=InventoryResponse,
    include_in_schema=False
)
def get_inventory(
    product_id: int,
    db: Session = Depends(get_db)
):

    return service.get_inventory_by_product(
        db,
        product_id
    )


@router.post(
    "/add-stock/{product_id}",
    response_model=InventoryResponse
)
def add_stock(
    product_id: int,
    request: AddStockRequest,
    db: Session = Depends(get_db)
):
    return service.add_stock(
        db,
        product_id,
        request.quantity,
        request.reference,
        request.remarks
    )


@router.post(
    "/remove-stock/{product_id}",
    response_model=InventoryResponse
)
def remove_stock(
    product_id: int,
    request: AddStockRequest,
    db: Session = Depends(get_db)
):
    try:
        return service.remove_stock(
            db,
            product_id,
            request.quantity,
            request.reference,
            request.remarks
        )
    except InsufficientStockException:
        return JSONResponse(
            status_code=400,
            content={"detail": "Insufficient stock"}
        )


@router.get(
    "/low-stock",
    response_model=list[LowStockResponse]
)
def get_low_stock(
    db: Session = Depends(get_db)
):
    return service.get_low_stock(db)


@router.get(
    "/out-of-stock",
    response_model=list[OutOfStockResponse]
)
def get_out_of_stock(
    db: Session = Depends(get_db)
):
    return service.get_out_of_stock(db)


@router.get(
    "/dashboard",
    response_model=InventoryDashboardResponse
)
def get_dashboard(
    db: Session = Depends(get_db)
):
    return service.get_dashboard_stats(db)


@router.get(
    "/{product_id}",
    response_model=InventoryResponse
)
def get_inventory_by_product_id(
    product_id: int,
    db: Session = Depends(get_db)
):

    return service.get_inventory_by_product(
        db,
        product_id
    )
