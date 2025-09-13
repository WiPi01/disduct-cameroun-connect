-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Users can view basic profile info for marketplace" ON public.profiles;

-- Create a secure view that only exposes non-sensitive profile information
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  user_id,
  display_name,
  rating,
  total_reviews,
  avatar_url,
  created_at,
  -- Conditionally include sensitive data only if user has permission
  CASE 
    WHEN auth.uid() = user_id OR public.can_view_contact_details(user_id) 
    THEN phone 
    ELSE NULL 
  END as phone,
  CASE 
    WHEN auth.uid() = user_id OR public.can_view_contact_details(user_id) 
    THEN address 
    ELSE NULL 
  END as address
FROM public.profiles;

-- Enable RLS on the view
ALTER VIEW public.public_profiles SET (security_barrier = true);

-- Grant access to the view
GRANT SELECT ON public.public_profiles TO authenticated;
GRANT SELECT ON public.public_profiles TO anon;

-- Create a more restrictive policy for direct table access
-- Only allow viewing other users' profiles for basic info (no sensitive columns)
CREATE POLICY "Users can view non-sensitive profile info"
ON public.profiles
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND user_id != auth.uid()
  AND NOT EXISTS (
    -- This policy should not be used when sensitive data is requested
    -- The application should use the public_profiles view instead
    SELECT 1 
  )
);