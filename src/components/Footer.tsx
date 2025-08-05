import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import AuthModal from "./AuthModal";

const Footer = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <footer className="bg-secondary/50 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
              disduct
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              La première plateforme de commerce en ligne qui connecte l'offre et la demande de produits et services au Cameroun.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/share/1F8SLY6pfG/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer"
              >
                <Facebook className="h-5 w-5 text-primary" />
              </a>
              <a 
                href="https://www.instagram.com/disduct?igsh=eWhhdHJyZzVkY3lk" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer"
              >
                <Instagram className="h-5 w-5 text-primary" />
              </a>
              <a 
                href="https://www.tiktok.com/@disduct?_t=ZM-8yaFhKnpKJM&_r=1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer"
              >
                <img src="/lovable-uploads/1ec331ef-0978-439e-9fbd-dfe2b12f5570.png" alt="TikTok" className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">Liens rapides</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Accueil</a></li>
              <li><button onClick={() => setIsAuthModalOpen(true)} className="text-muted-foreground hover:text-primary transition-colors">Catégories</button></li>
              <li><a href="/comment-vendre" className="text-muted-foreground hover:text-primary transition-colors">Comment vendre</a></li>
              <li><a href="/comment-acheter" className="text-muted-foreground hover:text-primary transition-colors">Comment acheter</a></li>
              <li><a href="/about" className="text-muted-foreground hover:text-primary transition-colors">À propos</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-3">
              <li><a href="/conditions-utilisation" className="text-muted-foreground hover:text-primary transition-colors">Conditions d'utilisation</a></li>
              <li><a href="/politique-confidentialite" className="text-muted-foreground hover:text-primary transition-colors">Politique de confidentialité</a></li>
              <li><a href="/signaler-probleme" className="text-muted-foreground hover:text-primary transition-colors">Signaler un problème</a></li>
              <li><a href="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">contact@disduct.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">+237 697392803</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">Bonaberi-Douala, Cameroun</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-muted-foreground text-sm mb-4 md:mb-0">
              © 2024 disduct. Tous droits réservés.
            </div>
            <div className="text-muted-foreground text-sm">
              Fait avec ❤️ au Cameroun
            </div>
          </div>
        </div>

      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </footer>
  );
};

export default Footer;