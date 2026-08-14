import os
import json
import logging
import urllib.request
import urllib.error
from typing import List, Dict, Any, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)

# Emergency keywords triggering HealthOS Emergency SOS Workflow
EMERGENCY_KEYWORDS = [
    "chest pain", "heart attack", "can't breathe", "cannot breathe",
    "shortness of breath", "severe bleeding", "unconscious", "fainted",
    "stroke", "numbness in face", "paralysis", "anaphylaxis", "severe allergic reaction",
    "seizure", "overdose", "suicidal", "head injury", "passing out"
]

CLINICAL_SYSTEM_INSTRUCTION = (
    "You are HealthOS AI Assistant, a compassionate, medically precise healthcare AI integrated into HealthOS.\n"
    "Provide accurate, helpful medical guidance. Structure responses cleanly using Markdown headers and bullet points.\n"
    "Always suggest practical self-care steps and mention when to consult a physician.\n"
    "Remind users that AI guidance is for informational purposes and does not replace direct clinical diagnosis."
)

SAFE_USER_ERROR_MESSAGE = "HealthOS AI is temporarily unavailable. Please try again."


class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY")
        self.primary_model = settings.GEMINI_MODEL or os.getenv("GEMINI_MODEL", "gemini-3.6-flash")

    def verify_configuration(self) -> bool:
        """
        At application startup, verify that GEMINI_API_KEY exists.
        Logs operational status without exposing the secret API key.
        """
        if not self.api_key or not self.api_key.strip():
            logger.warning("[HealthOS Gemini] GEMINI_API_KEY is not configured! AI Assistant will operate in fallback mode.")
            return False
        
        masked_key = self.api_key[:4] + "..." + self.api_key[-4:] if len(self.api_key) > 8 else "***"
        logger.info(f"[HealthOS Gemini] Gemini Service initialized. Key active ({masked_key}). Model: {self.primary_model}")
        return True

    def check_emergency_triggers(self, text: str) -> bool:
        """
        Scans message content for critical emergency indicators.
        """
        if not text:
            return False
        lower_text = text.lower()
        return any(keyword in lower_text for keyword in EMERGENCY_KEYWORDS)

    def generate_medical_response(
        self,
        user_message: str,
        chat_history: Optional[List[Dict[str, Any]]] = None,
        context_bridge: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Sends conversation context + user message to Gemini server-side.
        Tries primary model first, with automatic fallback to high-availability stable models if 503 high demand occurs.
        """
        is_emergency = self.check_emergency_triggers(user_message)
        
        action_cards = []
        if is_emergency:
            action_cards.append({
                "type": "EMERGENCY_SOS",
                "title": "Trigger HealthOS Emergency SOS",
                "description": "Immediate medical emergency detected. Click to dispatch nearest ambulance & alert ER.",
                "action_route": "/patient/emergency"
            })

        # If API key is missing, return safe fallback
        if not self.api_key or not self.api_key.strip():
            return {
                "success": True,
                "response": "HealthOS AI Assistant is operating in local clinical mode. "
                            "Please connect your GEMINI_API_KEY for live LLM responses.",
                "model": "healthos-clinical-assistant-v1",
                "service": "HealthOS Clinical Assistant",
                "triage_level": "EMERGENCY" if is_emergency else "SELF_CARE",
                "disclaimer": "Informational guidance only. Not a clinical diagnosis.",
                "emergency_action_required": is_emergency,
                "action_cards": action_cards if is_emergency else None
            }

        # Build prompt with optional patient context bridge
        prompt_with_context = user_message
        if context_bridge:
            age = context_bridge.get("age_bracket") or "N/A"
            allergies = context_bridge.get("known_allergies") or []
            allergies_str = ", ".join(allergies) if allergies else "None"
            condition = context_bridge.get("primary_condition") or "None"
            
            prompt_with_context = (
                f"[Patient Context: Age={age}, Allergies={allergies_str}, Primary Condition={condition}]\n\n"
                f"{user_message}"
            )

        # List of models to try in sequence for maximum reliability
        candidate_models = [self.primary_model]
        if "gemini-flash-latest" not in candidate_models:
            candidate_models.append("gemini-flash-latest")

        for target_model in candidate_models:
            # Attempt 1: Official google.genai SDK call
            try:
                from google import genai
                from google.genai import types

                client = genai.Client(api_key=self.api_key)
                contents = []

                if chat_history:
                    for msg in chat_history:
                        role = msg.get("role")
                        content = msg.get("content")
                        if content and role in ["user", "assistant", "model"]:
                            sdk_role = "user" if role == "user" else "model"
                            contents.append(
                                types.Content(
                                    role=sdk_role,
                                    parts=[types.Part.from_text(text=content)]
                                )
                            )

                contents.append(
                    types.Content(
                        role="user",
                        parts=[types.Part.from_text(text=prompt_with_context)]
                    )
                )

                res = client.models.generate_content(
                    model=target_model,
                    contents=contents,
                    config=types.GenerateContentConfig(
                        system_instruction=CLINICAL_SYSTEM_INSTRUCTION,
                        temperature=0.3
                    )
                )

                if res and res.text:
                    triage = "EMERGENCY" if is_emergency else (
                        "ROUTINE" if any(w in user_message.lower() for w in ["doctor", "appointment", "fever", "pain", "tooth", "teeth"]) else "SELF_CARE"
                    )
                    return {
                        "success": True,
                        "response": res.text,
                        "model": target_model,
                        "service": "HealthOS Gemini Medical Assistant",
                        "triage_level": triage,
                        "disclaimer": "Informational guidance only. Not a medical diagnosis or treatment plan.",
                        "emergency_action_required": is_emergency,
                        "action_cards": action_cards if is_emergency else None
                    }
            except Exception as sdk_err:
                logger.warning(f"[HealthOS Gemini] SDK call notice for {target_model}: {sdk_err}. Trying REST API fallback.")

            # Attempt 2: Direct REST API Fallback for current model
            try:
                rest_model = target_model if target_model.startswith("models/") else f"models/{target_model}"
                url = f"https://generativelanguage.googleapis.com/v1beta/{rest_model}:generateContent?key={self.api_key}"
                
                contents_payload = []
                if chat_history:
                    for msg in chat_history:
                        role = msg.get("role")
                        content = msg.get("content")
                        if content and role in ["user", "assistant", "model"]:
                            rest_role = "user" if role == "user" else "model"
                            contents_payload.append({"role": rest_role, "parts": [{"text": content}]})

                contents_payload.append({"role": "user", "parts": [{"text": prompt_with_context}]})

                payload = {
                    "contents": contents_payload,
                    "systemInstruction": {
                        "parts": [{"text": CLINICAL_SYSTEM_INSTRUCTION}]
                    }
                }

                req = urllib.request.Request(
                    url,
                    data=json.dumps(payload).encode("utf-8"),
                    headers={"Content-Type": "application/json"}
                )
                with urllib.request.urlopen(req, timeout=10) as resp:
                    resp_data = json.loads(resp.read().decode("utf-8"))
                    text = resp_data["candidates"][0]["content"]["parts"][0]["text"]
                    if text:
                        triage = "EMERGENCY" if is_emergency else (
                            "ROUTINE" if any(w in user_message.lower() for w in ["doctor", "appointment", "fever", "pain", "tooth", "teeth"]) else "SELF_CARE"
                        )
                        return {
                            "success": True,
                            "response": text,
                            "model": target_model,
                            "service": "HealthOS Gemini Medical Assistant",
                            "triage_level": triage,
                            "disclaimer": "Informational guidance only. Not a medical diagnosis or treatment plan.",
                            "emergency_action_required": is_emergency,
                            "action_cards": action_cards if is_emergency else None
                        }
            except Exception as rest_err:
                logger.error(f"[HealthOS Gemini] REST API error for {target_model}: {rest_err}")

        # If all LLM candidates fail, return high-level clinical guidance response
        fallback_data = get_smart_clinical_fallback(user_message)
        return {
            "success": True,
            "response": fallback_data["reply"],
            "model": "healthos-clinical-assistant-v1",
            "service": "HealthOS Clinical Assistant",
            "triage_level": fallback_data["triage_level"],
            "disclaimer": "Informational guidance only. Not a medical diagnosis or treatment plan.",
            "emergency_action_required": is_emergency,
            "action_cards": action_cards if is_emergency else (fallback_data["action_cards"] if fallback_data.get("action_cards") else None)
        }


def get_smart_clinical_fallback(user_message: str) -> Dict[str, Any]:
    """
    Fallback clinical advice generator when LLM service is undergoing high load or offline.
    """
    msg = user_message.lower().strip()

    if any(k in msg for k in ["headache", "fatigue", "tired", "head ache", "exhausted"]):
        return {
            "reply": (
                "### Clinical Guidance: Headache & Fatigue\n\n"
                "Mild headaches accompanied by tiredness are frequently caused by dehydration, sleep deprivation, stress, or eye strain.\n\n"
                "**Recommended Monitoring & Self-Care:**\n"
                "• **Hydration:** Drink 500ml of fresh water immediately.\n"
                "• **Rest & Screen Break:** Rest in a dim, quiet room for 20–30 minutes away from mobile/laptop screens.\n"
                "• **Vitals to Monitor:** Check your body temperature and measure blood pressure if a cuff is available.\n"
                "• **Red Flags:** Seek emergency medical evaluation immediately if the headache is sudden and extraordinarily severe ('thunderclap'), or accompanied by high fever, neck stiffness, vision changes, or confusion."
            ),
            "triage_level": "SELF_CARE",
            "action_cards": [
                {
                    "type": "APPOINTMENT",
                    "title": "Consult General Physician",
                    "description": "Schedule a routine consultation with a HealthOS medical practitioner.",
                    "action_route": "/patient/appointments"
                }
            ]
        }

    if any(k in msg for k in ["teeth", "tooth", "toothache", "dental", "gum", "cavity"]):
        return {
            "reply": (
                "### Clinical Guidance: Toothache & Dental Discomfort\n\n"
                "Dental discomfort is often linked to tooth decay, enamel erosion, or gum inflammation.\n\n"
                "**Immediate Relief Measures:**\n"
                "• **Warm Salt Rinse:** Swish warm salt water (1/2 tsp salt in warm water) for 30 seconds.\n"
                "• **Cold Compress:** Apply a cold compress to your cheek for 15 minutes to reduce localized swelling.\n"
                "• **Avoid Extreme Temperatures:** Stay away from sweet, hot, or ice-cold foods."
            ),
            "triage_level": "SELF_CARE",
            "action_cards": [
                {
                    "type": "APPOINTMENT",
                    "title": "Book Dental Specialist",
                    "description": "Schedule a visit with a certified dentist on HealthOS.",
                    "action_route": "/patient/appointments"
                }
            ]
        }

    return {
        "reply": (
            f"Thank you for reaching out regarding: *\"{user_message.strip()}\"*\n\n"
            "**General Health Guidance:**\n"
            "• Stay adequately hydrated and get sufficient rest.\n"
            "• Monitor your symptoms over the next 24 hours.\n"
            "• If symptoms worsen or persist, please consult a registered physician via HealthOS."
        ),
        "triage_level": "SELF_CARE",
        "action_cards": [
            {
                "type": "APPOINTMENT",
                "title": "Schedule Physician Visit",
                "description": "Book a clinical consultation with a doctor.",
                "action_route": "/patient/appointments"
            }
        ]
    }


# Singleton service instance
gemini_service = GeminiService()
