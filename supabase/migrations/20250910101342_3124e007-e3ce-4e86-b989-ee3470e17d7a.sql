-- Fix security issue: Restrict public access to profiles table
-- Currently, the "Users can view all profiles" policy allows anyone (including unauthenticated users) 
-- to view all profiles, which exposes email addresses stored in display_name

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a more secure policy that only allows authenticated users to view profiles
CREATE POLICY "Authenticated users can view profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (true);

-- Create a policy that allows users to view their own profile even if not authenticated
-- This ensures the app functionality isn't broken for profile management
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
TO anon
USING (auth.uid() = user_id);