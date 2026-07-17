from datetime import date
from pydantic import BaseModel


class DatasetSummaryResponse(BaseModel):
    total_rows: int
    total_products: int
    total_categories: int
    total_cities: int
    total_states: int
    total_warehouses: int
    missing_values: int
    dataset_size_mb: float

    start_date: date
    end_date: date
