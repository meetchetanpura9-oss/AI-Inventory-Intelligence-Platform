from fastapi import HTTPException

from app.models.product import Product
from app.repositories.product_repository import ProductRepository

repository = ProductRepository()


class ProductService:

    def create_product(self, db, request):

        product = Product(
            sku=request.sku,
            product_name=request.product_name,
            brand=request.brand,
            category=request.category,
            subcategory=request.subcategory,
            unit=request.unit,
            mrp=request.mrp,
            selling_price=request.selling_price,
            cost_price=request.cost_price
        )

        return repository.create(db, product)

    def get_products(
        self,
        db,
        search=None,
        category=None,
        brand=None,
        limit=10,
        offset=0,
        sort_by="id",
        sort_order="asc"
    ):

        return repository.get_all(
            db=db,
            search=search,
            category=category,
            brand=brand,
            limit=limit,
            offset=offset,
            sort_by=sort_by,
            sort_order=sort_order
        )

    def get_product(self, db, product_id):

        product = repository.get_by_id(db, product_id)

        if not product:
            raise HTTPException(
                status_code=404,
                detail="Product not found"
            )

        return product

    def update_product(self, db, product_id, request):

        product = repository.get_by_id(db, product_id)

        if not product:
            raise HTTPException(
                status_code=404,
                detail="Product not found"
            )

        product.sku = request.sku
        product.product_name = request.product_name
        product.brand = request.brand
        product.category = request.category
        product.subcategory = request.subcategory
        product.unit = request.unit
        product.mrp = request.mrp
        product.selling_price = request.selling_price
        product.cost_price = request.cost_price

        return repository.update(db, product)

    def delete_product(self, db, product_id):

        product = repository.get_by_id(db, product_id)

        if not product:
            raise HTTPException(
                status_code=404,
                detail="Product not found"
            )

        repository.delete(db, product)

        return {
            "message": "Product deleted successfully"
        }