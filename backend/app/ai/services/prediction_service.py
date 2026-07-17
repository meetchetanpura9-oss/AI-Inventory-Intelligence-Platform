import os
import joblib
import numpy as np
from datetime import date

from app.ai.utils.feature_builder import FeatureBuilder
from app.ai.models.demand_model import DemandForecastModel
from app.ai.models.sales_model import SalesForecastModel
from app.ai.models.stockout_model import StockoutPredictionModel

SAVED_MODELS_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "saved_models"
)

class PredictionService:
    def __init__(self):
        self.builder_path = os.path.join(SAVED_MODELS_DIR, "feature_builder.pkl")
        self.demand_path = os.path.join(SAVED_MODELS_DIR, "demand_model.pkl")
        self.sales_path = os.path.join(SAVED_MODELS_DIR, "sales_model.pkl")
        self.stockout_path = os.path.join(SAVED_MODELS_DIR, "stockout.pkl")
        self.reorder_path = os.path.join(SAVED_MODELS_DIR, "reorder_model.pkl")

    def _load_model(self, path):
        if os.path.exists(path):
            try:
                return joblib.load(path)
            except Exception:
                pass
        return None

    def predict_demand(self, product: str, current_stock: float, search_count: float, failed_searches: float, sales: float, festival: bool, temperature: float, demand_score: float, db=None) -> dict:
        model = self._load_model(self.demand_path)
        builder = self._load_model(self.builder_path)

        today = date.today()
        # Default fallback values
        humidity = 55.0
        rain = 0.0
        weather_score = 0.5
        days_left = 10.0
        season_val = 0.0
        weekend = 1.0 if today.weekday() >= 5 else 0.0
        holiday = 1.0 if today.weekday() == 6 or festival else 0.0

        if db:
            try:
                from app.modules.weather.service import weather_service
                from app.modules.festival.service import festival_service
                from app.modules.season.season import season_engine

                w_rec = weather_service.get_current_weather(db, "Delhi", "Delhi")
                humidity = w_rec.humidity
                rain = w_rec.rainfall
                w_impact = weather_service.get_impact_analysis(temperature, humidity, rain)
                weather_score = w_impact["impact_score"]
                
                fest_ctx = festival_service.get_festival_context(today)
                days_left = fest_ctx["days_left"]
                
                season = season_engine.get_season_for_date(today)
                if "monsoon" in season.lower():
                    season_val = 1.0
                elif "autumn" in season.lower() or "festival" in season.lower():
                    season_val = 2.0
                elif "winter" in season.lower():
                    season_val = 3.0
            except Exception:
                pass

        if model is None or builder is None:
            # Fallback heuristic prediction
            fest_val = 1.0 if festival else 0.0
            predicted_demand = max(0.0, sales + (search_count - failed_searches) * 0.1 + (demand_score * 0.05))
            return {
                "predicted_demand": round(predicted_demand, 2),
                "confidence_score": 0.85
            }

        # Format 12-feature row
        fest_val = 1.0 if festival else 0.0
        X = np.array([[
            current_stock,
            sales,
            search_count,
            temperature,
            humidity,
            rain,
            weather_score,
            fest_val,
            days_left,
            season_val,
            weekend,
            holiday
        ]])
        
        preds = model.predict(X)
        return {
            "predicted_demand": round(float(preds[0]), 2),
            "confidence_score": 0.92
        }

    def predict_sales(self, today_sales: float, yesterday_sales: float, stock: float, category: str, festival: bool, weather: float, search_count: float, db=None) -> dict:
        model = self._load_model(self.sales_path)
        builder = self._load_model(self.builder_path)

        if model is None or builder is None:
            # Heuristic fallback
            fest_val = 1.0 if festival else 0.0
            predicted_sales = today_sales * (1.05 + 0.1 * (weather / 100.0)) + (search_count * 0.02)
            return {
                "predicted_sales": round(predicted_sales, 2),
                "formatted_sales": f"₹{predicted_sales:,.2f}",
                "confidence_score": 0.80
            }

        fest_val = 1.0 if festival else 0.0
        cat_encoded = builder.encode_value("category", category)
        X = np.array([[
            today_sales,
            yesterday_sales,
            stock,
            cat_encoded,
            fest_val,
            weather,
            search_count
        ]])

        preds = model.predict(X)
        pred_val = round(float(preds[0]), 2)
        return {
            "predicted_sales": pred_val,
            "formatted_sales": f"₹{pred_val:,.2f}",
            "confidence_score": 0.88
        }

    def predict_stockout(self, current_stock: float, average_daily_sales: float, demand_score: float, warehouse: str, festival: bool, weather: float, db=None) -> dict:
        model = self._load_model(self.stockout_path)
        builder = self._load_model(self.builder_path)

        if model is None or builder is None:
            # Heuristic fallback
            prob = 0.9 if current_stock < (average_daily_sales * 1.5) else (0.45 if current_stock < (average_daily_sales * 2.5) else 0.1)
            risk = "High" if prob >= 0.7 else ("Medium" if prob >= 0.3 else "Low")
            return {
                "stockout_risk": risk,
                "stockout_probability": prob,
                "risk_code": 1 if prob >= 0.7 else 0
            }

        fest_val = 1.0 if festival else 0.0
        wh_encoded = builder.encode_value("warehouse", warehouse)
        X = np.array([[
            current_stock,
            average_daily_sales,
            demand_score,
            wh_encoded,
            fest_val,
            weather
        ]])

        prob_arr = model.predict_proba(X)[0]
        if len(prob_arr) > 1:
            prob = float(prob_arr[1])
        else:
            # Only one class was seen during fit
            class_label = getattr(model.model, "classes_", [0])[0]
            prob = 1.0 if class_label == 1 else 0.0

        risk = "High" if prob >= 0.7 else ("Medium" if prob >= 0.3 else "Low")
        return {
            "stockout_risk": risk,
            "stockout_probability": round(prob, 4),
            "risk_code": 1 if prob >= 0.7 else 0
        }

    def predict_reorder(self, average_sales: float, demand: float, festival: bool, weather: float, warehouse: str, lead_time: float, supplier_delay: float, current_stock: float, db=None) -> dict:
        model = self._load_model(self.reorder_path)
        builder = self._load_model(self.builder_path)

        days_left = current_stock / (average_sales + 1e-5)

        if model is None or builder is None:
            # Heuristic fallback
            recommended = max(0.0, average_sales * (lead_time + supplier_delay) - current_stock + 10.0)
            return {
                "recommended_quantity": round(recommended, 2),
                "days_of_stock_left": round(days_left, 2)
            }

        fest_val = 1.0 if festival else 0.0
        wh_encoded = builder.encode_value("warehouse", warehouse)
        X = np.array([[
            average_sales,
            demand,
            fest_val,
            weather,
            wh_encoded,
            lead_time,
            supplier_delay,
            current_stock
        ]])

        preds = model.predict(X)
        recommended = round(float(preds[0]), 2)
        return {
            "recommended_quantity": recommended,
            "days_of_stock_left": round(days_left, 2)
        }

prediction_service = PredictionService()
