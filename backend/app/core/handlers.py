from fastapi import FastAPI, HTTPException, Request
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError

from app.core.exceptions import (
    ProductNotFoundException,
    DuplicateSKUException,
    DatabaseException,
    DuplicateUsernameException,
    DuplicateEmailException,
    InvalidCredentialsException,
    DuplicatePhoneException
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
    # Duplicate Username
    # -----------------------------
    @app.exception_handler(DuplicateUsernameException)
    async def duplicate_username_handler(
        request: Request,
        exc: DuplicateUsernameException
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
    # Duplicate Email
    # -----------------------------
    @app.exception_handler(DuplicateEmailException)
    async def duplicate_email_handler(
        request: Request,
        exc: DuplicateEmailException
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
    # Invalid Credentials
    # -----------------------------
    @app.exception_handler(InvalidCredentialsException)
    async def invalid_credentials_handler(
        request: Request,
        exc: InvalidCredentialsException
    ):
        return JSONResponse(
            status_code=401,
            content={
                "success": False,
                "message": exc.message,
                "data": None
            }
        )

    # -----------------------------
    # Duplicate Phone
    # -----------------------------
    @app.exception_handler(DuplicatePhoneException)
    async def duplicate_phone_handler(
        request: Request,
        exc: DuplicatePhoneException
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
                "errors": jsonable_encoder(exc.errors())
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
        if exc.status_code in (401, 403):
            return JSONResponse(
                status_code=exc.status_code,
                headers=exc.headers,
                content={"detail": exc.detail}
            )

        return JSONResponse(
            status_code=exc.status_code,
            headers=exc.headers,
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
