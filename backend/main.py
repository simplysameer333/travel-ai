import logging
import os

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.api.routes import router as search_router
from app.api.auth import router as auth_router
from app.api.chat import router as chat_router
from app.routers.ai_router import router as ai_router
from app.core.limiter import limiter
from app.db.database import close_mongo_connection, connect_to_mongo, db

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-5s | %(name)-30s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

# ---------------------------------------------------------------------------
# Application factory
# ---------------------------------------------------------------------------

app = FastAPI(
    title="Travel AI API",
    description="AI-powered travel search and planning API for Indian destinations.",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ---------------------------------------------------------------------------
# Rate limiting
# ---------------------------------------------------------------------------

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------

_origins_env = os.getenv("ALLOWED_ORIGINS", "*").strip()
_allowed_origins = ["*"] if _origins_env == "*" else [o.strip() for o in _origins_env.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=_origins_env != "*",
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Lifecycle
# ---------------------------------------------------------------------------

@app.on_event("startup")
async def startup_event() -> None:
    await connect_to_mongo()

    # Unique email index — idempotent
    try:
        await db["users"].create_index("email", unique=True)
    except Exception:
        pass

    # Initialise the multi-agent LangGraph graph (+ checkpointer)
    try:
        from app.graph.travel_graph import init_travel_graph
        await init_travel_graph()
    except Exception as exc:
        logging.getLogger(__name__).warning("Graph init deferred: %s", exc)


@app.on_event("shutdown")
async def shutdown_event() -> None:
    await close_mongo_connection()

# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

app.include_router(search_router)
app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(ai_router)

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "version": "2.0.0"}

# ---------------------------------------------------------------------------
# Dev entry-point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=True,
        log_level="info",
    )
