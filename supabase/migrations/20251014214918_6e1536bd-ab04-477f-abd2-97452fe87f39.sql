-- Fonction pour supprimer automatiquement les produits vendus
CREATE OR REPLACE FUNCTION delete_sold_products()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Lorsqu'une transaction est complétée, supprimer le produit
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    DELETE FROM products WHERE id = NEW.product_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Créer le trigger pour supprimer automatiquement les produits vendus
DROP TRIGGER IF EXISTS auto_delete_sold_products ON transactions;
CREATE TRIGGER auto_delete_sold_products
  AFTER UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION delete_sold_products();