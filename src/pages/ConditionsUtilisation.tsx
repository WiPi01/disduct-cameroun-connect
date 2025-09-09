import MobileNavBar from "@/components/MobileNavBar";

const ConditionsUtilisation = () => {
  return (
    <div className="min-h-screen bg-background">
      <MobileNavBar title="Conditions d'Utilisation" />
      <main className="pt-16 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-6">
              Conditions d'Utilisation
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Dernière mise à jour : Janvier 2024
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                1. Introduction
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Bienvenue sur disduct, la première plateforme de commerce en
                ligne qui connecte l'offre et la demande de produits et services
                au Cameroun. En utilisant notre plateforme, vous acceptez de
                respecter les présentes conditions d'utilisation. Notre mission
                est de créer un environnement de commerce électronique sûr,
                transparent et bienveillant pour tous.
              </p>
            </section>

            {/* Respect et Courtoisie */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                2. Respect et Courtoisie Entre Utilisateurs
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>
                  <strong>Sympathie et Bienveillance :</strong> Tous les
                  utilisateurs de disduct doivent faire preuve de respect, de
                  courtoisie et de sympathie dans leurs interactions. Les
                  insultes, le harcèlement, les discriminations ou tout
                  comportement hostile sont strictement interdits.
                </p>
                <p>
                  <strong>Communication Constructive :</strong> Privilégiez une
                  communication claire, polie et constructive. En cas de
                  désaccord, restez professionnel et cherchez des solutions
                  amiables.
                </p>
                <p>
                  <strong>Sanctions :</strong> Tout manquement aux règles de
                  courtoisie peut entraîner la suspension temporaire ou
                  définitive de votre compte.
                </p>
              </div>
            </section>

            {/* Obligations des Vendeurs */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                3. Obligations des Vendeurs
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <h3 className="text-xl font-semibold text-foreground">
                  3.1 Description des Produits et Services
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Transparence Totale :</strong> Vous devez fournir
                    des descriptions précises, complètes et honnêtes de vos
                    produits et services.
                  </li>
                  <li>
                    <strong>Caractéristiques Détaillées :</strong> Indiquez
                    clairement les dimensions, poids, couleurs, matériaux,
                    fonctionnalités et toute caractéristique pertinente.
                  </li>
                  <li>
                    <strong>Qualité et État :</strong> Précisez l'état exact du
                    produit (neuf, occasion, défauts éventuels) avec une
                    description honnête de la qualité.
                  </li>
                  <li>
                    <strong>Provenance et Fabricant :</strong> Mentionnez
                    l'origine du produit, le fabricant, la marque et toute
                    certification pertinente.
                  </li>
                  <li>
                    <strong>Photos Authentiques :</strong> Utilisez uniquement
                    des photos réelles et récentes de vos produits, prises sous
                    différents angles.
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-foreground mt-6">
                  3.2 Politique de Prix
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Prix Attractifs :</strong> Fixez des prix
                    compétitifs et attractifs pour favoriser un volume de vente
                    conséquent et des ventes rapides.
                  </li>
                  <li>
                    <strong>Prix Justes :</strong> Évitez les prix excessifs qui
                    ne correspondent pas à la valeur réelle du produit ou
                    service.
                  </li>
                  <li>
                    <strong>Transparence des Coûts :</strong> Indiquez
                    clairement tous les frais (livraison, taxes, etc.) sans
                    coûts cachés.
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-foreground mt-6">
                  3.3 Responsabilités Générales
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Répondre rapidement aux questions des acheteurs</li>
                  <li>Respecter les délais de livraison annoncés</li>
                  <li>
                    Emballer soigneusement les produits pour éviter les dommages
                  </li>
                  <li>Être disponible pour le service après-vente</li>
                </ul>
              </div>
            </section>

            {/* Obligations des Acheteurs */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                4. Obligations des Acheteurs
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <h3 className="text-xl font-semibold text-foreground">
                  4.1 Paiement à la Livraison
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Principe Fondamental :</strong> Les acheteurs ne
                    paient qu'à la réception de leur commande, après
                    vérification de la conformité.
                  </li>
                  <li>
                    <strong>Vérification Obligatoire :</strong> Vous devez
                    vérifier que vous recevez exactement ce que vous avez
                    commandé.
                  </li>
                  <li>
                    <strong>Droit de Refus :</strong> Si le produit ne
                    correspond pas à la description ou présente des défauts non
                    mentionnés, vous pouvez refuser la livraison.
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-foreground mt-6">
                  4.2 Méthodes de Paiement Recommandées
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Mobile Money Privilégié :</strong> Utilisez de
                    préférence les services de mobile money (Orange Money, MTN
                    Mobile Money) pour plus de sécurité et de traçabilité.
                  </li>
                  <li>
                    <strong>Traçabilité :</strong> Les paiements électroniques
                    offrent une meilleure traçabilité des transactions.
                  </li>
                  <li>
                    <strong>Sécurité :</strong> Évitez les paiements en espèces
                    pour les montants importants.
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-foreground mt-6">
                  4.3 Comportement Responsable
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Communiquer respectueusement avec les vendeurs</li>
                  <li>
                    Être disponible pour la livraison aux horaires convenus
                  </li>
                  <li>Signaler tout problème de manière constructive</li>
                  <li>Laisser des avis honnêtes et constructifs</li>
                </ul>
              </div>
            </section>

            {/* Interdictions */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                5. Pratiques Interdites
              </h2>
              <div className="text-muted-foreground leading-relaxed">
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Vente de produits illégaux, contrefaits ou dangereux</li>
                  <li>Descriptions mensongères ou photos trompeuses</li>
                  <li>Manipulation des avis et évaluations</li>
                  <li>Harcèlement ou comportement inapproprié</li>
                  <li>
                    Tentatives de contournement de la plateforme pour éviter les
                    frais
                  </li>
                  <li>Création de faux comptes ou usurpation d'identité</li>
                </ul>
              </div>
            </section>

            {/* Résolution des Conflits */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                6. Résolution des Conflits
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>
                  En cas de litige entre acheteurs et vendeurs, disduct
                  encourage la résolution amiable. Notre équipe de médiation
                  peut intervenir pour faciliter un accord équitable.
                </p>
                <p>
                  <strong>Processus :</strong> Contactez notre support client
                  avec les détails du litige. Nous examinerons la situation et
                  proposerons une solution dans les plus brefs délais.
                </p>
              </div>
            </section>

            {/* Responsabilité de la Plateforme */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                7. Responsabilité de disduct
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>
                  disduct agit en tant qu'intermédiaire entre acheteurs et
                  vendeurs. Nous nous efforçons de maintenir une plateforme sûre
                  et fiable, mais ne pouvons garantir la qualité des produits
                  vendus par des tiers.
                </p>
                <p>
                  Nous nous réservons le droit de suspendre ou supprimer tout
                  compte en violation de ces conditions.
                </p>
              </div>
            </section>

            {/* Modifications */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                8. Modifications des Conditions
              </h2>
              <div className="text-muted-foreground leading-relaxed">
                <p>
                  Ces conditions peuvent être modifiées à tout moment. Les
                  utilisateurs seront informés des changements significatifs par
                  email ou notification sur la plateforme.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                9. Contact
              </h2>
              <div className="text-muted-foreground leading-relaxed">
                <p>
                  Pour toute question concernant ces conditions d'utilisation,
                  contactez-nous à :<strong> contact@disduct.com</strong> ou{" "}
                  <strong>+237 697392803</strong>
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConditionsUtilisation;
