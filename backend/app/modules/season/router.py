from fastapi import APIRouter, Query
from datetime import date
from app.modules.season.season import season_engine

router = APIRouter(prefix="/season", tags=["Seasonal Intelligence"])

@router.get("/current")
def get_current_season(
    target_date: str = Query(None, description="ISO Date string (YYYY-MM-DD)")
):
    t_date = date.fromisoformat(target_date) if target_date else date.today()
    season = season_engine.get_season_for_date(t_date)
    products = season_engine.get_seasonal_products(season)
    return {
        "season": season,
        "date": t_date.isoformat(),
        "seasonal_products": products
    }
