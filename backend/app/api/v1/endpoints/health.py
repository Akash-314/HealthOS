from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter()


@router.get("/health", response_model=Dict[str, Any])
def health_check() -> Dict[str, Any]:
    """
    Health check endpoint returning service status.
    """
    return {
        "status": "online",
        "service": "HealthOS API",
        "version": "1.0.0",
        "health": "ok"
    }
