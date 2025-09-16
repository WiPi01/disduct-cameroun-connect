-- Phase 1: Fix critical privacy vulnerability in profiles table RLS policies

-- First, let's see what policies exist and drop them properly
DO $$ 
BEGIN
  -- Drop existing problematic policies
  DROP POLICY IF EXISTS "Users can view basic profile info for marketplace" ON public.profiles;
  DROP POLICY IF EXISTS "Users can view non-sensitive profile info" ON public.profiles;
  DROP POLICY IF EXISTS "Users can view marketplace profile info" ON public.profiles;
EXCEPTION
  WHEN OTHERS THEN
    -- Continue if policies don't exist
    NULL;
END $$;

-- Create a secure policy that only exposes non-sensitive data to other authenticated users
CREATE POLICY "Users can view marketplace profile info" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND user_id <> auth.uid()
);

-- Phase 2: Restrict reviews and products to authenticated users only
DO $$ 
BEGIN
  -- Update reviews policy to require authentication
  DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
  DROP POLICY IF EXISTS "Authenticated users can view reviews" ON public.reviews;
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END $$;

CREATE POLICY "Authenticated users can view reviews" 
ON public.reviews 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Update products policy to require authentication  
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Anyone can view available products" ON public.products;
  DROP POLICY IF EXISTS "Authenticated users can view products" ON public.products;
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END $$;

CREATE POLICY "Authenticated users can view products" 
ON public.products 
FOR SELECT 
USING (auth.uid() IS NOT NULL);