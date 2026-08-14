import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, Bot, AlertTriangle, Calendar, Building2, ExternalLink, ShieldAlert } from 'lucide-react';
import './Chatbot.css';

function renderTextWithFormatting(text) {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    if (line.startsWith('### ')) {
      return (
        <h4 key={idx} style={{ margin: '0.6rem 0 0.3rem 0', color: '#0f172a', fontWeight: 700, fontSize: '1rem' }}>
          {line.replace('### ', '')}
        </h4>
      );
    }
    if (line.startsWith('• ') || line.startsWith('- ')) {
      return (
        <div key={idx} style={{ display: 'flex', gap: '0.4rem', margin: '0.2rem 0', paddingLeft: '0.2rem' }}>
          <span style={{ color: '#0284c7' }}>•</span>
          <span>{line.replace(/^[•-]\s*/, '')}</span>
        </div>
      );
    }
    if (!line.trim()) {
      return <div key={idx} style={{ height: '0.4rem' }} />;
    }

    // Replace bold syntax **text** safely
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <p key={idx} style={{ margin: '0.2rem 0', lineHeight: 1.55 }}>
        {parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={pIdx} style={{ color: '#0f172a' }}>{part.slice(2, -2)}</strong>;
          }
          return part;
        })}
      </p>
    );
  });
}

export function ChatMessage({ message }) {
  const isUser = message.role === 'user' || message.sender === 'user';
  const metadata = message.metadata || {};
  const triageLevel = metadata.triage_level || message.triage_level;
  const actionCards = metadata.action_cards || message.action_cards || [];
  const disclaimer = metadata.disclaimer || message.disclaimer;
  const isEmergency = metadata.emergency_action_required || message.emergency_action_required || triageLevel === 'EMERGENCY';

  const timeString = message.created_at || message.timestamp
    ? new Date(message.created_at || message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className={`chat-message-row ${isUser ? 'user' : 'assistant'}`}>
      <div className="message-avatar">
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>

      <div className="message-bubble-content">
        <div className="message-bubble-body">
          {!isUser && triageLevel && (
            <div className={`triage-badge ${triageLevel}`}>
              {triageLevel === 'EMERGENCY' ? <ShieldAlert size={12} /> : null}
              <span>{triageLevel.replace('_', ' ')}</span>
            </div>
          )}

          <div>{renderTextWithFormatting(message.content || message.text)}</div>

          {/* ACTION CARDS */}
          {!isUser && actionCards.length > 0 && (
            <div className="action-cards-container">
              {actionCards.map((card, idx) => {
                let route = card.action_route || '/patient/dashboard';
                let Icon = ExternalLink;
                if (card.type === 'EMERGENCY_SOS' || route.includes('emergency')) Icon = AlertTriangle;
                if (card.type === 'APPOINTMENT' || route.includes('appointments')) Icon = Calendar;
                if (card.type === 'HOSPITAL_FINDER' || route.includes('hospitals')) Icon = Building2;

                return (
                  <div key={idx} className="action-card-item">
                    <div>
                      <div className="action-card-title">{card.title}</div>
                      {card.description && <div className="action-card-desc">{card.description}</div>}
                    </div>
                    <NavLink to={route} className="action-card-btn">
                      <Icon size={14} />
                      <span>{card.type === 'EMERGENCY_SOS' ? 'Emergency SOS' : 'Open'}</span>
                    </NavLink>
                  </div>
                );
              })}
            </div>
          )}

          {!isUser && isEmergency && actionCards.length === 0 && (
            <div className="action-cards-container">
              <div className="action-card-item" style={{ background: '#fef2f2', borderColor: '#fca5a5' }}>
                <div>
                  <div className="action-card-title" style={{ color: '#dc2626' }}>Urgent Action Needed</div>
                  <div className="action-card-desc">Trigger emergency dispatch or view nearest care centers.</div>
                </div>
                <NavLink to="/patient/emergency" className="action-card-btn" style={{ background: '#dc2626' }}>
                  <AlertTriangle size={14} />
                  <span>Get Emergency Help</span>
                </NavLink>
              </div>
            </div>
          )}
        </div>

        <div className="message-meta-row">
          <span>{isUser ? 'You' : 'HealthOS AI Assistant'}</span>
          {timeString && <span>• {timeString}</span>}
        </div>

        {!isUser && disclaimer && (
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem', fontStyle: 'italic' }}>
            {disclaimer}
          </div>
        )}
      </div>
    </div>
  );
}
