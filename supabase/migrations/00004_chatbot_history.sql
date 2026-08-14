-- ============================================================
-- HEALTHOS CHATBOT HISTORY MIGRATION (00004_chatbot_history.sql)
-- ============================================================

-- Enable required extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CHAT SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'New Conversation',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CHAT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES FOR OPTIMAL QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user ON public.chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_updated ON public.chat_sessions(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON public.chat_messages(created_at ASC);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- ROW LEVEL SECURITY POLICIES FOR CHAT SESSIONS
DROP POLICY IF EXISTS "Patients can view own chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Patients can insert own chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Patients can update own chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Patients can delete own chat sessions" ON public.chat_sessions;

CREATE POLICY "Patients can view own chat sessions"
    ON public.chat_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Patients can insert own chat sessions"
    ON public.chat_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Patients can update own chat sessions"
    ON public.chat_sessions FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Patients can delete own chat sessions"
    ON public.chat_sessions FOR DELETE
    USING (auth.uid() = user_id);

-- ROW LEVEL SECURITY POLICIES FOR CHAT MESSAGES
DROP POLICY IF EXISTS "Patients can view own chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Patients can insert own chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Patients can update own chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Patients can delete own chat messages" ON public.chat_messages;

CREATE POLICY "Patients can view own chat messages"
    ON public.chat_messages FOR SELECT
    USING (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM public.chat_sessions s
            WHERE s.id = session_id AND s.user_id = auth.uid()
        )
    );

CREATE POLICY "Patients can insert own chat messages"
    ON public.chat_messages FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM public.chat_sessions s
            WHERE s.id = session_id AND s.user_id = auth.uid()
        )
    );

CREATE POLICY "Patients can update own chat messages"
    ON public.chat_messages FOR UPDATE
    USING (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM public.chat_sessions s
            WHERE s.id = session_id AND s.user_id = auth.uid()
        )
    );

CREATE POLICY "Patients can delete own chat messages"
    ON public.chat_messages FOR DELETE
    USING (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM public.chat_sessions s
            WHERE s.id = session_id AND s.user_id = auth.uid()
        )
    );
