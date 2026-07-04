from sqlalchemy.orm import Session

from app.customer_search.models import CustomerSearch
from app.customer_search.repository import repository
from app.customer_search.schemas import CustomerSearchCreate, CustomerSearchResponse, SearchProductInfo
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


service = CustomerSearchService()
