import { Button } from "@/components/ui/button";
import { Search, ShoppingBag, User, Menu } from "lucide-react";

const Navigation = () => {
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
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Catégories
            </a>
            <a href="/vendre" className="text-foreground hover:text-primary transition-colors">
              Vendre
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              À propos
            </a>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <ShoppingBag className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;