import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Heart,
  ShoppingBag,
  Store,
  Star,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ProductGrid } from "@/components/ProductGrid";

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    shopName: "",
    displayName: "",
    paymentMethod: "",
    avatarUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error loading profile:', error);
        return;
      }

      if (data) {
        setProfile({
          firstName: data.display_name?.split(' ')[0] || "",
          lastName: data.display_name?.split(' ').slice(1).join(' ') || "",
          phone: data.phone || "",
          address: data.address || "",
          shopName: (data as any).shop_name || "",
          displayName: data.display_name || "",
          paymentMethod: (data as any).payment_method || "",
          avatarUrl: data.avatar_url || "",
        });
        setSelectedPaymentMethod((data as any).payment_method || "");
      } else {
        // No profile exists, set empty values
        setProfile({
          firstName: "",
          lastName: "",
          phone: "",
          address: "",
          shopName: "",
          displayName: "",
          paymentMethod: "",
          avatarUrl: "",
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const displayName = `${profile.firstName} ${profile.lastName}`.trim();
      
      console.log('DEBUG: Attempting to save profile for user:', user.id);
      console.log('DEBUG: Profile data:', {
        user_id: user.id,
        display_name: displayName,
        phone: profile.phone,
        address: profile.address,
        shop_name: profile.shopName,
      });

      // First, check if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('DEBUG: Existing profile check:', { existingProfile, checkError });

      let result;
      if (existingProfile) {
        // Profile exists, update it
        console.log('DEBUG: Updating existing profile');
        result = await supabase
          .from('profiles')
          .update({
            display_name: displayName,
            phone: profile.phone,
            address: profile.address,
            shop_name: profile.shopName,
            payment_method: selectedPaymentMethod,
            avatar_url: profile.avatarUrl,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);
      } else {
        // Profile doesn't exist, create it
        console.log('DEBUG: Creating new profile');
        result = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            display_name: displayName,
            phone: profile.phone,
            address: profile.address,
            shop_name: profile.shopName,
            payment_method: selectedPaymentMethod,
            avatar_url: profile.avatarUrl,
          });
      }

      console.log('DEBUG: Save result:', result);

      if (result.error) {
        toast({
          title: "Erreur",
          description: "Erreur lors de la sauvegarde du profil",
          variant: "destructive",
        });
        console.error('Error saving profile:', result.error);
      } else {
        toast({
          title: "Profil sauvegardé",
          description: "Vos informations ont été mises à jour avec succès",
        });
        setProfile(prev => ({ ...prev, displayName, paymentMethod: selectedPaymentMethod }));
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde du profil",
        variant: "destructive",
      });
      console.error('Error saving profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la déconnexion",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
      navigate("/");
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille de l'image ne doit pas dépasser 5 MB.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setProfile(prev => ({ ...prev, avatarUrl: data.publicUrl }));
      
      toast({
        title: "Photo mise à jour",
        description: "Votre photo de profil a été mise à jour avec succès.",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du téléchargement de la photo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase.storage
        .from('avatars')
        .remove([`${user.id}/avatar.jpg`, `${user.id}/avatar.jpeg`, `${user.id}/avatar.png`]);

      setProfile(prev => ({ ...prev, avatarUrl: "" }));
      
      toast({
        title: "Photo supprimée",
        description: "Votre photo de profil a été supprimée.",
      });
    } catch (error) {
      console.error('Error removing avatar:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de la photo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Mon Profil</h1>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>

        {/* Section Ma boutique */}
        {profile.shopName && (
          <Card className="mb-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(`/boutique/${user?.id}`)}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Ma boutique : {profile.shopName}
              </CardTitle>
              <CardDescription>
                Cliquez pour voir votre boutique complète
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductGrid userId={user?.id || ""} showAvailableOnly={true} maxItems={4} />
              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">Cliquez pour voir tous vos articles</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Aperçu</TabsTrigger>
            <TabsTrigger value="favorites">Favoris</TabsTrigger>
            <TabsTrigger value="sales">Ventes</TabsTrigger>
            <TabsTrigger value="purchases">Achats</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Favoris</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    articles en favoris
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ventes</CardTitle>
                  <Store className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    articles vendus
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Achats</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    articles achetés
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Avis et Évaluations
                </CardTitle>
                <CardDescription>Vos avis reçus et donnés</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Aucun avis pour le moment
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>Mes Favoris</CardTitle>
                <CardDescription>
                  Articles que vous avez ajoutés à vos favoris
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Aucun favori pour le moment
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales">
            <Card>
              <CardHeader>
                <CardTitle>Mes Ventes</CardTitle>
                <CardDescription>
                  Articles que vous avez vendus
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProductGrid userId={user?.id || ""} showSoldOnly={true} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="purchases">
            <Card>
              <CardHeader>
                <CardTitle>Mes Achats</CardTitle>
                <CardDescription>
                  Articles que vous avez achetés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Aucun achat pour le moment
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Informations Personnelles
                </CardTitle>
                <CardDescription>
                  Gérez vos informations de profil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input 
                      id="firstName" 
                      placeholder="Votre prénom" 
                      value={profile.firstName}
                      onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Votre nom" 
                      value={profile.lastName}
                      onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Adresse e-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Numéro de téléphone</Label>
                  <Input 
                    id="phone" 
                    placeholder="**** ** ** **" 
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input 
                    id="address" 
                    placeholder="Votre adresse complète" 
                    value={profile.address}
                    onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shopName">Nom de la boutique (entreprise)</Label>
                  <Input 
                    id="shopName" 
                    placeholder="Nom de votre boutique ou entreprise" 
                    value={profile.shopName}
                    onChange={(e) => setProfile(prev => ({ ...prev, shopName: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Photo de profil</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                      {profile.avatarUrl ? (
                        <img 
                          src={profile.avatarUrl} 
                          alt="Avatar" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-muted-foreground text-sm">Pas d'avatar</span>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        id="avatar-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('avatar-upload')?.click()}
                      >
                        Changer la photo
                      </Button>
                      {profile.avatarUrl && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveAvatar}
                          className="ml-2 text-red-600 hover:text-red-700"
                        >
                          Supprimer
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleSaveProfile} 
                  disabled={isLoading}
                >
                  {isLoading ? "Sauvegarde..." : "Sauvegarder les modifications"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Moyens de Paiement</CardTitle>
                <CardDescription>
                  Gérez vos méthodes de paiement
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedPaymentMethod ? (
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-muted/50">
                      <p className="font-medium">Moyen de paiement privilégié :</p>
                      <p className="text-sm text-muted-foreground">{selectedPaymentMethod}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full">
                          Changer le moyen de paiement privilégié
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        <DropdownMenuItem onClick={() => setSelectedPaymentMethod("Orange Money")}>
                          Orange Money
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedPaymentMethod("Momo")}>
                          Momo
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedPaymentMethod("Espèce")}>
                          Espèce
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center py-8 text-muted-foreground">
                      Aucun moyen de paiement privilégié configuré
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full">
                          Moyen de paiement privilégié
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        <DropdownMenuItem onClick={() => setSelectedPaymentMethod("Orange Money")}>
                          Orange Money
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedPaymentMethod("Momo")}>
                          Momo
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedPaymentMethod("Espèce")}>
                          Espèce
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
