from sqlalchemy import Column, Integer, String, Float, DateTime, Date
from app.database.base import Base
from datetime import datetime

class WeatherRecord(Base):
    __tablename__ = "weather_records"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False, index=True)
    city = Column(String, nullable=False, index=True)
    state = Column(String, nullable=False)
    temperature = Column(Float, nullable=False)
    humidity = Column(Float, nullable=False)
    rainfall = Column(Float, nullable=False)
    weather_type = Column(String, nullable=False)
    wind_speed = Column(Float, nullable=False)
    heat_index = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
