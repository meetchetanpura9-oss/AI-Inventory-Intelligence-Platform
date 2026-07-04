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
