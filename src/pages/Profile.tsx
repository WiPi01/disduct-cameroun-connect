
import { useState, useEffect, useCallback } from "react";
import { User } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, ShoppingBag, Store,LogOut, Share2, Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type ProfileData = Database['public']['Tables']['profiles']['Row'];

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [stats, setStats] = useState({ favorites: 0, sales: 0, purchases: 0 });
  const [formData, setFormData] = useState({
    full_name: '',
    store_name: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchProfileData = useCallback(async (user: User) => {
    setLoading(true);
    // Fetch profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error("Error fetching profile:", profileError);
      toast({ title: "Erreur", description: "Impossible de charger le profil.", variant: "destructive" });
    } else {
      setProfile(profileData);
      setFormData({
        full_name: profileData?.full_name || '',
        store_name: profileData?.store_name || '',
        phone: profileData?.phone || '',
        address: profileData?.address || '',
      });
    }

    // TODO: Fetch real stats
    setStats({ favorites: 0, sales: 0, purchases: 0 });

    setLoading(false);
  }, [toast]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfileData(currentUser);
      } else {
        navigate('/?auth=login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, fetchProfileData]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({ title: "Déconnexion réussie" });
    navigate('/');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({ ...formData, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (error) {
      toast({ title: "Erreur", description: "La mise à jour a échoué.", variant: "destructive" });
    } else {
      toast({ title: "Succès", description: "Profil mis à jour avec succès." });
      if (profile) setProfile({ ...profile, ...formData });
    }
    setSaving(false);
  };

  const handleShareProfile = async () => {
    const profileUrl = `${window.location.origin}/profile/${user?.id}`;
    if (navigator.share) {
      await navigator.share({ title: `Profil de ${profile?.full_name || 'vendeur'}`, url: profileUrl });
    } else {
      navigator.clipboard.writeText(profileUrl);
      toast({ title: "Copié!", description: "Le lien du profil a été copié." });
    }
  };
  
  const displayName = profile?.store_name || profile?.full_name;
  const activeTab = searchParams.get('tab') || 'overview';

  return (
    <div className="min-h-screen bg-background">      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{loading ? "..." : (displayName || "Mon Profil")}</h1>
            {displayName && <p className="text-muted-foreground">{user?.email}</p>}
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleShareProfile} variant="outline" size="icon" className="flex-shrink-0"><Share2 className="h-4 w-4" /></Button>
            <Button onClick={handleSignOut} variant="outline" className="flex items-center gap-2"><LogOut className="h-4 w-4" />Déconnexion</Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(tab) => setSearchParams({ tab })} className="space-y-6">
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
                <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Favoris</CardTitle><Heart className="h-4 w-4 text-muted-foreground" /></CardHeader>
                <CardContent><div className="text-2xl font-bold">{stats.favorites}</div></CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Ventes</CardTitle><Store className="h-4 w-4 text-muted-foreground" /></CardHeader>
                <CardContent><div className="text-2xl font-bold">{stats.sales}</div></CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Achats</CardTitle><ShoppingBag className="h-4 w-4 text-muted-foreground" /></CardHeader>
                <CardContent><div className="text-2xl font-bold">{stats.purchases}</div></CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Informations sur le Vendeur</CardTitle><CardDescription>Ces informations seront visibles par les autres.</CardDescription></CardHeader>
              <CardContent>
                {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label htmlFor="full_name">Nom complet</Label><Input id="full_name" value={formData.full_name} onChange={handleInputChange} /></div>
                      <div className="space-y-2"><Label htmlFor="store_name">Nom de la boutique</Label><Input id="store_name" value={formData.store_name} onChange={handleInputChange} /></div>
                    </div>
                    <div className="space-y-2"><Label>Email</Label><Input value={user?.email || ''} disabled /></div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label htmlFor="phone">Téléphone</Label><Input id="phone" value={formData.phone} onChange={handleInputChange} /></div>
                      <div className="space-y-2"><Label htmlFor="address">Adresse</Label><Input id="address" value={formData.address} onChange={handleInputChange} /></div>
                    </div>
                    <Button type="submit" disabled={saving}>{saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sauvegarde...</> : 'Sauvegarder'}</Button>
                  </form>
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
