from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.schemas.inventory_transaction import InventoryTransactionResponse
from app.services.inventory_transaction_service import service

router = APIRouter(
    prefix="/inventory/transactions",
    tags=["Inventory Transactions"]
)


@router.get("", response_model=list[InventoryTransactionResponse])
def get_transaction_history(
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    return service.get_transaction_history(db, limit=limit, offset=offset)


@router.get("/{product_id}", response_model=list[InventoryTransactionResponse])
def get_product_transaction_history(
    product_id: int,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    return service.get_product_transaction_history(
        db,
        product_id,
        limit=limit,
        offset=offset
    )
