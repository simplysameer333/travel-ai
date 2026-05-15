from datetime import date
from typing import Optional

from pydantic import BaseModel, Field


class FlightSearchRequest(BaseModel):
    from_city: str = Field(..., examples=["Delhi"])
    to_city: str = Field(..., examples=["Mumbai"])
    departure_date: date
    return_date: Optional[date] = None
    travelers: int = Field(default=1, ge=1, le=9)


class HotelSearchRequest(BaseModel):
    city: str = Field(..., examples=["Goa"])
    check_in: date
    check_out: date
    guests: int = Field(default=1, ge=1, le=20)


class TrainSearchRequest(BaseModel):
    from_city: str = Field(..., examples=["Delhi"])
    to_city: str = Field(..., examples=["Agra"])
    travel_date: date


class BusSearchRequest(BaseModel):
    from_city: str = Field(..., examples=["Bangalore"])
    to_city: str = Field(..., examples=["Mysore"])
    travel_date: date


class AIQueryRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=2000, examples=["Plan a 5-day trip to Rajasthan"])


class StructuredSearchRequest(BaseModel):
    """Direct structured search — bypasses LLM, uses pre-parsed intent fields."""
    intent: str = Field(default="flight", examples=["flight"])
    from_city: Optional[str] = None
    to_city: Optional[str] = None
    city: Optional[str] = None
    travel_date: Optional[date] = None
    return_date: Optional[date] = None
    check_in: Optional[date] = None
    check_out: Optional[date] = None
    travelers: int = Field(default=1, ge=1, le=9)
    nights: Optional[int] = None
    budget_total: Optional[int] = None
