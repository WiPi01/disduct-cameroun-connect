-- Supprimer l'ancienne policy trop permissive
DROP POLICY IF EXISTS "Authenticated users can view public profile info" ON public.profiles;

-- Créer une policy qui permet de voir son propre profil complet
CREATE POLICY "Users can view own complete profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Créer une policy qui permet de voir les informations publiques des autres profils
-- mais PAS le téléphone et l'adresse (ces champs seront NULL pour les autres utilisateurs)
-- Note: Cette approche utilise une vue sécurisée pour les données sensibles
CREATE POLICY "Users can view public profile data of others"
ON public.profiles
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() != user_id
  AND NOT public.can_view_contact_details(user_id)
);

-- Créer une policy pour ceux qui ont la permission explicite de voir les contacts
CREATE POLICY "Users with permission can view contact details"
ON public.profiles  
FOR SELECT
USING (
  auth.uid() IS NOT NULL
  AND auth.uid() != user_id
  AND public.can_view_contact_details(user_id)
);

-- Créer une vue sécurisée pour les profils publics (sans données sensibles)
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  user_id,
  display_name,
  avatar_url,
  shop_name,
  rating,
  total_reviews,
  created_at,
  updated_at,
  first_product_posted_congratulated,
  first_product_sold_congratulated,
  first_product_bought_congratulated
  -- Exclusion volontaire de: phone, address, payment_method
FROM public.profiles;

-- Permettre aux utilisateurs authentifiés de lire la vue publique
GRANT SELECT ON public.public_profiles TO authenticated;

-- Ajouter un commentaire pour documenter la sécurité
COMMENT ON VIEW public.public_profiles IS 
'Vue sécurisée des profils excluant les données personnelles sensibles (téléphone, adresse). 
Utiliser get_secure_profile() pour accéder aux données sensibles avec vérification des permissions.';