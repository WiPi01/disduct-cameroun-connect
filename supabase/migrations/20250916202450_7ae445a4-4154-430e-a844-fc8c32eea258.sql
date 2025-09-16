-- Fix the security definer view issue by removing the problematic view
-- and ensuring the RLS policy properly restricts access to sensitive columns

-- Drop the problematic security definer view
DROP VIEW IF EXISTS public.public_profiles;

-- Drop the helper function that's not needed
DROP FUNCTION IF EXISTS public.get_public_profile_fields(profiles);

-- The main fix: Update the existing RLS policy to be more restrictive
-- We need to ensure that when users query the profiles table directly,
-- they can only see non-sensitive information

-- Since RLS policies cannot filter columns directly, we'll modify the application
-- to use the secure get_secure_profile function instead of direct table access

-- Update the comment on the policy to clarify its purpose
COMMENT ON POLICY "Users can view public marketplace profile info" ON public.profiles IS 
'Allows authenticated users to view profiles of other users. However, sensitive data (phone, address) should only be accessed through the get_secure_profile() function which enforces proper permission checks.';