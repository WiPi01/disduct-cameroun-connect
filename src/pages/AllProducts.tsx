import { useState, useEffect } from "react";
import { Search, Filter, MapPin, User, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MobileNavBar from "@/components/MobileNavBar";

// Mock products data - à remplacer par des données réelles plus tard
const mockProducts = [
  {
    id: "1",
    title: "iPhone 13 Pro Max",
    price: 850000,
    location: "Douala",
    seller: "Marie K.",
    image: "/public/lovable-uploads/1ec331ef-0978-439e-9fbd-dfe2b12f5570.png",
    category: "Téléphones"
  },
  {
    id: "2", 
    title: "MacBook Air M2",
    price: 1200000,
    location: "Yaoundé",
    seller: "Jean P.",
    image: "/public/lovable-uploads/3d903caa-94e2-4b37-9961-b5b0e7dc0580.png",
    category: "Ordinateurs"
  },
  {
    id: "3",
    title: "Samsung Galaxy S23",
    price: 650000,
    location: "Bamenda",
    seller: "Paul M.",
    image: "/public/lovable-uploads/61dab940-2e96-4b67-bfde-d6d42888c8ef.png",
    category: "Téléphones"
  },
  {
    id: "4",
    title: "Nike Air Jordan",
    price: 120000,
    location: "Douala",
    seller: "Sophie L.",
    image: "/public/lovable-uploads/621865e0-fd7f-4853-90dd-ff230323d076.png",
    category: "Chaussures"
  },
  {
    id: "5",
    title: "Canon EOS R5",
    price: 2500000,
    location: "Yaoundé",
    seller: "David N.",
    image: "/public/lovable-uploads/7df49345-46a1-4127-86e5-7c23b0258e38.png",
    category: "Photo"
  },
  {
    id: "6",
    title: "PlayStation 5",
    price: 450000,
    location: "Garoua",
    seller: "Michel T.",
    image: "/public/lovable-uploads/b17173b9-daab-4029-88ea-5bd0b838b63c.png",
    category: "Jeux vidéo"
  }
];

const AllProducts = () => {
  const [products, setProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [likedProducts, setLikedProducts] = useState<string[]>([]);

  const handleLike = (productId: string) => {
    setLikedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              Aucun produit trouvé pour votre recherche.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={product.image}
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
                    <span>{product.location}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground text-sm mb-4">
                    <User className="h-4 w-4 mr-1" />
                    <span>{product.seller}</span>
                  </div>
                  <Button className="w-full" size="sm">
                    Voir les détails
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