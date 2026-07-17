from app.modules.weather.weather_rules import get_weather_impact

def engineer_weather_features(temperature: float, humidity: float, rainfall: float) -> dict:
    is_hot = 1 if temperature > 35 else 0
    is_rainy = 1 if rainfall > 5 else 0
    is_cold = 1 if temperature < 20 else 0

    if humidity > 70:
        humidity_level = "HIGH"
    elif humidity < 35:
        humidity_level = "LOW"
    else:
        humidity_level = "MODERATE"

    impact = get_weather_impact(temperature, humidity, rainfall)

    return {
        "is_hot": is_hot,
        "is_rainy": is_rainy,
        "is_cold": is_cold,
        "humidity_level": humidity_level,
        "weather_score": impact["impact_score"],
        "weather_multiplier": impact["multiplier"]
    }
