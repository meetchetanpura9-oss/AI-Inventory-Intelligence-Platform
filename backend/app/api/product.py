from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.permissions.dependencies import require_roles
from app.permissions.roles import UserRole
from app.schemas.product import ProductCreate, ProductResponse
from app.services.product_service import ProductService

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)

service = ProductService()

can_read_products = require_roles(
    UserRole.ADMIN,
    UserRole.STORE_MANAGER,
    UserRole.STAFF,
    UserRole.VIEWER,
)
can_manage_products = require_roles(UserRole.ADMIN, UserRole.STORE_MANAGER)
can_delete_products = require_roles(UserRole.ADMIN)


@router.post(
    "",
    response_model=ProductResponse,
    status_code=201,
    dependencies=[Depends(can_manage_products)]
)
def create_product(
    request: ProductCreate,
    db: Session = Depends(get_db)
):
    return service.create_product(db, request)



@router.get(
    "",
    response_model=list[ProductResponse],
    dependencies=[Depends(can_read_products)]
)
def get_products(
    search: str | None = None,
    category: str | None = None,
    brand: str | None = None,
    limit: int = 10,
    offset: int = 0,
    sort_by: str = "id",
    sort_order: str = "asc",
    db: Session = Depends(get_db)
):
    return service.get_products(
        db=db,
        search=search,
        category=category,
        brand=brand,
        limit=limit,
        offset=offset,
        sort_by=sort_by,
        sort_order=sort_order
    )

@router.get(
    "/{product_id}",
    response_model=ProductResponse,
    dependencies=[Depends(can_read_products)]
)
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    return service.get_product(db, product_id)


@router.put(
    "/{product_id}",
    response_model=ProductResponse,
    dependencies=[Depends(can_manage_products)]
)
def update_product(
    product_id: int,
    request: ProductCreate,
    db: Session = Depends(get_db)
):
    return service.update_product(db, product_id, request)


@router.delete(
    "/{product_id}",
    dependencies=[Depends(can_delete_products)]
)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    return service.delete_product(db, product_id)
