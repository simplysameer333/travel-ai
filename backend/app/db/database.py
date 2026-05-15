from motor.motor_asyncio import AsyncIOMotorClient

from app.core.config import settings

_client: AsyncIOMotorClient | None = None


def get_client() -> AsyncIOMotorClient:
    if _client is None:
        raise RuntimeError("MongoDB client is not initialised.")
    return _client


async def connect_to_mongo() -> None:
    global _client
    if not settings.MONGO_URI:
        print("[DB] No MONGO_URI set — skipping MongoDB connection.")
        return
    _client = AsyncIOMotorClient(settings.MONGO_URI)
    await _client.admin.command("ping")
    print(f"[DB] Connected to MongoDB – database: '{settings.DATABASE_NAME}'")


async def close_mongo_connection() -> None:
    global _client
    if _client is not None:
        _client.close()
        _client = None
        print("[DB] MongoDB connection closed.")


class _DBProxy:
    def __getattr__(self, name: str):  # noqa: ANN001, ANN204
        return getattr(get_client()[settings.DATABASE_NAME], name)

    def __getitem__(self, name: str):  # noqa: ANN001, ANN204
        return get_client()[settings.DATABASE_NAME][name]


db = _DBProxy()
