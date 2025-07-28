import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Search, Eye, MessageCircle, CreditCard, Shield, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CommentAcheter = () => {
  const steps = [
    {
      icon: Search,
      title: "Recherchez",
      description: "Utilisez notre moteur de recherche pour trouver le produit idéal"
    },
    {
      icon: Eye,
      title: "Consultez",
      description: "Examinez les détails, photos et avis des autres acheteurs"
    },
    {
      icon: MessageCircle,
      title: "Contactez",
      description: "Posez vos questions au vendeur avant d'acheter"
    },
    {
      icon: CreditCard,
      title: "Achetez",
      description: "Finalisez votre achat en toute sécurité"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Comment acheter sur <span className="bg-gradient-hero bg-clip-text text-transparent">disduct</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez comment acheter en toute sécurité sur notre plateforme et trouver les meilleurs produits au Cameroun.
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
                <CardDescription className="text-base">{step.description}</CardDescription>
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
                Utilisez nos méthodes de paiement sécurisées pour vos achats
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CommentAcheter;