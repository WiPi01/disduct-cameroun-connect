import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, DollarSign, Shield, Users, Phone, Mail } from "lucide-react";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const faqCategories = [
    {
      id: "general",
      title: "Questions Générales",
      icon: Users,
      questions: [
        {
          question: "Qu'est-ce que disduct ?",
          answer: "disduct est la première plateforme de commerce en ligne qui connecte l'offre et la demande de produits et services au Cameroun. Nous permettons aux particuliers et entreprises de vendre et acheter facilement en ligne."
        },
        {
          question: "Comment créer un compte sur disduct ?",
          answer: "Cliquez sur 'Se connecter' en haut de la page, puis sur 'Créer un compte'. Remplissez vos informations (nom, email, mot de passe) et validez votre email. C'est gratuit et ne prend que quelques minutes."
        },
        {
          question: "disduct est-il gratuit ?",
          answer: "Oui, l'inscription et la création d'annonces sont gratuites. Nous ne prélevons qu'une petite commission sur les ventes réussies pour maintenir et améliorer la plateforme."
        },
        {
          question: "Dans quelles villes disduct est-il disponible ?",
          answer: "disduct est disponible dans tout le Cameroun. Nous desservons toutes les grandes villes : Douala, Yaoundé, Bafoussam, Bamenda, Garoua, Maroua, Ngaoundéré, et bien d'autres."
        }
      ]
    },
    {
      id: "vendre",
      title: "Vendre sur disduct",
      icon: DollarSign,
      questions: [
        {
          question: "Comment publier une annonce ?",
          answer: "Connectez-vous à votre compte, cliquez sur 'Vendre', choisissez la catégorie de votre produit, ajoutez des photos, une description détaillée, fixez votre prix et publiez. Votre annonce sera visible immédiatement."
        },
        {
          question: "Combien coûte la publication d'une annonce ?",
          answer: "La publication d'annonces est entièrement gratuite. Vous ne payez que si votre produit se vend, sous forme d'une petite commission pour soutenir la plateforme."
        },
        {
          question: "Combien de photos puis-je ajouter ?",
          answer: "Vous pouvez ajouter jusqu'à 10 photos par annonce. Nous recommandons d'utiliser des photos de bonne qualité prises sous différents angles pour attirer plus d'acheteurs."
        },
        {
          question: "Comment fixer le bon prix ?",
          answer: "Recherchez des produits similaires sur disduct pour connaître les prix du marché. Considérez l'état de votre produit, son âge et sa rareté. Un prix juste attire plus d'acheteurs."
        },
        {
          question: "Puis-je modifier mon annonce après publication ?",
          answer: "Oui, vous pouvez modifier le prix, la description et les photos de votre annonce à tout moment depuis votre profil vendeur."
        }
      ]
    },
    {
      id: "acheter",
      title: "Acheter sur disduct",
      icon: ShoppingCart,
      questions: [
        {
          question: "Comment acheter un produit ?",
          answer: "Trouvez le produit qui vous intéresse, consultez les détails et photos, contactez le vendeur via le chat intégré ou par téléphone pour négocier et organiser la livraison ou le retrait."
        },
        {
          question: "Comment contacter un vendeur ?",
          answer: "Cliquez sur 'Contacter le vendeur' sur la page du produit. Vous pouvez envoyer un message via notre système de chat intégré ou appeler directement si le numéro est affiché."
        },
        {
          question: "Puis-je négocier les prix ?",
          answer: "Oui ! La négociation fait partie de l'expérience disduct. Contactez le vendeur pour discuter du prix, surtout pour des achats multiples ou des produits affichés depuis longtemps."
        },
        {
          question: "Comment être sûr de la qualité d'un produit ?",
          answer: "Demandez des photos supplémentaires, posez des questions détaillées sur l'état, vérifiez les évaluations du vendeur, et si possible, inspectez le produit avant l'achat."
        }
      ]
    },
    {
      id: "paiement",
      title: "Paiements et Livraison",
      icon: Shield,
      questions: [
        {
          question: "Quels moyens de paiement sont acceptés ?",
          answer: "disduct supporte Mobile Money (MTN Money, Orange Money), les virements bancaires, et le paiement en espèces lors de la remise en main propre. Le choix du mode de paiement se fait entre acheteur et vendeur."
        },
        {
          question: "Comment fonctionne la livraison ?",
          answer: "La livraison est organisée entre l'acheteur et le vendeur. Vous pouvez choisir la remise en main propre, utiliser nos partenaires de livraison, ou organiser votre propre transport."
        },
        {
          question: "Qui paie les frais de livraison ?",
          answer: "Les frais de livraison sont à négocier entre acheteur et vendeur. Généralement, l'acheteur prend en charge ces frais, mais cela peut être inclus dans le prix de vente."
        },
        {
          question: "Que faire si je ne reçois pas mon produit ?",
          answer: "Contactez immédiatement le vendeur. Si aucune solution n'est trouvée, signalez le problème à notre équipe support via 'Signaler un problème'. Nous interviendrons pour résoudre le litige."
        }
      ]
    },
    {
      id: "securite",
      title: "Sécurité et Confiance",
      icon: Shield,
      questions: [
        {
          question: "Comment disduct protège-t-il mes données ?",
          answer: "Nous respectons strictement les lois camerounaises et internationales sur la protection des données (Loi n°2024/017, RGPD). Vos données sont chiffrées et ne sont jamais vendues à des tiers."
        },
        {
          question: "Comment éviter les arnaques ?",
          answer: "Vérifiez toujours l'identité du vendeur, méfiez-vous des prix trop bas, préférez la remise en main propre, ne payez qu'après avoir vérifié le produit, et utilisez nos moyens de paiement sécurisés."
        },
        {
          question: "Que faire si je pense être victime d'une arnaque ?",
          answer: "Signalez immédiatement l'utilisateur suspect via le bouton 'Signaler' sur son profil, contactez notre support, et si nécessaire, portez plainte auprès des autorités compétentes."
        },
        {
          question: "Comment fonctionne le système d'évaluation ?",
          answer: "Après chaque transaction, acheteurs et vendeurs peuvent s'évaluer mutuellement. Ces évaluations aident la communauté à identifier les utilisateurs fiables."
        }
      ]
    },
    {
      id: "compte",
      title: "Gestion du Compte",
      icon: Users,
      questions: [
        {
          question: "Comment modifier mes informations personnelles ?",
          answer: "Connectez-vous et accédez à 'Mon Profil'. Vous pouvez modifier votre nom, email, numéro de téléphone, photo de profil et informations de contact."
        },
        {
          question: "J'ai oublié mon mot de passe, que faire ?",
          answer: "Cliquez sur 'Mot de passe oublié' sur la page de connexion, entrez votre email, et suivez les instructions envoyées par email pour créer un nouveau mot de passe."
        },
        {
          question: "Comment supprimer mon compte ?",
          answer: "Contactez notre support à privacy@disduct.com en indiquant votre demande de suppression. Nous procéderons à la suppression conformément à nos obligations légales."
        },
        {
          question: "Pourquoi mon annonce a-t-elle été supprimée ?",
          answer: "Les annonces peuvent être supprimées si elles violent nos conditions d'utilisation : produits interdits, descriptions trompeuses, prix abusifs, ou contenu inapproprié. Vous recevrez un email d'explication."
        }
      ]
    }
  ];

  // Filtrer les questions basé sur le terme de recherche
  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-16 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Foire Aux Questions (FAQ)
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Trouvez rapidement les réponses à vos questions sur disduct. 
              Si vous ne trouvez pas ce que vous cherchez, n'hésitez pas à nous contacter.
            </p>
          </div>

          {/* Barre de recherche */}
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Rechercher dans la FAQ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Catégories de questions */}
          <div className="space-y-8">
            {filteredCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Icon className="h-6 w-6 text-primary" />
                      {category.title}
                      <Badge variant="secondary" className="ml-auto">
                        {category.questions.length} question{category.questions.length > 1 ? 's' : ''}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {category.questions.map((item, index) => (
                        <AccordionItem key={index} value={`${category.id}-${index}`}>
                          <AccordionTrigger className="text-left">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground leading-relaxed">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Message si aucun résultat */}
          {searchTerm && filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Aucune question trouvée pour "{searchTerm}"
              </p>
              <p className="text-sm text-muted-foreground">
                Essayez avec d'autres mots-clés ou contactez notre support pour une aide personnalisée.
              </p>
            </div>
          )}

          {/* Section contact */}
          <div className="mt-16 text-center">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Vous ne trouvez pas la réponse ?</CardTitle>
                <CardDescription>
                  Notre équipe support est là pour vous aider
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <Mail className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="font-medium text-foreground">Email</p>
                    <a href="mailto:support@disduct.com" className="text-sm text-primary hover:underline">
                      support@disduct.com
                    </a>
                  </div>
                  <div className="text-center">
                    <Phone className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="font-medium text-foreground">Téléphone</p>
                    <a href="tel:+237697392803" className="text-sm text-primary hover:underline">
                      +237 697392803
                    </a>
                  </div>
                  <div className="text-center">
                    <Search className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="font-medium text-foreground">Signaler</p>
                    <a href="/signaler-probleme" className="text-sm text-primary hover:underline">
                      Signaler un problème
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
};

export default FAQ;