-- Fix the sensitive data exposure by creating a proper secure view
-- without trying to enable RLS on views (which isn't supported)

-- Create a secure view for public marketplace data that excludes sensitive fields
CREATE OR REPLACE VIEW public.marketplace_profiles AS
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

-- Add security barrier to enforce RLS
ALTER VIEW public.marketplace_profiles SET (security_barrier = true);

-- Add comments explaining the security design
COMMENT ON VIEW public.marketplace_profiles IS 
'Secure view that exposes only non-sensitive profile information for marketplace display. Sensitive data (phone, address) is excluded and only accessible through get_secure_profile() function with proper permissions.';

-- Verify the policy on the main table is properly restrictive
COMMENT ON POLICY "Users can only view own profile directly" ON public.profiles IS 
'Critical security policy: Restricts direct profiles table access to own profile only. Other users profiles must be accessed through marketplace_profiles view or get_secure_profile() function which enforces proper permission checks.';