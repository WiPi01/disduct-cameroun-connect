import { Shield, Zap, Users, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "Transactions sécurisées",
    description: "Vos achats et ventes sont protégés par notre système de paiement sécurisé"
  },
  {
    icon: Zap,
    title: "Livraison rapide",
    description: "Recevez vos commandes rapidement partout au Cameroun grâce à notre réseau de partenaires"
  },
  {
    icon: Users,
    title: "Communauté locale",
    description: "Connectez-vous directement avec les vendeurs et acheteurs de votre région"
  },
  {
    icon: MapPin,
    title: "Couverture nationale",
    description: "Présent dans toutes les régions du Cameroun pour vous servir au mieux"
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Pourquoi choisir
            <span className="bg-gradient-hero bg-clip-text text-transparent"> disduct</span> ?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Une plateforme pensée pour les Camerounais, par une team multiculturelle
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-primary rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-elegant">
                <feature.icon className="h-10 w-10 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-gradient-hero rounded-3xl p-8 sm:p-12 text-center shadow-elegant">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-2">
                10,000+
              </div>
              <div className="text-primary-foreground/80">
                Utilisateurs actifs
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-2">
                50,000+
              </div>
              <div className="text-primary-foreground/80">
                Produits disponibles
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-2">
                10
              </div>
              <div className="text-primary-foreground/80">
                Régions couvertes
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;