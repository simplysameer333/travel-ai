"""
Realistic mock data generators for all travel verticals.
Each function accepts search params and returns plausible structured results.
Replace the return value with real API calls when APIs are wired up.
"""
from __future__ import annotations

import hashlib
import random
from datetime import datetime, timedelta
from typing import Any

# ─────────────────────────────────────────────
# City / airport reference
# ─────────────────────────────────────────────

CITY_CODE: dict[str, str] = {
    # Domestic
    "delhi": "DEL", "new delhi": "DEL",
    "mumbai": "BOM", "bombay": "BOM",
    "bangalore": "BLR", "bengaluru": "BLR",
    "hyderabad": "HYD",
    "chennai": "MAA", "madras": "MAA",
    "kolkata": "CCU", "calcutta": "CCU",
    "goa": "GOI",
    "kochi": "COK", "cochin": "COK",
    "jaipur": "JAI",
    "ahmedabad": "AMD",
    "pune": "PNQ",
    "lucknow": "LKO",
    "chandigarh": "IXC",
    "bhubaneswar": "BBI",
    "patna": "PAT",
    "nagpur": "NAG",
    "indore": "IDR",
    "varanasi": "VNS",
    "amritsar": "ATQ",
    "srinagar": "SXR",
    "leh": "IXL",
    "guwahati": "GAU",
    "bhopal": "BHO",
    "andaman": "IXZ", "port blair": "IXZ",
    "manali": "KUU",
    "agra": "AGR",
    "udaipur": "UDR",
    "shimla": "SLV",
    # International
    "dubai": "DXB",
    "abu dhabi": "AUH",
    "singapore": "SIN",
    "bangkok": "BKK",
    "bali": "DPS",
    "london": "LHR",
    "paris": "CDG",
    "tokyo": "NRT",
    "new york": "JFK",
    "maldives": "MLE",
    "colombo": "CMB",
    "kathmandu": "KTM",
    "beijing": "PEK",
    "shanghai": "PVG",
    "hong kong": "HKG",
    "taipei": "TPE",
    "kuala lumpur": "KUL",
    "phuket": "HKT",
    "amsterdam": "AMS",
    "rome": "FCO",
    "barcelona": "BCN",
    "sydney": "SYD",
    "toronto": "YYZ",
}

DOMESTIC_CODES = {
    "DEL","BOM","BLR","HYD","MAA","CCU","GOI","COK","JAI","AMD",
    "PNQ","LKO","IXC","BBI","PAT","NAG","IDR","VNS","ATQ","SXR",
    "IXL","GAU","BHO","AGR","IXZ","KUU","UDR","SLV",
}

ROUTE_HOURS: dict[tuple[str,str], float] = {
    # Domestic
    ("DEL","BOM"): 2.1, ("DEL","BLR"): 2.7, ("DEL","GOI"): 2.3,
    ("DEL","HYD"): 2.0, ("DEL","MAA"): 2.8, ("DEL","CCU"): 2.2,
    ("DEL","COK"): 3.2, ("DEL","JAI"): 1.1, ("DEL","AMD"): 1.5,
    ("DEL","PNQ"): 2.0, ("DEL","LKO"): 1.0, ("DEL","VNS"): 1.2,
    ("DEL","ATQ"): 1.0, ("DEL","SXR"): 1.2, ("DEL","IXL"): 1.5,
    ("BOM","GOI"): 1.2, ("BOM","BLR"): 1.5, ("BOM","COK"): 1.8,
    ("BOM","HYD"): 1.5, ("BOM","MAA"): 2.0, ("BOM","CCU"): 2.5,
    ("BLR","HYD"): 1.2, ("BLR","GOI"): 1.5, ("BLR","MAA"): 1.1,
    ("BLR","COK"): 1.3, ("BLR","CCU"): 2.5,
    ("HYD","MAA"): 1.2, ("HYD","COK"): 1.7,
    # International
    ("DEL","DXB"): 3.5, ("BOM","DXB"): 3.1,
    ("DEL","SIN"): 5.5, ("BOM","SIN"): 5.2,
    ("DEL","BKK"): 4.2, ("BOM","BKK"): 4.0,
    ("DEL","DPS"): 7.0,
    ("DEL","LHR"): 9.0, ("BOM","LHR"): 9.2,
    ("DEL","CDG"): 9.5,
    ("DEL","NRT"): 8.0,
    ("DEL","PEK"): 5.5,
    ("DEL","HKG"): 6.5,
    ("DEL","MLE"): 4.0,
    ("DEL","CMB"): 3.5,
    ("DEL","KTM"): 1.5,
    ("DEL","KUL"): 6.5,
    ("DEL","HKT"): 5.5,
    ("DEL","AMS"): 8.5,
    ("DEL","FCO"): 8.5,
    ("DEL","BCN"): 9.5,
    ("DEL","JFK"): 14.0,
    ("DEL","SYD"): 13.5,
}

# ─────────────────────────────────────────────
# Airlines
# ─────────────────────────────────────────────

