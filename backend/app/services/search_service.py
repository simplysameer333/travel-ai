"""Thin re-export — keeps any existing imports working.

To add a new transport type:
1. Create backend/app/services/<type>_service.py with a search_<type>() function
2. Add its schema to backend/app/schemas/search.py
3. Import and call it from ai_service.py
4. Add a card in frontend/components/search/cards/<Type>Card.tsx
5. Register it in ResultCard.tsx CARD_MAP
"""

from app.services.flights_service import search_flights as search_flights
from app.services.hotels_service import search_hotels as search_hotels
from app.services.trains_service import search_trains as search_trains
from app.services.buses_service import search_buses as search_buses

__all__ = ["search_flights", "search_hotels", "search_trains", "search_buses"]
