
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, MessageCircle, Package, Star, Upload, UserPlus, DollarSign, Truck, ArrowRight } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import MobileNavBar from "@/components/MobileNavBar";

const Vendre = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('signup');

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  const openAuthModal = (view: 'login' | 'signup') => {
    setAuthView(view);
    setIsAuthModalOpen(true);
  };

  const handleAction = (action: () => void) => {
    if (user) {
      action();
    } else {
      openAuthModal('login');
    }
  };

  const steps = [
    {
      icon: UserPlus,
      title: "1. Inscription sur la plateforme",
      description: "Créez votre compte vendeur en quelques minutes. Complétez votre profil pour inspirer confiance.",
      action: () => openAuthModal('signup'),
      actionText: "Créer un compte"
    },
    {
      icon: Camera,
      title: "2. Photographiez vos articles",
      description: "Prenez des photos de qualité sous différents angles. Des photos attrayantes augmentent vos chances de vente."
    },
    {
      icon: Upload,
      title: "3. Créez votre annonce",
      description: "Ajoutez vos articles en renseignant toutes les caractéristiques : titre, description, prix, etc.",
      action: () => handleAction(() => navigate('/create-product')),
      actionText: "Créer une annonce"
    },
    {
      icon: MessageCircle,
      title: "4. Échangez avec les acheteurs",
      description: "Utilisez notre système de chat intégré pour répondre aux questions et rassurer les acheteurs."
    },
    {
      icon: DollarSign,
      title: "5. Négociez le prix",
      description: "Si nécessaire, négociez le prix de vente directement avec l'acheteur pour conclure la transaction."
    },
    {
      icon: Package,
      title: "6. Finalisez la vente",
      description: "Une fois l'accord trouvé, confirmez la vente et préparez soigneusement votre article."
    },
    {
      icon: Truck,
      title: "7. Suivez la livraison",
      description: "Confiez votre article à un livreur et suivez sa livraison en temps réel grâce à notre système intégré."
    },
    {
      icon: Star,
      title: "8. Évaluez la transaction",
      description: "Après livraison, notez l'acheteur et laissez un commentaire pour aider la communauté."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <MobileNavBar title="Vendre" />
      <section className="bg-gradient-hero text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">Vendez sur Disduct</h1>
          <p className="text-xl sm:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">Transformez vos articles en argent en quelques étapes simples.</p>
          <Button size="lg" className="text-lg px-8 py-3 bg-white text-primary hover:bg-white/90" onClick={() => handleAction(() => navigate('/create-product'))}>Commencer à vendre</Button>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Comment vendre sur Disduct ?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Suivez ces 8 étapes simples pour réussir vos ventes.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {steps.map((step, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 flex flex-col">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg"><step.icon className="h-8 w-8 text-primary" /></div>
                    <div><CardTitle className="text-xl">{step.title}</CardTitle></div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <CardDescription className="text-base leading-relaxed flex-grow">{step.description}</CardDescription>
                  {step.action && (
                    <Button variant="secondary" className="mt-6 w-full justify-between" onClick={step.action}>
                      {step.actionText}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialView={authView} />
    </div>
  );
};

export default Vendre;
