import React, { useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Bot, Sparkles, AlertTriangle, RefreshCw } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import './Chatbot.css';

const SUGGESTED_PROMPTS = [
  "I have a mild headache and feel fatigue. What should I monitor?",
  "How do I prepare for a routine general physician appointment?",
  "What are common symptoms of seasonal allergies vs a cold?",
  "Where can I find nearby verified hospitals with open ICU beds?",
];

export function ChatWindow({
  messages = [],
  isLoading = false,
  sessionTitle = 'AI Health Assistant',
  onSendMessage,
  onNewChat,
  emergencyActive = false,
}) {
  const feedRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="chat-window-main">
      {/* HEADER */}
      <div className="chat-header">
        <div className="chat-header-title">
          <div className="assistant-avatar-badge">
            <Bot size={22} />
          </div>
          <div className="chat-header-meta">
            <h2>{sessionTitle || 'AI Health Assistant'}</h2>
            <p>
              <span className="status-online-dot"></span>
              Integrated Clinical Guidance System
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={onNewChat}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              color: '#334155',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            title="Start new conversation"
          >
            <RefreshCw size={14} />
            <span>New Chat</span>
          </button>
        </div>
      </div>

      {/* EMERGENCY SOS ALERT BANNER */}
      {emergencyActive && (
        <div className="emergency-banner-alert">
          <div className="emergency-banner-left">
            <AlertTriangle size={18} style={{ color: '#dc2626' }} />
            <span>Emergency Alert Triggered: Immediate medical attention may be required.</span>
          </div>
          <NavLink to="/patient/emergency" className="emergency-sos-action-btn">
            <span>Get Emergency Help</span>
          </NavLink>
        </div>
      )}

      {/* MESSAGES FEED */}
      <div ref={feedRef} className="chat-messages-feed">
        {messages.length === 0 ? (
          <div className="chat-empty-state">
            <div className="empty-state-icon-wrapper">
              <Sparkles size={36} />
            </div>
            <h3>Your HealthOS AI Assistant</h3>
            <p>
              Ask about symptoms, wellness advice, appointment prep, or general health questions.
              Your conversation history is securely saved to your account.
            </p>

            <div className="suggested-prompts-grid">
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <div
                  key={idx}
                  onClick={() => onSendMessage(prompt)}
                  className="suggested-prompt-card"
                >
                  "{prompt}"
                </div>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <ChatMessage key={msg.id || index} message={msg} />
          ))
        )}

        {/* LOADING TYPING INDICATOR */}
        {isLoading && (
          <div className="chat-message-row assistant">
            <div className="message-avatar">
              <Bot size={18} />
            </div>
            <div className="message-bubble-content">
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: '0.4rem' }}>
                  AI Assistant Thinking...
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* INPUT BAR */}
      <ChatInput onSendMessage={onSendMessage} disabled={isLoading} />
    </div>
  );
}
