-- Completely remove any security definer settings and recreate a clean view
-- This should resolve the security linter warnings

-- Drop the view completely and recreate it clean
DROP VIEW IF EXISTS public.marketplace_profiles;

-- Drop any leftover views that might have security definer settings
DROP VIEW IF EXISTS public.public_profiles;

-- Recreate the view cleanly without any security definer properties
CREATE VIEW public.marketplace_profiles AS
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
FROM public.profiles
WHERE auth.uid() IS NOT NULL AND user_id <> auth.uid();

-- Grant appropriate permissions
GRANT SELECT ON public.marketplace_profiles TO authenticated;

-- Verify current RLS policies are secure
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles' AND schemaname = 'public';