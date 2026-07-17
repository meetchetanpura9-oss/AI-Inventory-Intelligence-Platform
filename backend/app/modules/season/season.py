from datetime import date

class SeasonEngine:
    def get_season_by_month(self, month: int) -> str:
        """
        March - May: Summer
        June - September: Monsoon
        October - November: Autumn
        December - February: Winter
        """
        if 3 <= month <= 5:
            return "Summer"
        elif 6 <= month <= 9:
            return "Monsoon"
        elif month in [10, 11]:
            return "Autumn"
        else:
            return "Winter"

    def get_season_for_date(self, target_date: date) -> str:
        return self.get_season_by_month(target_date.month)

    def get_seasonal_products(self, season: str) -> list:
        mapping = {
            "Summer": ["Ice Cream", "Juice", "Water", "Curd", "Cold Drinks"],
            "Winter": ["Coffee", "Tea", "Soup", "Blanket"],
            "Monsoon": ["Umbrella", "Tea", "Snacks", "Instant Food"],
            "Autumn": ["Snacks", "Dry Fruits", "Sweets"]
        }
        return mapping.get(season, [])

    def get_seasonal_multiplier(self, season: str, product_name: str) -> float:
        """
        Returns seasonal multiplier. If product aligns with season, increase demand.
        """
        products = self.get_seasonal_products(season)
        if product_name in products:
            if season == "Summer":
                return 1.30 # +30%
            elif season == "Monsoon":
                return 1.25 # +25%
            elif season == "Winter":
                return 1.20 # +20%
            else:
                return 1.15
        return 1.0

season_engine = SeasonEngine()
