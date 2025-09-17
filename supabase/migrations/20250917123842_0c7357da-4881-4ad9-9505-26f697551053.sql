-- Supprimer l'ancienne contrainte
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_condition_check;

-- Ajouter une nouvelle contrainte qui accepte les valeurs françaises
ALTER TABLE public.products ADD CONSTRAINT products_condition_check 
CHECK (condition = ANY (ARRAY['neuf'::text, 'tres-bon-etat'::text, 'bon-etat'::text, 'etat-correct'::text, 'a-reparer'::text]));