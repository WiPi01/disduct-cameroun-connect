import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Camera,
  MessageCircle,
  DollarSign,
  TrendingUp,
  Shield,
  X,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import MobileNavBar from "@/components/MobileNavBar";
import { supabase } from "@/integrations/supabase/client";

const CommentVendre = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [hasSellerAccount, setHasSellerAccount] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSellerAccount();
  }, []);

  const checkSellerAccount = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name, shop_name, phone, address')
          .eq('user_id', session.user.id)
          .single();

        // Vérification stricte : tous les champs obligatoires doivent être remplis
        const hasAccount = profile && profile.display_name && profile.shop_name && profile.phone;
        setHasSellerAccount(!!hasAccount);
        
        // Afficher l'alerte si l'utilisateur n'a pas de compte vendeur complet
        if (!hasAccount) {
          setShowAlert(true);
        }
      } else {
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Error checking seller account:', error);
    } finally {
      setLoading(false);
    }
  };
  const steps = [
    {
      icon: Package,
      title: "Créez votre annonce",
      description:
        "Décrivez votre produit avec des détails précis et attractifs",
    },
    {
      icon: Camera,
      title: "Ajoutez des photos",
      description:
        "Téléchargez des images de qualité pour attirer les acheteurs",
    },
    {
      icon: DollarSign,
      title: "Fixez votre prix",
      description: "Définissez un prix compétitif basé sur le marché",
    },
    {
      icon: TrendingUp,
      title: "Publiez et vendez",
      description:
        "Votre annonce est en ligne et visible par tous les acheteurs",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <MobileNavBar title="Comment Vendre" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Alert pour inciter à créer un compte vendeur */}
        {showAlert && !loading && (
          <Alert className="mb-8 border-primary bg-primary/5">
            <AlertCircle className="h-5 w-5 text-primary" />
            <div className="flex items-start justify-between flex-1">
              <div className="flex-1 pr-4">
                <AlertTitle className="text-lg font-semibold mb-2">
                  Créez votre compte vendeur pour commencer
                </AlertTitle>
                <AlertDescription className="text-base">
                  Avant de publier vos articles, vous devez créer votre compte vendeur et renseigner les informations concernant votre boutique Disduct ou votre activité commerciale. 
                  <span className="block mt-2 font-medium">
                    👉 Cliquez sur le bouton "Créer mon compte vendeur" en bas de cette page pour commencer.
                  </span>
                </AlertDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-primary/10 shrink-0"
                onClick={() => setShowAlert(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Alert>
        )}
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Comment vendre sur{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              disduct
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez comment vendre facilement vos produits sur notre
            plateforme et toucher des milliers d'acheteurs potentiels.
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

        {/* Tips Section */}
        <div className="bg-secondary/30 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Conseils pour réussir vos ventes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Camera className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Photos de qualité</h3>
              <p className="text-muted-foreground text-sm">
                Utilisez un bon éclairage et montrez votre produit sous tous les
                angles
              </p>
            </div>
            <div className="text-center">
              <MessageCircle className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Répondez rapidement</h3>
              <p className="text-muted-foreground text-sm">
                Une communication rapide augmente vos chances de vente
              </p>
            </div>
            <div className="text-center">
              <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Soyez honnête</h3>
              <p className="text-muted-foreground text-sm">
                Décrivez fidèlement l'état de vos produits pour éviter les
                déceptions
              </p>
            </div>
          </div>
        </div>

        {/* CTA pour créer son compte vendeur */}
        <div className="mt-16 text-center">
          <Button
            size="lg"
            className="px-8 py-6 text-lg"
            onClick={() => navigate("/creer-compte-vendeur")}
          >
            Créer mon compte vendeur
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentVendre;
