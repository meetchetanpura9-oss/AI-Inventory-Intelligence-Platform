from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.schemas.product import ProductCreate, ProductResponse
from app.services.product_service import ProductService

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)

service = ProductService()


@router.post("/", response_model=ProductResponse, status_code=201)
def create_product(
    request: ProductCreate,
    db: Session = Depends(get_db)
):
    return service.create_product(db, request)



@router.get("/", response_model=list[ProductResponse])
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

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    return service.get_product(db, product_id)


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    request: ProductCreate,
    db: Session = Depends(get_db)
):
    return service.update_product(db, product_id, request)


@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    return service.delete_product(db, product_id)