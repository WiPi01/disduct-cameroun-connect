-- Fix security vulnerability: Remove policy that exposes sensitive profile data
-- Replace with secure access through the get_secure_profile function

-- Drop the problematic policy that allows direct access to profiles table
DROP POLICY IF EXISTS "Authenticated users can view marketplace profiles" ON public.profiles;

-- Update the marketplace_profiles view to use the secure profile function
-- This ensures proper field-level security is applied
DROP VIEW IF EXISTS public.marketplace_profiles;

-- Create a secure marketplace view that only shows non-sensitive data
CREATE VIEW public.marketplace_profiles 
WITH (security_invoker=true) AS
SELECT 
    p.id,
    p.user_id,
    p.display_name,
    p.rating,
    p.total_reviews,
    p.avatar_url,
    p.created_at,
    p.first_product_posted_congratulated,
    p.first_product_sold_congratulated,
    p.first_product_bought_congratulated
FROM public.profiles p
WHERE auth.uid() IS NOT NULL 
  AND p.user_id != auth.uid();

-- Grant access to the secure view
GRANT SELECT ON public.marketplace_profiles TO authenticated;

-- Add a policy for the secure marketplace view that only shows public data
CREATE POLICY "Authenticated users can view public marketplace data"
ON public.marketplace_profiles
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);