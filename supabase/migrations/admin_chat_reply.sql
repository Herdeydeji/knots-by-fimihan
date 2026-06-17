-- Create admin_send_chat_reply function for SECURITY DEFINER admin replies
CREATE OR REPLACE FUNCTION public.admin_send_chat_reply(p_user_id UUID, p_message TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF public.is_admin() THEN
    INSERT INTO public.chat_messages (user_id, sender, message)
    VALUES (p_user_id, 'admin', p_message);
  ELSE
    RAISE EXCEPTION 'Not authorized';
  END IF;
END;
$$;

-- Ensure chat_messages is in the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS chat_messages;

-- Add update policy for marking messages as read (if missing)
DROP POLICY IF EXISTS "Admins can mark messages as read" ON chat_messages;
CREATE POLICY "Admins can mark messages as read"
  ON chat_messages FOR UPDATE
  USING (public.is_admin());
