-- Fix security definer view issue with marketplace_profiles
-- Replace the problematic view with a secure one

-- Drop the existing marketplace_profiles view
DROP VIEW IF EXISTS public.marketplace_profiles;

-- Create a new view that simply selects from profiles without auth.uid()
-- Security will be handled by the application layer and the profiles table RLS
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
FROM public.profiles;

-- Grant SELECT permissions to authenticated users
GRANT SELECT ON public.marketplace_profiles TO authenticated;