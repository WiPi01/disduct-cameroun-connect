import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  condition: string;
  brand?: string;
  size_info?: string;
  status: string;
  created_at: string;
}

interface ProductGridProps {
  userId: string;
  showAvailableOnly?: boolean;
  showSoldOnly?: boolean;
  maxItems?: number;
}

export const ProductGrid = ({ userId, showAvailableOnly, showSoldOnly, maxItems }: ProductGridProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let query = supabase
          .from('products')
          .select('*')
          .eq('seller_id', userId)
          .order('created_at', { ascending: false });

        if (showAvailableOnly) {
          query = query.eq('status', 'available');
        }

        if (showSoldOnly) {
          query = query.eq('status', 'sold');
        }

        if (maxItems) {
          query = query.limit(maxItems);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching products:', error);
          return;
        }

        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [userId, showAvailableOnly, showSoldOnly, maxItems]);

  const getConditionText = (condition: string) => {
    const conditionMap: { [key: string]: string } = {
      'neuf': 'Neuf',
      'tres-bon-etat': 'Très bon état',
      'bon-etat': 'Bon état',
      'etat-correct': 'État correct',
      'a-reparer': 'À réparer'
    };
    return conditionMap[condition] || condition;
  };

  const getConditionColor = (condition: string) => {
    const colorMap: { [key: string]: string } = {
      'neuf': 'bg-green-100 text-green-800',
      'tres-bon-etat': 'bg-blue-100 text-blue-800',
      'bon-etat': 'bg-yellow-100 text-yellow-800',
      'etat-correct': 'bg-orange-100 text-orange-800',
      'a-reparer': 'bg-red-100 text-red-800'
    };
    return colorMap[condition] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="aspect-square w-full" />
            <CardContent className="p-3 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {showSoldOnly ? "Aucun article vendu pour le moment" : "Aucun article en vente pour le moment"}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
          <div className="relative aspect-square overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0].startsWith('http') ? product.images[0] : `https://rtvsinrxboyamtrglciz.supabase.co/storage/v1/object/public/product-images/${product.images[0]}`}
                alt={product.title}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23f1f5f9"/><text x="100" y="100" text-anchor="middle" dy="0.3em" font-family="Arial" font-size="14" fill="%236b7280">Pas d\'image</text></svg>';
                }}
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-sm">Pas d'image</span>
              </div>
            )}
            {product.status === 'sold' && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">VENDU</span>
              </div>
            )}
          </div>
          <CardContent className="p-3 space-y-2">
            <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {product.title}
            </h3>
            <div className="space-y-1">
                <p className="font-bold text-lg text-primary">
                  {product.price.toLocaleString()} FCFA
                </p>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className={`text-xs ${getConditionColor(product.condition)}`}>
                  {getConditionText(product.condition)}
                </Badge>
                {product.brand && (
                  <span className="text-xs text-muted-foreground">{product.brand}</span>
                )}
              </div>
              {product.size_info && (
                <p className="text-xs text-muted-foreground">Taille: {product.size_info}</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};