DOM_AIRLINES = [
    {"code": "6E", "name": "IndiGo",    "tier": "budget",  "baggage": "15 kg", "refundable": False},
    {"code": "SG", "name": "SpiceJet",  "tier": "budget",  "baggage": "15 kg", "refundable": False},
    {"code": "QP", "name": "Akasa Air", "tier": "budget",  "baggage": "15 kg", "refundable": False},
    {"code": "AI", "name": "Air India", "tier": "full",    "baggage": "23 kg", "refundable": True},
    {"code": "UK", "name": "Vistara",   "tier": "full",    "baggage": "20 kg", "refundable": True},
]

INTL_AIRLINES = [
    {"code": "AI", "name": "Air India",            "tier": "full",    "baggage": "23 kg", "refundable": True},
    {"code": "EK", "name": "Emirates",             "tier": "full",    "baggage": "30 kg", "refundable": True},
    {"code": "SQ", "name": "Singapore Airlines",  "tier": "premium", "baggage": "30 kg", "refundable": True},
    {"code": "FZ", "name": "flydubai",             "tier": "budget",  "baggage": "20 kg", "refundable": False},
    {"code": "FD", "name": "Thai AirAsia",         "tier": "budget",  "baggage": "20 kg", "refundable": False},
    {"code": "QR", "name": "Qatar Airways",        "tier": "premium", "baggage": "30 kg", "refundable": True},
    {"code": "UK", "name": "Vistara",              "tier": "full",    "baggage": "20 kg", "refundable": True},
    {"code": "MH", "name": "Malaysia Airlines",   "tier": "full",    "baggage": "25 kg", "refundable": True},
    {"code": "TG", "name": "Thai Airways",         "tier": "full",    "baggage": "30 kg", "refundable": True},
]

# ─────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────

def _seed(s: str) -> int:
    return int(hashlib.md5(s.encode()).hexdigest()[:8], 16)


def _code(city: str) -> str:
    return CITY_CODE.get(city.lower().strip(), city.upper()[:3])


def _duration_hours(origin: str, destination: str) -> float:
    o, d = _code(origin), _code(destination)
    return (
        ROUTE_HOURS.get((o, d))
        or ROUTE_HOURS.get((d, o))
        or max(1.0, len(origin + destination) * 0.08)  # fallback estimate
    )


def _is_international(origin: str, destination: str) -> bool:
    return _code(origin) not in DOMESTIC_CODES or _code(destination) not in DOMESTIC_CODES


def _fmt_duration(hours: float) -> str:
    h, m = int(hours), int((hours % 1) * 60)
    return f"{h}h {m:02d}m" if m else f"{h}h"


# ─────────────────────────────────────────────
# Flight generator
# ─────────────────────────────────────────────

def generate_flights(
    origin: str,
    destination: str,
    date: str,
    passengers: int = 1,
    cabin: str = "economy",
) -> list[dict[str, Any]]:
    duration = _duration_hours(origin, destination)
    intl = _is_international(origin, destination)
    airlines = INTL_AIRLINES if intl else DOM_AIRLINES
    rng = random.Random(_seed(f"flight{origin}{destination}{date}"))

    # Base price per person
    if intl:
        base = 12000 if duration < 3 else (22000 if duration < 6 else 45000)
    else:
        base = int(duration * 1100 + 1800)
    if cabin == "business":
        base = int(base * 3.5)

    results: list[dict] = []
    dep_slots = ["06:00", "09:25", "13:45", "17:15", "20:30"]
    selected = rng.sample(airlines, min(4, len(airlines)))

    for i, al in enumerate(selected):
        dep_str = dep_slots[i % len(dep_slots)]
        dep_dt = datetime.strptime(f"{date or '2026-06-01'} {dep_str}", "%Y-%m-%d %H:%M")
        arr_dt = dep_dt + timedelta(hours=duration + rng.choice([0, 0, 0.5, 1.0]))
        price = int(base * rng.uniform(0.88, 1.28))
        stops = 0 if (not intl or duration < 6) else rng.choice([0, 0, 1])

        results.append({
            "airline": al["name"],
            "flight_no": f"{al['code']}-{rng.randint(100, 999)}",
            "origin_code": _code(origin),
            "dest_code": _code(destination),
            "departure": dep_dt.strftime("%H:%M"),
            "arrival": arr_dt.strftime("%H:%M"),
            "duration": _fmt_duration(duration),
            "stops": stops,
            "cabin": cabin,
            "price_per_person": price,
            "total_price": price * passengers,
            "baggage": al["baggage"],
            "refundable": al["refundable"],
            "currency": "INR",
        })

    results.sort(key=lambda x: x["price_per_person"])
    return results


# ─────────────────────────────────────────────
# Train generator
# ─────────────────────────────────────────────

