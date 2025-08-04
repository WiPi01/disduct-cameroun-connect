import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Store, ShoppingBag, User, Menu, ChevronDown, Smartphone, Shirt, Home, Wheat, Car, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </nav>
  );
};

export default Navigation;