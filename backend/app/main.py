from fastapi import FastAPI, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database.base import Base
from app.database.connection import engine
from app.database.dependencies import get_db

import app.models
from app.api.product import router as product_router
from app.api.inventory import router as inventory_router
from app.api.sale import router as sale_router
from app.api.purchase import router as purchase_router
from app.analytics.routes import router as analytics_router
from app.customer_search.routes import router as customer_search_router
from app.demand.routes import router as demand_router
from app.ai.api.dataset import ai_dataset_router
from app.ai.routes.ai_training import ai_training_router
from app.auth.routes import router as auth_router
from app.users.router import router as users_router

from app.modules.weather.router import router as weather_router
from app.modules.festival.router import router as festival_router
from app.modules.season.router import router as season_router

from app.analytics.schemas import DashboardSummaryResponse
from app.analytics.routes import can_read_analytics
from app.analytics.service import service as analytics_service

from fastapi.middleware.cors import CORSMiddleware
from app.core.handlers import register_exception_handlers


app = FastAPI(
    title="AI Inventory Intelligence Platform",
    version="1.0.0",
    description="An AI-powered Inventory Management Platform inspired by Zepto and Blinkit"
)


# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register all custom exception handlers
register_exception_handlers(app)


# Register all API routes
app.include_router(product_router)
app.include_router(inventory_router)
app.include_router(sale_router)
app.include_router(purchase_router)
app.include_router(analytics_router)
app.include_router(customer_search_router)
app.include_router(demand_router)
app.include_router(
    ai_dataset_router,
    prefix="/ai",
    tags=["AI Dataset"]
)
app.include_router(
    ai_training_router,
    prefix="/ai",
    tags=["AI Forecasting"]
)
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(weather_router)
app.include_router(festival_router)
app.include_router(season_router)


# Create all database tables
Base.metadata.create_all(bind=engine)


@app.get("/dashboard", response_model=DashboardSummaryResponse, dependencies=[Depends(can_read_analytics)])
def get_dashboard(db: Session = Depends(get_db)):
    return analytics_service.dashboard(db)


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