TRAIN_NAMES = [
    "Rajdhani Express", "Shatabdi Express", "Vande Bharat Express",
    "Duronto Express", "Garib Rath Express", "Jan Shatabdi Express",
]
TRAIN_CLASSES = {
    "1A": {"label": "AC First Class",   "multiplier": 1.0},
    "2A": {"label": "AC 2-Tier",        "multiplier": 0.55},
    "3A": {"label": "AC 3-Tier",        "multiplier": 0.38},
    "SL": {"label": "Sleeper Class",    "multiplier": 0.18},
}


def generate_trains(
    origin: str,
    destination: str,
    date: str,
    passengers: int = 1,
    travel_class: str = "3A",
) -> list[dict[str, Any]]:
    # Train distance ≈ 1.4× air distance equivalent
    air_h = _duration_hours(origin, destination)
    if _is_international(origin, destination):
        return []  # Trains only domestic

    rng = random.Random(_seed(f"train{origin}{destination}{date}"))
    train_hours = air_h * 5.5 + rng.uniform(-0.5, 1.5)
    train_hours = max(1.5, train_hours)

    base_1A = int(air_h * 700 + 1200)
    cls_info = TRAIN_CLASSES.get(travel_class, TRAIN_CLASSES["3A"])
    base_price = int(base_1A * cls_info["multiplier"])

    results = []
    dep_slots = ["06:00", "10:30", "14:00", "19:45", "22:30"]
    num_trains = min(3, len(TRAIN_NAMES))
    selected = rng.sample(TRAIN_NAMES, num_trains)

    for i, name in enumerate(selected):
        dep_str = dep_slots[i % len(dep_slots)]
        dep_dt = datetime.strptime(f"{date or '2026-06-01'} {dep_str}", "%Y-%m-%d %H:%M")
        arr_dt = dep_dt + timedelta(hours=train_hours)
        price = int(base_price * rng.uniform(0.92, 1.12))
        availability = rng.choice(["AVAILABLE", "AVAILABLE", "WL-12", "RAC-5"])

        results.append({
            "train_name": name,
            "train_no": f"{rng.randint(10000, 19999)}",
            "origin": origin.title(),
            "destination": destination.title(),
            "departure": dep_dt.strftime("%H:%M"),
            "arrival": arr_dt.strftime("%H:%M (+1)" if arr_dt.day > dep_dt.day else "%H:%M"),
            "duration": _fmt_duration(train_hours),
            "travel_class": travel_class,
            "class_name": cls_info["label"],
            "price_per_person": price,
            "total_price": price * passengers,
            "availability": availability,
            "currency": "INR",
        })

    results.sort(key=lambda x: x["price_per_person"])
    return results


# ─────────────────────────────────────────────
# Hotel generator
# ─────────────────────────────────────────────

HOTEL_TIERS = {
    "budget":  {"brands": ["OYO", "Treebo", "FabHotel", "GoStays"],   "min": 600,  "max": 2000},
    "standard":{"brands": ["ibis", "Lemon Tree", "Ginger", "Holiday Inn Express"], "min": 2000, "max": 5000},
    "premium": {"brands": ["Marriott", "Hyatt", "Taj Vivanta", "Radisson Blu"],    "min": 5000, "max": 15000},
    "luxury":  {"brands": ["Taj", "Oberoi", "ITC", "The Leela"],      "min": 15000,"max": 50000},
}

CITY_AREAS: dict[str, list[str]] = {
    "goa":       ["Calangute", "Baga", "Candolim", "Colva", "Panjim"],
    "mumbai":    ["Bandra", "Juhu", "Andheri", "Lower Parel", "Colaba"],
    "delhi":     ["Connaught Place", "Aerocity", "South Delhi", "Karol Bagh"],
    "bangalore": ["MG Road", "Koramangala", "Whitefield", "Indiranagar"],
    "jaipur":    ["MI Road", "C-Scheme", "Sindhi Camp", "Bani Park"],
    "kerala":    ["Varkala", "Alleppey", "Munnar", "Fort Kochi"],
    "bali":      ["Seminyak", "Ubud", "Kuta", "Nusa Dua", "Canggu"],
    "dubai":     ["Downtown", "Deira", "JBR", "Business Bay"],
    "goa":       ["Calangute", "Baga", "Candolim", "Anjuna"],
}


