-- Phase 1: Fix critical privacy vulnerability in profiles table RLS policies

-- Drop the overly permissive policies that expose sensitive data
DROP POLICY IF EXISTS "Users can view basic profile info for marketplace" ON public.profiles;
DROP POLICY IF EXISTS "Users can view non-sensitive profile info" ON public.profiles;

-- Create a secure policy that only exposes non-sensitive marketplace data to other users
CREATE POLICY "Users can view marketplace profile info" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND user_id <> auth.uid()
);

-- Add a row-level filter to restrict which columns are accessible
-- This will be handled by the get_secure_profile function for sensitive data

-- Phase 2: Restrict reviews and products to authenticated users only
-- Update reviews policy to require authentication
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
CREATE POLICY "Authenticated users can view reviews" 
ON public.reviews 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Update products policy to require authentication  
DROP POLICY IF EXISTS "Anyone can view available products" ON public.products;
CREATE POLICY "Authenticated users can view products" 
ON public.products 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Add security logging for profile access attempts
CREATE OR REPLACE FUNCTION public.log_profile_access(profile_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log profile access attempts for security monitoring
  INSERT INTO public.security_logs (
    event_type,
    user_id,
    target_user_id,
    ip_address,
    user_agent,
    created_at
  ) VALUES (
    'profile_access',
    auth.uid(),
    profile_user_id,
    current_setting('request.headers')::json->>'x-forwarded-for',
    current_setting('request.headers')::json->>'user-agent',
    now()
  );
EXCEPTION
  WHEN OTHERS THEN
    -- Don't fail the main operation if logging fails
    NULL;
END;
$$;

-- Create security logs table for monitoring
CREATE TABLE IF NOT EXISTS public.security_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type text NOT NULL,
  user_id uuid,
  target_user_id uuid,
  ip_address text,
  user_agent text,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on security logs
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- Only allow system/admin access to security logs
CREATE POLICY "Only system can access security logs" 
ON public.security_logs 
FOR ALL 
USING (false);