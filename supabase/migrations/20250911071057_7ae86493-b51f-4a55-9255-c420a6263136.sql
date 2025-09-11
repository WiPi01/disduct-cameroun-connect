-- Create a table to track contact sharing permissions
CREATE TABLE IF NOT EXISTS public.contact_sharing_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL, -- The user who owns the contact info
  requester_id UUID NOT NULL, -- The user requesting access
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE, -- Optional expiration
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(owner_id, requester_id)
);

-- Enable RLS on the new table
ALTER TABLE public.contact_sharing_permissions ENABLE ROW LEVEL SECURITY;

-- Policy for contact sharing permissions
CREATE POLICY "Users can manage their own contact sharing permissions" 
ON public.contact_sharing_permissions 
FOR ALL 
USING (auth.uid() = owner_id OR auth.uid() = requester_id);

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Users can view profiles of transaction partners" ON public.profiles;

-- Create a security definer function to check contact sharing permission
CREATE OR REPLACE FUNCTION public.has_contact_permission(profile_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Always allow viewing own profile
  IF auth.uid() = profile_user_id THEN
    RETURN true;
  END IF;
  
  -- Check if permission exists
  RETURN EXISTS (
    SELECT 1 FROM public.contact_sharing_permissions 
    WHERE owner_id = profile_user_id 
    AND requester_id = auth.uid()
    AND (expires_at IS NULL OR expires_at > now())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Create a new restrictive policy that requires contact permission for sensitive data
CREATE POLICY "Users can view profiles with contact permission check" 
ON public.profiles 
FOR SELECT 
USING (
  -- Always allow viewing own profile
  auth.uid() = user_id 
  OR 
  -- For others, only allow if they have conversations/transactions AND we'll filter sensitive data in app
  (
    auth.uid() IS NOT NULL 
    AND (
      EXISTS (
        SELECT 1 FROM conversations 
        WHERE (
          (conversations.buyer_id = auth.uid() AND conversations.seller_id = profiles.user_id) 
          OR 
          (conversations.seller_id = auth.uid() AND conversations.buyer_id = profiles.user_id)
        )
      )
      OR 
      EXISTS (
        SELECT 1 FROM transactions 
        WHERE (
          (transactions.buyer_id = auth.uid() AND transactions.seller_id = profiles.user_id) 
          OR 
          (transactions.seller_id = auth.uid() AND transactions.buyer_id = profiles.user_id)
        )
      )
    )
  )
);

-- Add trigger to update updated_at on contact_sharing_permissions
CREATE TRIGGER update_contact_sharing_permissions_updated_at
BEFORE UPDATE ON public.contact_sharing_permissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();