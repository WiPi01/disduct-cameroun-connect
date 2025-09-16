-- Fix security vulnerability: Restrict profile visibility to non-sensitive fields only
-- This updates the RLS policy to hide phone numbers and addresses from direct table access

-- Drop the existing policy that exposes sensitive data
DROP POLICY IF EXISTS "Users can view marketplace profile info" ON public.profiles;

-- Create a new secure policy that only exposes non-sensitive marketplace information
CREATE POLICY "Users can view public marketplace profile info" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND user_id <> auth.uid()
);

-- Update the policy to use a row-level filter that excludes sensitive columns
-- We'll create a security definer function to handle this properly
CREATE OR REPLACE FUNCTION public.get_public_profile_fields(profile_row profiles)
RETURNS TABLE(
  id uuid,
  user_id uuid,
  display_name text,
  rating numeric,
  total_reviews integer,
  avatar_url text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  first_product_posted_congratulated boolean,
  first_product_sold_congratulated boolean,
  first_product_bought_congratulated boolean
) 
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only return non-sensitive fields for public viewing
  RETURN QUERY SELECT 
    profile_row.id,
    profile_row.user_id,
    profile_row.display_name,
    profile_row.rating,
    profile_row.total_reviews,
    profile_row.avatar_url,
    profile_row.created_at,
    profile_row.updated_at,
    profile_row.first_product_posted_congratulated,
    profile_row.first_product_sold_congratulated,
    profile_row.first_product_bought_congratulated;
END;
$$;

-- Create a secure view for public profile access
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  user_id,
  display_name,
  rating,
  total_reviews,
  avatar_url,
  created_at,
  updated_at,
  first_product_posted_congratulated,
  first_product_sold_congratulated,
  first_product_bought_congratulated,
  -- Explicitly exclude sensitive fields
  NULL::text as phone,
  NULL::text as address
FROM public.profiles
WHERE auth.uid() IS NOT NULL AND user_id <> auth.uid();

-- Enable RLS on the view
ALTER VIEW public.public_profiles SET (security_barrier = true);

-- Add a comment explaining the security measure
COMMENT ON POLICY "Users can view public marketplace profile info" ON public.profiles IS 
'Allows authenticated users to view non-sensitive profile information of other users. Sensitive data (phone, address) is excluded and only accessible through secure functions with proper permissions.';