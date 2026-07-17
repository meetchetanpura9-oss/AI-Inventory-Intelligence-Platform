import os

class WeatherClient:
    def __init__(self):
        self.api_key = os.getenv("WEATHER_API_KEY", "mock_key")
        self.provider = os.getenv("WEATHER_PROVIDER", "mock")

    def get_weather(self, city: str) -> dict:
        city_lower = city.lower()
        if "delhi" in city_lower:
            return {
                "temperature": 38.5,
                "humidity": 45.0,
                "rainfall": 0.0,
                "weather_type": "Sunny",
                "wind_speed": 12.0,
                "heat_index": 42.0
            }
        elif "mumbai" in city_lower:
            return {
                "temperature": 31.0,
                "humidity": 85.0,
                "rainfall": 15.0,
                "weather_type": "Rainy",
                "wind_speed": 22.0,
                "heat_index": 38.0
            }
        elif "bangalore" in city_lower or "bengaluru" in city_lower:
            return {
                "temperature": 24.0,
                "humidity": 60.0,
                "rainfall": 2.0,
                "weather_type": "Cloudy",
                "wind_speed": 15.0,
                "heat_index": 26.0
            }
        return {
            "temperature": 28.0,
            "humidity": 55.0,
            "rainfall": 0.0,
            "weather_type": "Sunny",
            "wind_speed": 10.0,
            "heat_index": 30.0
        }
