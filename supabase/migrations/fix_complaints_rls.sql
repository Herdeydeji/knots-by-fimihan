-- Fix complaints RLS: old UPDATE policy queried auth.users directly,
-- which the authenticated role cannot access. Use public.is_admin() instead.

-- Drop broken policies
DROP POLICY IF EXISTS "admins can update complaints" ON public.complaints;
DROP POLICY IF EXISTS "admins can read all complaints" ON public.complaints;

-- Admins can read all complaints (via profiles table, safe)
CREATE POLICY "admins can read all complaints" ON public.complaints
  FOR SELECT
  USING (public.is_admin());

-- Admins can update complaints (via profiles table, safe)
CREATE POLICY "admins can update complaints" ON public.complaints
  FOR UPDATE
  USING (public.is_admin());

-- Users can insert their own complaints; anonymous submissions allowed
DROP POLICY IF EXISTS "users can insert their own complaints" ON public.complaints;

CREATE POLICY "users can insert their own complaints" ON public.complaints
  FOR INSERT
  WITH CHECK (
    (auth.uid() = user_id) OR (user_id IS NULL)
  );
