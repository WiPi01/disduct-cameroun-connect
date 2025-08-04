-- Insert some test products for each category
INSERT INTO public.products (title, description, price, category, location, condition, seller_id, images) VALUES
-- Electronics
('iPhone 14 Pro Max', 'iPhone 14 Pro Max 256GB, état neuf, débloqué tous opérateurs. Vendu avec chargeur et écouteurs.', 850000, 'electronique', 'Douala, Cameroun', 'Comme neuf', '00000000-0000-0000-0000-000000000001', ARRAY['https://via.placeholder.com/400x300?text=iPhone+14+Pro']),
('MacBook Air M2', 'MacBook Air M2 13 pouces, 256GB SSD, 8GB RAM. Parfait pour étudiants et professionnels.', 1200000, 'electronique', 'Yaoundé, Cameroun', 'Excellent', '00000000-0000-0000-0000-000000000002', ARRAY['https://via.placeholder.com/400x300?text=MacBook+Air+M2']),
('Samsung Galaxy S23', 'Samsung Galaxy S23 128GB, couleur noir, avec garantie de 6 mois.', 650000, 'electronique', 'Bafoussam, Cameroun', 'Très bon', '00000000-0000-0000-0000-000000000003', ARRAY['https://via.placeholder.com/400x300?text=Samsung+Galaxy+S23']),

-- Mode & Beauty
('Robe de soirée élégante', 'Magnifique robe de soirée taille M, portée une seule fois. Parfaite pour événements spéciaux.', 45000, 'mode', 'Douala, Cameroun', 'Comme neuf', '00000000-0000-0000-0000-000000000004', ARRAY['https://via.placeholder.com/400x300?text=Robe+de+soirée']),
('Baskets Nike Air Max', 'Baskets Nike Air Max taille 42, authentiques, très peu portées.', 85000, 'mode', 'Yaoundé, Cameroun', 'Très bon', '00000000-0000-0000-0000-000000000005', ARRAY['https://via.placeholder.com/400x300?text=Nike+Air+Max']),

-- Maison & Jardin
('Canapé 3 places', 'Canapé 3 places en cuir véritable, couleur marron, très confortable.', 320000, 'maison', 'Douala, Cameroun', 'Bon', '00000000-0000-0000-0000-000000000006', ARRAY['https://via.placeholder.com/400x300?text=Canapé+3+places']),
('Réfrigérateur Samsung', 'Réfrigérateur Samsung 350L, fonctionne parfaitement, économe en énergie.', 280000, 'maison', 'Yaoundé, Cameroun', 'Excellent', '00000000-0000-0000-0000-000000000007', ARRAY['https://via.placeholder.com/400x300?text=Réfrigérateur']),

-- Agriculture
('Plantains bio', 'Plantains bio cultivés sans pesticides, 25kg. Idéal pour restaurants.', 15000, 'agriculture', 'Bafang, Cameroun', 'Neuf', '00000000-0000-0000-0000-000000000008', ARRAY['https://via.placeholder.com/400x300?text=Plantains+bio']),
('Matériel d''irrigation', 'Système d''irrigation goutte à goutte pour 1 hectare, complet avec pompe.', 450000, 'agriculture', 'Foumban, Cameroun', 'Neuf', '00000000-0000-0000-0000-000000000009', ARRAY['https://via.placeholder.com/400x300?text=Irrigation']),

-- Automobile
('Toyota Camry 2018', 'Toyota Camry 2018, automatique, climatisée, 95000 km au compteur.', 12500000, 'automobile', 'Douala, Cameroun', 'Très bon', '00000000-0000-0000-0000-000000000010', ARRAY['https://via.placeholder.com/400x300?text=Toyota+Camry']),
('Pneus Michelin', 'Set de 4 pneus Michelin 225/65R17, état neuf, montage gratuit.', 180000, 'automobile', 'Yaoundé, Cameroun', 'Neuf', '00000000-0000-0000-0000-000000000011', ARRAY['https://via.placeholder.com/400x300?text=Pneus+Michelin']),

-- Services
('Cours de français', 'Cours particuliers de français pour tous niveaux, professeur certifié.', 25000, 'services', 'Yaoundé, Cameroun', 'Neuf', '00000000-0000-0000-0000-000000000012', ARRAY['https://via.placeholder.com/400x300?text=Cours+français']),
('Réparation téléphones', 'Service de réparation de smartphones toutes marques, diagnostic gratuit.', 15000, 'services', 'Douala, Cameroun', 'Neuf', '00000000-0000-0000-0000-000000000013', ARRAY['https://via.placeholder.com/400x300?text=Réparation+téléphones']);

-- Insert test profiles for the test sellers
INSERT INTO public.profiles (user_id, display_name, phone, address) VALUES
('00000000-0000-0000-0000-000000000001', 'Jean Kouam', '+237670123456', 'Bonanjo, Douala'),
('00000000-0000-0000-0000-000000000002', 'Marie Ngono', '+237680234567', 'Melen, Yaoundé'),
('00000000-0000-0000-0000-000000000003', 'Paul Djomo', '+237690345678', 'Centre-ville, Bafoussam'),
('00000000-0000-0000-0000-000000000004', 'Claire Mbida', '+237650456789', 'Akwa, Douala'),
('00000000-0000-0000-0000-000000000005', 'David Nkomo', '+237660567890', 'Bastos, Yaoundé'),
('00000000-0000-0000-0000-000000000006', 'Sophie Talla', '+237670678901', 'Bonapriso, Douala'),
('00000000-0000-0000-0000-000000000007', 'Michel Foko', '+237680789012', 'Nlongkak, Yaoundé'),
('00000000-0000-0000-0000-000000000008', 'Grace Kemgne', '+237690890123', 'Bafang, Ouest'),
('00000000-0000-0000-0000-000000000009', 'Robert Nya', '+237650901234', 'Foumban, Ouest'),
('00000000-0000-0000-0000-000000000010', 'Lucienne Mbeng', '+237660012345', 'Bassa, Douala'),
('00000000-0000-0000-0000-000000000011', 'Francis Zoua', '+237670123450', 'Emana, Yaoundé'),
('00000000-0000-0000-0000-000000000012', 'Sylvie Ngoupa', '+237680234561', 'Djoungolo, Yaoundé'),
('00000000-0000-0000-0000-000000000013', 'Eric Mendo', '+237690345672', 'New Bell, Douala');