-- Add a policy to allow authenticated users to view other users' profiles for marketplace functionality
-- This replaces the problematic auth.uid() logic that was in the view

CREATE POLICY "Authenticated users can view marketplace profiles" 
ON public.profiles 
FOR SELECT 
USING (
    auth.uid() IS NOT NULL 
    AND user_id != auth.uid()
);