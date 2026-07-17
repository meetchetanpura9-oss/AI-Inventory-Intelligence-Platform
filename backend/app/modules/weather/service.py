from sqlalchemy.orm import Session
from datetime import date, datetime, timedelta
from app.modules.weather.models import WeatherRecord
from app.modules.weather.weather_client import WeatherClient
from app.modules.weather.weather_rules import get_weather_impact
from app.modules.weather.utils import engineer_weather_features

class WeatherService:
    def __init__(self):
        self.client = WeatherClient()

    def get_current_weather(self, db: Session, city: str, state: str) -> WeatherRecord:
        """
        Gets current weather, logs it to database, and returns the record.
        """
        data = self.client.get_weather(city)
        today = date.today()

        # Check if record already exists for today/city
        existing = db.query(WeatherRecord).filter(
            WeatherRecord.date == today,
            WeatherRecord.city.ilike(city)
        ).first()

        if existing:
            return existing

        # Create new record
        record = WeatherRecord(
            date=today,
            city=city,
            state=state,
            temperature=data["temperature"],
            humidity=data["humidity"],
            rainfall=data["rainfall"],
            weather_type=data["weather_type"],
            wind_speed=data["wind_speed"],
            heat_index=data["heat_index"]
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        return record

    def get_forecast(self, city: str) -> list:
        """
        Returns a mock 7-day forecast.
        """
        data = self.client.get_weather(city)
        forecast = []
        today = date.today()
        for i in range(1, 8):
            future_date = today + timedelta(days=i)
            # Add some variations to make it realistic
            temp_var = (i % 3 - 1) * 1.5
            rain_var = 12.0 if (i % 4 == 0) else 0.0
            w_type = "Rainy" if rain_var > 0 else ("Cloudy" if i % 3 == 0 else "Sunny")
            forecast.append({
                "date": future_date.isoformat(),
                "temperature": round(data["temperature"] + temp_var, 1),
                "humidity": min(100.0, max(0.0, data["humidity"] + (i * 2 % 10))),
                "rainfall": rain_var,
                "weather_type": w_type,
                "wind_speed": round(data["wind_speed"] + (i % 2), 1),
                "heat_index": round(data["heat_index"] + temp_var, 1)
            })
        return forecast

    def get_history(self, db: Session, city: str, days: int = 30) -> list:
        start_date = date.today() - timedelta(days=days)
        records = db.query(WeatherRecord).filter(
            WeatherRecord.city.ilike(city),
            WeatherRecord.date >= start_date
        ).order_by(WeatherRecord.date.desc()).all()
        
        # If no records exist, seed some mock history
        if not records:
            records = self.seed_mock_history(db, city, days)
        return records

    def seed_mock_history(self, db: Session, city: str, days: int = 30) -> list:
        seeded = []
        today = date.today()
        base_data = self.client.get_weather(city)
        
        # Determine state
        state = "Maharashtra" if "mumbai" in city.lower() else ("Karnataka" if "bangalore" in city.lower() else "Delhi")

        for i in range(days):
            hist_date = today - timedelta(days=i)
            temp_var = (i % 5 - 2) * 1.0
            rain_var = 8.0 if (i % 6 == 0) else 0.0
            w_type = "Rainy" if rain_var > 0 else ("Cloudy" if i % 4 == 0 else "Sunny")
            
            record = WeatherRecord(
                date=hist_date,
                city=city,
                state=state,
                temperature=round(base_data["temperature"] + temp_var, 1),
                humidity=min(100.0, max(0.0, base_data["humidity"] + (i % 5))),
                rainfall=rain_var,
                weather_type=w_type,
                wind_speed=base_data["wind_speed"],
                heat_index=round(base_data["heat_index"] + temp_var, 1)
            )
            db.add(record)
            seeded.append(record)
        db.commit()
        for r in seeded:
            db.refresh(r)
        return seeded

    def get_impact_analysis(self, temperature: float, humidity: float, rainfall: float) -> dict:
        return get_weather_impact(temperature, humidity, rainfall)

weather_service = WeatherService()
