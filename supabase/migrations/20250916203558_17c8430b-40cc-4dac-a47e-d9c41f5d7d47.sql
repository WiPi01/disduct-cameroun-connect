-- Final fix for sensitive data exposure
-- Remove the problematic policy that allows access to sensitive data

-- Drop the policy that exposes sensitive information
DROP POLICY IF EXISTS "Users can view public marketplace profile info" ON public.profiles;

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

-- Add security barrier to enforce RLS on underlying table
ALTER VIEW public.marketplace_profiles SET (security_barrier = true);

-- Add comment explaining the security design
COMMENT ON VIEW public.marketplace_profiles IS 
'Secure view that exposes only non-sensitive profile information for marketplace display. Sensitive data (phone, address) is completely excluded and only accessible through get_secure_profile() function with explicit permission checks.';