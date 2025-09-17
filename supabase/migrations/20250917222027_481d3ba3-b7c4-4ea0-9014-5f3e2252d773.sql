-- Ajouter la clé étrangère manquante entre products et profiles
ALTER TABLE public.products 
ADD CONSTRAINT products_seller_id_fkey 
FOREIGN KEY (seller_id) REFERENCES auth.users(id) ON DELETE CASCADE;