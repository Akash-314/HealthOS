import React, { useState, useRef } from 'react';
import { Send, Sparkles } from 'lucide-react';
import './Chatbot.css';

export function ChatInput({ onSendMessage, disabled = false }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSendMessage(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className="chat-input-container">
      <form onSubmit={handleSubmit} className="chat-input-wrapper">
        <Sparkles size={20} style={{ color: '#0284c7', marginTop: '0.4rem', flexShrink: 0 }} />
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask HealthOS about your symptoms, general health, or care navigation..."
          disabled={disabled}
          rows={1}
          className="chat-textarea"
        />
        <button
          type="submit"
          disabled={!text.trim() || disabled}
          className="chat-send-btn"
          title="Send message (Enter)"
        >
          <Send size={18} />
        </button>
      </form>
      <div className="chat-input-disclaimer-text">
        HealthOS AI Assistant provides general health information. In case of emergency, use Emergency SOS.
      </div>
    </div>
  );
}
