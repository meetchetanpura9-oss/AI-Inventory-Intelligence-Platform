def get_weather_impact(temperature: float, humidity: float, rainfall: float) -> dict:
    """
    Evaluates weather conditions and returns an impact score,
    affected products, and demand multipliers.
    """
    multiplier = 1.0
    impact_score = 0.5 # default moderate
    affected_products = []
    reason = "Normal weather conditions."

    if temperature > 35:
        multiplier += 0.25
        impact_score = 0.85
        affected_products.extend(["Ice Cream", "Cold Drinks", "Curd", "Juice", "Water Bottle"])
        reason = f"High temperature surge ({temperature}°C). Summer demand peaks."
    elif temperature < 20:
        multiplier += 0.18
        impact_score = 0.70
        affected_products.extend(["Blankets", "Coffee", "Soup", "Tea"])
        reason = f"Cold temperature dip ({temperature}°C). Winter warming demand peaks."

    if rainfall > 5.0:
        multiplier += 0.40
        impact_score = 0.90
        affected_products.extend(["Umbrella", "Tea", "Coffee", "Instant Noodles"])
        reason = f"Heavy rainfall forecast ({rainfall}mm). Indoor and rain protection spike."

    # Remove duplicates
    affected_products = list(set(affected_products))

    return {
        "multiplier": round(multiplier, 2),
        "impact_score": round(impact_score, 2),
        "affected_products": affected_products,
        "reason": reason
    }
