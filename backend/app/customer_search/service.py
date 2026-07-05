from sqlalchemy.orm import Session

from app.customer_search.models import CustomerSearch
from app.customer_search.repository import repository
from app.customer_search.schemas import (
    CustomerSearchCreate,
    CustomerSearchResponse,
    SearchProductInfo,
    SearchHistoryResponse,
    FailedSearchResponse,
    TopProductResponse,
    TopFailedProductResponse,
    CityAnalyticsResponse,
    AreaAnalyticsResponse,
)
from app.services.product_service import ProductService

product_service = ProductService()


class CustomerSearchService:

    def search_product(
        self,
        db: Session,
        request: CustomerSearchCreate,
    ) -> CustomerSearchResponse:
        products = product_service.get_products(
            db=db,
            search=request.keyword,
            limit=1,
        )
        product = products[0] if products else None

        if product:
            search_record = CustomerSearch(
                searched_keyword=request.keyword,
                searched_product=product.product_name,
                city=request.city,
                state=request.state,
                area=request.area,
                latitude=request.latitude,
                longitude=request.longitude,
                device=request.device,
                found=True,
            )
            saved = repository.create_search(db, search_record)

            return CustomerSearchResponse(
                message="Product found",
                found=True,
                product=SearchProductInfo(
                    id=product.id,
                    name=product.product_name,
                ),
                search_id=saved.id,
            )

        search_record = CustomerSearch(
            searched_keyword=request.keyword,
            searched_product=None,
            city=request.city,
            state=request.state,
            area=request.area,
            latitude=request.latitude,
            longitude=request.longitude,
            device=request.device,
            found=False,
        )
        saved = repository.create_search(db, search_record)

        return CustomerSearchResponse(
            message="Product not found",
            found=False,
            product=None,
            search_id=saved.id,
        )

    def get_search_history(self, db: Session) -> list[SearchHistoryResponse]:
        records = repository.get_search_history(db)
        return [SearchHistoryResponse.model_validate(r) for r in records]

    def get_failed_searches(self, db: Session) -> list[FailedSearchResponse]:
        records = repository.get_failed_searches(db)
        return [FailedSearchResponse.model_validate(r) for r in records]

    def get_top_products(self, db: Session, limit: int = 10) -> list[TopProductResponse]:
        if limit <= 0:
            limit = 10
        records = repository.get_top_products(db, limit=limit)
        return [TopProductResponse.model_validate(r) for r in records]

    def get_top_failed_products(self, db: Session, limit: int = 10) -> list[TopFailedProductResponse]:
        if limit <= 0:
            limit = 10
        records = repository.get_top_failed_products(db, limit=limit)
        return [TopFailedProductResponse.model_validate(r) for r in records]

    def get_city_analytics(self, db: Session) -> list[CityAnalyticsResponse]:
        records = repository.get_city_analytics(db)
        return [CityAnalyticsResponse.model_validate(r) for r in records]

    def get_area_analytics(self, db: Session) -> list[AreaAnalyticsResponse]:
        records = repository.get_area_analytics(db)
        return [AreaAnalyticsResponse.model_validate(r) for r in records]


service = CustomerSearchService()

