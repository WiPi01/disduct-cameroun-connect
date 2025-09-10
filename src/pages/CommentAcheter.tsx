import {
  Search,
  Eye,
  MessageCircle,
  CreditCard,
  Shield,
  Star,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MobileNavBar from "@/components/MobileNavBar";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const CommentAcheter = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleCommencerAcheter = () => {
    if (user) {
      navigate('/produits');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const steps = [
    {
      icon: Search,
      title: "Recherchez",
      description:
        "Utilisez notre moteur de recherche pour trouver le produit idéal",
    },
    {
      icon: Eye,
      title: "Consultez",
      description: "Examinez les détails, photos et avis des autres acheteurs",
    },
    {
      icon: MessageCircle,
      title: "Contactez",
      description: "Posez vos questions au vendeur avant d'acheter",
    },
    {
      icon: CreditCard,
      title: "Achetez",
      description: "Achetez des articles et payer des services seulement après leur livraison. Privilégiez le paiement mobile (OM/MOMO).",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <MobileNavBar title="Comment Acheter" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Comment acheter sur{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              disduct
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez comment trouver et bénéficier des meilleurs produits et services disponibles au Cameroun en toute sécurité sur notre plateforme.
          </p>
        </div>

        {/* Steps Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {steps.map((step, index) => (
            <Card key={index} className="p-6">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {step.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Safety Tips Section */}
        <div className="bg-secondary/30 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Conseils pour acheter en sécurité
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Star className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Vérifiez les avis</h3>
              <p className="text-muted-foreground text-sm">
                Consultez les évaluations et commentaires des autres acheteurs
              </p>
            </div>
            <div className="text-center">
              <MessageCircle className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Communiquez</h3>
              <p className="text-muted-foreground text-sm">
                N'hésitez pas à poser toutes vos questions au vendeur
              </p>
            </div>
            <div className="text-center">
              <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Paiement sécurisé</h3>
              <p className="text-muted-foreground text-sm">
                Privilégiez les méthodes de paiement sécurisées tels que OM ou MOMO pour plus de traçabilité
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Prêt à découvrir nos produits ?
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Explorez notre large sélection de produits et trouvez ce qui vous convient !
          </p>
          <Button
            size="lg"
            className="px-8 py-3"
            onClick={handleCommencerAcheter}
          >
            Commencer à acheter
          </Button>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};

export default CommentAcheter;
