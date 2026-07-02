from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError

from app.core.exceptions import (
    ProductNotFoundException,
    DuplicateSKUException,
    DatabaseException
)


def register_exception_handlers(app: FastAPI):

    # -----------------------------
    # Product Not Found
    # -----------------------------
    @app.exception_handler(ProductNotFoundException)
    async def product_not_found_handler(
        request: Request,
        exc: ProductNotFoundException
    ):
        return JSONResponse(
            status_code=404,
            content={
                "success": False,
                "message": exc.message,
                "data": None
            }
        )

    # -----------------------------
    # Duplicate SKU
    # -----------------------------
    @app.exception_handler(DuplicateSKUException)
    async def duplicate_sku_handler(
        request: Request,
        exc: DuplicateSKUException
    ):
        return JSONResponse(
            status_code=409,
            content={
                "success": False,
                "message": exc.message,
                "data": None
            }
        )

    # -----------------------------
    # Database Exception
    # -----------------------------
    @app.exception_handler(DatabaseException)
    async def database_handler(
        request: Request,
        exc: DatabaseException
    ):
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": exc.message,
                "data": None
            }
        )

    # -----------------------------
    # Validation Error
    # -----------------------------
    @app.exception_handler(RequestValidationError)
    async def validation_handler(
        request: Request,
        exc: RequestValidationError
    ):
        return JSONResponse(
            status_code=422,
            content={
                "success": False,
                "message": "Validation Failed",
                "errors": exc.errors()
            }
        )

    # -----------------------------
    # HTTP Exception
    # -----------------------------
    @app.exception_handler(HTTPException)
    async def http_handler(
        request: Request,
        exc: HTTPException
    ):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "message": exc.detail,
                "data": None
            }
        )

    # -----------------------------
    # SQLAlchemy Integrity Error
    # -----------------------------
    @app.exception_handler(IntegrityError)
    async def integrity_handler(
        request: Request,
        exc: IntegrityError
    ):
        return JSONResponse(
            status_code=409,
            content={
                "success": False,
                "message": "Database integrity error.",
                "data": None
            }
        )

    # -----------------------------
    # Unexpected Exception
    # -----------------------------
    @app.exception_handler(Exception)
    async def generic_handler(
        request: Request,
        exc: Exception
    ):
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": "Something went wrong.",
                "data": None
            }
        )