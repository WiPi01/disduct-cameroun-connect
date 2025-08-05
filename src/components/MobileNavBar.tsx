import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

interface MobileNavBarProps {
  title?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
}

const MobileNavBar = ({ 
  title, 
  showBackButton = true, 
  showHomeButton = true 
}: MobileNavBarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  // Ne pas afficher sur la page d'accueil
  if (location.pathname === '/') return null;

  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-2">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="h-9 w-9"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          {showHomeButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleHome}
              className="h-9 w-9"
            >
              <Home className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {title && (
          <h1 className="text-lg font-semibold text-foreground truncate flex-1 text-center">
            {title}
          </h1>
        )}
        
        <div className="w-[76px]" /> {/* Spacer pour centrer le titre */}
      </div>
    </div>
  );
};

export default MobileNavBar;