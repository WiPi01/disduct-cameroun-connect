-- Fix security issue: Restrict profile access to only users actively transacting
-- Currently "Authenticated users can view profiles" allows all authenticated users 
-- to see personal information (phone, address) of all other users

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

-- Create a more restrictive policy that only allows viewing profiles of users
-- you are actively transacting with (through conversations or transactions)
CREATE POLICY "Users can view profiles of transaction partners" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (
  -- Users can always view their own profile
  auth.uid() = user_id 
  OR 
  -- Users can view profiles of people they have conversations with
  EXISTS (
    SELECT 1 FROM public.conversations 
    WHERE (conversations.buyer_id = auth.uid() AND conversations.seller_id = profiles.user_id)
       OR (conversations.seller_id = auth.uid() AND conversations.buyer_id = profiles.user_id)
  )
  OR
  -- Users can view profiles of people they have transactions with
  EXISTS (
    SELECT 1 FROM public.transactions 
    WHERE (transactions.buyer_id = auth.uid() AND transactions.seller_id = profiles.user_id)
       OR (transactions.seller_id = auth.uid() AND transactions.buyer_id = profiles.user_id)
  )
);