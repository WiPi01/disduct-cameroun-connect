
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, MapPin, Mail, Phone } from "lucide-react";
import MobileNavBar from "@/components/MobileNavBar";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"];

const PublicProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfileAndProducts = async () => {
      if (!id) return;
      setLoading(true);

      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (profileError || !profileData) {
        console.error("Error fetching profile:", profileError);
        toast({ title: "Erreur", description: "Profil vendeur non trouvé.", variant: "destructive" });
        return navigate('/');
      }
      setProfile(profileData);

      // Fetch user's products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error("Error fetching products:", productsError);
        toast({ title: "Erreur", description: "Impossible de charger les articles.", variant: "destructive" });
      }
      setProducts(productsData || []);

      setLoading(false);
    };

    fetchProfileAndProducts();
  }, [id, navigate, toast]);

  const sellerName = profile?.store_name || profile?.full_name || "Vendeur Anonyme";

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
  }

  if (!profile) {
    return null; // Should be redirected
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <MobileNavBar title={sellerName} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="h-24 w-24 border-4 border-background ring-2 ring-primary">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="text-3xl">{sellerName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-foreground">{sellerName}</h1>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-1 text-muted-foreground mt-2">
                {profile.address && (
                  <span className="flex items-center"><MapPin className="h-4 w-4 mr-1" />{profile.address}</span>
                )}
                {profile.email && (
                  <span className="flex items-center"><Mail className="h-4 w-4 mr-1" />{profile.email}</span>
                )}
                {profile.phone && (
                  <span className="flex items-center"><Phone className="h-4 w-4 mr-1" />{profile.phone}</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seller's Products */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Articles de {sellerName}</h2>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card 
                  key={product.id} 
                  className="group hover:shadow-lg transition-all duration-300 border-border/50 flex flex-col cursor-pointer"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  <CardContent className="p-0 flex-grow flex flex-col">
                    <div className="relative overflow-hidden rounded-t-lg aspect-square bg-muted">
                      <img 
                        src={product.image_urls?.[0] || '/placeholder.svg'} 
                        alt={product.title || 'Image du produit'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2 flex-grow">
                        {product.title}
                      </h3>
                      <span className="text-lg font-bold text-primary">
                        {product.price ? `${product.price.toLocaleString()} FCFA` : ''}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">Ce vendeur n'a aucun article en vente pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
