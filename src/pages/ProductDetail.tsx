import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ContactSellerDialog } from "@/components/ContactSellerDialog";
import { ShareButton } from "@/components/ShareButton";
import { SEO } from "@/components/SEO";
import { ArrowLeft, Store, Package, Ruler, Palette, Weight, Maximize, Tag, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  images: string[];
  condition: string;
  category: string;
  brand?: string;
  color?: string;
  material?: string;
  size_info?: string;
  weight?: string;
  dimensions?: string;
  location?: string;
  status: string;
  created_at: string;
  seller_id: string;
}

interface SellerProfile {
  display_name: string;
  shop_name: string;
  rating: number;
  total_reviews: number;
  avatar_url?: string;
}

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) return;

      try {
        // Fetch product details
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .maybeSingle();

        if (productError || !productData) {
          console.error('Error fetching product:', productError);
          setProduct(null);
          setLoading(false);
          return;
        }

        setProduct(productData);

        // Fetch seller profile
        const { data: profileData } = await supabase
          .from('public_profiles')
          .select('display_name, shop_name, rating, total_reviews, avatar_url')
          .eq('user_id', productData.seller_id)
          .maybeSingle();

        if (profileData) {
          setSellerProfile(profileData);
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  const handleDeleteProduct = async () => {
    if (!product || !user || user.id !== product.seller_id) return;

    setDeleting(true);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (error) throw error;

      toast({
        title: "Article supprimé",
        description: "Votre article a été supprimé avec succès",
      });

      navigate('/');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'article",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

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
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="h-96 bg-muted rounded"></div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground">Article introuvable</h1>
            <Button onClick={() => navigate('/')} className="mt-4">
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === product.seller_id;

  // Préparer l'image principale pour le SEO
  const productImage = product.images && product.images.length > 0 && !product.images[0].includes('placeholder')
    ? (product.images[0].startsWith('http') 
        ? product.images[0] 
        : `https://rtvsinrxboyamtrglciz.supabase.co/storage/v1/object/public/product-images/${product.images[0]}`)
    : 'https://storage.googleapis.com/gpt-engineer-file-uploads/TM45LeeZmThy7iiznlliB4K4rjW2/social-images/social-1758055635885-logo disduct.png';

  return (
    <>
      <SEO 
        title={`${product.title} - ${product.price.toLocaleString()} FCFA`}
        description={product.description || `Achetez ${product.title} pour ${product.price.toLocaleString()} FCFA au Cameroun. ${getConditionText(product.condition)}. Contactez le vendeur sur disduct.`}
        keywords={`acheter ${product.title}, ${product.category}, ${product.brand || ''}, ${product.location || 'Cameroun'}, marketplace Cameroun`}
        image={productImage}
        url={`/produit/${product.id}`}
        type="product"
        productData={{
          price: product.price,
          currency: 'XAF',
          availability: product.status === 'available' ? 'in_stock' : 'out_of_stock',
          condition: product.condition === 'neuf' ? 'new' : 'used',
          brand: product.brand || undefined,
        }}
      />
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

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Images Section */}
          <div className="space-y-4">
            {product.images && product.images.length > 0 && !product.images[0].includes('placeholder') && !product.images[0].includes('/placeholder') ? (
              <Card className="overflow-hidden">
                <Carousel className="w-full">
                  <CarouselContent>
                    {product.images.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="aspect-square">
                          <img
                            src={image.startsWith('http') ? image : `https://rtvsinrxboyamtrglciz.supabase.co/storage/v1/object/public/product-images/${image}`}
                            alt={`${product.title} - Image ${index + 1}`}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23f1f5f9"/><text x="200" y="200" text-anchor="middle" dy="0.3em" font-family="Arial" font-size="16" fill="%236b7280">Image non disponible</text></svg>';
                            }}
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {product.images.length > 1 && (
                    <>
                      <CarouselPrevious className="left-4" />
                      <CarouselNext className="right-4" />
                    </>
                  )}
                </Carousel>
                {product.images.length > 1 && (
                  <div className="px-4 py-2 bg-muted/50 text-center text-sm text-muted-foreground">
                    {product.images.length} photos
                  </div>
                )}
              </Card>
            ) : (
              <Card className="overflow-hidden">
                <div className="aspect-square bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">Pas d'image disponible</span>
                </div>
              </Card>
            )}
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-3xl font-bold text-foreground">{product.title}</h1>
                <ShareButton
                  url={`/produit/${product.id}`}
                  title={product.title}
                  description={product.description || `${product.price.toLocaleString()} FCFA`}
                  variant="outline"
                />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary" className={`text-sm ${getConditionColor(product.condition)}`}>
                  {getConditionText(product.condition)}
                </Badge>
                {product.status === 'sold' && (
                  <Badge variant="destructive" className="text-sm">
                    VENDU
                  </Badge>
                )}
              </div>
              <p className="text-4xl font-bold text-primary mb-6">
                {product.price.toLocaleString()} FCFA
              </p>
            </div>

            {/* Description */}
            {product.description && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-lg font-semibold mb-3">Description</h2>
                  <p className="text-muted-foreground whitespace-pre-wrap">{product.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Détails du produit */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4">Détails du produit</h2>
                <div className="space-y-3">
                  {product.brand && (
                    <div className="flex items-center gap-3">
                      <Tag className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Marque:</span>
                      <span className="text-muted-foreground">{product.brand}</span>
                    </div>
                  )}
                  {product.size_info && (
                    <div className="flex items-center gap-3">
                      <Ruler className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Taille / Pointure:</span>
                      <span className="text-muted-foreground">{product.size_info}</span>
                    </div>
                  )}
                  {product.color && (
                    <div className="flex items-center gap-3">
                      <Palette className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Couleur:</span>
                      <span className="text-muted-foreground">{product.color}</span>
                    </div>
                  )}
                  {product.material && (
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Matériau:</span>
                      <span className="text-muted-foreground">{product.material}</span>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex items-center gap-3">
                      <Weight className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Poids:</span>
                      <span className="text-muted-foreground">{product.weight}</span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex items-center gap-3">
                      <Maximize className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Dimensions:</span>
                      <span className="text-muted-foreground">{product.dimensions}</span>
                    </div>
                  )}
                  {product.location && (
                    <div className="flex items-center gap-3">
                      <Store className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Localisation:</span>
                      <span className="text-muted-foreground">{product.location}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Seller Info */}
            {sellerProfile && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-lg font-semibold mb-4">Vendeur</h2>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {sellerProfile.avatar_url && !sellerProfile.avatar_url.includes('placeholder') ? (
                        <img
                          src={sellerProfile.avatar_url.startsWith('http') ? sellerProfile.avatar_url : `https://rtvsinrxboyamtrglciz.supabase.co/storage/v1/object/public/avatars/${sellerProfile.avatar_url}`}
                          alt={sellerProfile.display_name}
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><rect width="48" height="48" fill="%23f1f5f9" rx="24"/><circle cx="24" cy="18" r="6" fill="%236b7280"/><path d="M12 42 Q24 33 36 42 V48 H12 Z" fill="%236b7280"/></svg>';
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Store className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{sellerProfile.shop_name || sellerProfile.display_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {sellerProfile.rating?.toFixed(1) || '0.0'} ⭐ ({sellerProfile.total_reviews || 0} avis)
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/boutique/${product.seller_id}`)}
                    >
                      <Store className="h-4 w-4 mr-2" />
                      Voir la boutique
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="space-y-3">
              {!isOwner && user && product.status === 'available' && (
                <ContactSellerDialog
                  productId={product.id}
                  sellerId={product.seller_id}
                  sellerName={sellerProfile?.display_name || 'Vendeur'}
                  productTitle={product.title}
                  triggerClassName="w-full bg-gradient-hero hover:opacity-90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                />
              )}
              
              {isOwner && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="w-full"
                      disabled={deleting}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {deleting ? "Suppression..." : "Supprimer l'article"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. Votre article sera définitivement supprimé de la plateforme.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteProduct}>
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
