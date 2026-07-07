from fastapi import FastAPI
from sqlalchemy import text

from app.database.base import Base
from app.database.connection import engine

import app.models
from app.api.product import router as product_router
from app.api.inventory import router as inventory_router
from app.api.inventory_transaction import router as inventory_transaction_router
from app.api.sale import router as sale_router
from app.api.purchase import router as purchase_router
from app.analytics.routes import router as analytics_router
from app.customer_search.routes import router as customer_search_router
from app.demand.routes import router as demand_router

from app.core.handlers import register_exception_handlers


app = FastAPI(
    title="AI Inventory Intelligence Platform",
    version="1.0.0",
    description="An AI-powered Inventory Management Platform inspired by Zepto and Blinkit"
)


# Register all custom exception handlers
register_exception_handlers(app)


# Register all API routes
app.include_router(product_router)
app.include_router(inventory_router)
app.include_router(inventory_transaction_router)
app.include_router(sale_router)
app.include_router(purchase_router)
app.include_router(analytics_router)
app.include_router(customer_search_router)
app.include_router(demand_router)


# Create all database tables
Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {
        "message": "Welcome to AI Inventory Intelligence Platform"
    }


@app.get("/health")
def health():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "status": "healthy",
            "database": "connected"
        }

    except Exception as e:
        return {
            "status": "unhealthy",
            "database": str(e)
        }