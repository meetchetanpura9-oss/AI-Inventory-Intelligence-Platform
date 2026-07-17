from fastapi import APIRouter, Query
from datetime import date
from typing import Optional
from app.modules.festival.service import festival_service
from app.modules.festival.schemas import UpcomingFestivalResponse, FestivalBase, FestivalContextResponse

router = APIRouter(prefix="/festival", tags=["Festival Intelligence"])

@router.get("/upcoming", response_model=list[UpcomingFestivalResponse])
def get_upcoming_festivals(
    target_date: str = Query(None, description="ISO Date string (YYYY-MM-DD), default is today")
):
    t_date = date.fromisoformat(target_date) if target_date else date.today()
    return festival_service.get_upcoming_festivals(t_date)

@router.get("/current", response_model=Optional[FestivalBase])
def get_current_festival(
    target_date: str = Query(None, description="ISO Date string (YYYY-MM-DD), default is today")
):
    t_date = date.fromisoformat(target_date) if target_date else date.today()
    res = festival_service.get_current_festival(t_date)
    return FestivalBase(**res) if res else None

@router.get("/context", response_model=FestivalContextResponse)
def get_festival_context(
    target_date: str = Query(None, description="ISO Date string (YYYY-MM-DD), default is today")
):
    t_date = date.fromisoformat(target_date) if target_date else date.today()
    res = festival_service.get_festival_context(t_date)
    return FestivalContextResponse(**res)
