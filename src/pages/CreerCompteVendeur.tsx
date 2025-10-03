import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import MobileNavBar from "@/components/MobileNavBar";
import { Store, User as UserIcon, Phone, MapPin } from "lucide-react";

const CreerCompteVendeur = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    display_name: "",
    shop_name: "",
    phone: "",
    address: "",
    description: "",
    category: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
        return;
      }
      setUser(session.user);
      
      // Pré-remplir avec les données existantes si disponibles
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      
      if (profile) {
        setFormData({
          display_name: profile.display_name || "",
          shop_name: profile.shop_name || "",
          phone: profile.phone || "",
          address: profile.address || "",
          description: "",
          category: "",
        });
      }
    };

    checkAuth();
  }, [navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour créer un compte vendeur.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.display_name || !formData.shop_name || !formData.phone) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Mettre à jour le profil avec les informations vendeur
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          display_name: formData.display_name,
          shop_name: formData.shop_name,
          phone: formData.phone,
          address: formData.address,
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Succès !",
        description: "Votre compte vendeur a été créé avec succès. Vous pouvez maintenant publier vos articles.",
      });

      // Rediriger vers la boutique de l'utilisateur
      navigate(`/boutique/${user.id}`);
    } catch (error) {
      console.error('Error creating seller account:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de votre compte vendeur.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    "Électronique",
    "Mode et Vêtements",
    "Maison et Jardin",
    "Sport et Loisirs",
    "Véhicules",
    "Livres et Médias",
    "Beauté et Santé",
    "Enfants et Bébés",
    "Alimentation",
    "Services",
    "Autre"
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <MobileNavBar title="Créer mon compte vendeur" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Créer mon compte vendeur
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Complétez vos informations pour commencer à vendre sur Disduct
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Store className="h-6 w-6 text-primary" />
              <span>Informations vendeur</span>
            </CardTitle>
            <CardDescription>
              Ces informations seront visibles par les acheteurs pour établir la confiance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="display_name" className="flex items-center space-x-2">
                    <UserIcon className="h-4 w-4" />
                    <span>Nom d'affichage *</span>
                  </Label>
                  <Input
                    id="display_name"
                    value={formData.display_name}
                    onChange={(e) => handleInputChange("display_name", e.target.value)}
                    placeholder="Votre nom d'affichage"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shop_name" className="flex items-center space-x-2">
                    <Store className="h-4 w-4" />
                    <span>Nom de la boutique *</span>
                  </Label>
                  <Input
                    id="shop_name"
                    value={formData.shop_name}
                    onChange={(e) => handleInputChange("shop_name", e.target.value)}
                    placeholder="Nom de votre boutique"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>Numéro de téléphone *</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+237 6XX XXX XXX"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="flex items-center space-x-2">
                    <Store className="h-4 w-4" />
                    <span>Catégorie principale</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Adresse/Localisation</span>
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Ville, quartier ou adresse complète"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description de votre activité
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Décrivez brièvement les produits ou services que vous souhaitez vendre..."
                  rows={4}
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Création en cours..." : "Créer mon compte vendeur"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            * Champs obligatoires
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Une fois votre compte créé, vous pourrez commencer à publier vos articles
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreerCompteVendeur;