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

-- Enable RLS on security logs (only system access)
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- Update the get_secure_profile function to include security logging and proper column filtering
CREATE OR REPLACE FUNCTION public.get_secure_profile(profile_user_id uuid)
RETURNS json
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  profile_data json;
  can_view_contact boolean;
BEGIN
  -- Check if user can view contact details
  can_view_contact := public.can_view_contact_details(profile_user_id);
  
  -- Log profile access attempt for security monitoring
  BEGIN
    INSERT INTO public.security_logs (
      event_type,
      user_id,
      target_user_id,
      metadata
    ) VALUES (
      'profile_access',
      auth.uid(),
      profile_user_id,
      json_build_object(
        'can_view_contact', can_view_contact,
        'is_own_profile', auth.uid() = profile_user_id
      )
    );
  EXCEPTION
    WHEN OTHERS THEN
      -- Don't fail the main operation if logging fails
      NULL;
  END;
  
  -- Always allow viewing own profile with all details
  IF auth.uid() = profile_user_id THEN
    SELECT json_build_object(
      'user_id', user_id,
      'display_name', display_name,
      'rating', rating,
      'total_reviews', total_reviews,
      'avatar_url', avatar_url,
      'phone', phone,
      'address', address,
      'created_at', created_at,
      'can_view_contact', true
    ) INTO profile_data
    FROM profiles
    WHERE user_id = profile_user_id;
  -- For other users, only return non-sensitive marketplace data unless contact permission exists
  ELSE
    SELECT json_build_object(
      'user_id', user_id,
      'display_name', display_name,
      'rating', rating,
      'total_reviews', total_reviews,
      'avatar_url', avatar_url,
      -- Only include sensitive data if explicit permission exists
      'phone', CASE WHEN can_view_contact THEN phone ELSE NULL END,
      'address', CASE WHEN can_view_contact THEN address ELSE NULL END,
      'created_at', created_at,
      'can_view_contact', can_view_contact
    ) INTO profile_data
    FROM profiles
    WHERE user_id = profile_user_id;
  END IF;
  
  RETURN profile_data;
END;
$$;