def generate_hotels(
    city: str,
    checkin: str,
    checkout: str,
    guests: int = 1,
    budget_tier: str = "standard",
) -> list[dict[str, Any]]:
    rng = random.Random(_seed(f"hotel{city}{checkin}{checkout}"))

    try:
        nights = (
            datetime.strptime(checkout or "2026-06-03", "%Y-%m-%d")
            - datetime.strptime(checkin or "2026-06-01", "%Y-%m-%d")
        ).days
    except Exception:
        nights = 2
    nights = max(1, nights)

    tier_opts = ["budget", "standard", "premium", "luxury"]
    # Return 2 budget + this tier + 1 premium for variety
    tiers_to_gen = {budget_tier}
    if budget_tier != "budget":
        tiers_to_gen.add("budget")
    if budget_tier not in ("luxury", "premium"):
        tiers_to_gen.add("premium")

    areas = CITY_AREAS.get(city.lower(), ["City Centre", "Old Town", "Airport Area", "Beach Area"])
    results = []

    for t in tiers_to_gen:
        info = HOTEL_TIERS[t]
        brand = rng.choice(info["brands"])
        area = rng.choice(areas)
        nightly = rng.randint(info["min"], info["max"])
        total = nightly * nights

        results.append({
            "hotel_name": f"{brand} {city.title()}",
            "area": area,
            "city": city.title(),
            "tier": t,
            "star_rating": {"budget": 2, "standard": 3, "premium": 4, "luxury": 5}[t],
            "nightly_rate": nightly,
            "total_price": total,
            "nights": nights,
            "guests": guests,
            "amenities": _hotel_amenities(t, rng),
            "rating": round(rng.uniform(3.8, 4.9), 1),
            "reviews": rng.randint(120, 4500),
            "free_cancellation": t in ("standard", "premium", "luxury"),
            "breakfast_included": t in ("premium", "luxury"),
            "currency": "INR",
        })

    results.sort(key=lambda x: x["nightly_rate"])
    return results


def _hotel_amenities(tier: str, rng: random.Random) -> list[str]:
    base = ["Free WiFi", "Air Conditioning"]
    if tier in ("standard", "premium", "luxury"):
        base += ["Swimming Pool", "24-hr Front Desk", "Restaurant"]
    if tier in ("premium", "luxury"):
        base += ["Spa", "Gym", "Room Service", "Concierge"]
    if tier == "luxury":
        base += ["Butler Service", "Private Pool", "Airport Transfer"]
    return base


# ─────────────────────────────────────────────
# Bus generator
# ─────────────────────────────────────────────

BUS_OPERATORS = [
    "RedBus", "Orange Travels", "SRS Travels", "VRL Travels",
    "Parveen Travels", "KPN Travels", "Kallada Travels", "KSRTC",
]
BUS_TYPES = ["Sleeper", "AC Sleeper", "Semi-Sleeper", "AC Seater", "Volvo AC"]


def generate_buses(
    origin: str,
    destination: str,
    date: str,
    passengers: int = 1,
) -> list[dict[str, Any]]:
    if _is_international(origin, destination):
        return []

    air_h = _duration_hours(origin, destination)
    bus_hours = air_h * 5.0 + random.Random(_seed(f"bus{origin}{destination}")).uniform(0, 2)
    bus_hours = max(2.0, bus_hours)

    rng = random.Random(_seed(f"bus{origin}{destination}{date}"))
    base_price = int(bus_hours * 80 + 200)

    results = []
    dep_slots = ["18:00", "20:00", "21:30", "22:30"]
    selected = rng.sample(BUS_OPERATORS, min(4, len(BUS_OPERATORS)))

    for i, op in enumerate(selected):
        bus_type = rng.choice(BUS_TYPES)
        dep_str = dep_slots[i % len(dep_slots)]
        dep_dt = datetime.strptime(f"{date or '2026-06-01'} {dep_str}", "%Y-%m-%d %H:%M")
        arr_dt = dep_dt + timedelta(hours=bus_hours)
        multi = {"Sleeper": 1.0, "AC Sleeper": 1.6, "Semi-Sleeper": 0.85, "AC Seater": 1.3, "Volvo AC": 1.5}
        price = int(base_price * multi.get(bus_type, 1.0) * rng.uniform(0.9, 1.15))

        results.append({
            "operator": op,
            "bus_type": bus_type,
            "origin": origin.title(),
            "destination": destination.title(),
            "departure": dep_dt.strftime("%H:%M"),
            "arrival": arr_dt.strftime("%H:%M (+1)" if arr_dt.day > dep_dt.day else "%H:%M"),
            "duration": _fmt_duration(bus_hours),
            "price_per_person": price,
            "total_price": price * passengers,
            "seats_available": rng.randint(3, 28),
            "rating": round(rng.uniform(3.5, 4.8), 1),
            "currency": "INR",
        })

    results.sort(key=lambda x: x["price_per_person"])
    return results


# ─────────────────────────────────────────────
# Car rental generator
# ─────────────────────────────────────────────

CAR_TYPES = [
    {"type": "Hatchback", "model": "Maruti Swift",        "base_per_day": 1200},
    {"type": "Sedan",     "model": "Honda City",          "base_per_day": 1800},
    {"type": "SUV",       "model": "Toyota Innova Crysta","base_per_day": 2800},
    {"type": "Luxury",    "model": "Mercedes-Benz E-Class","base_per_day": 5500},
    {"type": "MPV",       "model": "Kia Carnival",        "base_per_day": 3500},
]
CAR_VENDORS = ["Zoomcar", "Myles", "Revv", "Avis", "Hertz"]


