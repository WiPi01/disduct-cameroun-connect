import { useState, useEffect } from "react";
import { Search, MapPin, User, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MobileNavBar from "@/components/MobileNavBar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  title: string;
  price: number;
  location: string | null;
  images: string[] | null;
  category: string;
  description: string | null;
  status: string;
  seller_id: string;
  created_at: string;
  profiles?: {
    display_name: string | null;
  } | null;
}

const AllProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [likedProducts, setLikedProducts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          profiles (
            display_name
          )
        `)
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les produits.",
          variant: "destructive",
        });
        return;
      }

      setProducts((data as any) || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors du chargement.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (productId: string) => {
    setLikedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Recherche améliorée avec scoring pour pertinence
  const filteredProducts = products.filter(product => {
    const searchLower = searchTerm.toLowerCase().trim();
    if (!searchLower) return true;
    
    const searchWords = searchLower.split(' ').filter(word => word.length > 0);
    
    return searchWords.some(word => 
      product.title.toLowerCase().includes(word) ||
      product.category.toLowerCase().includes(word) ||
      (product.location && product.location.toLowerCase().includes(word)) ||
      (product.description && product.description.toLowerCase().includes(word)) ||
      (product.profiles?.display_name && product.profiles.display_name.toLowerCase().includes(word))
    );
  }).sort((a, b) => {
    if (!searchTerm.trim()) return 0;
    
    const searchLower = searchTerm.toLowerCase();
    const searchWords = searchLower.split(' ').filter(word => word.length > 0);
    
    // Calcul du score de pertinence
    const getRelevanceScore = (product: Product) => {
      let score = 0;
      const titleLower = product.title.toLowerCase();
      const categoryLower = product.category.toLowerCase();
      const descriptionLower = product.description?.toLowerCase() || '';
      
      searchWords.forEach(word => {
        // Score élevé pour correspondance exacte dans le titre
        if (titleLower.includes(word)) {
          score += titleLower === word ? 100 : titleLower.startsWith(word) ? 50 : 20;
        }
        // Score moyen pour catégorie
        if (categoryLower.includes(word)) {
          score += 15;
        }
        // Score faible pour description
        if (descriptionLower.includes(word)) {
          score += 10;
        }
      });
      
      return score;
    };
    
    return getRelevanceScore(b) - getRelevanceScore(a);
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  return (
    <div className="min-h-screen bg-background">
      <MobileNavBar title="Tous les produits" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Découvrez tous nos produits
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            {filteredProducts.length} articles disponibles
          </p>
          
          {/* Search bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              Chargement des produits...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              {searchTerm ? "Aucun produit trouvé pour votre recherche." : "Aucun produit disponible pour le moment."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.svg'}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 p-2"
                    onClick={() => handleLike(product.id)}
                  >
                    <Heart 
                      className={`h-4 w-4 ${
                        likedProducts.includes(product.id) 
                          ? 'fill-red-500 text-red-500' 
                          : 'text-muted-foreground'
                      }`} 
                    />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                    {product.title}
                  </h3>
                  <p className="text-lg font-bold text-primary mb-2">
                    {formatPrice(product.price)}
                  </p>
                  <div className="flex items-center text-muted-foreground text-sm mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{product.location || 'Non spécifié'}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground text-sm mb-4">
                    <User className="h-4 w-4 mr-1" />
                    <span>{product.profiles?.display_name || 'Utilisateur'}</span>
                  </div>
                  <Button className="w-full" size="sm" variant="default">
                    Contacter le vendeur
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;