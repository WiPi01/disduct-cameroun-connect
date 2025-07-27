import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              À propos de Disduct
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium">
              The best products at discount prices
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="/lovable-uploads/3d903caa-94e2-4b37-9961-b5b0e7dc0580.png"
                alt="Disduct - The Best Products at discount prices"
                className="rounded-2xl shadow-elegant w-full"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                La meilleure plateforme e-commerce du Cameroun
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Disduct révolutionne le commerce en ligne au Cameroun en offrant une plateforme 
                innovante où acheter et vendre des articles de qualité à prix réduits. Notre mission 
                est de démocratiser l'accès aux meilleurs produits pour tous les Camerounais.
              </p>
              <div className="bg-accent/50 p-6 rounded-xl border border-accent">
                <h3 className="font-semibold text-lg mb-2 text-accent-foreground">
                  Soutenu par Aboveandco
                </h3>
                <p className="text-muted-foreground">
                  Disduct est fièrement soutenu par le groupe français Aboveandco, 
                  garantissant innovation, sécurité et excellence dans nos services.
                </p>
              </div>
              <div className="bg-primary/10 p-6 rounded-xl border border-primary/20">
                <h3 className="font-semibold text-lg mb-2 text-primary">
                  Lancement Septembre 2025
                </h3>
                <p className="text-muted-foreground">
                  Nous arrivons au Cameroun en septembre 2025 avec une plateforme 
                  adaptée aux besoins locaux et aux standards internationaux.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
              Notre Équipe
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Une équipe dynamique, jeune, passionnée et multiculturelle qui travaille 
              sans relâche pour révolutionner l'e-commerce au Cameroun
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <Card className="p-6 text-center bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                  <CardContent className="pt-0">
                    <div className="text-3xl font-bold text-primary mb-2">100%</div>
                    <div className="text-sm text-muted-foreground">Passion</div>
                  </CardContent>
                </Card>
                <Card className="p-6 text-center bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
                  <CardContent className="pt-0">
                    <div className="text-3xl font-bold text-accent-foreground mb-2">25</div>
                    <div className="text-sm text-muted-foreground">Âge moyen</div>
                  </CardContent>
                </Card>
                <Card className="p-6 text-center bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
                  <CardContent className="pt-0">
                    <div className="text-3xl font-bold text-secondary-foreground mb-2">10+</div>
                    <div className="text-sm text-muted-foreground">Nationalités</div>
                  </CardContent>
                </Card>
                <Card className="p-6 text-center bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                  <CardContent className="pt-0">
                    <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                    <div className="text-sm text-muted-foreground">Engagement</div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-foreground">
                  Diversité et Innovation
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Notre équipe multiculturelle apporte une richesse de perspectives uniques, 
                  alimentant notre innovation constante. Chaque membre contribue avec sa 
                  passion et son expertise pour créer une expérience utilisateur exceptionnelle.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Cette diversité nous permet de mieux comprendre et servir nos utilisateurs 
                  camerounais tout en maintenant les standards internationaux d'excellence.
                </p>
              </div>
            </div>
            
            <div>
              <img 
                src="/lovable-uploads/621865e0-fd7f-4853-90dd-ff230323d076.png"
                alt="La Team Disduct"
                className="rounded-2xl shadow-elegant w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Rejoignez l'aventure Disduct
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Soyez parmi les premiers à découvrir la révolution du e-commerce 
            au Cameroun. Inscrivez-vous pour être notifié de notre lancement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              Être notifié du lancement
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Découvrir nos services
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;