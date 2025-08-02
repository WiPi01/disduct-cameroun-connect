import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Heart, Eye } from "lucide-react";
import AuthModal from "@/components/AuthModal";

// Données temporaires des produits pour démonstration
const mockProducts = {
  "electronique": [
    {
      id: 1,
      title: "iPhone 13 Pro Max",
      price: "450000",
      location: "Douala",
      image: "/lovable-uploads/621865e0-fd7f-4853-90dd-ff230323d076.png",
      views: 245,
      seller: "John Doe"
    },
    {
      id: 2,
      title: "MacBook Air M2",
      price: "800000",
      location: "Yaoundé",
      image: "/lovable-uploads/3d903caa-94e2-4b37-9961-b5b0e7dc0580.png",
      views: 189,
      seller: "Marie Dupont"
    }
  ],
  "mode": [
    {
      id: 3,
      title: "Robe élégante",
      price: "25000",
      location: "Douala",
      image: "/lovable-uploads/7df49345-46a1-4127-86e5-7c23b0258e38.png",
      views: 156,
      seller: "Sophie Martin"
    }
  ],
  "maison": [
    {
      id: 4,
      title: "Canapé 3 places",
      price: "120000",
      location: "Yaoundé",
      image: "/lovable-uploads/b17173b9-daab-4029-88ea-5bd0b838b63c.png",
      views: 98,
      seller: "Pierre Nkomo"
    }
  ],
  "automobile": [
    {
      id: 5,
      title: "Toyota Corolla 2018",
      price: "8500000",
      location: "Douala",
      image: "/lovable-uploads/cf728e29-c321-48d4-aada-078f0755489a.png",
      views: 432,
      seller: "Paul Mballa"
    }
  ],
  "immobilier": [
    {
      id: 6,
      title: "Appartement 2 chambres",
      price: "45000000",
      location: "Yaoundé",
      image: "/lovable-uploads/61dab940-2e96-4b67-bfde-d6d42888c8ef.png",
      views: 267,
      seller: "Henriette Fouda"
    }
  ]
};

const CategoryProducts = () => {
  const { category } = useParams<{ category: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleContactSeller = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      // Logique pour contacter le vendeur
      console.log("Contacter le vendeur");
    }
  };

  const products = category ? mockProducts[category as keyof typeof mockProducts] || [] : [];
  const categoryNames = {
    "electronique": "Électronique",
    "mode": "Mode & Beauté",
    "maison": "Maison & Jardin",
    "automobile": "Automobile",
    "immobilier": "Immobilier"
  };

  const categoryName = category ? categoryNames[category as keyof typeof categoryNames] : "Catégorie";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            {categoryName}
          </h1>
          <p className="text-muted-foreground">
            {products.length} produit{products.length !== 1 ? 's' : ''} trouvé{products.length !== 1 ? 's' : ''}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Aucun produit trouvé dans cette catégorie pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 border-border/50">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
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
                    <div className="absolute bottom-3 left-3">
                      <Badge variant="secondary" className="bg-background/80">
                        <Eye className="h-3 w-3 mr-1" />
                        {product.views}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                      {product.title}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-bold text-primary">
                        {parseInt(product.price).toLocaleString()} FCFA
                      </span>
                    </div>
                    
                    <div className="flex items-center text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{product.location}</span>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground">
                        Vendeur: {product.seller}
                      </p>
                    </div>
                    
                    <Button 
                      onClick={handleContactSeller}
                      className="w-full"
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

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      
      <Footer />
    </div>
  );
};

export default CategoryProducts;