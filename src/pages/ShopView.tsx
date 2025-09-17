import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowLeft, Store } from "lucide-react";

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

interface Profile {
  display_name: string;
  shop_name: string;
  rating: number;
  total_reviews: number;
  avatar_url?: string;
}

export default function ShopView() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopData = async () => {
      if (!userId) return;

      try {
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('display_name, shop_name, rating, total_reviews, avatar_url')
          .eq('user_id', userId)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          return;
        }

        setProfile(profileData);

        // Fetch available products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('seller_id', userId)
          .eq('status', 'available')
          .order('created_at', { ascending: false });

        if (productsError) {
          console.error('Error fetching products:', productsError);
          return;
        }

        setProducts(productsData || []);
      } catch (error) {
        console.error('Error fetching shop data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, [userId]);

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
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="h-32 bg-muted rounded mb-8"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-80 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground">Boutique introuvable</h1>
            <Button onClick={() => navigate('/')} className="mt-4">
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </div>

        {/* Shop Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-shrink-0">
                {profile.avatar_url && !profile.avatar_url.includes('placeholder') ? (
                  <img
                    src={profile.avatar_url.startsWith('http') ? profile.avatar_url : `https://rtvsinrxboyamtrglciz.supabase.co/storage/v1/object/public/avatars/${profile.avatar_url}`}
                    alt={profile.display_name}
                    className="w-20 h-20 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" fill="%23f1f5f9" rx="40"/><circle cx="40" cy="30" r="10" fill="%236b7280"/><path d="M20 70 Q40 55 60 70 V80 H20 Z" fill="%236b7280"/></svg>';
                    }}
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Store className="h-8 w-8 text-primary" />
                  </div>
                )}
              </div>
              
              <div className="flex-grow">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {profile.shop_name || profile.display_name}
                </h1>
                {profile.shop_name && (
                  <p className="text-muted-foreground mb-3">{profile.display_name}</p>
                )}
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{profile.rating?.toFixed(1) || '0.0'}</span>
                    <span className="text-muted-foreground">({profile.total_reviews || 0} avis)</span>
                  </div>
                  <div className="text-muted-foreground">
                    {products.length} {products.length === 1 ? 'article' : 'articles'} en vente
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Aucun article en vente</h2>
            <p className="text-muted-foreground">Cette boutique n'a pas encore d'articles à vendre.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className="relative aspect-square overflow-hidden">
                   {product.images && product.images.length > 0 && !product.images[0].includes('placeholder') ? (
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
                 </div>
                
                <CardContent className="p-3 space-y-2">
                  <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                    {product.title}
                  </h3>
                  
                  <div className="space-y-2">
                    <p className="font-bold text-lg text-primary">
                      {product.price.toLocaleString()} FCFA
                    </p>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className={`text-xs ${getConditionColor(product.condition)}`}>
                        {getConditionText(product.condition)}
                      </Badge>
                      {product.brand && (
                        <span className="text-xs text-muted-foreground truncate">{product.brand}</span>
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
        )}
      </div>
    </div>
  );
}