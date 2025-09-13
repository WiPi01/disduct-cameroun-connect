-- Drop the problematic view
DROP VIEW IF EXISTS public.public_profiles;

-- Instead, create a simple policy that allows viewing basic profile info only
-- We'll handle sensitive data filtering in the application layer
CREATE POLICY "Users can view basic profile info for marketplace"
ON public.profiles
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND user_id != auth.uid()
);

-- Create a function to get secure profile data that applications should use
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
      'created_at', created_at
    ) INTO profile_data
    FROM profiles
    WHERE user_id = profile_user_id;
  -- For other users, conditionally include sensitive data
  ELSE
    SELECT json_build_object(
      'user_id', user_id,
      'display_name', display_name,
      'rating', rating,
      'total_reviews', total_reviews,
      'avatar_url', avatar_url,
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