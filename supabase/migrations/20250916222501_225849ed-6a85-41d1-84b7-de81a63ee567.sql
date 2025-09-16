-- Fix the ownership and security context of marketplace_profiles view
-- Drop and recreate the view with proper ownership

DROP VIEW IF EXISTS public.marketplace_profiles;

-- Create the view with explicit ownership for authenticated role
CREATE VIEW public.marketplace_profiles 
WITH (security_invoker=true) AS
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
FROM public.profiles;

-- Ensure proper permissions
GRANT SELECT ON public.marketplace_profiles TO authenticated;
GRANT SELECT ON public.marketplace_profiles TO anon;