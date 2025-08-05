import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Store, ShoppingBag, User, Menu, ChevronDown, Smartphone, Shirt, Home, Wheat, Car, Briefcase, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AuthModal from "./AuthModal";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleProfileClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };
  return (
    <nav className="w-full bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/7df49345-46a1-4127-86e5-7c23b0258e38.png" 
              alt="disduct logo" 
              className="h-12 w-12 object-contain"
            />
            <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              disduct
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-foreground hover:text-primary transition-colors">
              Accueil
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground hover:text-primary transition-colors p-0 h-auto font-normal">
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
            <a href="/vendre" className="text-foreground hover:text-primary transition-colors">
              Vendre
            </a>
            <a href="/about" className="text-foreground hover:text-primary transition-colors">
              À propos
            </a>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden sm:flex"
              onClick={() => navigate('/comment-vendre')}
            >
              <Store className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/comment-acheter')}
            >
              <ShoppingBag className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleProfileClick}
            >
              <User className="h-4 w-4" />
            </Button>
            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-6 mt-8">
                  {/* Logo */}
                  <div className="flex items-center space-x-3 pb-4 border-b border-border">
                    <img 
                      src="/lovable-uploads/7df49345-46a1-4127-86e5-7c23b0258e38.png" 
                      alt="disduct logo" 
                      className="h-8 w-8 object-contain"
                    />
                    <h2 className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                      disduct
                    </h2>
                  </div>

                  {/* Navigation Links */}
                  <div className="flex flex-col space-y-4">
                    <Button 
                      variant="ghost" 
                      className="justify-start text-left"
                      onClick={() => handleNavClick('/')}
                    >
                      Accueil
                    </Button>
                    
                    {/* Categories in Mobile */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground px-3">Catégories</p>
                      {categories.map((category) => (
                        <Button
                          key={category.slug}
                          variant="ghost"
                          className="justify-start text-left w-full"
                          onClick={() => handleNavClick(`/category/${category.slug}`)}
                        >
                          <category.icon className="h-4 w-4 mr-2 text-primary" />
                          {category.title}
                        </Button>
                      ))}
                    </div>

                    <Button 
                      variant="ghost" 
                      className="justify-start text-left"
                      onClick={() => handleNavClick('/vendre')}
                    >
                      Vendre
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="justify-start text-left"
                      onClick={() => handleNavClick('/about')}
                    >
                      À propos
                    </Button>
                  </div>

                  {/* Mobile Actions */}
                  <div className="flex flex-col space-y-3 pt-4 border-t border-border">
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => {
                        navigate('/comment-vendre');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <Store className="h-4 w-4 mr-2" />
                      Comment Vendre
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => {
                        navigate('/comment-acheter');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Comment Acheter
                    </Button>
                    <Button 
                      variant="default" 
                      className="justify-start"
                      onClick={() => {
                        handleProfileClick();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      {user ? 'Mon Profil' : 'Se connecter'}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </nav>
  );
};

export default Navigation;