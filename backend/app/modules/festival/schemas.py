from pydantic import BaseModel
from datetime import date
from typing import List, Optional

class FestivalBase(BaseModel):
    name: str
    start_date: date
    end_date: date
    category: str
    expected_increase: float
    affected_categories: List[str]

class UpcomingFestivalResponse(FestivalBase):
    days_left: int

class FestivalContextResponse(BaseModel):
    in_festival: bool
    festival_name: Optional[str] = None
    days_left: int
    multiplier: float
    affected_categories: List[str]
