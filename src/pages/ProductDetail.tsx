
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, MapPin, Share2, MessageSquare } from "lucide-react";
import MobileNavBar from "@/components/MobileNavBar";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface ProductWithSeller extends Product {
  profiles: Profile | null;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductWithSeller | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*, profiles(*)')
        .eq('id', id)
        .single();

      if (error || !data) {
        console.error("Error fetching product:", error);
        toast({ title: "Erreur", description: "Produit non trouvé.", variant: "destructive" });
        navigate('/');
      } else {
        setProduct(data as ProductWithSeller);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id, navigate, toast]);

  const handleShare = async () => {
    if (!product) return;
    const productUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title || 'Découvrez ce produit sur Disduct',
          text: `Regardez ce que j'ai trouvé sur Disduct : ${product.title}`,
          url: productUrl,
        });
      } catch (error) {
        console.error("Share failed:", error);
      }
    } else {
      navigator.clipboard.writeText(productUrl);
      toast({ title: "Copié!", description: "Le lien du produit a été copié." });
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
  }

  if (!product) {
    return null; // Should be redirected by the effect
  }

  const sellerName = product.profiles?.store_name || product.profiles?.full_name || "Vendeur Anonyme";

  return (
    <div className="min-h-screen bg-background">
      <MobileNavBar title={product.title || "Détails"} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images Carousel */}
          <Carousel className="w-full">
            <CarouselContent>
              {product.image_urls && product.image_urls.length > 0 ? (
                product.image_urls.map((url, index) => (
                  <CarouselItem key={index}>
                    <Card className="overflow-hidden">
                      <CardContent className="p-0 aspect-square flex items-center justify-center">
                        <img src={url} alt={`${product.title} - image ${index + 1}`} className="w-full h-full object-cover" />
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))
              ) : (
                <CarouselItem>
                   <Card className="overflow-hidden">
                    <CardContent className="p-0 aspect-square flex items-center justify-center bg-muted">
                      <img src="/placeholder.svg" alt="Pas d'image disponible" className="w-1/2 h-1/2 object-contain text-muted-foreground" />
                    </CardContent>
                  </Card>
                </CarouselItem>
              )}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>

          {/* Product Info */}
          <div className="flex flex-col space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">{product.category}</Badge>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">{product.title}</h1>
              {product.location && (
                <div className="flex items-center text-muted-foreground mt-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{product.location}</span>
                </div>
              )}
            </div>

            <p className="text-3xl font-bold text-primary">
              {product.price ? `${product.price.toLocaleString()} FCFA` : "Prix sur demande"}
            </p>

            {product.description && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{product.description}</p>
              </div>
            )}

            <Card className="bg-muted/50">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={product.profiles?.avatar_url || undefined} />
                    <AvatarFallback>{sellerName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-muted-foreground">Vendu par</p>
                    <p className="font-semibold text-foreground">{sellerName}</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => navigate(`/profile/${product.profiles?.id}`)}>Voir le profil</Button>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="flex-1" asChild>
                <a href={`mailto:${product.profiles?.email}?subject=Question concernant votre article: ${product.title}`}>
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Contacter le vendeur
                </a>
              </Button>
              <Button size="lg" variant="outline" onClick={handleShare}>
                <Share2 className="h-5 w-5 mr-2" />
                Partager
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
