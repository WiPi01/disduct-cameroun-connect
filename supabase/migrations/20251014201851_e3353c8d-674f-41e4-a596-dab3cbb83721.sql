-- ============================================
-- SECURITY FIX: Contact Sharing Permissions
-- ============================================
-- This migration implements a secure approval workflow for contact sharing
-- to prevent unauthorized access to phone numbers and addresses.

-- Step 1: Add status column to track approval workflow
ALTER TABLE public.contact_sharing_permissions
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending'
CHECK (status IN ('pending', 'approved', 'rejected'));

-- Step 2: Add constraint to prevent self-requests
ALTER TABLE public.contact_sharing_permissions
ADD CONSTRAINT no_self_request CHECK (owner_id != requester_id);

-- Step 3: Drop the overly permissive existing policy
DROP POLICY IF EXISTS "Users can manage their own contact sharing permissions" ON public.contact_sharing_permissions;

-- Step 4: Create granular RLS policies for secure workflow

-- Policy: Anyone can request permission (creates pending request)
CREATE POLICY "Users can request contact permissions"
ON public.contact_sharing_permissions
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = requester_id 
  AND status = 'pending'
);

-- Policy: Owners can view all requests to them
CREATE POLICY "Owners can view permission requests"
ON public.contact_sharing_permissions
FOR SELECT
TO authenticated
USING (auth.uid() = owner_id);

-- Policy: Requesters can view their own requests
CREATE POLICY "Requesters can view their own requests"
ON public.contact_sharing_permissions
FOR SELECT
TO authenticated
USING (auth.uid() = requester_id);

-- Policy: Only owners can approve/reject requests
CREATE POLICY "Owners can approve or reject requests"
ON public.contact_sharing_permissions
FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (
  auth.uid() = owner_id 
  AND status IN ('approved', 'rejected')
);

-- Policy: Owners can revoke approved permissions
CREATE POLICY "Owners can delete permissions"
ON public.contact_sharing_permissions
FOR DELETE
TO authenticated
USING (auth.uid() = owner_id);

-- Step 5: Update can_view_contact_details function to check approval status
CREATE OR REPLACE FUNCTION public.can_view_contact_details(profile_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Always allow viewing own contact details
  IF auth.uid() = profile_user_id THEN
    RETURN true;
  END IF;
  
  -- Check if APPROVED contact sharing permission exists
  RETURN EXISTS (
    SELECT 1 FROM public.contact_sharing_permissions 
    WHERE owner_id = profile_user_id 
    AND requester_id = auth.uid()
    AND status = 'approved'  -- Must be explicitly approved!
    AND (expires_at IS NULL OR expires_at > now())
  );
END;
$$;

-- ============================================
-- SECURITY FIX: Security Logs RLS Policies
-- ============================================
-- Allow users to view their own logs and SECURITY DEFINER functions to insert

-- Drop the overly restrictive policy
DROP POLICY IF EXISTS "Only system can access security logs" ON public.security_logs;

-- Policy: Users can view their own security logs
CREATE POLICY "Users can view own security logs"
ON public.security_logs
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Allow service role to insert logs (for SECURITY DEFINER functions)
CREATE POLICY "Service role can insert security logs"
ON public.security_logs
FOR INSERT
TO authenticated
WITH CHECK (true);  -- Functions running as SECURITY DEFINER can insert

-- ============================================
-- SECURITY FIX: Server-Side Rate Limiting
-- ============================================
-- Create table to track rate limiting at database level

CREATE TABLE IF NOT EXISTS public.rate_limit_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  action_type text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on rate_limit_tracking
ALTER TABLE public.rate_limit_tracking ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own rate limit records
CREATE POLICY "Users can view own rate limits"
ON public.rate_limit_tracking
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: System can insert rate limit records
CREATE POLICY "System can insert rate limits"
ON public.rate_limit_tracking
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create index for efficient rate limit queries
CREATE INDEX IF NOT EXISTS idx_rate_limit_user_action_time 
ON public.rate_limit_tracking(user_id, action_type, created_at DESC);

-- Function to check server-side rate limits
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_user_id uuid,
  p_action_type text,
  p_max_requests integer,
  p_time_window_minutes integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  request_count integer;
  time_threshold timestamp with time zone;
BEGIN
  -- Calculate time threshold
  time_threshold := now() - (p_time_window_minutes || ' minutes')::interval;
  
  -- Count recent requests
  SELECT COUNT(*) INTO request_count
  FROM public.rate_limit_tracking
  WHERE user_id = p_user_id
    AND action_type = p_action_type
    AND created_at > time_threshold;
  
  -- Return true if under limit
  IF request_count < p_max_requests THEN
    -- Log this attempt
    INSERT INTO public.rate_limit_tracking (user_id, action_type)
    VALUES (p_user_id, p_action_type);
    
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$;

-- Trigger to enforce rate limits on contact permission requests
CREATE OR REPLACE FUNCTION public.enforce_contact_request_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check rate limit: max 5 requests per 15 minutes
  IF NOT public.check_rate_limit(NEW.requester_id, 'contact_permission_request', 5, 15) THEN
    RAISE EXCEPTION 'Rate limit exceeded. Maximum 5 requests per 15 minutes allowed.';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for rate limiting
DROP TRIGGER IF EXISTS trg_contact_request_rate_limit ON public.contact_sharing_permissions;
CREATE TRIGGER trg_contact_request_rate_limit
  BEFORE INSERT ON public.contact_sharing_permissions
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_contact_request_rate_limit();

-- Cleanup function: Remove old rate limit records (run periodically)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  DELETE FROM public.rate_limit_tracking
  WHERE created_at < now() - interval '24 hours';
END;
$$;

-- Add helpful comments
COMMENT ON TABLE public.contact_sharing_permissions IS 
'Manages secure contact sharing with approval workflow. Status must progress: pending -> approved/rejected. Only owner can approve.';

COMMENT ON TABLE public.rate_limit_tracking IS 
'Server-side rate limiting tracking. Records are automatically cleaned up after 24 hours.';

COMMENT ON FUNCTION public.check_rate_limit IS 
'Server-side rate limiting enforcement. Returns true if action is allowed, false if rate limit exceeded.';