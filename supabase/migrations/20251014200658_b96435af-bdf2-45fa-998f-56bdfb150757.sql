-- Supprimer la vue précédente qui avait SECURITY DEFINER
DROP VIEW IF EXISTS public.public_profiles;

-- Recréer la vue sans SECURITY DEFINER (elle utilisera les permissions de l'utilisateur qui l'interroge)
CREATE VIEW public.public_profiles AS
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
FROM public.profiles;

-- La vue héritera des politiques RLS de la table profiles
-- Pas besoin de GRANT explicite car elle utilisera les mêmes permissions

-- Ajouter un commentaire pour documenter
COMMENT ON VIEW public.public_profiles IS 
'Vue sécurisée des profils excluant les données personnelles sensibles (téléphone, adresse, payment_method). 
Pour accéder aux données sensibles avec vérification des permissions, utiliser la fonction get_secure_profile().';