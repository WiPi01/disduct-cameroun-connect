import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, MapPin, User, Heart, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ContactSellerDialog } from "@/components/ContactSellerDialog";
import { ImageViewModal } from "@/components/ImageViewModal";
import { ShareButton } from "@/components/ShareButton";
import MobileNavBar from "@/components/MobileNavBar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Store } from "lucide-react";

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
  brand?: string | null;
  profiles?: {
    display_name: string | null;
  } | null;
}

const AllProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [likedProducts, setLikedProducts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Initialiser le terme de recherche depuis l'URL
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Optimisation: récupérer produits et profils en parallèle
      const [{ data: productsData, error: productsError }, { data: profilesData }] = await Promise.all([
        supabase
          .from('products')
          .select('*')
          .eq('status', 'available')
          .order('created_at', { ascending: false })
          .limit(100),
        supabase
          .from('public_profiles')
          .select('user_id, display_name')
      ]);

      if (productsError) {
        console.error('Error fetching products:', productsError);
        toast({
          title: "Erreur",
          description: "Impossible de charger les produits.",
          variant: "destructive",
        });
        return;
      }

      // Combiner les données efficacement
      const productsWithProfiles = productsData?.map(product => ({
        ...product,
        profiles: profilesData?.find(p => p.user_id === product.seller_id) || null
      })) || [];

      setProducts(productsWithProfiles);
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

  // Recherche intelligente avec scoring pour pertinence
  const filteredProducts = products.filter(product => {
    const searchLower = searchTerm.toLowerCase().trim();
    if (!searchLower) return true;
    
    const titleLower = product.title.toLowerCase();
    const categoryLower = product.category.toLowerCase();
    const brandLower = (product.brand || '').toLowerCase();
    const descriptionLower = (product.description || '').toLowerCase();
    const locationLower = (product.location || '').toLowerCase();
    const sellerNameLower = (product.profiles?.display_name || '').toLowerCase();
    
    // Combiner tout le texte pour recherche globale
    const allText = `${titleLower} ${categoryLower} ${brandLower} ${descriptionLower} ${locationLower} ${sellerNameLower}`;
    
    // Séparer les mots de recherche pour une recherche plus flexible
    const searchWords = searchLower.split(/\s+/).filter(word => word.length > 1);
    
    // Chercher chaque mot individuellement (au lieu de tous ensemble)
    const hasMatch = searchWords.every(word => {
      // Normaliser les accents et variantes
      const normalizedWord = word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const normalizedAllText = allText.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      
      return normalizedAllText.includes(normalizedWord) || 
             normalizedAllText.includes(word) ||
             titleLower.includes(word) ||
             categoryLower.includes(word) ||
             brandLower.includes(word) ||
             descriptionLower.includes(word);
    });
    
    return hasMatch;
  }).sort((a, b) => {
    if (!searchTerm.trim()) return 0;
    
    const searchLower = searchTerm.toLowerCase();
    const searchWords = searchLower.split(/\s+/).filter(word => word.length > 1);
    
    // Calcul du score de pertinence amélioré
    const getRelevanceScore = (product: Product) => {
      let score = 0;
      const titleLower = product.title.toLowerCase();
      const categoryLower = product.category.toLowerCase();
      const descriptionLower = (product.description || '').toLowerCase();
      const brandLower = (product.brand || '').toLowerCase();
      const locationLower = (product.location || '').toLowerCase();
      
      const titleWords = titleLower.split(/\s+/);
      const brandWords = brandLower.split(/\s+/);
      
      searchWords.forEach(word => {
        // Correspondance exacte du terme complet
        if (titleLower === searchLower) score += 200;
        if (brandLower === searchLower) score += 180;
        
        // Correspondance exacte d'un mot
        if (titleWords.includes(word)) score += 100;
        if (brandWords.includes(word)) score += 90;
        
        // Commence par le mot recherché
        if (titleLower.startsWith(word)) score += 70;
        if (brandLower.startsWith(word)) score += 65;
        
        // Contient le mot
        if (titleLower.includes(word)) score += 40;
        if (brandLower.includes(word)) score += 50;
        if (categoryLower.includes(word)) score += 30;
        if (descriptionLower.includes(word)) score += 20;
        if (locationLower.includes(word)) score += 15;
        
        // Correspondance partielle (sous-chaîne)
        titleWords.forEach(titleWord => {
          if (titleWord.includes(word) && titleWord !== word) score += 10;
          if (word.includes(titleWord) && word !== titleWord) score += 8;
        });
        
        brandWords.forEach(brandWord => {
          if (brandWord.includes(word) && brandWord !== word) score += 12;
          if (word.includes(brandWord) && word !== brandWord) score += 10;
        });
      });
      
      return score;
    };
    
    return getRelevanceScore(b) - getRelevanceScore(a);
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        console.error('Error deleting product:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'article.",
          variant: "destructive",
        });
        return;
      }

      // Refresh products list
      setProducts(products.filter(p => p.id !== productId));
      toast({
        title: "Article supprimé",
        description: "Votre article a été supprimé avec succès.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite.",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = (productId: string) => {
    navigate(`/modifier-article/${productId}`);
  };

  const handleShowSuggestions = () => {
    setShowSuggestions(true);
    setSearchTerm("");
  };

  // Produits suggérés basés sur la popularité et la proximité
  const suggestedProducts = products
    .filter(p => p.status === 'available')
    .slice(0, 8); // Afficher les 8 produits les plus récents

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
        ) : showSuggestions ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Découvrez nos vendeurs
              </h2>
              <p className="text-muted-foreground mb-4">
                Voici une sélection d'articles qui pourraient vous intéresser
              </p>
              <Button 
                variant="outline" 
                onClick={() => setShowSuggestions(false)}
                className="mb-6"
              >
                Retour à la recherche
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {suggestedProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative">
                    {product.images && product.images.length > 0 && !product.images[0].includes('placeholder.svg') ? (
                      <ImageViewModal
                        images={product.images}
                        trigger={
                      <img
                            src={product.images[0]}
                            alt={product.title}
                            loading="lazy"
                            className="w-full h-48 object-cover cursor-pointer"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23f1f5f9"/><text x="100" y="100" text-anchor="middle" dy="0.3em" font-family="Arial" font-size="14" fill="%236b7280">Pas d\'image</text></svg>';
                            }}
                          />
                        }
                      />
                    ) : (
                      <div className="w-full h-48 bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground text-sm">Pas d'image</span>
                      </div>
                    )}
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
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2"
                        onClick={() => navigate(`/boutique/${product.seller_id}`)}
                      >
                        <Store className="h-4 w-4" />
                        Voir la boutique
                      </Button>
                      {user && user.id !== product.seller_id ? (
                        <ContactSellerDialog
                          productId={product.id}
                          sellerId={product.seller_id}
                          sellerName={product.profiles?.display_name || 'Vendeur'}
                          productTitle={product.title}
                          triggerClassName="w-full"
                        />
                      ) : (
                        <Button className="w-full" size="sm" variant="default" onClick={() => navigate('/')}>
                          Se connecter pour contacter
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            {searchTerm ? (
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Article non disponible
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Désolé, nous n'avons trouvé aucun produit correspondant à "{searchTerm}".
                </p>
                
                <div className="bg-card border rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Suggestions pour vous aider :
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">Affinez votre recherche :</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Vérifiez l'orthographe</li>
                        <li>• Utilisez des mots-clés plus généraux</li>
                        <li>• Essayez des synonymes</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">Catégories populaires :</h4>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSearchTerm("électronique")}>
                          Électronique
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setSearchTerm("mode")}>
                          Mode
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setSearchTerm("maison")}>
                          Maison
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    💡 Astuce : Trouvez votre vendeur
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Vous cherchez un produit spécifique ? Contactez directement les vendeurs de votre région 
                    qui pourraient avoir ce que vous recherchez.
                  </p>
                  <Button variant="default" size="sm" onClick={handleShowSuggestions}>
                    Voir les vendeurs près de chez vous
                  </Button>
                </div>
              </div>
            ) : (
              <div className="max-w-lg mx-auto">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Aucun produit disponible
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Soyez le premier à publier un article sur notre plateforme !
                </p>
                <Button 
                  variant="default" 
                  size="lg"
                  onClick={() => navigate("/publier-article")}
                >
                  Publier mon premier article
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  {product.images && product.images.length > 0 && !product.images[0].includes('placeholder.svg') ? (
                    product.images.length === 1 ? (
                      <ImageViewModal
                        images={product.images}
                        trigger={
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-full h-48 object-cover cursor-pointer"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23f1f5f9"/><text x="100" y="100" text-anchor="middle" dy="0.3em" font-family="Arial" font-size="14" fill="%236b7280">Pas d\'image</text></svg>';
                            }}
                          />
                        }
                      />
                    ) : (
                      <Carousel className="w-full">
                        <CarouselContent>
                          {product.images.map((image, index) => (
                            <CarouselItem key={index}>
                              <ImageViewModal
                                images={product.images!}
                                initialIndex={index}
                                trigger={
                                  <img
                                    src={image}
                                    alt={`${product.title} - Image ${index + 1}`}
                                    className="w-full h-48 object-cover cursor-pointer"
                                    onError={(e) => {
                                      e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23f1f5f9"/><text x="100" y="100" text-anchor="middle" dy="0.3em" font-family="Arial" font-size="14" fill="%236b7280">Pas d\'image</text></svg>';
                                    }}
                                  />
                                }
                              />
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2" />
                        <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2" />
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                          {product.images.length} photos
                        </div>
                      </Carousel>
                    )
                  ) : (
                    <div className="w-full h-48 bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">Pas d'image</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 bg-white/80 hover:bg-white"
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
                    {user && user.id === product.seller_id && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2 bg-white/80 hover:bg-white"
                          onClick={() => handleEditProduct(product.id)}
                        >
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-2 bg-white/80 hover:bg-white"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer l'article</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </div>
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
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <ShareButton 
                        url={`/boutique/${product.seller_id}`}
                        title={product.title}
                        description={`${product.price.toLocaleString()} FCFA`}
                        variant="ghost"
                        size="sm"
                      />
                      {user && user.id !== product.seller_id && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 flex-1"
                          onClick={() => navigate(`/boutique/${product.seller_id}`)}
                        >
                          <Store className="h-4 w-4" />
                          Voir la boutique
                        </Button>
                      )}
                    </div>
                    {user && user.id !== product.seller_id ? (
                      <ContactSellerDialog
                        productId={product.id}
                        sellerId={product.seller_id}
                        sellerName={product.profiles?.display_name || 'Vendeur'}
                        productTitle={product.title}
                        triggerClassName="w-full"
                      />
                    ) : user && user.id === product.seller_id ? (
                      <Button className="w-full" size="sm" variant="outline" disabled>
                        Votre article
                      </Button>
                    ) : (
                      <Button className="w-full" size="sm" variant="default" onClick={() => navigate('/')}>
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
    </div>
  );
};

export default AllProducts;