from fastapi import APIRouter

from datetime import date, timedelta

from app.schemas.search import (
    AIQueryRequest,
    BusSearchRequest,
    FlightSearchRequest,
    HotelSearchRequest,
    StructuredSearchRequest,
    TrainSearchRequest,
)
from app.services import search_service, ai_service

router = APIRouter()


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------

@router.get("/api/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "message": "Travel AI API is running"}


# ---------------------------------------------------------------------------
# Flight search
# ---------------------------------------------------------------------------

@router.post("/api/search/flights", tags=["Search"])
async def search_flights(req: FlightSearchRequest):
    results = await search_service.search_flights(req)
    return {"success": True, "count": len(results), "results": results}


# ---------------------------------------------------------------------------
# Hotel search
# ---------------------------------------------------------------------------

@router.post("/api/search/hotels", tags=["Search"])
async def search_hotels(req: HotelSearchRequest):
    results = await search_service.search_hotels(req)
    return {"success": True, "count": len(results), "results": results}


# ---------------------------------------------------------------------------
# Train search
# ---------------------------------------------------------------------------

@router.post("/api/search/trains", tags=["Search"])
async def search_trains(req: TrainSearchRequest):
    results = await search_service.search_trains(req)
    return {"success": True, "count": len(results), "results": results}


# ---------------------------------------------------------------------------
# Bus search
# ---------------------------------------------------------------------------

@router.post("/api/search/buses", tags=["Search"])
async def search_buses(req: BusSearchRequest):
    results = await search_service.search_buses(req)
    return {"success": True, "count": len(results), "results": results}


# ---------------------------------------------------------------------------
# Structured search — takes pre-parsed intent, skips LLM, same response shape
# ---------------------------------------------------------------------------

@router.post("/api/ai/structured", tags=["AI"])
async def structured_query(req: StructuredSearchRequest):
    default_date = date.today() + timedelta(weeks=2)
    results = []

    try:
        if req.intent == "flight":
            flight_req = FlightSearchRequest(
                from_city=req.from_city or "Delhi",
                to_city=req.to_city or "Mumbai",
                departure_date=req.travel_date or default_date,
                return_date=req.return_date,
                travelers=req.travelers,
            )
            results = await search_service.search_flights(flight_req)

        elif req.intent == "hotel":
            nights = req.nights or 2
            check_in = req.check_in or default_date
            check_out = req.check_out or (check_in + timedelta(days=nights))
            hotel_req = HotelSearchRequest(
                city=req.city or req.to_city or "Goa",
                check_in=check_in,
                check_out=check_out,
                guests=req.travelers,
            )
            results = await search_service.search_hotels(hotel_req)

        elif req.intent == "train":
            train_req = TrainSearchRequest(
                from_city=req.from_city or "Delhi",
                to_city=req.to_city or "Mumbai",
                travel_date=req.travel_date or default_date,
            )
            results = await search_service.search_trains(train_req)

        elif req.intent == "bus":
            bus_req = BusSearchRequest(
                from_city=req.from_city or "Bangalore",
                to_city=req.to_city or "Mysore",
                travel_date=req.travel_date or default_date,
            )
            results = await search_service.search_buses(bus_req)

    except Exception:
        results = []

    # Budget filter
    if req.budget_total and results:
        price_key = "total_price" if req.intent in ("flight", "hotel") else "price"
        affordable = [r for r in results if r.get(price_key, 0) <= req.budget_total]
        if affordable:
            results = affordable

    route = (
        f"{req.from_city} → {req.to_city}" if req.from_city and req.to_city
        else req.city or ""
    )
    ai_message = f"Showing {req.intent} results for {route}."

    intent_dict = {
        "intent": req.intent,
        "from_city": req.from_city,
        "to_city": req.to_city,
        "city": req.city,
        "travel_date": req.travel_date.isoformat() if req.travel_date else None,
        "return_date": req.return_date.isoformat() if req.return_date else None,
        "check_in": req.check_in.isoformat() if req.check_in else None,
        "check_out": req.check_out.isoformat() if req.check_out else None,
        "travelers": req.travelers,
        "nights": req.nights,
        "budget_total": req.budget_total,
        "ai_message": ai_message,
    }

    return {"success": True, "intent": intent_dict, "results": results, "ai_message": ai_message}


# ---------------------------------------------------------------------------
# AI query — parses natural language, runs search, returns structured results
# ---------------------------------------------------------------------------

@router.post("/api/ai/query", tags=["AI"])
async def ai_query(req: AIQueryRequest):
    try:
        result = await ai_service.parse_and_search(req.query)
        return {"success": True, **result}
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "intent": None,
            "results": [],
            "ai_message": "Sorry, I had trouble understanding your query. Please try again.",
        }
