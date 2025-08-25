
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Store, ShoppingBag, Menu, ChevronDown, Smartphone, Shirt, Home, Wheat, Car, Briefcase, LogOut, User as UserIcon, LifeBuoy, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AuthModal from "./AuthModal";
import { Database } from "@/integrations/supabase/types";
import logo from "@/assets/logo.png";

type Profile = Database['public']['Tables']['profiles']['Row'];

const categories = [
  { icon: Smartphone, title: "Électronique", slug: "electronique" },
  { icon: Shirt, title: "Mode & Beauté", slug: "mode" },
  { icon: Home, title: "Maison & Jardin", slug: "maison" },
  { icon: Wheat, title: "Agriculture", slug: "agriculture" },
  { icon: Car, title: "Automobile", slug: "automobile" },
  { icon: Briefcase, title: "Services", slug: "services" }
];

const Navigation = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndProfile = async (sessionUser: SupabaseUser | null) => {
      setUser(sessionUser);
      if (sessionUser) {
        const { data } = await supabase.from('profiles').select('*').eq('id', sessionUser.id).single();
        setProfile(data);
      } else {
        setProfile(null);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchUserAndProfile(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchUserAndProfile(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const openAuthModal = (view: 'login' | 'signup') => {
    setAuthView(view);
    setIsAuthModalOpen(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const UserActions = () => {
    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="rounded-full">
              {profile?.full_name || 'Mon Compte'}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Mon Profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/profile?tab=settings')} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Paramètres</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/faq')} className="cursor-pointer">
              <LifeBuoy className="mr-2 h-4 w-4" />
              <span>Support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    return (
      <div className="hidden md:flex items-center space-x-2">
        <Button variant="ghost" onClick={() => openAuthModal('login')}>Se connecter</Button>
        <Button onClick={() => openAuthModal('signup')}>S'inscrire</Button>
      </div>
    );
  };

  return (
    <nav className="w-full bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <img 
              src={logo} 
              alt="disduct logo" 
              className="h-12 w-12 object-contain"
            />
            <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              disduct
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-foreground hover:text-primary transition-colors font-medium">
              Accueil
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground hover:text-primary transition-colors p-0 h-auto font-medium">
                  Catégories
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {categories.map((category) => (
                  <DropdownMenuItem 
                    key={category.slug}
                    onClick={() => navigate(`/category/${category.slug}`)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <category.icon className="h-4 w-4 text-primary" />
                    {category.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <a href="/vendre" className="text-foreground hover:text-primary transition-colors font-medium">
              Vendre
            </a>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <UserActions />
            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs p-6">
                <div className="flex flex-col h-full">
                  {/* Logo */}
                  <div className="flex items-center space-x-3 pb-4 border-b border-border">
                    <img src={logo} alt="disduct logo" className="h-8 w-8 object-contain"/>
                    <h2 className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">disduct</h2>
                  </div>

                  {/* Navigation Links */}
                  <div className="flex flex-col space-y-2 mt-6 flex-grow">
                    <Button variant="ghost" className="justify-start text-lg" onClick={() => handleNavClick('/')}>Accueil</Button>
                    <p className="text-sm font-medium text-muted-foreground px-3 pt-4">Catégories</p>
                    {categories.map((category) => (
                      <Button key={category.slug} variant="ghost" className="justify-start" onClick={() => handleNavClick(`/category/${category.slug}`)}>
                        <category.icon className="h-4 w-4 mr-2 text-primary" />
                        {category.title}
                      </Button>
                    ))}
                    <Button variant="ghost" className="justify-start text-lg pt-4" onClick={() => handleNavClick('/vendre')}>Vendre</Button>
                  </div>

                  {/* Mobile Actions */}
                  <div className="flex flex-col space-y-3 pt-6 border-t border-border">
                    {user ? (
                      <Button variant="secondary" onClick={() => handleNavClick('/profile')}>Mon Profil</Button>
                    ) : (
                      <div className="space-y-3">
                        <Button className="w-full" onClick={() => { openAuthModal('signup'); setIsMobileMenuOpen(false); }}>S'inscrire</Button>
                        <Button variant="outline" className="w-full" onClick={() => { openAuthModal('login'); setIsMobileMenuOpen(false); }}>Se connecter</Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialView={authView} />
    </nav>
  );
};

export default Navigation;