def generate_cars(
    city: str,
    pickup_date: str,
    drop_date: str,
    car_type: str = "any",
) -> list[dict[str, Any]]:
    rng = random.Random(_seed(f"car{city}{pickup_date}"))
    try:
        days = max(1, (
            datetime.strptime(drop_date or "2026-06-03", "%Y-%m-%d")
            - datetime.strptime(pickup_date or "2026-06-01", "%Y-%m-%d")
        ).days)
    except Exception:
        days = 1

    if car_type.lower() == "any":
        cars = CAR_TYPES
    else:
        cars = [c for c in CAR_TYPES if car_type.lower() in c["type"].lower()] or CAR_TYPES

    results = []
    for car in cars[:4]:
        vendor = rng.choice(CAR_VENDORS)
        daily = int(car["base_per_day"] * rng.uniform(0.9, 1.2))
        total = daily * days

        results.append({
            "car_type": car["type"],
            "model": car["model"],
            "vendor": vendor,
            "city": city.title(),
            "pickup_date": pickup_date,
            "drop_date": drop_date,
            "days": days,
            "price_per_day": daily,
            "total_price": total,
            "fuel_type": rng.choice(["Petrol", "Diesel", "CNG"]),
            "seats": {"Hatchback": 5, "Sedan": 5, "SUV": 7, "Luxury": 5, "MPV": 8}.get(car["type"], 5),
            "ac": True,
            "km_limit": f"{rng.choice([200, 250, 300])} km/day",
            "currency": "INR",
        })

    return results


# ─────────────────────────────────────────────
# Package generator
# ─────────────────────────────────────────────

PACKAGE_TEMPLATES: dict[str, dict] = {
    "goa": {
        "title": "Goa Sun & Sand Package",
        "nights": 4,
        "includes": ["Return flights", "4N hotel (3★)", "Airport transfers", "North Goa sightseeing"],
        "starting_price": 12999,
    },
    "kerala": {
        "title": "God's Own Country — Kerala Escape",
        "nights": 5,
        "includes": ["Return flights", "5N stay (Houseboat + Resort)", "Munnar + Alleppey + Kochi tour", "Meals"],
        "starting_price": 17999,
    },
    "rajasthan": {
        "title": "Rajasthan Royal Heritage Tour",
        "nights": 6,
        "includes": ["Return flights", "6N heritage hotels", "Jaipur + Jodhpur + Udaipur", "Heritage walks", "Camel safari"],
        "starting_price": 22999,
    },
    "himachal": {
        "title": "Himachal Adventure — Manali & Shimla",
        "nights": 6,
        "includes": ["Return flights", "6N hotel", "Manali + Shimla", "Rohtang Day Trip", "Solang Valley"],
        "starting_price": 19999,
    },
    "andaman": {
        "title": "Andaman Island Paradise",
        "nights": 5,
        "includes": ["Return flights", "5N stay", "Ferry tickets", "Radhanagar Beach", "Scuba intro", "Havelock Island"],
        "starting_price": 24999,
    },
    "dubai": {
        "title": "Dubai Extravaganza",
        "nights": 5,
        "includes": ["Return flights", "5N 4★ hotel", "Dubai City Tour", "Desert Safari", "Burj Khalifa (At the Top)", "Dhow Cruise"],
        "starting_price": 39999,
    },
    "bali": {
        "title": "Bali Bliss",
        "nights": 6,
        "includes": ["Return flights", "6N resort", "Kuta + Seminyak + Ubud", "Tanah Lot temple", "Spa session", "Breakfast daily"],
        "starting_price": 44999,
    },
    "singapore": {
        "title": "Singapore — The Lion City Experience",
        "nights": 5,
        "includes": ["Return flights", "5N hotel", "Universal Studios", "Gardens by the Bay", "Sentosa Island", "City tour"],
        "starting_price": 54999,
    },
    "thailand": {
        "title": "Thailand — Bangkok & Phuket",
        "nights": 7,
        "includes": ["Return flights", "7N hotel", "Bangkok city tour", "Phi Phi Islands", "Thai massage", "Meals"],
        "starting_price": 42999,
    },
    "europe": {
        "title": "European Dream — 5 Countries",
        "nights": 10,
        "includes": ["Return flights", "10N hotels", "Paris + Amsterdam + Zurich + Vienna + Prague", "City tours", "Schengen visa assistance"],
        "starting_price": 129999,
    },
}


def generate_packages(
    destination: str,
    origin: str = "Delhi",
    passengers: int = 1,
    trip_style: str = "standard",
) -> list[dict[str, Any]]:
    dest_key = destination.lower().split()[0]
    rng = random.Random(_seed(f"pkg{destination}{origin}{passengers}"))

    # Find matching or related packages
    matches = []
    for key, tmpl in PACKAGE_TEMPLATES.items():
        if dest_key in key or key in dest_key:
            matches.append((key, tmpl))

    if not matches:
        # Generic package
        matches = [("generic", {
            "title": f"{destination.title()} Discovery Package",
            "nights": 5,
            "includes": ["Return flights", "5N hotel", "Airport transfers", "Sightseeing"],
            "starting_price": 29999,
        })]

    results = []
    for _, tmpl in matches[:2]:
        base = tmpl["starting_price"]
        if trip_style in ("premium", "luxury"):
            base = int(base * 1.7)
        total = int(base * rng.uniform(0.95, 1.1)) * passengers

        results.append({
            "title": tmpl["title"],
            "destination": destination.title(),
            "origin": origin.title(),
            "duration": f"{tmpl['nights']} Nights / {tmpl['nights'] + 1} Days",
            "nights": tmpl["nights"],
            "passengers": passengers,
            "includes": tmpl["includes"],
            "price_per_person": int(total / passengers),
            "total_price": total,
            "validity": "Jun – Sep 2026",
            "customizable": True,
            "currency": "INR",
        })

    return results


