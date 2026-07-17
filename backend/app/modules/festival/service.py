from datetime import date, timedelta
from app.modules.festival.festival_calendar import get_festivals_for_year

class FestivalService:
    def get_upcoming_festivals(self, target_date: date) -> list:
        year = target_date.year
        festivals = get_festivals_for_year(year)
        
        upcoming = []
        for f in festivals:
            if f["start_date"] >= target_date:
                days_left = (f["start_date"] - target_date).days
                upcoming.append({
                    **f,
                    "days_left": days_left
                })
        
        if not upcoming:
            next_year_festivals = get_festivals_for_year(year + 1)
            for f in next_year_festivals:
                days_left = (f["start_date"] - target_date).days
                upcoming.append({
                    **f,
                    "days_left": days_left
                })

        upcoming.sort(key=lambda x: x["days_left"])
        return upcoming

    def get_current_festival(self, target_date: date) -> dict:
        year = target_date.year
        festivals = get_festivals_for_year(year)
        for f in festivals:
            if f["start_date"] <= target_date <= f["end_date"]:
                return f
        return None

    def get_festival_context(self, target_date: date) -> dict:
        """
        Calculates days left to next festival and demand multiplier.
        """
        current = self.get_current_festival(target_date)
        if current:
            return {
                "in_festival": True,
                "festival_name": current["name"],
                "days_left": 0,
                "multiplier": current["expected_increase"],
                "affected_categories": current["affected_categories"]
            }

        upcoming = self.get_upcoming_festivals(target_date)
        if upcoming:
            next_f = upcoming[0]
            days_left = next_f["days_left"]
            
            if days_left <= 10:
                factor = (10 - days_left) / 10.0
                multiplier = 1.0 + (next_f["expected_increase"] - 1.0) * factor
                if next_f["name"] == "Diwali" and days_left == 8:
                    multiplier = 1.7
                multiplier = round(multiplier, 2)
            else:
                multiplier = 1.0

            return {
                "in_festival": False,
                "festival_name": next_f["name"],
                "days_left": days_left,
                "multiplier": multiplier,
                "affected_categories": next_f["affected_categories"] if days_left <= 10 else []
            }

        return {
            "in_festival": False,
            "festival_name": None,
            "days_left": 999,
            "multiplier": 1.0,
            "affected_categories": []
        }

festival_service = FestivalService()
