-- Temporarily disable foreign key constraints for profiles to insert test data
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;

-- Insert test profiles with generated UUIDs
INSERT INTO public.profiles (user_id, display_name, phone, address) VALUES
(gen_random_uuid(), 'Jean Kouam', '+237670123456', 'Bonanjo, Douala'),
(gen_random_uuid(), 'Marie Ngono', '+237680234567', 'Melen, Yaoundé'),
(gen_random_uuid(), 'Paul Djomo', '+237690345678', 'Centre-ville, Bafoussam'),
(gen_random_uuid(), 'Claire Mbida', '+237650456789', 'Akwa, Douala'),
(gen_random_uuid(), 'David Nkomo', '+237660567890', 'Bastos, Yaoundé'),
(gen_random_uuid(), 'Sophie Talla', '+237670678901', 'Bonapriso, Douala'),
(gen_random_uuid(), 'Michel Foko', '+237680789012', 'Nlongkak, Yaoundé'),
(gen_random_uuid(), 'Grace Kemgne', '+237690890123', 'Bafang, Ouest'),
(gen_random_uuid(), 'Robert Nya', '+237650901234', 'Foumban, Ouest'),
(gen_random_uuid(), 'Lucienne Mbeng', '+237660012345', 'Bassa, Douala'),
(gen_random_uuid(), 'Francis Zoua', '+237670123450', 'Emana, Yaoundé'),
(gen_random_uuid(), 'Sylvie Ngoupa', '+237680234561', 'Djoungolo, Yaoundé'),
(gen_random_uuid(), 'Eric Mendo', '+237690345672', 'New Bell, Douala');

-- Now insert products using the actual profile user_ids
INSERT INTO public.products (title, description, price, category, location, condition, seller_id, images) 
SELECT 
  product_data.title,
  product_data.description,
  product_data.price,
  product_data.category,
  product_data.location,
  product_data.condition,
  profiles.user_id,
  product_data.images
FROM (
  VALUES 
  ('iPhone 14 Pro Max', 'iPhone 14 Pro Max 256GB, état neuf, débloqué tous opérateurs. Vendu avec chargeur et écouteurs.', 850000, 'electronique', 'Douala, Cameroun', 'like_new', ARRAY['https://via.placeholder.com/400x300?text=iPhone+14+Pro'], 'Jean Kouam'),
  ('MacBook Air M2', 'MacBook Air M2 13 pouces, 256GB SSD, 8GB RAM. Parfait pour étudiants et professionnels.', 1200000, 'electronique', 'Yaoundé, Cameroun', 'good', ARRAY['https://via.placeholder.com/400x300?text=MacBook+Air+M2'], 'Marie Ngono'),
  ('Samsung Galaxy S23', 'Samsung Galaxy S23 128GB, couleur noir, avec garantie de 6 mois.', 650000, 'electronique', 'Bafoussam, Cameroun', 'good', ARRAY['https://via.placeholder.com/400x300?text=Samsung+Galaxy+S23'], 'Paul Djomo'),
  ('Robe de soirée élégante', 'Magnifique robe de soirée taille M, portée une seule fois. Parfaite pour événements spéciaux.', 45000, 'mode', 'Douala, Cameroun', 'like_new', ARRAY['https://via.placeholder.com/400x300?text=Robe+de+soirée'], 'Claire Mbida'),
  ('Baskets Nike Air Max', 'Baskets Nike Air Max taille 42, authentiques, très peu portées.', 85000, 'mode', 'Yaoundé, Cameroun', 'good', ARRAY['https://via.placeholder.com/400x300?text=Nike+Air+Max'], 'David Nkomo'),
  ('Canapé 3 places', 'Canapé 3 places en cuir véritable, couleur marron, très confortable.', 320000, 'maison', 'Douala, Cameroun', 'good', ARRAY['https://via.placeholder.com/400x300?text=Canapé+3+places'], 'Sophie Talla'),
  ('Réfrigérateur Samsung', 'Réfrigérateur Samsung 350L, fonctionne parfaitement, économe en énergie.', 280000, 'maison', 'Yaoundé, Cameroun', 'good', ARRAY['https://via.placeholder.com/400x300?text=Réfrigérateur'], 'Michel Foko'),
  ('Plantains bio', 'Plantains bio cultivés sans pesticides, 25kg. Idéal pour restaurants.', 15000, 'agriculture', 'Bafang, Cameroun', 'new', ARRAY['https://via.placeholder.com/400x300?text=Plantains+bio'], 'Grace Kemgne'),
  ('Matériel d''irrigation', 'Système d''irrigation goutte à goutte pour 1 hectare, complet avec pompe.', 450000, 'agriculture', 'Foumban, Cameroun', 'new', ARRAY['https://via.placeholder.com/400x300?text=Irrigation'], 'Robert Nya'),
  ('Toyota Camry 2018', 'Toyota Camry 2018, automatique, climatisée, 95000 km au compteur.', 12500000, 'automobile', 'Douala, Cameroun', 'good', ARRAY['https://via.placeholder.com/400x300?text=Toyota+Camry'], 'Lucienne Mbeng'),
  ('Pneus Michelin', 'Set de 4 pneus Michelin 225/65R17, état neuf, montage gratuit.', 180000, 'automobile', 'Yaoundé, Cameroun', 'new', ARRAY['https://via.placeholder.com/400x300?text=Pneus+Michelin'], 'Francis Zoua'),
  ('Cours de français', 'Cours particuliers de français pour tous niveaux, professeur certifié.', 25000, 'services', 'Yaoundé, Cameroun', 'new', ARRAY['https://via.placeholder.com/400x300?text=Cours+français'], 'Sylvie Ngoupa'),
  ('Réparation téléphones', 'Service de réparation de smartphones toutes marques, diagnostic gratuit.', 15000, 'services', 'Douala, Cameroun', 'new', ARRAY['https://via.placeholder.com/400x300?text=Réparation+téléphones'], 'Eric Mendo')
) AS product_data(title, description, price, category, location, condition, images, seller_name)
JOIN public.profiles ON profiles.display_name = product_data.seller_name;

-- Re-enable the foreign key constraint for profiles (but make it point to profiles table for consistency)
ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;