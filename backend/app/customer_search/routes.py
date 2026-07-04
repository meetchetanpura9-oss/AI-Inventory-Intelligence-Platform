from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.customer_search.schemas import CustomerSearchCreate, CustomerSearchResponse
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
