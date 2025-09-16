-- Fix security definer view issue with marketplace_profiles
-- Drop the problematic view and replace it with proper RLS policies

-- Drop the existing marketplace_profiles view
DROP VIEW IF EXISTS public.marketplace_profiles;

-- Create a new view without auth.uid() to avoid SECURITY DEFINER issues
-- The security will be handled by RLS policies on the underlying profiles table
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

-- Enable RLS on the view (inherits from profiles table RLS)
-- Create a policy for the marketplace_profiles view that allows authenticated users 
-- to view other users' profiles (excluding their own for marketplace purposes)
CREATE POLICY "Authenticated users can view marketplace profiles"
ON public.marketplace_profiles
FOR SELECT
USING (
    auth.uid() IS NOT NULL 
    AND user_id != auth.uid()
);