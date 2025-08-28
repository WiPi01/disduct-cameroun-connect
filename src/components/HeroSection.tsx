import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useDevMode } from "@/hooks/use-dev-mode";
import heroImage from "@/assets/hero-image.jpg";
import AuthModal from "./AuthModal";

const HeroSection = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const isDevMode = useDevMode();

  const handleSearch = () => {
    if (isDevMode) {
      // En mode dev, permettre la recherche directement
      console.log("Recherche en mode dev:", searchQuery);
      // Ici vous pouvez ajouter la logique de recherche
      navigate("/category/electronique"); // Exemple de navigation
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleBuyClick = () => {
    if (isDevMode) {
      navigate("/comment-acheter");
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleSellClick = () => {
    if (isDevMode) {
      navigate("/vendre");
    } else {
      setIsAuthModalOpen(true);
    }
  };
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-1 gap-8 items-center">
          {/* Content */}
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                The best products
              </span>
              <br />
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                at discount prices
              </span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              La première plateforme qui simplifie l'achat et la vente entre
              Camerounais. Trouvez ce que vous cherchez ou vendez ce que vous
              possédez.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-md mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Que recherchez-vous ?"
                  className="pl-10 h-12 border-2 focus:border-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  readOnly={!isDevMode}
                  onClick={() => !isDevMode && setIsAuthModalOpen(true)}
                />
              </div>
              <Button
                variant="hero"
                size="lg"
                className="h-12 px-8"
                onClick={handleSearch}
              >
                Rechercher
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="default"
                size="lg"
                className="h-12 px-8"
                onClick={handleBuyClick}
              >
                Commencer à acheter
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8"
                onClick={handleSellClick}
              >
                Commencer à vendre
              </Button>
            </div>
          </div>
        </div>
      </div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </section>
  );
};

export default HeroSection;
