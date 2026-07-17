from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.permissions.dependencies import require_roles
from app.permissions.roles import UserRole
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
from app.schemas.inventory_transaction import InventoryTransactionResponse
from app.services.inventory_transaction_service import service as transaction_service

from app.services.inventory_service import service


router = APIRouter(
    prefix="/inventory",
    tags=["Inventory"]
)

can_read_inventory = require_roles(
    UserRole.ADMIN,
    UserRole.STORE_MANAGER,
    UserRole.STAFF,
    UserRole.VIEWER,
)
can_manage_inventory = require_roles(
    UserRole.ADMIN,
    UserRole.STORE_MANAGER,
    UserRole.STAFF,
)


@router.post(
    "",
    response_model=InventoryResponse,
    status_code=201,
    dependencies=[Depends(can_manage_inventory)]
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
    response_model=list[InventoryResponse],
    dependencies=[Depends(can_read_inventory)]
)
def get_all_inventory(
    db: Session = Depends(get_db)
):

    return service.get_all_inventory(db)


@router.get(
    "/product/{product_id}",
    response_model=InventoryResponse,
    include_in_schema=False,
    dependencies=[Depends(can_read_inventory)]
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
    response_model=InventoryResponse,
    dependencies=[Depends(can_manage_inventory)]
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
    response_model=InventoryResponse,
    dependencies=[Depends(can_manage_inventory)]
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
    response_model=list[LowStockResponse],
    dependencies=[Depends(can_read_inventory)]
)
def get_low_stock(
    db: Session = Depends(get_db)
):
    return service.get_low_stock(db)


@router.get(
    "/out-of-stock",
    response_model=list[OutOfStockResponse],
    dependencies=[Depends(can_read_inventory)]
)
def get_out_of_stock(
    db: Session = Depends(get_db)
):
    return service.get_out_of_stock(db)


@router.get(
    "/dashboard",
    response_model=InventoryDashboardResponse,
    dependencies=[Depends(can_read_inventory)]
)
def get_dashboard(
    db: Session = Depends(get_db)
):
    return service.get_dashboard_stats(db)


@router.get(
    "/transactions",
    response_model=list[InventoryTransactionResponse],
    dependencies=[Depends(can_read_inventory)]
)
def get_transaction_history(
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """
    Fetch global stock transaction history.
    Defined before /{product_id} to avoid routing conflict.
    """
    return transaction_service.get_transaction_history(db, limit=limit, offset=offset)


@router.get(
    "/transactions/{product_id}",
    response_model=list[InventoryTransactionResponse],
    dependencies=[Depends(can_read_inventory)]
)
def get_product_transaction_history(
    product_id: int,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """
    Fetch stock transaction history for a specific product.
    """
    return transaction_service.get_product_transaction_history(
        db,
        product_id,
        limit=limit,
        offset=offset
    )


@router.get(
    "/{product_id}",
    response_model=InventoryResponse,
    dependencies=[Depends(can_read_inventory)]
)
def get_inventory_by_product_id(
    product_id: int,
    db: Session = Depends(get_db)
):

    return service.get_inventory_by_product(
        db,
        product_id
    )
