import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../app/providers/AuthProvider';
import { chatHistoryService } from '../../services/chatHistoryService';
import { chatbotService } from '../../services/chatbotService';
import { ChatHistory } from '../../components/chatbot/ChatHistory';
import { ChatWindow } from '../../components/chatbot/ChatWindow';
import '../../components/chatbot/Chatbot.css';

export function AIHealthAssistant() {
  const { user } = useAuth();
  const userId = user?.id || 'demo-patient';

  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [emergencyActive, setEmergencyActive] = useState(false);

  // 1. Fetch patient chat sessions on mount or when user changes
  const loadSessions = useCallback(async () => {
    setIsSessionLoading(true);
    try {
      const fetchedSessions = await chatHistoryService.getSessions(userId);
      setSessions(fetchedSessions);

      if (fetchedSessions.length > 0 && !activeSessionId) {
        setActiveSessionId(fetchedSessions[0].id);
      }
    } catch (err) {
      console.error('Error fetching chat sessions:', err);
    } finally {
      setIsSessionLoading(false);
    }
  }, [userId, activeSessionId]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // 2. Fetch messages whenever activeSessionId changes
  useEffect(() => {
    let isSubscribed = true;
    async function loadMessages() {
      if (!activeSessionId) {
        setMessages([]);
        return;
      }
      try {
        const fetchedMessages = await chatHistoryService.getSessionMessages(activeSessionId, userId);
        if (isSubscribed) {
          setMessages(fetchedMessages);

          // Check if any message in active session triggered emergency flag
          const hasEmergency = fetchedMessages.some(
            (m) =>
              m.metadata?.emergency_action_required ||
              m.metadata?.triage_level === 'EMERGENCY'
          );
          setEmergencyActive(hasEmergency);
        }
      } catch (err) {
        console.error('Error fetching session messages:', err);
      }
    }

    loadMessages();
    return () => {
      isSubscribed = false;
    };
  }, [activeSessionId, userId]);

  // 3. Create a new chat session
  const handleNewChat = async () => {
    try {
      const newSession = await chatHistoryService.createSession(userId, 'New Conversation');
      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(newSession.id);
      setMessages([]);
      setEmergencyActive(false);
    } catch (err) {
      console.error('Failed to create new chat session:', err);
    }
  };

  // 4. Delete a chat session
  const handleDeleteSession = async (sessionIdToDelete) => {
    try {
      await chatHistoryService.deleteSession(sessionIdToDelete, userId);
      const remaining = sessions.filter((s) => s.id !== sessionIdToDelete);
      setSessions(remaining);

      if (activeSessionId === sessionIdToDelete) {
        if (remaining.length > 0) {
          setActiveSessionId(remaining[0].id);
        } else {
          setActiveSessionId(null);
          setMessages([]);
          setEmergencyActive(false);
        }
      }
    } catch (err) {
      console.error('Failed to delete chat session:', err);
    }
  };

  // 5. Send message flow
  const handleSendMessage = async (userText) => {
    let currentSessionId = activeSessionId;

    // If no active session exists, create one first
    if (!currentSessionId) {
      try {
        const title = chatHistoryService.generateTitleFromMessage(userText);
        const newSession = await chatHistoryService.createSession(userId, title);
        currentSessionId = newSession.id;
        setActiveSessionId(newSession.id);
        setSessions((prev) => [newSession, ...prev]);
      } catch (err) {
        console.error('Error auto-creating session:', err);
        return;
      }
    }

    // Step A: Save user message to Supabase
    const tempUserMsg = {
      role: 'user',
      content: userText,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setIsLoading(true);

    try {
      const savedUserMsg = await chatHistoryService.addMessage({
        sessionId: currentSessionId,
        userId,
        role: 'user',
        content: userText,
      });

      // Update session title if it's the first message or still named 'New Conversation'
      const activeSession = sessions.find((s) => s.id === currentSessionId);
      if (activeSession && activeSession.title === 'New Conversation') {
        const newTitle = chatHistoryService.generateTitleFromMessage(userText);
        await chatHistoryService.updateSessionTitle(currentSessionId, newTitle, userId);
        setSessions((prev) =>
          prev.map((s) => (s.id === currentSessionId ? { ...s, title: newTitle } : s))
        );
      }

      // Step B: Send prompt to Chatbot API
      const contextBridge = {
        age_bracket: user?.age ? `${user.age} yrs` : null,
        known_allergies: user?.allergies ? [user.allergies] : [],
        active_portal_page: '/patient/ai',
        primary_condition: user?.conditions || null,
      };

      const aiResponse = await chatbotService.sendMessage({
        message: userText,
        sessionId: currentSessionId,
        userId,
        contextBridge,
      });

      // Step C: Save AI response to Supabase
      const metadataPayload = {
        model: aiResponse.model,
        service: aiResponse.service,
        triage_level: aiResponse.triage_level,
        disclaimer: aiResponse.disclaimer,
        emergency_action_required: aiResponse.emergency_action_required,
        citations: aiResponse.citations,
        action_cards: aiResponse.action_cards,
      };

      const savedAssistantMsg = await chatHistoryService.addMessage({
        sessionId: currentSessionId,
        userId,
        role: 'assistant',
        content: aiResponse.response,
        metadata: metadataPayload,
      });

      // Step D: Update UI message state
      setMessages((prev) => {
        // Replace temp message with saved messages
        const filtered = prev.filter((m) => m !== tempUserMsg);
        return [...filtered, savedUserMsg, savedAssistantMsg];
      });

      if (aiResponse.emergency_action_required || aiResponse.triage_level === 'EMERGENCY') {
        setEmergencyActive(true);
      }
    } catch (err) {
      console.error('Error during message exchange:', err);

      // Display friendly error message
      const errorMsgObj = {
        role: 'assistant',
        content: `⚠️ **Connection Alert:** Unable to complete request with AI Assistant. ${err.message || 'Please try again.'}`,
        metadata: {
          triage_level: 'SELF_CARE',
          disclaimer: 'Informational only. Please verify server connectivity or consult a medical professional directly.',
        },
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsgObj]);
    } finally {
      setIsLoading(false);
    }
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  return (
    <div className="ai-assistant-container">
      <ChatHistory
        sessions={sessions}
        activeSessionId={activeSessionId}
        onNewChat={handleNewChat}
        onSelectSession={setActiveSessionId}
        onDeleteSession={handleDeleteSession}
      />

      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        sessionTitle={activeSession?.title || 'AI Health Assistant'}
        onSendMessage={handleSendMessage}
        onNewChat={handleNewChat}
        emergencyActive={emergencyActive}
      />
    </div>
  );
}
