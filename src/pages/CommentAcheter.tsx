import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye, MessageCircle, CreditCard, Shield, Star, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MobileNavBar from "@/components/MobileNavBar";
import AuthModal from "@/components/AuthModal";

const CommentAcheter = () => {
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const steps = [
    {
      icon: Search,
      title: "Recherchez",
      description: "Utilisez notre moteur de recherche pour trouver le produit idéal.",
      action: () => navigate('/'),
      actionText: "Commencer la recherche"
    },
    {
      icon: Eye,
      title: "Consultez",
      description: "Examinez les détails, photos et avis des autres acheteurs.",
      action: () => navigate('/search'),
      actionText: "Voir les derniers articles"
    },
    {
      icon: MessageCircle,
      title: "Contactez",
      description: "Posez vos questions au vendeur avant d'acheter pour être sûr de votre choix."
    },
    {
      icon: CreditCard,
      title: "Achetez",
      description: "Finalisez votre achat en toute sécurité en suivant les instructions."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <MobileNavBar title="Comment Acheter" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Comment acheter sur <span className="bg-gradient-hero bg-clip-text text-transparent">disduct</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Suivez ces étapes simples pour trouver les meilleurs produits au Cameroun en toute sécurité.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {steps.map((step, index) => (
            <Card key={index} className="p-6 flex flex-col">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <CardDescription className="text-base flex-grow">{step.description}</CardDescription>
                {step.action && (
                  <Button variant="outline" className="mt-6 w-full" onClick={step.action}>
                    {step.actionText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-secondary/30 rounded-lg p-8 text-center">
           <h2 className="text-2xl font-bold text-foreground mb-4">
            Prêt à trouver la perle rare ?
          </h2>
          <p className="text-muted-foreground mb-6">
            Créez un compte pour une expérience complète ou commencez à explorer dès maintenant.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/search')}>Parcourir les articles</Button>
            <Button size="lg" variant="outline" onClick={() => setIsAuthModalOpen(true)}>Créer un compte</Button>
          </div>
        </div>

      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialView="signup" />
    </div>
  );
};

export default CommentAcheter;