from pydantic import BaseModel
from datetime import date, datetime
from typing import List, Optional

class WeatherResponse(BaseModel):
    temperature: float
    humidity: float
    rainfall: float
    weather_type: str
    wind_speed: float
    heat_index: float

class WeatherImpactResponse(BaseModel):
    multiplier: float
    impact_score: float
    affected_products: List[str]
    reason: str

class WeatherRecordCreate(BaseModel):
    date: date
    city: str
    state: str
    temperature: float
    humidity: float
    rainfall: float
    weather_type: str
    wind_speed: float
    heat_index: float

class WeatherRecordResponse(WeatherRecordCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
