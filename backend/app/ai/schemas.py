from datetime import date, datetime
from pydantic import BaseModel


class AIDatasetRow(BaseModel):
    date: date
    product: str
    sku: str
    category: str
    warehouse: str
    city: str
    state: str
    zone: str
    pincode: str
    stock: int
    minimum_stock: int
    maximum_stock: int
    warehouse_capacity: int
    stock_percentage: float
    sales: int
    today_sales: int
    yesterday_sales: int
    last_7_days_sales: int
    last_30_days_sales: int
    average_daily_sales: float
    purchase: int
    purchase_count: int
    failed_searches: int
    search_count: int
    demand_score: float
    demand_level: str
    revenue: float
    temperature: float
    humidity: float
    rain: bool
    weather_type: str
    festival: bool
    festival_days_left: int
    festival_multiplier: float
    weather_multiplier: float
    holiday: bool
    diwali: bool
    holi: bool
    christmas: bool
    navratri: bool
    eid: bool
    raksha_bandhan: bool
    independence_day: bool
    weekend: bool
    day: int
    week: int
    month: int
    quarter: int
    year: int
    day_of_week: int
    moving_avg_7: float
    moving_avg_30: float
    sales_growth: float
    inventory_turnover: float
    days_since_last_purchase: int | None
    seasonal_indicator: str
    weather_score: float


class AIDatasetSummary(BaseModel):
    dataset_size: int
    columns: list[str]
    missing_columns: list[str]
    duplicate_records_removed: int
    validation_errors: list[str]
    last_training_time: datetime | None
    training_status: str
    available_models: list[str]


class AIDatasetResponse(BaseModel):
    items: list[AIDatasetRow]
    total: int
    limit: int
    offset: int
    summary: AIDatasetSummary


class DatasetValidationResponse(BaseModel):
    status: str
    total_rows: int
    total_columns: int
    missing_values: int
    duplicate_rows: int
    negative_values: int
    invalid_dates: int
    issues: list[str]


class PreprocessResponse(BaseModel):
    status: str
    rows_processed: int
    columns_processed: int
    missing_values_before: int
    missing_values_after: int
    duplicates_removed: int
    encoded_columns: list[str]
    scaled_columns: list[str]
    sample: list[dict]


class FeatureListResponse(BaseModel):
    selected_features: list[str]
    target: str
    removed_features: list[str]
    feature_count: int


class TrainTestSplitResponse(BaseModel):
    total_rows: int
    train_size: int
    test_size: int
    validation_size: int
    train_ratio: float
    test_ratio: float
    validation_ratio: float


class PipelineStatusResponse(BaseModel):
    status: str
    steps: list[dict]
    last_run_at: datetime | None
    dataset_rows: int
    selected_features: int


class DemandPredictionInput(BaseModel):
    product: str
    current_stock: float
    search_count: float
    failed_searches: float
    sales: float
    festival: bool
    temperature: float
    demand_score: float

class DemandPredictionResponse(BaseModel):
    predicted_demand: float
    confidence_score: float

class SalesPredictionInput(BaseModel):
    today_sales: float
    yesterday_sales: float
    stock: float
    category: str
    festival: bool
    weather: float
    search_count: float

class SalesPredictionResponse(BaseModel):
    predicted_sales: float
    formatted_sales: str
    confidence_score: float

class StockoutPredictionInput(BaseModel):
    current_stock: float
    average_daily_sales: float
    demand_score: float
    warehouse: str
    festival: bool
    weather: float

class StockoutPredictionResponse(BaseModel):
    stockout_risk: str
    stockout_probability: float
    risk_code: int

class ReorderPredictionInput(BaseModel):
    average_sales: float
    demand: float
    festival: bool
    weather: float
    warehouse: str
    lead_time: float
    supplier_delay: float
    current_stock: float

class ReorderPredictionResponse(BaseModel):
    recommended_quantity: float
    days_of_stock_left: float
