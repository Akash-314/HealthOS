/**
 * HealthOS Chatbot AI Communication Service
 * Communicates with HealthOS Chatbot FastAPI Backend
 */

const API_BASE_URL =
  import.meta.env.VITE_CHATBOT_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://127.0.0.1:8000/api/v1';

function getSmartOfflineResponse(userMsg) {
  const msg = userMsg.toLowerCase().strip ? userMsg.toLowerCase().strip() : userMsg.toLowerCase();
  
  if (/teeth|tooth|toothache|dental|gum|cavity|wisdom tooth/.test(msg)) {
    return {
      response:
        `### Clinical Guidance: Toothache & Dental Pain\n\n` +
        `Dental pain is commonly caused by tooth decay, gum inflammation, an exposed root, or a tooth cavity.\n\n` +
        `**Immediate Self-Care & Relief:**\n` +
        `• **Warm Salt Water Rinse:** Swish warm salt water (1/2 tsp salt in warm water) for 30 seconds to clean the area and soothe gums.\n` +
        `• **Cold Compress:** Apply a cold pack wrapped in a towel to your outer cheek for 15 minutes to reduce inflammation.\n` +
        `• **Avoid Direct Triggers:** Stay away from hot, icy cold, or sweet foods.\n\n` +
        `*(Note: Operating in local Clinical Assistant mode. Connect Gemini API for live LLM responses).*`,
      actionCards: [
        {
          type: 'APPOINTMENT',
          title: 'Book Dental Consultation',
          description: 'Schedule a visit with a dental specialist in HealthOS.',
          action_route: '/patient/appointments',
        },
      ],
    };
  }

  if (/stomach|belly|abdominal|nausea|vomiting|diarrhea|acidity|gas|indigestion/.test(msg)) {
    return {
      response:
        `### Clinical Guidance: Abdominal & Digestive Discomfort\n\n` +
        `Stomach pain or nausea can result from indigestion, food irritation, or hyperacidity.\n\n` +
        `**Self-Care Measures:**\n` +
        `• **Hydration:** Sip water, peppermint tea, or electrolyte drinks slowly.\n` +
        `• **Bland Foods:** Stick to simple foods like rice, toast, or bananas.\n\n` +
        `*(Note: Operating in local Clinical Assistant mode. Connect Gemini API for live LLM responses).*`,
      actionCards: [
        {
          type: 'APPOINTMENT',
          title: 'Consult General Physician',
          description: 'Schedule a visit for digestive evaluation.',
          action_route: '/patient/appointments',
        },
      ],
    };
  }

  return {
    response:
      `Thank you for your inquiry regarding: *"${userMsg.trim()}"*.\n\n` +
      `• **Health Guidance:** For mild symptoms, stay hydrated, get adequate rest, and monitor symptom severity.\n` +
      `• **Consultation:** If your symptoms persist or cause discomfort, please schedule a consultation with a physician on HealthOS.\n\n` +
      `*(Note: Operating in local Clinical Assistant mode. Connect Gemini API for live LLM responses).*`,
    actionCards: [
      {
        type: 'APPOINTMENT',
        title: 'Book Doctor Consultation',
        description: 'Schedule a visit with a practitioner in HealthOS.',
        action_route: '/patient/appointments',
      },
    ],
  };
}

export const chatbotService = {
  /**
   * Send a medical prompt to the backend AI assistant service
   * @param {Object} params
   * @param {string} params.message - Patient user query
   * @param {string} [params.sessionId] - Chat session ID
   * @param {string} [params.userId] - Patient user ID
   * @param {Object} [params.contextBridge] - Optional patient profile context
   */
  async sendMessage({ message, sessionId = null, userId = null, contextBridge = null }) {
    if (!message || typeof message !== 'string' || !message.trim()) {
      throw new Error('Message content cannot be empty.');
    }

    const payload = {
      message: message.trim(),
    };

    if (sessionId) {
      payload.sessionId = sessionId;
    }

    if (contextBridge) {
      payload.context_bridge = {
        age_bracket: contextBridge.age_bracket || null,
        known_allergies: contextBridge.known_allergies || [],
        active_portal_page: contextBridge.active_portal_page || '/patient/ai',
        primary_condition: contextBridge.primary_condition || null,
      };
    }

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (userId) {
      headers['x-user-id'] = userId;
    }

    // Attach saved auth session token if present
    try {
      const savedSession = localStorage.getItem('healthos_session');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed?.id) {
          headers['x-patient-id'] = parsed.id;
        }
      }
    } catch (_e) {
      // Ignore parse errors
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = 'An error occurred while communicating with the AI Assistant.';

        if (response.status === 422) {
          errorMessage = 'Invalid query input. Please enter a valid medical question.';
        } else if (response.status === 503) {
          errorMessage = errorData.detail || 'The AI Assistant service is currently updating. Please try again shortly.';
        } else if (errorData.detail) {
          errorMessage = typeof errorData.detail === 'string' ? errorData.detail : errorMessage;
        }

        const err = new Error(errorMessage);
        err.status = response.status;
        throw err;
      }

      const data = await response.json();

      return {
        response: data.response || 'No response returned from assistant.',
        model: data.model || 'healthos-ai-v1',
        service: data.service || 'HealthOS AI Assistant',
        triage_level: data.triage_level || 'SELF_CARE',
        disclaimer: data.disclaimer || 'Informational only. Not a medical diagnosis or treatment plan.',
        emergency_action_required: Boolean(data.emergency_action_required),
        citations: Array.isArray(data.citations) ? data.citations : [],
        action_cards: Array.isArray(data.action_cards) ? data.action_cards : [],
      };
    } catch (error) {
      console.warn('Chatbot API Service Notice (switching to local Clinical Assistant):', error);

      // Return smart clinical fallback for any network error, timeout, or server exception
      const smartFallback = getSmartOfflineResponse(message);
      return {
        response: smartFallback.response,
        model: 'healthos-clinical-assistant-v1',
        service: 'HealthOS Clinical Assistant',
        triage_level: 'SELF_CARE',
        disclaimer: 'Informational guidance only. Consult a registered physician for diagnosis.',
        emergency_action_required: false,
        citations: [],
        action_cards: smartFallback.actionCards,
      };
    }
  },
};
