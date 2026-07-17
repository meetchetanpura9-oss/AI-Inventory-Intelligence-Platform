import numpy as np

class FeatureBuilder:
    def __init__(self):
        self.mappings = {
            "product": {},
            "category": {},
            "warehouse": {},
            "city": {},
            "weather_type": {},
        }

    def fit_mappings(self, rows: list[dict]):
        """Build mapping dictionaries from the dataset rows."""
        for field in self.mappings:
            vals = sorted(list(set(str(row.get(field, "")) for row in rows)))
            self.mappings[field] = {val: idx for idx, val in enumerate(vals)}

    def encode_value(self, field: str, value: str) -> int:
        """Encode a string value to integer using fitted mappings."""
        value_str = str(value)
        mapping = self.mappings.get(field, {})
        return mapping.get(value_str, 0)

    def build_features_demand(self, rows: list[dict], is_training: bool = True):
        """
        Features: Stock, Sales, Search Count, Temp, Humidity, Rain, Weather Score, Festival, Festival Days Left, Season, Weekend, Holiday
        Target: Future Demand
        """
        X = []
        y = []
        for row in rows:
            festival = 1.0 if row.get("festival") is True or str(row.get("festival")).lower() == "true" else 0.0
            weekend = 1.0 if row.get("weekend") is True or str(row.get("weekend")).lower() == "true" else 0.0
            holiday = 1.0 if row.get("holiday") is True or str(row.get("holiday")).lower() == "true" else 0.0
            
            season_str = str(row.get("seasonal_indicator") or "summer").lower()
            season_val = 0.0
            if "monsoon" in season_str:
                season_val = 1.0
            elif "autumn" in season_str or "festival" in season_str:
                season_val = 2.0
            elif "winter" in season_str:
                season_val = 3.0

            x_row = [
                float(row.get("stock") or 0.0),
                float(row.get("sales") or 0.0),
                float(row.get("search_count") or 0.0),
                float(row.get("temperature") or 25.0),
                float(row.get("humidity") or 50.0),
                float(row.get("rain") or 0.0),
                float(row.get("weather_score") or 0.5),
                festival,
                float(row.get("festival_days_left") or 10.0),
                season_val,
                weekend,
                holiday
            ]
            X.append(x_row)
            
            if is_training:
                # Target: Future Demand
                sales = float(row.get("sales") or 0.0)
                searches = float(row.get("search_count") or 0.0)
                failed = float(row.get("failed_searches") or 0.0)
                future_demand = max(0.0, sales + (searches - failed) * 0.1)
                
                # Apply weather & festival multipliers
                weather_mult = float(row.get("weather_multiplier") or 1.0)
                festival_mult = float(row.get("festival_multiplier") or 1.0)
                future_demand *= (weather_mult * festival_mult)
                
                y.append(future_demand)
                
        return np.array(X), (np.array(y) if is_training else None)

    def build_features_sales(self, rows: list[dict], is_training: bool = True):
        """
        Features: Today Sales, Yesterday Sales, Stock, Category, Festival, Weather (Score), Search Count
        Target: Tomorrow Sales
        """
        X = []
        y = []
        for row in rows:
            festival = 1 if row.get("festival") is True or str(row.get("festival")).lower() == "true" else 0
            cat_val = self.encode_value("category", row.get("category") or "")
            x_row = [
                float(row.get("today_sales") or row.get("sales") or 0),
                float(row.get("yesterday_sales") or row.get("sales") or 0),
                float(row.get("stock") or 0),
                float(cat_val),
                float(festival),
                float(row.get("weather_score") or 50.0),
                float(row.get("search_count") or 0),
            ]
            X.append(x_row)
            
            if is_training:
                # Target: Tomorrow Sales
                sales = float(row.get("sales") or 0)
                weather_score = float(row.get("weather_score") or 50.0)
                tomorrow_sales = sales * (1.05 + 0.1 * (weather_score / 100.0))
                y.append(tomorrow_sales)
                
        return np.array(X), (np.array(y) if is_training else None)

    def build_features_stockout(self, rows: list[dict], is_training: bool = True):
        """
        Features: Current Stock, Average Daily Sales, Demand Score, Warehouse, Festival, Weather (Score)
        Target: Stockout (classification)
        """
        X = []
        y = []
        for row in rows:
            festival = 1 if row.get("festival") is True or str(row.get("festival")).lower() == "true" else 0
            wh_val = self.encode_value("warehouse", row.get("warehouse") or "")
            x_row = [
                float(row.get("stock") or 0),
                float(row.get("average_daily_sales") or 0.0),
                float(row.get("demand_score") or 0.0),
                float(wh_val),
                float(festival),
                float(row.get("weather_score") or 50.0),
            ]
            X.append(x_row)
            
            if is_training:
                # Target: Stockout classification (1 = risk, 0 = safe)
                stock = float(row.get("stock") or 0)
                avg_sales = float(row.get("average_daily_sales") or 0)
                # If stock is less than 1.5 times the average daily sales, flag as stockout risk
                stockout = 1 if stock < avg_sales * 1.5 else 0
                y.append(stockout)
                
        return np.array(X), (np.array(y) if is_training else None)

    def build_features_reorder(self, rows: list[dict], is_training: bool = True):
        """
        Features: Average Sales, Demand, Festival, Weather (Score), Warehouse, Lead Time, Supplier Delay, Current Stock
        Target: Recommended Quantity
        """
        X = []
        y = []
        for row in rows:
            festival = 1 if row.get("festival") is True or str(row.get("festival")).lower() == "true" else 0
            wh_val = self.encode_value("warehouse", row.get("warehouse") or "")
            lead_time = 3.0
            supplier_delay = 1.0
            x_row = [
                float(row.get("average_daily_sales") or 0.0),
                float(row.get("demand_score") or 0.0),
                float(festival),
                float(row.get("weather_score") or 50.0),
                float(wh_val),
                float(lead_time),
                float(supplier_delay),
                float(row.get("stock") or 0),
            ]
            X.append(x_row)
            
            if is_training:
                # Target: Recommended quantity
                avg_sales = float(row.get("average_daily_sales") or 0.0)
                stock = float(row.get("stock") or 0)
                min_stock = float(row.get("minimum_stock") or 10.0)
                recommended = max(0.0, avg_sales * (lead_time + supplier_delay) - stock + min_stock)
                y.append(recommended)
                
        return np.array(X), (np.array(y) if is_training else None)
