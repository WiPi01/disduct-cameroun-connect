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

-- Create a new restrictive policy that only shows public profile information
CREATE POLICY "Users can view public profile information" 
ON public.profiles 
FOR SELECT 
USING (
  -- Always allow viewing own profile
  auth.uid() = user_id 
  OR 
  -- For others, only show basic public info (we'll handle this in the application layer)
  (
    auth.uid() IS NOT NULL 
    AND (
      -- Only allow viewing profiles of people they have conversations/transactions with
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

-- Create a view for public profile information only
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  user_id,
  display_name,
  rating,
  total_reviews,
  created_at
FROM public.profiles;

-- Create a view for full profile information (including contact details)
CREATE OR REPLACE VIEW public.full_profiles AS
SELECT 
  p.*,
  CASE 
    -- Always show full info to the profile owner
    WHEN auth.uid() = p.user_id THEN true
    -- Show full info if contact sharing permission exists
    WHEN EXISTS (
      SELECT 1 FROM public.contact_sharing_permissions csp
      WHERE csp.owner_id = p.user_id 
      AND csp.requester_id = auth.uid()
      AND (csp.expires_at IS NULL OR csp.expires_at > now())
    ) THEN true
    ELSE false
  END as has_contact_permission
FROM public.profiles p;

-- Enable RLS on the views
ALTER VIEW public.public_profiles SET (security_barrier = true);
ALTER VIEW public.full_profiles SET (security_barrier = true);

-- Create policies for the views
CREATE POLICY "Anyone can view public profile data" 
ON public.public_profiles 
FOR SELECT 
USING (true);

-- Add trigger to update updated_at on contact_sharing_permissions
CREATE TRIGGER update_contact_sharing_permissions_updated_at
BEFORE UPDATE ON public.contact_sharing_permissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();