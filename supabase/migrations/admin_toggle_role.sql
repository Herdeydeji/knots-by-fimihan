-- SECURITY DEFINER function to let existing admins promote/demote other users
CREATE OR REPLACE FUNCTION public.admin_set_admin_role(target_user_id UUID, make_admin BOOLEAN)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF public.is_admin() THEN
    UPDATE public.profiles
    SET is_admin = make_admin
    WHERE id = target_user_id;
  ELSE
    RAISE EXCEPTION 'Not authorized';
  END IF;
END;
$$;

-- Allow admins to UPDATE any profile row (needed for is_admin toggle)
DROP POLICY IF EXISTS "Admins can update profiles" ON profiles;
CREATE POLICY "Admins can update profiles"
  ON profiles FOR UPDATE
  USING (public.is_admin());
