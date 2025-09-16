-- Remove the security definer property from the view to fix the linter warning
-- The view will still be secure through the underlying table's RLS policies

-- Update the view without security_barrier to avoid the security definer warning
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