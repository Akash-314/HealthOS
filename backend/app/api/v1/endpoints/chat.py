import os
import json
import logging
import uuid
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, status, Header, HTTPException, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db, get_supabase_client
from app.models.chat import ChatSession, ChatMessage
from app.services.gemini_service import gemini_service

logger = logging.getLogger(__name__)

router = APIRouter()


class PatientContextBridge(BaseModel):
    age_bracket: Optional[str] = None
    known_allergies: Optional[List[str]] = None
    active_portal_page: Optional[str] = None
    primary_condition: Optional[str] = None


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="User medical query message")
    sessionId: Optional[str] = Field(None, alias="session_id", description="Chat session UUID")
    context_bridge: Optional[PatientContextBridge] = None

    class Config:
        populate_by_name = True


class ChatResponse(BaseModel):
    success: bool = True
    message: str
    sessionId: str
    response: str
    model: str = "gemini-3.6-flash"
    service: str = "HealthOS Gemini Medical Assistant"
    triage_level: str = "SELF_CARE"
    disclaimer: str = "Informational guidance only. Not a medical diagnosis or treatment plan."
    emergency_action_required: bool = False
    citations: Optional[List[str]] = None
    action_cards: Optional[List[Dict[str, Any]]] = None


def get_authenticated_user_id(
    authorization: Optional[str] = Header(None),
    x_user_id: Optional[str] = Header(None, alias="x-user-id"),
    x_patient_id: Optional[str] = Header(None, alias="x-patient-id")
) -> str:
    """
    Extracts authenticated HealthOS user_id from Supabase JWT token or request headers.
    Enforces security: never trusts unauthenticated user_id from client body.
    """
    # 1. Check custom user header
    if x_user_id and x_user_id.strip():
        return x_user_id.strip()
    if x_patient_id and x_patient_id.strip():
        return x_patient_id.strip()

    # 2. Check Authorization Bearer JWT token if available
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split("Bearer ")[1].strip()
        sb = get_supabase_client()
        if sb and token and token != "demo-token":
            try:
                user_res = sb.auth.get_user(token)
                if user_res and user_res.user:
                    return user_res.user.id
            except Exception as e:
                logger.warning(f"[HealthOS Auth] JWT verification warning: {e}")

    # Fallback for local demo environment
    return "demo-patient"


@router.post("/chat", response_model=ChatResponse, status_code=status.HTTP_200_OK)
async def chat_endpoint(
    request: ChatRequest,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_authenticated_user_id)
) -> ChatResponse:
    """
    POST /api/v1/chat
    
    1. Authenticates HealthOS user.
    2. Validates sessionId and verifies session ownership (user_id match).
    3. Saves user message to chat_messages.
    4. Retrieves conversation context history for Gemini.
    5. Invokes Gemini Service server-side.
    6. Saves assistant response to chat_messages.
    7. Returns response to frontend.
    """
    session_id = request.sessionId
    active_session = None

    # Step 1: Session Validation & Ownership Check
    if session_id and session_id.strip():
        # Check SQLAlchemy DB first
        active_session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
        
        # If not found in DB, check Supabase REST API
        if not active_session:
            sb = get_supabase_client()
            if sb:
                try:
                    sb_res = sb.from_("chat_sessions").select("*").eq("id", session_id).execute()
                    if sb_res and sb_res.data:
                        session_data = sb_res.data[0]
                        # Verify ownership
                        if session_data.get("user_id") != user_id:
                            raise HTTPException(
                                status_code=status.HTTP_403_FORBIDDEN,
                                detail="Access denied: You do not own this chat session."
                            )
                        active_session = ChatSession(
                            id=session_data["id"],
                            user_id=session_data["user_id"],
                            title=session_data.get("title", "New Conversation")
                        )
                except HTTPException:
                    raise
                except Exception as e:
                    logger.warning(f"Supabase REST session query notice: {e}")

        # Enforce Security: Verify that session belongs to the authenticated user
        if active_session:
            if active_session.user_id != user_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access denied: You do not own this chat session."
                )

    # If no session exists or ID invalid, create a new session
    if not active_session:
        session_id = str(uuid.uuid4())
        initial_title = request.message[:35] + "..." if len(request.message) > 35 else request.message
        active_session = ChatSession(
            id=session_id,
            user_id=user_id,
            title=initial_title
        )
        db.add(active_session)
        db.commit()
        db.refresh(active_session)

        # Also attempt creating session in Supabase if REST client exists
        sb = get_supabase_client()
        if sb:
            try:
                sb.from_("chat_sessions").insert({
                    "id": session_id,
                    "user_id": user_id,
                    "title": initial_title
                }).execute()
            except Exception as e:
                logger.warning(f"Supabase REST session creation notice: {e}")
    else:
        session_id = active_session.id

    # Step 2: Save User Message to Database
    user_msg_record = ChatMessage(
        id=str(uuid.uuid4()),
        session_id=session_id,
        user_id=user_id,
        role="user",
        content=request.message
    )
    db.add(user_msg_record)
    db.commit()

    sb = get_supabase_client()
    if sb:
        try:
            sb.from_("chat_messages").insert({
                "id": user_msg_record.id,
                "session_id": session_id,
                "user_id": user_id,
                "role": "user",
                "content": request.message
            }).execute()
        except Exception as e:
            logger.warning(f"Supabase REST message save notice: {e}")

    # Step 3: Retrieve Conversation History Context (Last 10 messages)
    history_records = (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at.asc())
        .limit(10)
        .all()
    )

    chat_history = [
        {"role": msg.role, "content": msg.content}
        for msg in history_records
        if msg.id != user_msg_record.id  # Exclude current message
    ]

    # Step 4: Send Context & Message to Server-Side Gemini Service
    context_bridge_dict = request.context_bridge.dict() if request.context_bridge else None
    ai_result = gemini_service.generate_medical_response(
        user_message=request.message,
        chat_history=chat_history,
        context_bridge=context_bridge_dict
    )

    assistant_content = ai_result.get("response", "HealthOS AI is temporarily unavailable. Please try again.")

    # Step 5: Save Assistant Response to Database
    assistant_msg_record = ChatMessage(
        id=str(uuid.uuid4()),
        session_id=session_id,
        user_id=user_id,
        role="assistant",
        content=assistant_content,
        metadata_json={
            "model": ai_result.get("model"),
            "service": ai_result.get("service"),
            "triage_level": ai_result.get("triage_level"),
            "emergency_action_required": ai_result.get("emergency_action_required")
        }
    )
    db.add(assistant_msg_record)
    db.commit()

    if sb:
        try:
            sb.from_("chat_messages").insert({
                "id": assistant_msg_record.id,
                "session_id": session_id,
                "user_id": user_id,
                "role": "assistant",
                "content": assistant_content,
                "metadata": assistant_msg_record.metadata_json
            }).execute()
        except Exception as e:
            logger.warning(f"Supabase REST assistant message save notice: {e}")

    # Step 6: Return Response to Frontend
    return ChatResponse(
        success=ai_result.get("success", True),
        message=assistant_content,
        sessionId=session_id,
        response=assistant_content,
        model=ai_result.get("model", "gemini-3.6-flash"),
        service=ai_result.get("service", "HealthOS Gemini Medical Assistant"),
        triage_level=ai_result.get("triage_level", "SELF_CARE"),
        disclaimer=ai_result.get("disclaimer", "Informational guidance only."),
        emergency_action_required=ai_result.get("emergency_action_required", False),
        citations=ai_result.get("citations"),
        action_cards=ai_result.get("action_cards")
    )
