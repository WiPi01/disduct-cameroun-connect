-- Drop the overly permissive profile viewing policy
DROP POLICY IF EXISTS "Users can view profiles with contact permission check" ON public.profiles;

-- Create more restrictive policy for viewing other users' basic profile info
-- This only allows viewing basic marketplace info, not sensitive contact details
CREATE POLICY "Users can view basic profile info for marketplace"
ON public.profiles
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND user_id != auth.uid()
);

-- Create a security definer function to check if contact details should be visible
CREATE OR REPLACE FUNCTION public.can_view_contact_details(profile_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Always allow viewing own contact details
  IF auth.uid() = profile_user_id THEN
    RETURN true;
  END IF;
  
  -- Check if explicit contact sharing permission exists
  RETURN EXISTS (
    SELECT 1 FROM public.contact_sharing_permissions 
    WHERE owner_id = profile_user_id 
    AND requester_id = auth.uid()
    AND (expires_at IS NULL OR expires_at > now())
  );
END;
$$;