import { supabase } from '../lib/supabase/client';

const LOCAL_STORAGE_KEY = 'healthos_chat_history';

/**
 * Helper wrapper to prevent Supabase queries from hanging indefinitely
 */
function withTimeout(promise, ms = 2000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Supabase operation timed out')), ms)
    ),
  ]);
}

/**
 * Helper to get local storage fallback sessions map: { [userId]: [ { id, title, created_at, updated_at, messages: [] } ] }
 */
function getLocalStorageHistory() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (_e) {
    return {};
  }
}

function saveLocalStorageHistory(store) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(store));
  } catch (_e) {
    // Ignore storage quota errors
  }
}

/**
 * Service handling Chat Session and Message Persistence with Supabase & Local Fallback
 */
export const chatHistoryService = {
  /**
   * Fetch all chat sessions for an authenticated patient
   */
  async getSessions(userId) {
    if (!userId) return [];

    try {
      const { data, error } = await withTimeout(
        supabase
          .from('chat_sessions')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false })
      );

      if (!error && data) {
        return data;
      }
    } catch (_err) {
      // Fall through to local fallback
    }

    // Local Storage Fallback
    const store = getLocalStorageHistory();
    const userSessions = store[userId] || [];
    return userSessions.map((s) => ({
      id: s.id,
      user_id: s.user_id,
      title: s.title,
      created_at: s.created_at,
      updated_at: s.updated_at,
    })).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  },

  /**
   * Create a new chat session for an authenticated patient
   */
  async createSession(userId, title = 'New Conversation') {
    if (!userId) throw new Error('User ID is required to create a session');

    const newSessionPayload = {
      user_id: userId,
      title,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await withTimeout(
        supabase
          .from('chat_sessions')
          .insert([newSessionPayload])
          .select()
          .single()
      );

      if (!error && data) {
        return data;
      }
    } catch (_err) {
      // Fall through to local fallback
    }

    // Local Storage Fallback
    const store = getLocalStorageHistory();
    if (!store[userId]) store[userId] = [];
    const localSession = {
      ...newSessionPayload,
      id: `session-local-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      messages: [],
    };
    store[userId].unshift(localSession);
    saveLocalStorageHistory(store);

    return {
      id: localSession.id,
      user_id: localSession.user_id,
      title: localSession.title,
      created_at: localSession.created_at,
      updated_at: localSession.updated_at,
    };
  },

  /**
   * Fetch all messages for a specific session ID
   */
  async getSessionMessages(sessionId, userId) {
    if (!sessionId) return [];

    try {
      const { data, error } = await withTimeout(
        supabase
          .from('chat_messages')
          .select('*')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: true })
      );

      if (!error && data) {
        return data;
      }
    } catch (_err) {
      // Fall through to local fallback
    }

    // Local Storage Fallback
    const store = getLocalStorageHistory();
    const userSessions = store[userId] || [];
    const targetSession = userSessions.find((s) => s.id === sessionId);
    return targetSession ? targetSession.messages || [] : [];
  },

  /**
   * Add a single user or assistant message to a chat session
   */
  async addMessage({ sessionId, userId, role, content, metadata = {} }) {
    if (!sessionId || !userId || !content) {
      throw new Error('sessionId, userId, and content are required');
    }

    const messagePayload = {
      session_id: sessionId,
      user_id: userId,
      role,
      content,
      metadata,
      created_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await withTimeout(
        supabase
          .from('chat_messages')
          .insert([messagePayload])
          .select()
          .single()
      );

      if (!error && data) {
        // Touch updated_at on the session
        await withTimeout(
          supabase
            .from('chat_sessions')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', sessionId)
        ).catch(() => {});

        return data;
      }
    } catch (_err) {
      // Fall through to local fallback
    }

    // Local Storage Fallback
    const store = getLocalStorageHistory();
    const userSessions = store[userId] || [];
    const targetSession = userSessions.find((s) => s.id === sessionId);
    const localMsg = {
      ...messagePayload,
      id: `msg-local-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };

    if (targetSession) {
      if (!targetSession.messages) targetSession.messages = [];
      targetSession.messages.push(localMsg);
      targetSession.updated_at = localMsg.created_at;
      saveLocalStorageHistory(store);
    }

    return localMsg;
  },

  /**
   * Update a session title
   */
  async updateSessionTitle(sessionId, title, userId) {
    if (!sessionId || !title) return;

    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({ title, updated_at: new Date().toISOString() })
        .eq('id', sessionId);

      if (!error) return;
    } catch (_err) {
      // Fallback
    }

    const store = getLocalStorageHistory();
    const userSessions = store[userId] || [];
    const targetSession = userSessions.find((s) => s.id === sessionId);
    if (targetSession) {
      targetSession.title = title;
      targetSession.updated_at = new Date().toISOString();
      saveLocalStorageHistory(store);
    }
  },

  /**
   * Delete a session and all its messages
   */
  async deleteSession(sessionId, userId) {
    if (!sessionId) return;

    try {
      await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId);
    } catch (_err) {
      // Fallback
    }

    const store = getLocalStorageHistory();
    if (store[userId]) {
      store[userId] = store[userId].filter((s) => s.id !== sessionId);
      saveLocalStorageHistory(store);
    }
  },

  /**
   * Helper to derive a safe, concise title from the first message
   */
  generateTitleFromMessage(messageText) {
    if (!messageText) return 'New Conversation';
    const cleanText = messageText.trim().replace(/^[#*>\-\s]+/, '');
    if (cleanText.length <= 35) return cleanText;
    const truncated = cleanText.substring(0, 35);
    const lastSpace = truncated.lastIndexOf(' ');
    return (lastSpace > 10 ? truncated.substring(0, lastSpace) : truncated) + '...';
  },
};
