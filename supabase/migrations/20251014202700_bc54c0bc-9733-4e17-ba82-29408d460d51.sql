-- Add DELETE policy for rate_limit_tracking table to allow cleanup
-- This policy allows deletion of records older than 24 hours
-- The cleanup_old_rate_limits() function uses SECURITY DEFINER so it will work

CREATE POLICY "Service role can delete old rate limits"
ON public.rate_limit_tracking
FOR DELETE
TO authenticated
USING (created_at < now() - interval '24 hours');