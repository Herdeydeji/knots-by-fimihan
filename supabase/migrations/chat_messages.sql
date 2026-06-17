-- Run this in your Supabase SQL editor to create the chat table and enable Realtime
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'admin')),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert their own messages" ON chat_messages;
CREATE POLICY "Users can insert their own messages"
  ON chat_messages FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND sender = 'user'
  );

DROP POLICY IF EXISTS "Admins can insert replies" ON chat_messages;
CREATE POLICY "Admins can insert replies"
  ON chat_messages FOR INSERT
  WITH CHECK (
    sender = 'admin' AND auth.jwt() ->> 'email' = 'adedejiadebeso@gmail.com'
  );

DROP POLICY IF EXISTS "Users can read their own conversations" ON chat_messages;
CREATE POLICY "Users can read their own conversations"
  ON chat_messages FOR SELECT
  USING (
    auth.uid() = user_id
  );

DROP POLICY IF EXISTS "Admins can read all conversations" ON chat_messages;
CREATE POLICY "Admins can read all conversations"
  ON chat_messages FOR SELECT
  USING (
    auth.jwt() ->> 'email' = 'adedejiadebeso@gmail.com'
  );

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
