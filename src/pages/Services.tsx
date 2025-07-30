import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Zap, Users, MapPin, Package, Search, MessageCircle, DollarSign, TrendingUp, Eye } from "lucide-react";

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-hero text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Disduct : Le marché Camerounais en ligne qui connecte l'Offre et la Demande de produits et services
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed">
            Découvrez une nouvelle ère pour le commerce au Cameroun. Notre plateforme réunit acheteurs et vendeurs pour toutes les catégories de produits et services sans limite de prix ou de caractéristiques.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
              Votre Guichet Unique pour Tout au Cameroun
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Que vous cherchiez des produits artisanaux locaux, de l'électronique de pointe, des véhicules, des services ou des denrées alimentaires, notre plateforme est votre destination unique. Nous mettons en relation directe les vendeurs et les acheteurs, simplifiant le processus d'achat et de vente.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Accès Illimité aux Produits</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Explorez une gamme infinie de produits et services offerts par des vendeurs camerounais, des grandes villes aux zones rurales.
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-8 border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-orange-500/5">
              <CardHeader>
                <CardTitle className="text-2xl text-orange-600">Visibilité Maximale pour les Vendeurs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Donnez à vos produits la visibilité qu'ils méritent et atteignez des milliers de clients potentiels à travers le pays.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/10 to-orange-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Rejoignez la Révolution du Commerce en Ligne Camerounais !
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Ne manquez pas l'opportunité de faire partie de la plus grande plateforme de commerce électronique au Cameroun. Que vous soyez acheteur ou vendeur, inscrivez-vous dès aujourd'hui et commencez à explorer un monde de possibilités infinies.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-6 text-center">
              <CardHeader>
                <CardTitle className="text-orange-600">Prêt à Vendre ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Transformez vos produits en succès nationaux. Créez votre compte vendeur maintenant.
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-6 text-center">
              <CardHeader>
                <CardTitle className="text-orange-600">Prêt à Acheter ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Trouvez l'article de vos rêves parmi des milliers d'offres unique. Explorez notre catalogue.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-orange-600">
              Sécurité et Confiance Avant Tout
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              La sécurité de vos transactions et la confidentialité de vos données sont nos priorités absolues. Nous mettons en œuvre des mesures de sécurité robustes pour garantir une expérience d'achat et de vente sûre et fiable pour tous nos utilisateurs au Cameroun.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="p-6 text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Protection des données personnelles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Vos informations personnelles sont protégées par des protocoles de sécurité avancés.
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-6 text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Systèmes de paiement sécurisés</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Toutes les transactions sont sécurisées et conformes aux standards internationaux.
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-6 text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Modération des annonces pour prévenir les fraudes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Chaque annonce est vérifiée pour garantir la qualité et la sécurité de nos services.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Economic Impact Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-orange-600">
              Impact Économique : Soutenir le Marché Local
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Notre plateforme est plus qu'un simple site e-commerce : c'est un moteur de croissance pour l'économie camerounaise. En connectant directement les producteurs locaux aux consommateurs, nous encourageons l'achat local, réduisons les intermédiaires et contribuons au développement des entreprises artisanales et PME.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center bg-primary/10 border-primary/20">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-primary">PME Locales</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Soutien direct aux petites et moyennes entreprises camerounaises.
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-8 text-center bg-orange-500/10 border-orange-500/20">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-orange-600">Artisans</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Valorisation du savoir-faire artisanal camerounais.
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-8 text-center bg-secondary/10 border-secondary/20">
              <CardHeader>
                <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-secondary-foreground" />
                </div>
                <CardTitle className="text-secondary-foreground">Consommateurs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Accès facilité aux produits locaux de qualité.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              En renforçant les circuits courts, nous assurons une meilleure rémunération pour les vendeurs et des prix justes pour les acheteurs, stimulant ainsi l'ensemble de la chaîne de valeur.
            </p>
          </div>
        </div>
      </section>

      {/* Sellers Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-orange-600">
              Pour les Vendeurs : Développez Votre Portée
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Vendre n'a jamais été aussi simple. Créez votre boutique en ligne en quelques minutes et mettez en avant vos produits à une audience nationale. Que vous soyez un artisan, un commerçant ou un particulier, notre plateforme est conçue pour vous aider à réussir.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="p-8 text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Inscription Facile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Créez votre compte vendeur en quelques étapes simples et rapides.
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-8 text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle>Créez Votre Annonce</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Ajoutez des photos, des descriptions et fixez votre prix. C'est intuitif !
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-8 text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-secondary-foreground" />
                </div>
                <CardTitle>Connectez-vous avec les Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Interagissez directement avec les acheteurs intéressés et finalisez vos ventes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Flexibility Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-orange-600">
              La Flexibilité au Cœur de Nos Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Nous sommes fiers de proposer une plateforme qui s'adapte à tous les besoins. Quelle que soit la taille de votre entreprise ou le type de produit ou service que vous vendez, notre écosystème est conçu pour une flexibilité maximale. Nous éliminons les barrières traditionnelles du commerce.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <CardHeader>
                <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Aucune Restriction de Prix</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Du petit article au gros investissement, tous les prix sont les bienvenus sur notre plateforme.
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-8 text-center">
              <CardHeader>
                <Package className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Diversité des Produits</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Vendez ou achetez tout, des produits agricoles aux services numériques, sans limitation de catégorie.
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-8 text-center">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-secondary-foreground mx-auto mb-4" />
                <CardTitle>Adaptabilité des Caractéristiques</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Notre système est suffisamment robuste pour gérer toutes les caractéristiques de produit imaginables.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Buyers Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-orange-600">
                Pour les Acheteurs : Trouvez Exactement Ce Qu'il Vous Faut
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Naviguez facilement à travers des milliers d'annonces. Utilisez nos filtres de recherche avancés pour trouver le produit ou service idéal, au bon prix et près de chez vous. Chaque annonce est détaillée avec des photos et des descriptions complètes pour une décision éclairée.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Search className="h-6 w-6 text-primary" />
                  <span className="text-muted-foreground">Recherche intuitive et rapide</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Eye className="h-6 w-6 text-primary" />
                  <span className="text-muted-foreground">Descriptions détaillées et photos claires</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageCircle className="h-6 w-6 text-primary" />
                  <span className="text-muted-foreground">Contact direct avec les vendeurs</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-orange-500/20 p-8 rounded-2xl">
                <div className="bg-white/90 p-6 rounded-xl">
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Expérience d'achat optimisée
                  </h3>
                  <p className="text-muted-foreground">
                    Notre interface intuitive vous permet de découvrir rapidement les meilleures offres adaptées à vos besoins et votre budget.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transport Partners Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
              Nos Partenaires de Transport
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Pour garantir une livraison sûre et rapide de vos achats, nous avons noué des partenariats stratégiques avec les leaders du transport au Cameroun.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Card className="p-8 text-center bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
                <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/cf728e29-c321-48d4-aada-078f0755489a.png" 
                    alt="Logo Potolo" 
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <CardTitle className="text-2xl text-primary mb-4">Potolo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Service de livraison rapide et fiable pour vos colis urbains. Potolo assure un transport sécurisé de vos achats avec un suivi en temps réel.
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-8 text-center bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
              <CardHeader>
                <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/b17173b9-daab-4029-88ea-5bd0b838b63c.png" 
                    alt="Logo Gozem" 
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <CardTitle className="text-2xl text-orange-600 mb-4">Gozem</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Plateforme de transport multimodale qui facilite la livraison de vos articles partout au Cameroun, des centres urbains aux zones rurales.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-primary/10 to-orange-500/10 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Transport en Toute Sécurité
              </h3>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Grâce à nos partenariats avec Potolo et Gozem, vos achats sur Disduct sont livrés en toute sécurité, avec des options de livraison flexibles adaptées à vos besoins et votre localisation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Thank You Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
            Merci d'utiliser disduct
          </h2>
        </div>
      </section>
    </div>
  );
};

export default Services;