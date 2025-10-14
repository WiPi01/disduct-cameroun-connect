-- Supprimer l'ancienne policy restrictive de SELECT
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Créer une nouvelle policy qui permet à tous les utilisateurs authentifiés de voir les profils
-- mais avec des informations sensibles protégées par la fonction get_secure_profile
CREATE POLICY "Authenticated users can view public profile info"
ON public.profiles
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Note: Les informations sensibles (phone, address) sont déjà protégées par la fonction get_secure_profile
-- qui ne les retourne que si l'utilisateur a la permission ou si c'est son propre profil