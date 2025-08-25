
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, UploadCloud, X } from "lucide-react";
import MobileNavBar from "@/components/MobileNavBar";

const categories = [
  { name: "Électronique", value: "electronique" },
  { name: "Mode & Beauté", value: "mode" },
  { name: "Maison & Jardin", value: "maison" },
  { name: "Automobile", value: "automobile" },
  { name: "Immobilier", value: "immobilier" },
  { name: "Agriculture & Alimentation", value: "agriculture" },
  { name: "Services", value: "services" },
];

const CreateProduct = () => {
  const [user, setUser] = useState<User | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Accès non autorisé", description: "Vous devez être connecté pour vendre un article.", variant: "destructive" });
        navigate('/?auth=login');
      } else {
        setUser(user);
      }
    };
    fetchUser();
  }, [navigate, toast]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (images.length + filesArray.length > 5) {
        return toast({ title: "Trop d'images", description: "Vous ne pouvez télécharger que 5 images maximum.", variant: "destructive" });
      }
      setImages(prev => [...prev, ...filesArray]);
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title || !price || !category || images.length === 0) {
      return toast({ title: "Champs requis", description: "Veuillez remplir tous les champs obligatoires et ajouter au moins une image.", variant: "destructive" });
    }

    setIsSubmitting(true);

    try {
      // 1. Check if it's the user's first post
      const { count, error: countError } = await supabase
        .from('products')
        .select('*_count', { count: 'exact' })
        .eq('user_id', user.id);

      if (countError) throw countError;
      const isFirstPost = count === 0;

      // 2. Upload images
      const imageUrls: string[] = [];
      for (const image of images) {
        const fileName = `${user.id}/${Date.now()}_${image.name}`;
        const { data, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, image);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(data.path);
        imageUrls.push(publicUrl);
      }

      // 3. Insert product into database
      const { data: productData, error: insertError } = await supabase
        .from('products')
        .insert({
          user_id: user.id,
          title,
          description,
          price: parseFloat(price),
          category,
          location,
          image_urls: imageUrls,
          status: 'pending', // or 'approved' if you don't need moderation
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // 4. Show success message
      if (isFirstPost) {
        toast({ title: "Félicitations !", description: "Votre premier article a été mis en ligne avec succès !" });
      } else {
        toast({ title: "Succès", description: "Votre article a été mis en ligne." });
      }

      navigate(`/products/${productData.id}`); // Navigate to the new product's page

    } catch (error: any) {
      console.error("Error creating product:", error);
      toast({ title: "Erreur", description: error.message || "Une erreur est survenue lors de la création de l'article.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <MobileNavBar title="Vendre un article" />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Décrivez votre article</CardTitle>
            <CardDescription>Fournissez les détails pour aider les acheteurs à trouver votre article.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Titre de l'annonce *</Label>
                <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: iPhone 13 Pro Max en excellent état" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Décrivez votre article en détail..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Prix (FCFA) *</Label>
                  <Input id="price" type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Ex: 350000" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie *</Label>
                  <Select onValueChange={setCategory} value={category} required>
                    <SelectTrigger id="category"><SelectValue placeholder="Sélectionnez une catégorie" /></SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => <SelectItem key={cat.value} value={cat.value}>{cat.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Localisation</Label>
                <Input id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="Ex: Douala, Bonaberi" />
              </div>

              <div className="space-y-2">
                <Label>Images * (5 max)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground mt-2">Glissez-déposez ou cliquez pour télécharger</p>
                  <Input id="images" type="file" multiple onChange={handleImageChange} className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" accept="image/*" />
                </div>
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mt-4">
                    {imagePreviews.map((src, i) => (
                      <div key={i} className="relative group">
                        <img src={src} alt={`Aperçu ${i+1}`} className="w-full h-24 object-cover rounded-md" />
                        <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100" onClick={() => removeImage(i)}><X className="h-4 w-4" /></Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Mise en ligne...' : 'Mettre en ligne\'article'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateProduct;
