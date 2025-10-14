-- Supprimer la vue marketplace_profiles si elle existe
-- (Cette vue semble être obsolète, les données sont déjà dans la table profiles)
DROP VIEW IF EXISTS public.marketplace_profiles CASCADE;

-- Ajouter un commentaire pour documenter pourquoi elle a été supprimée
-- Les données de profil marketplace (rating, total_reviews, etc.) 
-- sont déjà présentes dans la table profiles qui a des politiques RLS appropriées