import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Camera,
  MessageCircle,
  Package,
  Star,
  Upload,
  UserPlus,
  DollarSign,
  Truck,
} from "lucide-react";
import AuthModal from "@/components/AuthModal";
import MobileNavBar from "@/components/MobileNavBar";

const Vendre = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleCommencerVendre = () => {
    if (user) {
      // TODO: Rediriger vers la page de création d'annonce (à créer)
      console.log("Redirection vers la page de création d'annonce");
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleCreerCompteVendeur = () => {
    setIsAuthModalOpen(true);
  };

  const handleEnSavoirPlus = () => {
    navigate("/comment-vendre");
  };
  const steps = [
    {
      icon: <UserPlus className="h-8 w-8 text-primary" />,
      title: "1. Inscription sur la plateforme",
      description:
        "Créez votre compte vendeur en quelques minutes. Complétez votre profil pour inspirer confiance aux acheteurs.",
    },
    {
      icon: <Camera className="h-8 w-8 text-primary" />,
      title: "2. Photographiez vos articles",
      description:
        "Prenez des photos de qualité sous différents angles avec un bon éclairage. Des photos attrayantes augmentent vos chances de vente.",
    },
    {
      icon: <Upload className="h-8 w-8 text-primary" />,
      title: "3. Créez votre annonce",
      description:
        "Ajoutez vos articles sur votre profil en renseignant toutes les caractéristiques : type, couleur, description détaillée, taille, marque, état, etc.",
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-primary" />,
      title: "4. Échangez avec les acheteurs",
      description:
        "Utilisez notre système de chat intégré pour répondre aux questions et rassurer les acheteurs potentiels.",
    },
    {
      icon: <DollarSign className="h-8 w-8 text-primary" />,
      title: "5. Négociez le prix",
      description:
        "Si nécessaire, négociez le prix de vente directement avec l'acheteur pour conclure la transaction.",
    },
    {
      icon: <Package className="h-8 w-8 text-primary" />,
      title: "6. Finalisez la vente",
      description:
        "Une fois l'accord trouvé, confirmez la vente et préparez soigneusement votre article pour l'expédition.",
    },
    {
      icon: <Truck className="h-8 w-8 text-primary" />,
      title: "7. Suivez la livraison",
      description:
        "Confiez votre/vos article(s) à un livreur Potolo ou Gozem et suivez sa livraison en temps réel grâce à notre système de tracking intégré.",
    },
    {
      icon: <Star className="h-8 w-8 text-primary" />,
      title: "8. Évaluez la transaction",
      description:
        "Après livraison, notez l'acheteur et laissez un commentaire pour aider la communauté Disduct.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <MobileNavBar title="Vendre" />
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Vendez sur Disduct
          </h1>
          <p className="text-xl sm:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            Transformez vos articles en argent en quelques étapes simples.
            Rejoignez des milliers de vendeurs qui font confiance à Disduct.
          </p>
          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8 py-3 text-purple-600 border-purple-600 hover:border-orange-500"
            onClick={handleCommencerVendre}
          >
            Commencer à vendre
          </Button>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Comment vendre sur Disduct ?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Suivez ces 8 étapes simples pour réussir vos ventes et maximiser
              vos revenus
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {steps.map((step, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      {step.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{step.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="bg-muted/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Conseils pour réussir vos ventes
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="h-5 w-5 text-primary" />
                  <span>Photos de qualité</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Utilisez la lumière naturelle et prenez plusieurs angles.
                  Montrez les détails et l'état réel de l'article.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <span>Communication rapide</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Répondez rapidement aux messages. Une bonne communication
                  rassure les acheteurs.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <span>Prix attractif</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Fixez un prix juste en vous basant sur l'état de l'article et
                  les prix du marché.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à commencer ?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Rejoignez la communauté Disduct et commencez à vendre dès
            aujourd'hui !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="px-8 py-3"
              onClick={handleCreerCompteVendeur}
            >
              Créer mon compte vendeur
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-3"
              onClick={handleEnSavoirPlus}
            >
              En savoir plus
            </Button>
          </div>
        </div>
      </section>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default Vendre;
