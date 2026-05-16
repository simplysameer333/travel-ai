"""
AI endpoints beyond the core chat stream.
These accept structured requests and return JSON results from individual agents.
Useful for the frontend search pages and future booking/payment flows.
"""
from __future__ import annotations

import logging
from typing import Optional

from fastapi import APIRouter
from pydantic import BaseModel

log = logging.getLogger(__name__)
router = APIRouter(prefix="/api/ai", tags=["AI"])


# ─────────────────────────────────────────────
# Request / Response schemas
# ─────────────────────────────────────────────

class FlightSearchRequest(BaseModel):
    origin: str
    destination: str
    departure_date: Optional[str] = ""
    return_date: Optional[str] = ""
    passengers: int = 1
    cabin: str = "economy"


class TrainSearchRequest(BaseModel):
    origin: str
    destination: str
    date: Optional[str] = ""
    passengers: int = 1
    travel_class: str = "3A"


class HotelSearchRequest(BaseModel):
    city: str
    checkin: Optional[str] = ""
    checkout: Optional[str] = ""
    guests: int = 1
    budget_tier: str = "standard"


class BusSearchRequest(BaseModel):
    origin: str
    destination: str
    date: Optional[str] = ""
    passengers: int = 1


class CarSearchRequest(BaseModel):
    city: str
    pickup_date: Optional[str] = ""
    drop_date: Optional[str] = ""
    car_type: str = "any"


class PackageSearchRequest(BaseModel):
    destination: str
    origin: str = "Delhi"
    passengers: int = 1
    trip_style: str = "standard"
    duration_days: int = 0


class BudgetEstimateRequest(BaseModel):
    origin: str
    destination: str
    nights: int
    passengers: int = 1
    trip_style: str = "standard"


class VisaRequest(BaseModel):
    destination: str
    from_country: str = "India"


# ─────────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────────

@router.post("/flights")
async def search_flights(req: FlightSearchRequest):
    from app.agents import flights_agent
    return await flights_agent.search(
        req.origin, req.destination, req.departure_date,
        req.passengers, req.cabin, req.return_date,
    )


@router.post("/trains")
async def search_trains(req: TrainSearchRequest):
    from app.agents import trains_agent
    return await trains_agent.search(req.origin, req.destination, req.date, req.passengers, req.travel_class)


@router.post("/hotels")
async def search_hotels(req: HotelSearchRequest):
    from app.agents import hotels_agent
    return await hotels_agent.search(req.city, req.checkin, req.checkout, req.guests, req.budget_tier)


@router.post("/buses")
async def search_buses(req: BusSearchRequest):
    from app.agents import buses_agent
    return await buses_agent.search(req.origin, req.destination, req.date, req.passengers)


@router.post("/cars")
async def search_cars(req: CarSearchRequest):
    from app.agents import cars_agent
    return await cars_agent.search(req.city, req.pickup_date, req.drop_date, req.car_type)


@router.post("/packages")
async def search_packages(req: PackageSearchRequest):
    from app.agents import packages_agent
    return await packages_agent.search(req.destination, req.origin, req.passengers, req.trip_style, req.duration_days)


@router.post("/budget-estimate")
async def budget_estimate(req: BudgetEstimateRequest):
    from app.agents import budget_agent
    return await budget_agent.estimate(req.origin, req.destination, req.nights, req.passengers, req.trip_style)


@router.post("/visa")
async def visa_info(req: VisaRequest):
    from app.agents import visa_agent
    return await visa_agent.get_requirements(req.destination, req.from_country)
