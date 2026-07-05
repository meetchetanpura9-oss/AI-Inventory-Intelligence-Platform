from uuid import UUID

from pydantic import BaseModel, Field, field_validator


class CustomerSearchCreate(BaseModel):

    keyword: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Product search keyword entered by the customer",
    )

    city: str | None = Field(default=None, max_length=100)
    state: str | None = Field(default=None, max_length=100)
    area: str | None = Field(default=None, max_length=100)
    device: str | None = Field(default=None, max_length=50)
    latitude: float | None = None
    longitude: float | None = None

    @field_validator("keyword", mode="before")
    @classmethod
    def strip_keyword(cls, value):
        if isinstance(value, str):
            return value.strip()
        return value


class SearchProductInfo(BaseModel):

    id: int
    name: str


class CustomerSearchResponse(BaseModel):

    message: str
    found: bool
    product: SearchProductInfo | None = None
    search_id: UUID | None = None


from datetime import datetime

class SearchHistoryResponse(BaseModel):
    id: UUID
    customer_id: UUID | None = None
    searched_keyword: str
    searched_product: str | None = None
    city: str | None = None
    state: str | None = None
    area: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    dark_store_id: UUID | None = None
    found: bool
    weather: str | None = None
    festival: str | None = None
    temperature: float | None = None
    device: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class FailedSearchResponse(BaseModel):
    id: UUID
    customer_id: UUID | None = None
    searched_keyword: str
    searched_product: str | None = None
    city: str | None = None
    state: str | None = None
    area: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    dark_store_id: UUID | None = None
    found: bool
    weather: str | None = None
    festival: str | None = None
    temperature: float | None = None
    device: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class TopProductResponse(BaseModel):
    searched_product: str | None = None
    search_count: int

    class Config:
        from_attributes = True


class TopFailedProductResponse(BaseModel):
    searched_keyword: str
    search_count: int

    class Config:
        from_attributes = True


class CityAnalyticsResponse(BaseModel):
    city: str | None = None
    search_count: int

    class Config:
        from_attributes = True


class AreaAnalyticsResponse(BaseModel):
    area: str | None = None
    search_count: int

    class Config:
        from_attributes = True

