-- Supprimer l'ancienne policy qui exige l'authentification
DROP POLICY IF EXISTS "Authenticated users can view products" ON products;

-- Créer une nouvelle policy permettant à tout le monde de voir les produits disponibles
CREATE POLICY "Anyone can view available products" 
ON products 
FOR SELECT 
USING (status = 'available');