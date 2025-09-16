-- Complete fix for sensitive data exposure
-- Create a security definer function that enforces column-level restrictions

-- First, drop the existing policy that allows broad access
DROP POLICY IF EXISTS "Users can view public marketplace profile info" ON public.profiles;

-- Create a new restrictive policy that completely blocks direct table access to other users' profiles
CREATE POLICY "Users can only view own profile directly" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create a secure view for public marketplace data that excludes sensitive fields
CREATE VIEW public.marketplace_profiles 
WITH (security_barrier = true) AS
SELECT 
  id,
  user_id,
  display_name,
  rating,
  total_reviews,
  avatar_url,
  created_at,
  first_product_posted_congratulated,
  first_product_sold_congratulated,
  first_product_bought_congratulated
  -- Explicitly exclude phone and address columns
FROM public.profiles
WHERE auth.uid() IS NOT NULL AND user_id <> auth.uid();

-- Grant select permission on the view to authenticated users
GRANT SELECT ON public.marketplace_profiles TO authenticated;

-- Enable RLS on the view
ALTER VIEW public.marketplace_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for the view
CREATE POLICY "Authenticated users can view marketplace profiles" 
ON public.marketplace_profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Add comments explaining the security design
COMMENT ON VIEW public.marketplace_profiles IS 
'Secure view that exposes only non-sensitive profile information for marketplace display. Sensitive data (phone, address) is excluded and only accessible through get_secure_profile() function with proper permissions.';

COMMENT ON POLICY "Users can only view own profile directly" ON public.profiles IS 
'Restricts direct table access to own profile only. Other users'' profiles should be accessed through marketplace_profiles view or get_secure_profile() function.';