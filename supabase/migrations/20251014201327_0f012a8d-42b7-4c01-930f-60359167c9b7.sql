-- Supprimer la policy problématique qui permet de voir les profils des autres
DROP POLICY IF EXISTS "Users can view public profile data of others" ON public.profiles;

-- Note: Maintenant, seuls les utilisateurs peuvent voir leur propre profil complet via la policy
-- "Users can view own complete profile"
-- 
-- Pour voir les données publiques des autres utilisateurs, les applications doivent utiliser
-- la vue public_profiles qui exclut phone, address, et payment_method
--
-- Pour accéder aux données sensibles avec vérification des permissions, 
-- utiliser la fonction get_secure_profile(user_id)

-- Ajouter un commentaire pour documenter l'approche de sécurité
COMMENT ON POLICY "Users can view own complete profile" ON public.profiles IS 
'Permet aux utilisateurs de voir uniquement leur propre profil complet. 
Pour les profils publics des autres utilisateurs, utiliser la vue public_profiles. 
Pour les données sensibles avec permissions, utiliser get_secure_profile().';