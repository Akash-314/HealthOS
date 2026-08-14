import React from 'react';
import { Plus, MessageSquare, Trash2, Clock } from 'lucide-react';
import './Chatbot.css';

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: 'short' });
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function ChatHistory({
  sessions = [],
  activeSessionId = null,
  onNewChat,
  onSelectSession,
  onDeleteSession,
}) {
  return (
    <aside className="chat-history-sidebar">
      <div className="chat-history-header">
        <button onClick={onNewChat} className="new-chat-btn" title="Start a new conversation">
          <Plus size={18} />
          <span>New Chat</span>
        </button>
        <div className="chat-history-title">Recent Conversations</div>
      </div>

      <div className="chat-sessions-list">
        {sessions.length === 0 ? (
          <div style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem' }}>
            <Clock size={20} style={{ margin: '0 auto 0.5rem auto', display: 'block', opacity: 0.5 }} />
            No chat history yet.
          </div>
        ) : (
          sessions.map((session) => {
            const isActive = session.id === activeSessionId;
            return (
              <div
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`chat-session-item ${isActive ? 'active' : ''}`}
                title={session.title}
              >
                <div className="session-info">
                  <div className="session-title-text" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MessageSquare size={14} style={{ flexShrink: 0, color: isActive ? '#0284c7' : '#94a3b8' }} />
                    <span>{session.title || 'New Conversation'}</span>
                  </div>
                  <div className="session-date-text">{formatDate(session.updated_at || session.created_at)}</div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Delete this chat history?')) {
                      onDeleteSession(session.id);
                    }
                  }}
                  className="delete-session-btn"
                  title="Delete conversation"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
