
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Heart, Share2 } from "lucide-react";
import MobileNavBar from "@/components/MobileNavBar";
import { Database } from "@/integrations/supabase/types";

type Product = Database["public"]["Tables"]["products"]["Row"] & {
    seller_name?: string;
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data, error } = await supabase.rpc('search_products', { search_term: query });

      if (error) {
        console.error("Error fetching search results:", error);
        setProducts([]);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [query]);

  return (
    <div className="min-h-screen bg-background">
      <MobileNavBar title={`Recherche: ${query}`} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Résultats pour "{query}"
          </h1>
          <p className="text-muted-foreground">
            {loading ? "Chargement..." : `${products.length} produit${products.length !== 1 ? 's' : ''} trouvé${products.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="group">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg bg-muted animate-pulse h-48 w-full"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
                    <div className="h-6 bg-muted animate-pulse rounded w-1/2"></div>
                    <div className="h-4 bg-muted animate-pulse rounded w-1/4"></div>
                    <div className="h-10 bg-muted animate-pulse rounded w-full"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Aucun produit correspondant à votre recherche n'a été trouvé.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card 
                key={product.id}
                className="group hover:shadow-lg transition-all duration-300 border-border/50 flex flex-col cursor-pointer"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <CardContent className="p-0 flex-grow flex flex-col">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={product.image_urls?.[0] || '/placeholder.svg'} 
                      alt={product.title || 'Image du produit'}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 flex space-x-2">
                      <Button variant="ghost" size="icon" className="bg-background/80 hover:bg-background">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2 flex-grow">
                      {product.title}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-bold text-primary">
                        {product.price ? `${product.price.toLocaleString()} FCFA` : 'Prix non spécifié'}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{product.location || 'Non spécifié'}</span>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground">
                        Vendeur: {product.seller_name || 'Anonyme'}
                      </p>
                    </div>
                    
                    <Button 
                      className="w-full mt-auto"
                      variant="default"
                    >
                      Contacter le vendeur
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
