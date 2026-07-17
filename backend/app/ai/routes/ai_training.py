from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date

from app.database.dependencies import get_db
from app.permissions.dependencies import require_roles
from app.permissions.roles import UserRole

from app.ai.services.training_service import training_service
from app.ai.services.prediction_service import prediction_service
from app.ai.services.evaluation_service import evaluation_service

from app.modules.weather.service import weather_service
from app.modules.festival.service import festival_service
from app.modules.season.season import season_engine

from app.ai.schemas import (
    DemandPredictionInput,
    DemandPredictionResponse,
    SalesPredictionInput,
    SalesPredictionResponse,
    StockoutPredictionInput,
    StockoutPredictionResponse,
    ReorderPredictionInput,
    ReorderPredictionResponse,
)

ai_training_router = APIRouter()

can_read_ai = require_roles(
    UserRole.ADMIN,
    UserRole.STORE_MANAGER,
    UserRole.STAFF,
    UserRole.VIEWER,
)

@ai_training_router.post(
    "/train",
    dependencies=[Depends(can_read_ai)],
)
def train_models(db: Session = Depends(get_db)):
    """Train all 4 forecasting models using the generated ML dataset."""
    return training_service.train_all_models(db)


@ai_training_router.get(
    "/models",
    dependencies=[Depends(can_read_ai)],
)
def get_models_status():
    """Retrieve training status and model evaluation metrics (MAE, RMSE, R2, Accuracy, etc.)."""
    return evaluation_service.get_all_metrics()


@ai_training_router.post(
    "/predict/demand",
    response_model=DemandPredictionResponse,
    dependencies=[Depends(can_read_ai)],
)
def predict_demand(input_data: DemandPredictionInput):
    """Predict tomorrow's demand for a product given features."""
    return prediction_service.predict_demand(
        product=input_data.product,
        current_stock=input_data.current_stock,
        search_count=input_data.search_count,
        failed_searches=input_data.failed_searches,
        sales=input_data.sales,
        festival=input_data.festival,
        temperature=input_data.temperature,
        demand_score=input_data.demand_score
    )


@ai_training_router.post(
    "/predict/sales",
    response_model=SalesPredictionResponse,
    dependencies=[Depends(can_read_ai)],
)
def predict_sales(input_data: SalesPredictionInput):
    """Predict tomorrow's total sales revenue given features."""
    return prediction_service.predict_sales(
        today_sales=input_data.today_sales,
        yesterday_sales=input_data.yesterday_sales,
        stock=input_data.stock,
        category=input_data.category,
        festival=input_data.festival,
        weather=input_data.weather,
        search_count=input_data.search_count
    )


@ai_training_router.post(
    "/predict/stockout",
    response_model=StockoutPredictionResponse,
    dependencies=[Depends(can_read_ai)],
)
def predict_stockout(input_data: StockoutPredictionInput):
    """Evaluate tomorrow's stockout risk status (classification & probability)."""
    return prediction_service.predict_stockout(
        current_stock=input_data.current_stock,
        average_daily_sales=input_data.average_daily_sales,
        demand_score=input_data.demand_score,
        warehouse=input_data.warehouse,
        festival=input_data.festival,
        weather=input_data.weather
    )


@ai_training_router.post(
    "/predict/reorder",
    response_model=ReorderPredictionResponse,
    dependencies=[Depends(can_read_ai)],
)
def predict_reorder(input_data: ReorderPredictionInput):
    """Calculate recommended order quantity for smart stock replenishments."""
    return prediction_service.predict_reorder(
        average_sales=input_data.average_sales,
        demand=input_data.demand,
        festival=input_data.festival,
        weather=input_data.weather,
        warehouse=input_data.warehouse,
        lead_time=input_data.lead_time,
        supplier_delay=input_data.supplier_delay,
        current_stock=input_data.current_stock
    )


