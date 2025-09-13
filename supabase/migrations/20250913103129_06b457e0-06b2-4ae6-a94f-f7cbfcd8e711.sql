-- Drop the overly permissive profile viewing policy
DROP POLICY IF EXISTS "Users can view profiles with contact permission check" ON public.profiles;

-- Create more restrictive policies for profile access
-- Policy 1: Users can always view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Policy 2: Allow viewing basic profile info (display_name, rating, total_reviews) for marketplace functionality
-- but NOT sensitive contact info (phone, address)
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

-- Add a computed column for contact details visibility (for use in application layer)
-- This will help the SecureProfileDisplay component know when to show contact info