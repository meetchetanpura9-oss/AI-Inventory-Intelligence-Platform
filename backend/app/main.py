from fastapi import FastAPI
from sqlalchemy import text

from app.database.base import Base
from app.database.connection import engine

import app.models
from app.api.product import router as product_router


app = FastAPI(
    title="AI Inventory Intelligence Platform",
    version="1.0.0",
    description="An AI-powered Inventory Management Platform inspired by Zepto and Blinkit"
)


# Register all API routes
app.include_router(product_router)


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