# ─────────────────────────────────────────────
# Budget estimator
# ─────────────────────────────────────────────

def estimate_budget(
    origin: str,
    destination: str,
    nights: int,
    passengers: int,
    trip_style: str = "standard",
    international: bool = False,
) -> dict[str, Any]:
    rng = random.Random(_seed(f"budget{destination}{nights}{trip_style}"))

    tiers = {
        "budget":   {"hotel": 1200, "food": 600,  "local": 500,  "misc": 300},
        "standard": {"hotel": 3500, "food": 1200, "local": 1200, "misc": 800},
        "premium":  {"hotel": 8000, "food": 2500, "local": 2500, "misc": 1500},
        "luxury":   {"hotel": 20000,"food": 5000, "local": 5000, "misc": 3000},
    }
    t = tiers.get(trip_style, tiers["standard"])

    hotel_total = t["hotel"] * nights * passengers
    food_total  = t["food"]  * nights * passengers
    local_total = t["local"] * nights * passengers
    misc_total  = t["misc"]  * nights

    # Rough flight cost
    air_h = _duration_hours(origin, destination)
    if international:
        flight_base = 12000 if air_h < 3 else (22000 if air_h < 6 else 45000)
    else:
        flight_base = int(air_h * 1100 + 1800)
    if trip_style in ("premium", "luxury"):
        flight_base = int(flight_base * 1.5)
    flight_total = flight_base * 2 * passengers  # round-trip

    grand_total = flight_total + hotel_total + food_total + local_total + misc_total

    return {
        "destination": destination.title(),
        "nights": nights,
        "passengers": passengers,
        "trip_style": trip_style,
        "breakdown": {
            "flights_round_trip": flight_total,
            "accommodation": hotel_total,
            "food_and_dining": food_total,
            "local_transport": local_total,
            "miscellaneous": misc_total,
        },
        "total_estimate": grand_total,
        "per_person": int(grand_total / passengers),
        "currency": "INR",
        "note": "Estimate based on typical prices. Actual costs vary with availability and season.",
    }


# ─────────────────────────────────────────────
# Visa info
# ─────────────────────────────────────────────

VISA_INFO: dict[str, dict] = {
    "UAE": {
        "required": True, "type": "Tourist Visa on Arrival / E-Visa",
        "duration": "30 days (extendable)", "fee_inr": 5500,
        "processing": "2–3 business days (online)",
        "docs": ["Passport (6+ months validity)", "Return ticket", "Hotel booking", "Bank statement (₹1L+)", "Travel insurance"],
        "tips": "Apply via UAE ICP portal or through airline. Easy process for Indian travelers.",
    },
    "Singapore": {
        "required": True, "type": "Tourist Visa (VTF Application)",
        "duration": "30 days", "fee_inr": 2200,
        "processing": "3–5 business days",
        "docs": ["Passport", "Bank statement", "Return flights", "Hotel booking", "Photograph"],
        "tips": "Apply at VFS Centre or online. Singapore is very Indian-friendly with easy visa.",
    },
    "Thailand": {
        "required": False, "type": "Visa Free (30 days)",
        "duration": "30 days", "fee_inr": 0,
        "processing": "Granted at airport",
        "docs": ["Valid passport", "Return ticket", "THB 10,000 cash per person"],
        "tips": "Thailand offers visa-free access to Indian passport holders. Easy entry!",
    },
    "Bali (Indonesia)": {
        "required": False, "type": "Visa on Arrival (30 days)",
        "duration": "30 days (extendable to 60)", "fee_inr": 1500,
        "processing": "On arrival at Ngurah Rai Airport",
        "docs": ["Passport", "Return ticket", "USD 35 fee"],
        "tips": "Pay USD 35 at airport kiosk. Quick process. Very tourist-friendly destination.",
    },
    "China": {
        "required": True, "type": "Tourist Visa (L Visa)",
        "duration": "30 days single entry", "fee_inr": 6500,
        "processing": "4–7 business days",
        "docs": ["Passport", "Visa application form", "Itinerary", "Hotel bookings", "Bank statement (₹2L+)", "Photograph", "Return ticket"],
        "tips": "Apply at Chinese Visa Application Service Centre. Book through registered tour operators for easier processing.",
    },
    "UK": {
        "required": True, "type": "Standard Visitor Visa",
        "duration": "6 months (multi-entry)", "fee_inr": 8800,
        "processing": "15+ business days",
        "docs": ["Passport", "Bank statements (6 months)", "ITR", "Proof of employment", "Return ticket", "Hotel bookings", "Travel insurance"],
        "tips": "Apply well in advance. Strong bank statements and employment proof are key for Indian applicants.",
    },
    "Schengen": {
        "required": True, "type": "Schengen Visa (Type C)",
        "duration": "90 days within 180-day period", "fee_inr": 7500,
        "processing": "15–30 business days",
        "docs": ["Passport", "Bank statements", "ITR", "Travel insurance", "Hotel bookings", "Itinerary", "Return ticket"],
        "tips": "Apply at embassy of first entry country. Book hotels + flights before applying.",
    },
    "Maldives": {
        "required": False, "type": "Visa on Arrival (Free)",
        "duration": "30 days", "fee_inr": 0,
        "processing": "On arrival",
        "docs": ["Passport", "Return ticket", "Hotel booking"],
        "tips": "Visa-free for Indians! Arrival stamp is free. USD 100/day solvency proof may be asked.",
    },
    "Nepal": {
        "required": False, "type": "No Visa Required",
        "duration": "Unrestricted", "fee_inr": 0,
        "processing": "Passport or Voter ID accepted",
        "docs": ["Valid passport or Voter ID with photo"],
        "tips": "Indian passport holders don't need visa for Nepal. Open border access!",
    },
    "Sri Lanka": {
        "required": True, "type": "Electronic Travel Authorization (ETA)",
        "duration": "30 days", "fee_inr": 2000,
        "processing": "Online, instant to 24 hrs",
        "docs": ["Passport", "Return ticket", "Bank statement"],
        "tips": "Apply online at eta.gov.lk. Very easy and quick. Sri Lanka is welcoming to Indian tourists.",
    },
}


