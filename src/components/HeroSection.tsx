import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import heroImage from "@/assets/hero-image.jpg";
import AuthModal from "./AuthModal";

const HeroSection = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="bg-gradient-hero bg-clip-text text-transparent">The best products</span>
              <br /><span className="bg-gradient-hero bg-clip-text text-transparent">at discount prices</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
              La première plateforme qui simplifie l'achat et la vente entre Camerounais. 
              Trouvez ce que vous cherchez ou vendez ce que vous possédez.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Que recherchez-vous ?" 
                  className="pl-10 h-12 border-2 focus:border-primary"
                  onClick={() => setIsAuthModalOpen(true)}
                  readOnly
                />
              </div>
              <Button 
                variant="hero" 
                size="lg" 
                className="h-12 px-8"
                onClick={() => setIsAuthModalOpen(true)}
              >
                Rechercher
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="default" 
                size="lg" 
                className="h-12 px-8"
                onClick={() => setIsAuthModalOpen(true)}
              >
                Commencer à acheter
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="h-12 px-8"
                onClick={() => setIsAuthModalOpen(true)}
              >
                Commencer à vendre
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-elegant">
              <img 
                src={heroImage} 
                alt="Marketplace au Cameroun"
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-primary rounded-full opacity-20 blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-accent rounded-full opacity-20 blur-xl" />
          </div>
          
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </section>
  );
};

export default HeroSection;