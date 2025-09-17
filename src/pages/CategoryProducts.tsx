import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Heart, Search } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import { ImageViewModal } from "@/components/ImageViewModal";
import { ContactSellerDialog } from "@/components/ContactSellerDialog";
import MobileNavBar from "@/components/MobileNavBar";

interface Product {
  id: string;
  title: string;
  price: number;
  location: string;
  images: string[];
  category: string;
  description: string;
  status: string;
  seller_id: string;
  created_at: string;
  brand?: string;
  seller?: {
    display_name: string;
  } | null;
}

const CategoryProducts = () => {
  const { category } = useParams<{ category: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [category, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Récupérer les produits d'abord
      let query = supabase
        .from("products")
        .select("*")
        .eq("status", "available");

      // Si on a un terme de recherche, on cherche dans tous les produits
      // Sinon, on filtre par catégorie
      if (!searchTerm.trim() && category) {
        query = query.eq("category", category);
      }

      const { data: products, error: productsError } = await query.order("created_at", { ascending: false });

      if (productsError) {
        console.error("Erreur lors du chargement des produits:", productsError);
        return;
      }

      if (!products || products.length === 0) {
        setProducts([]);
        return;
      }

      // Récupérer les profils des vendeurs séparément
      const sellerIds = [...new Set(products.map(p => p.seller_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .in("user_id", sellerIds);

      // Combiner les données
      const productsWithSeller = products.map(product => ({
        ...product,
        seller: profiles?.find(profile => profile.user_id === product.seller_id) || null
      }));

      setProducts(productsWithSeller as Product[]);
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrage par recherche
  const filteredProducts = products.filter(product => {
    const searchLower = searchTerm.toLowerCase().trim();
    if (!searchLower) return true;

    const searchWords = searchLower.split(' ').filter(word => word.length > 0);
    
    return searchWords.some(word => 
      product.title.toLowerCase().includes(word) ||
      product.description?.toLowerCase().includes(word) ||
      product.brand?.toLowerCase().includes(word) ||
      product.category.toLowerCase().includes(word) ||
      product.location?.toLowerCase().includes(word)
    );
  });
  const categoryNames = {
    electronique: "Électronique",
    mode: "Mode & Beauté",
    maison: "Maison & Jardin",
    automobile: "Automobile",
    immobilier: "Immobilier",
  };

  const categoryName = category
    ? categoryNames[category as keyof typeof categoryNames]
    : "Catégorie";

  return (
    <div className="min-h-screen bg-background">
      <MobileNavBar title={categoryName} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            {categoryName}
          </h1>
          <p className="text-muted-foreground">
            {filteredProducts.length} produit{filteredProducts.length !== 1 ? "s" : ""} trouvé
            {filteredProducts.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg h-48 mb-4"></div>
                <div className="bg-muted rounded h-4 mb-2"></div>
                <div className="bg-muted rounded h-4 w-3/4"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {searchTerm 
                ? `Aucun produit trouvé pour "${searchTerm}"`
                : "Aucun produit trouvé dans cette catégorie pour le moment."
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="group hover:shadow-lg transition-all duration-300 border-border/50"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <ImageViewModal
                      images={product.images || []}
                      trigger={
                        <img
                          src={product.images?.[0] || "/placeholder.svg"}
                          alt={product.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                        />
                      }
                    />
                    <div className="absolute top-3 right-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-background/80 hover:bg-background"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                      {product.title}
                    </h3>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-bold text-primary">
                        {product.price.toLocaleString()} FCFA
                      </span>
                    </div>

                    <div className="flex items-center text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{product.location || "Non spécifié"}</span>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground">
                        Vendeur: {product.seller?.display_name || "Utilisateur"}
                      </p>
                    </div>

                    {user && user.id !== product.seller_id ? (
                      <ContactSellerDialog
                        productId={product.id}
                        sellerId={product.seller_id}
                        sellerName={product.seller?.display_name || "Vendeur"}
                        productTitle={product.title}
                        triggerClassName="w-full"
                      />
                    ) : user?.id === product.seller_id ? (
                      <p className="text-sm text-muted-foreground text-center py-2">
                        Votre produit
                      </p>
                    ) : (
                      <Button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="w-full"
                        variant="default"
                      >
                        Se connecter pour contacter
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default CategoryProducts;
