-- Fix security vulnerability: Remove policy that exposes sensitive profile data

-- Drop the problematic policy that allows any authenticated user to view other profiles
-- This policy was exposing sensitive data like phone numbers and addresses
DROP POLICY IF EXISTS "Authenticated users can view marketplace profiles" ON public.profiles;

-- The marketplace_profiles view already only shows non-sensitive fields
-- No additional changes needed to the view as it's already secure

-- Verify that sensitive data access is properly controlled:
-- 1. Users can only view their own full profile via "Users can view own profile" policy
-- 2. Contact details (phone, address) are only accessible via get_secure_profile() function
--    which checks for explicit contact sharing permissions
-- 3. The marketplace_profiles view only shows public, non-sensitive fields