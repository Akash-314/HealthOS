from fastapi import APIRouter
from app.api.v1.endpoints import health, chat

api_router = APIRouter()

# Include endpoint routers
api_router.include_router(health.router, tags=["System Health"])
api_router.include_router(chat.router, tags=["AI Assistant"])

