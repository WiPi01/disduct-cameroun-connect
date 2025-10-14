import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Store,
  ShoppingBag,
  User,
  Menu,
  ChevronDown,
  Smartphone,
  Shirt,
  Home,
  Wheat,
  Car,
  Briefcase,
  LogOut,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useDevMode } from "@/hooks/use-dev-mode";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "./AuthModal";

const categories = [
  { icon: Smartphone, title: "Électronique", slug: "electronique" },
  { icon: Shirt, title: "Mode & Beauté", slug: "mode" },
  { icon: Home, title: "Maison & Jardin", slug: "maison" },
  { icon: Wheat, title: "Agriculture", slug: "agriculture" },
  { icon: Car, title: "Automobile", slug: "automobile" },
  { icon: Briefcase, title: "Services", slug: "services" },
];

const Navigation = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isDevMode = useDevMode();
  const { user, signOut } = useAuth();

  const handleProfileClick = () => {
    if (user || isDevMode) {
      navigate("/profile");
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
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-foreground hover:text-primary transition-colors p-0 h-auto font-normal"
            >
              Accueil
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-foreground hover:text-primary transition-colors p-0 h-auto font-normal"
                >
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
            <Button
              variant="ghost"
              onClick={() => navigate("/vendre")}
              className="text-foreground hover:text-primary transition-colors p-0 h-auto font-normal"
            >
              Vendre
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/about")}
              className="text-foreground hover:text-primary transition-colors p-0 h-auto font-normal"
            >
              À propos
            </Button>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex"
              onClick={() => navigate("/comment-vendre")}
            >
              <Store className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/comment-acheter")}
            >
              <ShoppingBag className="h-4 w-4" />
            </Button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="h-4 w-4 mr-2" />
                    Mon Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(`/boutique/${user?.id}`)}>
                    <Store className="h-4 w-4 mr-2" />
                    Ma Boutique
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={async () => {
                    if (!user) {
                      return;
                    }
                    await signOut();
                  }}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" onClick={handleProfileClick}>
                <User className="h-4 w-4" />
              </Button>
            )}
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
                      onClick={() => handleNavClick("/")}
                    >
                      Accueil
                    </Button>

                    {/* Categories in Mobile */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground px-3">
                        Catégories
                      </p>
                      {categories.map((category) => (
                        <Button
                          key={category.slug}
                          variant="ghost"
                          className="justify-start text-left w-full"
                          onClick={() =>
                            handleNavClick(`/category/${category.slug}`)
                          }
                        >
                          <category.icon className="h-4 w-4 mr-2 text-primary" />
                          {category.title}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="ghost"
                      className="justify-start text-left"
                      onClick={() => handleNavClick("/vendre")}
                    >
                      Vendre
                    </Button>

                    <Button
                      variant="ghost"
                      className="justify-start text-left"
                      onClick={() => handleNavClick("/about")}
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
                        navigate("/comment-vendre");
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
                        navigate("/comment-acheter");
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
                       {user ? "Mon Profil" : "Se connecter"}
                     </Button>
                     {user && (
                       <Button
                         variant="outline"
                         className="justify-start"
                         onClick={() => {
                           navigate(`/boutique/${user.id}`);
                           setIsMobileMenuOpen(false);
                         }}
                       >
                         <Store className="h-4 w-4 mr-2" />
                         Ma Boutique
                       </Button>
                     )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </nav>
  );
};

export default Navigation;
