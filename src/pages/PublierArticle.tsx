import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Upload, X, Image } from "lucide-react";
import MobileNavBar from "@/components/MobileNavBar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PublierArticle = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
    condition: "neuf",
    brand: "",
    color: "",
    material: "",
    size_info: "",
    weight: "",
    dimensions: ""
  });
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Authentification requise",
        description: "Vous devez être connecté pour publier un article.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }
    setUser(session.user);
  };

  const categories = [
    "Électronique",
    "Mode et Accessoires", 
    "Maison et Jardin",
    "Sport et Loisirs",
    "Véhicules",
    "Immobilier",
    "Emploi et Services",
    "Animaux",
    "Livres et Médias",
    "Autres"
  ];

  const conditions = [
    { value: "neuf", label: "Neuf" },
    { value: "tres-bon-etat", label: "Très bon état" },
    { value: "bon-etat", label: "Bon état" },
    { value: "etat-correct", label: "État correct" },
    { value: "a-reparer", label: "À réparer" }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      toast({
        title: "Limite d'images",
        description: "Vous ne pouvez télécharger que 5 images maximum.",
        variant: "destructive",
      });
      return;
    }

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: `${file.name} dépasse 5 MB.`,
          variant: "destructive",
        });
        return;
      }
    });

    setImages(prev => [...prev, ...files]);
    
    // Créer les prévisualisations
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (const image of images) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      try {
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, image);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw uploadError;
        }

        const { data } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        uploadedUrls.push(data.publicUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error(`Erreur lors du téléchargement de l'image: ${image.name}`);
      }
    }
    
    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price || !formData.category) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Vérifier si un profil existe pour l'utilisateur, sinon le créer
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('user_id', user.id)
        .single();

      if (!existingProfile) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            display_name: user.email || 'Utilisateur'
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
          throw new Error('Impossible de créer le profil utilisateur');
        }
      }

      // Upload des images
      const imageUrls = await uploadImages();

      // Insertion du produit
      const { data, error } = await supabase
        .from('products')
        .insert({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          location: formData.location,
          condition: formData.condition,
          brand: formData.brand,
          color: formData.color,
          material: formData.material,
          size_info: formData.size_info,
          weight: formData.weight,
          dimensions: formData.dimensions,
          images: imageUrls,
          seller_id: user.id,
          status: 'available'
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      toast({
        title: "Article publié !",
        description: "Votre article a été publié avec succès.",
      });

      navigate("/produits");
    } catch (error: any) {
      console.error('Error publishing article:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de la publication.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <MobileNavBar title="Publier un article" />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Publier votre article
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Titre */}
              <div className="space-y-2">
                <Label htmlFor="title">Titre de l'article *</Label>
                <Input
                  id="title"
                  placeholder="Ex: iPhone 13 Pro Max 128 GB"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez votre article en détail..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                />
              </div>

              {/* Prix */}
              <div className="space-y-2">
                <Label htmlFor="price">Prix (FCFA) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="Ex: 250000"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  required
                />
              </div>

              {/* Catégorie */}
              <div className="space-y-2">
                <Label>Catégorie *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
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

              {/* Localisation */}
              <div className="space-y-2">
                <Label htmlFor="location">Localisation</Label>
                <Input
                  id="location"
                  placeholder="Ex: Abidjan, Cocody"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                />
              </div>

              {/* État */}
              <div className="space-y-2">
                <Label>État de l'article</Label>
                <Select value={formData.condition} onValueChange={(value) => handleInputChange("condition", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((condition) => (
                      <SelectItem key={condition.value} value={condition.value}>
                        {condition.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Spécificités produit */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Marque */}
                <div className="space-y-2">
                  <Label htmlFor="brand">Marque</Label>
                  <Input
                    id="brand"
                    placeholder="Ex: Nike, Samsung, Apple..."
                    value={formData.brand}
                    onChange={(e) => handleInputChange("brand", e.target.value)}
                  />
                </div>

                {/* Couleur */}
                <div className="space-y-2">
                  <Label htmlFor="color">Couleur</Label>
                  <Input
                    id="color"
                    placeholder="Ex: Noir, Rouge, Bleu..."
                    value={formData.color}
                    onChange={(e) => handleInputChange("color", e.target.value)}
                  />
                </div>

                {/* Matière */}
                <div className="space-y-2">
                  <Label htmlFor="material">Matière</Label>
                  <Input
                    id="material"
                    placeholder="Ex: Coton, Cuir, Plastique..."
                    value={formData.material}
                    onChange={(e) => handleInputChange("material", e.target.value)}
                  />
                </div>

                {/* Taille */}
                <div className="space-y-2">
                  <Label htmlFor="size_info">Taille</Label>
                  <Input
                    id="size_info"
                    placeholder="Ex: S, M, L, XL, 42, 38..."
                    value={formData.size_info}
                    onChange={(e) => handleInputChange("size_info", e.target.value)}
                  />
                </div>

                {/* Poids */}
                <div className="space-y-2">
                  <Label htmlFor="weight">Poids</Label>
                  <Input
                    id="weight"
                    placeholder="Ex: 500g, 1.2kg, 150g..."
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                  />
                </div>

                {/* Dimensions */}
                <div className="space-y-2">
                  <Label htmlFor="dimensions">Dimensions</Label>
                  <Input
                    id="dimensions"
                    placeholder="Ex: 30x20x10cm, L50cm..."
                    value={formData.dimensions}
                    onChange={(e) => handleInputChange("dimensions", e.target.value)}
                  />
                </div>
              </div>

              {/* Images */}
              <div className="space-y-2">
                <Label>Photos (maximum 5)</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Glissez vos images ici ou cliquez pour sélectionner
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={images.length >= 5}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('image-upload')?.click()}
                      disabled={images.length >= 5}
                    >
                      <Image className="h-4 w-4 mr-2" />
                      Ajouter des photos
                    </Button>
                  </div>
                </div>

                {/* Prévisualisation des images */}
                {previews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {previews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Prévisualisation ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bouton de soumission */}
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Publication en cours..." : "Publier mon article"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PublierArticle;