def get_visa_info(destination: str, from_country: str = "India") -> dict[str, Any]:
    # Map destination to visa key
    dest_lower = destination.lower()
    key_map = {
        "dubai": "UAE", "abu dhabi": "UAE", "sharjah": "UAE",
        "singapore": "Singapore",
        "thailand": "Thailand", "bangkok": "Thailand", "phuket": "Thailand",
        "bali": "Bali (Indonesia)", "indonesia": "Bali (Indonesia)", "lombok": "Bali (Indonesia)",
        "china": "China", "beijing": "China", "shanghai": "China", "guangzhou": "China",
        "uk": "UK", "london": "UK", "england": "UK", "scotland": "UK",
        "france": "Schengen", "germany": "Schengen", "italy": "Schengen",
        "spain": "Schengen", "netherlands": "Schengen", "europe": "Schengen",
        "maldives": "Maldives",
        "nepal": "Nepal", "kathmandu": "Nepal",
        "sri lanka": "Sri Lanka", "colombo": "Sri Lanka",
    }
    key = next((v for k, v in key_map.items() if k in dest_lower), None)

    if key and key in VISA_INFO:
        info = VISA_INFO[key].copy()
        info["destination"] = destination.title()
        info["from"] = from_country
        return info

    return {
        "destination": destination.title(),
        "from": from_country,
        "required": True,
        "type": "Tourist Visa (check with embassy)",
        "duration": "Varies",
        "fee_inr": None,
        "processing": "15–30 days (approximate)",
        "docs": ["Valid passport", "Application form", "Bank statements", "Return ticket", "Hotel booking"],
        "tips": "Contact the embassy of the destination country for accurate requirements.",
    }


# ─────────────────────────────────────────────
# Itinerary framework generator
# ─────────────────────────────────────────────

DEST_HIGHLIGHTS: dict[str, list[str]] = {
    "goa":       ["Calangute Beach", "Fort Aguada", "Basilica of Bom Jesus", "Dudhsagar Waterfalls", "Anjuna Flea Market", "Old Goa Churches", "Spice Plantation Tour"],
    "kerala":    ["Alleppey Backwaters Houseboat", "Munnar Tea Gardens", "Periyar Wildlife Sanctuary", "Fort Kochi Chinese Nets", "Kovalam Beach", "Varkala Cliff"],
    "rajasthan": ["Amber Fort (Jaipur)", "City Palace (Udaipur)", "Mehrangarh Fort (Jodhpur)", "Jaisalmer Desert Camp", "Ranthambore Safari", "Pushkar Camel Fair"],
    "himachal":  ["Rohtang Pass", "Solang Valley", "Hadimba Temple", "The Ridge (Shimla)", "Kufri Snow Point", "Manali Monastery"],
    "andaman":   ["Radhanagar Beach", "Cellular Jail", "Havelock Island", "Neil Island", "Scuba Diving", "Ross Island"],
    "dubai":     ["Burj Khalifa At The Top", "Desert Safari", "Dubai Mall & Fountain", "Palm Jumeirah", "Gold & Spice Souk", "Dhow Cruise Marina"],
    "bali":      ["Tanah Lot Temple", "Ubud Rice Terraces", "Mount Batur Sunrise", "Seminyak Beach", "Uluwatu Temple", "Tegallalang Terraces"],
    "singapore": ["Universal Studios", "Gardens by the Bay", "Sentosa Island", "Marina Bay Sands SkyPark", "Chinatown & Little India", "Night Safari"],
    "thailand":  ["Grand Palace (Bangkok)", "Phi Phi Islands", "Chiang Mai Temples", "Tiger Kingdom", "Floating Markets", "Wat Phra Kaew"],
    "china":     ["The Great Wall (Mutianyu)", "Forbidden City", "Temple of Heaven", "Yu Garden (Shanghai)", "West Lake (Hangzhou)", "Terracotta Army (Xi'an)"],
    "paris":     ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral", "Montmartre", "Palace of Versailles", "Champs-Élysées"],
    "europe":    ["Eiffel Tower", "Colosseum", "Anne Frank House", "Neuschwanstein Castle", "Sagrada Família", "Prague Castle"],
}


def generate_itinerary_framework(
    destination: str,
    duration_days: int,
    trip_style: str = "standard",
) -> dict[str, Any]:
    dest_key = destination.lower().split()[0]
    attractions = next(
        (v for k, v in DEST_HIGHLIGHTS.items() if k in dest_key or dest_key in k),
        [f"Top attractions in {destination}", "City tour", "Local markets", "Cultural experiences", "Local cuisine trail"],
    )
    rng = random.Random(_seed(f"itin{destination}{duration_days}"))

    # Build day-by-day framework
    days = []
    # Day 1: Arrival
    days.append({
        "day": 1,
        "title": f"Arrival in {destination.title()}",
        "activities": [
            f"Arrive at {destination.title()} airport / station",
            "Check-in and freshen up",
            f"Evening walk around {'hotel area' if rng.random() > 0.5 else 'city centre'}",
            "Welcome dinner",
        ],
    })

    # Middle days: attractions
    attr_pool = attractions * 3  # repeat pool so we don't run out
    rng.shuffle(attr_pool)
    for day_n in range(2, duration_days):
        n_activities = min(3, len(attr_pool))
        day_attrs = attr_pool[:n_activities]
        attr_pool = attr_pool[n_activities:]
        days.append({
            "day": day_n,
            "title": f"Exploring {destination.title()}",
            "activities": day_attrs + ["Local street food dinner"],
        })

    # Last day: departure
    days.append({
        "day": duration_days,
        "title": "Departure Day",
        "activities": [
            "Morning at leisure",
            "Last-minute shopping / souvenirs",
            f"Check-out and transfer to airport / station",
            f"Depart from {destination.title()}",
        ],
    })

    return {
        "destination": destination.title(),
        "duration_days": duration_days,
        "trip_style": trip_style,
        "itinerary": days,
        "tips": [
            f"Best time to visit: {_best_time(destination)}",
            f"Local currency: {_currency(destination)}",
            "Carry travel insurance for international trips",
            "Book popular attractions in advance",
        ],
    }


def _best_time(dest: str) -> str:
    d = dest.lower()
    if "goa" in d: return "November – February (cool and dry)"
    if "kerala" in d: return "September – March (post-monsoon and winter)"
    if "rajasthan" in d: return "October – March (avoid summer heat)"
    if "manali" in d or "himachal" in d: return "May – June and September – October"
    if "andaman" in d: return "October – May (avoid monsoon)"
    if "dubai" in d: return "November – April (pleasant weather)"
    if "bali" in d: return "April – October (dry season)"
    if "singapore" in d: return "Year-round (mild tropical climate)"
    if "thailand" in d: return "November – March (cool and dry)"
    if "china" in d: return "April – June or September – October"
    return "October – April (typically pleasant)"


def _currency(dest: str) -> str:
    d = dest.lower()
    if any(c in d for c in ["dubai", "abu dhabi"]): return "UAE Dirham (AED)"
    if "singapore" in d: return "Singapore Dollar (SGD)"
    if any(c in d for c in ["thailand", "bangkok", "phuket"]): return "Thai Baht (THB)"
    if any(c in d for c in ["bali", "indonesia"]): return "Indonesian Rupiah (IDR)"
    if any(c in d for c in ["china", "beijing", "shanghai"]): return "Chinese Yuan (CNY)"
    if any(c in d for c in ["uk", "london"]): return "British Pound (GBP)"
    if any(c in d for c in ["france", "germany", "italy", "spain", "europe"]): return "Euro (EUR)"
    if "maldives" in d: return "Maldivian Rufiyaa (MVR) / USD accepted"
    if any(c in d for c in ["nepal", "kathmandu"]): return "Nepalese Rupee (NPR)"
    if any(c in d for c in ["sri lanka", "colombo"]): return "Sri Lankan Rupee (LKR)"
    return "Local currency (carry USD as backup)"