@ai_training_router.get(
    "/context",
    dependencies=[Depends(can_read_ai)],
)
def get_ai_context(db: Session = Depends(get_db)):
    """Retrieve consolidated AI context containing current weather, season, and festival countdown."""
    today = date.today()
    
    # Get current weather
    w_rec = weather_service.get_current_weather(db, "Delhi", "Delhi")
    
    # Get festival context
    fest_ctx = festival_service.get_festival_context(today)
    
    # Get seasonal context
    season = season_engine.get_season_for_date(today)
    seasonal_products = season_engine.get_seasonal_products(season)
    
    return {
        "weather": {
            "temperature": w_rec.temperature,
            "humidity": w_rec.humidity,
            "rainfall": w_rec.rainfall,
            "weather_type": w_rec.weather_type,
            "heat_index": w_rec.heat_index,
            "weather_score": w_rec.heat_index # mock or comfort score
        },
        "festival": {
            "in_festival": fest_ctx["in_festival"],
            "festival_name": fest_ctx["festival_name"],
            "days_left": fest_ctx["days_left"],
            "multiplier": fest_ctx["multiplier"],
            "affected_categories": fest_ctx["affected_categories"]
        },
        "season": {
            "season": season,
            "seasonal_products": seasonal_products
        }
    }


@ai_training_router.get(
    "/recommendations",
    dependencies=[Depends(can_read_ai)],
)
def get_ai_recommendations(db: Session = Depends(get_db)):
    """Generate dynamic order suggestions and warnings based on weather, festival, and seasonal demand drivers."""
    today = date.today()
    w_rec = weather_service.get_current_weather(db, "Delhi", "Delhi")
    fest_ctx = festival_service.get_festival_context(today)
    season = season_engine.get_season_for_date(today)

    recommendations = []

    # Weather impact recommendation
    weather_impact = weather_service.get_impact_analysis(w_rec.temperature, w_rec.humidity, w_rec.rainfall)
    if weather_impact["multiplier"] > 1.0:
        for prod in weather_impact["affected_products"][:3]:
            qty = int(120 * weather_impact["multiplier"])
            recommendations.append({
                "product": prod,
                "type": "Weather Alert",
                "multiplier": weather_impact["multiplier"],
                "recommendation": f"Increase stock by {qty} Units (High temperature of {w_rec.temperature}°C)",
                "reason": weather_impact["reason"]
            })

    # Festival impact recommendation
    if fest_ctx["multiplier"] > 1.0 and fest_ctx["festival_name"]:
        for category in fest_ctx["affected_categories"][:2]:
            prod_name = "Diwali Sweets Gift Pack" if "Sweets" in category else (f"Premium {category} Box")
            qty = int(150 * fest_ctx["multiplier"])
            recommendations.append({
                "product": prod_name,
                "type": "Festival Countdown",
                "multiplier": fest_ctx["multiplier"],
                "recommendation": f"Pre-order {qty} Units for {fest_ctx['festival_name']} ({fest_ctx['days_left']} Days Left)",
                "reason": f"Expected demand surge (+{int((fest_ctx['multiplier'] - 1.0) * 100)}%) for category {category}."
            })

    # Seasonal product map recommendations
    seasonal_products = season_engine.get_seasonal_products(season)
    for prod in seasonal_products[:2]:
        mult = season_engine.get_seasonal_multiplier(season, prod)
        qty = int(100 * mult)
        recommendations.append({
            "product": prod,
            "type": "Seasonal demand",
            "multiplier": mult,
            "recommendation": f"Maintain standard stock layout of {qty} Units",
            "reason": f"Standard seasonal demand profile for {season} season."
        })

    if not recommendations:
        recommendations.append({
            "product": "Milk",
            "type": "Stable Profile",
            "multiplier": 1.0,
            "recommendation": "Maintain baseline inventory level of 120 Units",
            "reason": "Stable baseline demand detected."
        })

    return recommendations
