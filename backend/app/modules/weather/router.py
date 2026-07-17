from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.dependencies import get_db
from app.modules.weather.service import weather_service
from app.modules.weather.schemas import WeatherRecordResponse, WeatherImpactResponse

router = APIRouter(prefix="/weather", tags=["Weather Intelligence"])

@router.get("/current", response_model=WeatherRecordResponse)
def get_current_weather(
    city: str = Query("Delhi", description="City to get weather for"),
    state: str = Query("Delhi", description="State for record logging"),
    db: Session = Depends(get_db)
):
    return weather_service.get_current_weather(db, city, state)

@router.get("/forecast")
def get_weather_forecast(city: str = Query("Delhi", description="City for forecast")):
    return weather_service.get_forecast(city)

@router.get("/history", response_model=list[WeatherRecordResponse])
def get_weather_history(
    city: str = Query("Delhi", description="City for historical weather"),
    days: int = Query(30, description="Number of historical days"),
    db: Session = Depends(get_db)
):
    return weather_service.get_history(db, city, days)

@router.get("/impact", response_model=WeatherImpactResponse)
def get_weather_impact_score(
    temperature: float = Query(28.0),
    humidity: float = Query(55.0),
    rainfall: float = Query(0.0)
):
    res = weather_service.get_impact_analysis(temperature, humidity, rainfall)
    return WeatherImpactResponse(**res)
