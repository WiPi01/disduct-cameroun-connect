const PolitiqueConfidentialite = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-16 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Politique de Confidentialité
            </h1>
            <p className="text-lg text-muted-foreground">
              Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
            </p>
          </div>

          <div className="space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                1. Introduction
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                disduct s'engage à protéger la confidentialité et la sécurité de
                vos données personnelles. Cette politique explique comment nous
                collectons, utilisons, stockons et protégeons vos informations
                personnelles en conformité avec :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  <strong>
                    La loi camerounaise n°2024/017 du 23 décembre 2024
                  </strong>{" "}
                  sur la protection des données à caractère personnel
                </li>
                <li>
                  <strong>Les réglementations de la CEMAC</strong> en matière de
                  protection des données
                </li>
                <li>
                  <strong>Les lois africaines</strong> sur la protection des
                  données (APD/DPAs)
                </li>
                <li>
                  <strong>
                    Le Règlement Général sur la Protection des Données (RGPD)
                  </strong>{" "}
                  européen
                </li>
              </ul>
            </section>

            {/* Cadre légal */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                2. Cadre Légal et Conformité
              </h2>

              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
                <h3 className="font-semibold text-amber-800 mb-2">
                  ⚠️ Important : Vos Droits Légaux
                </h3>
                <p className="text-amber-700 text-sm">
                  Conformément aux lois en vigueur, vous disposez de droits
                  spécifiques concernant vos données personnelles. Ces lois vous
                  protègent et nous obligent à respecter des standards stricts
                  de protection des données.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-3">
                2.1 Loi Camerounaise n°2024/017
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                En tant qu'entreprise opérant au Cameroun, nous respectons
                strictement la loi n°2024/017 du 23 décembre 2024 relative à la
                protection des données à caractère personnel. Cette loi garantit
                vos droits fondamentaux concernant le traitement de vos données
                personnelles.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3">
                2.2 Réglementations CEMAC
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Nous appliquons les directives de la Communauté Économique et
                Monétaire de l'Afrique Centrale (CEMAC) en matière de protection
                des données et de commerce électronique transfrontalier.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3">
                2.3 Standards Africains (APD/DPAs)
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Nous nous conformons aux standards africains de protection des
                données établis par les Autorités de Protection des Données
                (APD/DPAs) du continent africain.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3">
                2.4 Conformité RGPD
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Pour nos utilisateurs européens ou traitant avec l'Europe, nous
                respectons également les exigences du Règlement Général sur la
                Protection des Données (RGPD).
              </p>
            </section>

            {/* Responsable du traitement */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                3. Responsable du Traitement
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>disduct</strong> est le responsable du traitement de vos
                données personnelles.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Contact :</strong> privacy@disduct.com
                  <br />
                  <strong>Délégué à la Protection des Données :</strong>{" "}
                  dpo@disduct.com
                </p>
              </div>
            </section>

            {/* Données collectées */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                4. Données Collectées
              </h2>

              <h3 className="text-xl font-semibold text-foreground mb-3">
                4.1 Données d'Identification
              </h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4 mb-4">
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Numéro de téléphone</li>
                <li>Adresse physique</li>
                <li>Photo de profil (optionnelle)</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mb-3">
                4.2 Données de Transaction
              </h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4 mb-4">
                <li>Historique des achats et ventes</li>
                <li>Informations de paiement (Mobile Money, etc.)</li>
                <li>Évaluations et commentaires</li>
                <li>Communications entre utilisateurs</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mb-3">
                4.3 Données Techniques
              </h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Adresse IP et géolocalisation</li>
                <li>Type de navigateur et appareil</li>
                <li>Cookies et technologies similaires</li>
                <li>Données de navigation sur la plateforme</li>
              </ul>
            </section>

            {/* Finalités du traitement */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                5. Finalités du Traitement
              </h2>

              <h3 className="text-xl font-semibold text-foreground mb-3">
                5.1 Base Légale : Exécution du Contrat
              </h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4 mb-4">
                <li>Création et gestion de votre compte</li>
                <li>Facilitation des transactions commerciales</li>
                <li>Communication entre acheteurs et vendeurs</li>
                <li>Traitement des paiements et livraisons</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mb-3">
                5.2 Base Légale : Intérêt Légitime
              </h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4 mb-4">
                <li>Amélioration de nos services</li>
                <li>
                  Prévention de la fraude et sécurisation de la plateforme
                </li>
                <li>Analyse et statistiques d'utilisation</li>
                <li>
                  Marketing et communications commerciales (avec opt-out
                  possible)
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mb-3">
                5.3 Base Légale : Obligation Légale
              </h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Respect des obligations fiscales et comptables</li>
                <li>Coopération avec les autorités compétentes</li>
                <li>Conservation des données pour audit et contrôle</li>
              </ul>
            </section>

            {/* Partage des données */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                6. Partage et Transfert des Données
              </h2>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <h3 className="font-semibold text-blue-800 mb-2">
                  🛡️ Engagement de Protection
                </h3>
                <p className="text-blue-700 text-sm">
                  Nous ne vendons jamais vos données personnelles à des tiers.
                  Tout partage est strictement réglementé et justifié par les
                  besoins du service.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-3">
                6.1 Partage Autorisé
              </h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4 mb-4">
                <li>
                  <strong>Entre utilisateurs :</strong> Informations nécessaires
                  aux transactions (nom, contact)
                </li>
                <li>
                  <strong>Prestataires de services :</strong> Partenaires de
                  paiement (Mobile Money), livraison
                </li>
                <li>
                  <strong>Autorités compétentes :</strong> Sur demande légale ou
                  judiciaire
                </li>
                <li>
                  <strong>Partenaires techniques :</strong> Hébergeurs, services
                  cloud (avec accords de confidentialité)
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mb-3">
                6.2 Transferts Internationaux
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Les transferts de données hors du Cameroun ou de la zone CEMAC
                sont encadrés par des garanties appropriées (clauses
                contractuelles types, décisions d'adéquation) conformément aux
                lois applicables.
              </p>
            </section>

            {/* Sécurité */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                7. Sécurité des Données
              </h2>

              <p className="text-muted-foreground leading-relaxed mb-4">
                Nous mettons en œuvre des mesures techniques et
                organisationnelles appropriées pour protéger vos données contre
                :
              </p>

              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4 mb-4">
                <li>L'accès non autorisé</li>
                <li>La divulgation, l'altération ou la destruction</li>
                <li>La perte accidentelle</li>
                <li>Les cyberattaques et violations de données</li>
              </ul>

              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <h3 className="font-semibold text-green-800 mb-2">
                  🔒 Mesures de Sécurité
                </h3>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Chiffrement des données sensibles</li>
                  <li>• Authentification forte et contrôle d'accès</li>
                  <li>• Surveillance continue des systèmes</li>
                  <li>• Sauvegarde régulière des données</li>
                  <li>• Formation du personnel à la sécurité</li>
                </ul>
              </div>
            </section>

            {/* Conservation */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                8. Conservation des Données
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left">
                        Type de Données
                      </th>
                      <th className="border border-gray-300 p-2 text-left">
                        Durée de Conservation
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        Données de compte actif
                      </td>
                      <td className="border border-gray-300 p-2">
                        Tant que le compte est actif
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        Données de transaction
                      </td>
                      <td className="border border-gray-300 p-2">
                        10 ans (obligations comptables)
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        Données de connexion
                      </td>
                      <td className="border border-gray-300 p-2">
                        1 an maximum
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">Cookies</td>
                      <td className="border border-gray-300 p-2">
                        13 mois maximum
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Droits des utilisateurs */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                9. Vos Droits
              </h2>

              <div className="bg-purple-50 border-l-4 border-purple-400 p-4 mb-6">
                <h3 className="font-semibold text-purple-800 mb-2">
                  ⚖️ Droits Garantis par la Loi
                </h3>
                <p className="text-purple-700 text-sm">
                  Conformément aux lois camerounaises, CEMAC, africaines et
                  RGPD, vous disposez de droits inaliénables sur vos données
                  personnelles.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-foreground">
                      Droit d'Accès
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Obtenir une copie de vos données
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-foreground">
                      Droit de Rectification
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Corriger des données inexactes
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-foreground">
                      Droit à l'Effacement
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Demander la suppression de vos données
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-foreground">
                      Droit d'Opposition
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Vous opposer au traitement
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-foreground">
                      Droit à la Portabilité
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Récupérer vos données dans un format standard
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-foreground">
                      Droit de Limitation
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Limiter le traitement de vos données
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">
                  Comment Exercer Vos Droits ?
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Contactez-nous à : <strong>privacy@disduct.com</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  Délai de réponse : 30 jours maximum (conformément à la loi
                  camerounaise)
                </p>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                10. Cookies et Technologies Similaires
              </h2>

              <p className="text-muted-foreground leading-relaxed mb-4">
                Nous utilisons des cookies pour améliorer votre expérience
                utilisateur. Vous pouvez gérer vos préférences de cookies à tout
                moment.
              </p>

              <h3 className="text-lg font-semibold text-foreground mb-2">
                Types de Cookies :
              </h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>
                  <strong>Cookies essentiels :</strong> Nécessaires au
                  fonctionnement du site
                </li>
                <li>
                  <strong>Cookies de performance :</strong> Amélioration de
                  l'expérience utilisateur
                </li>
                <li>
                  <strong>Cookies marketing :</strong> Personnalisation des
                  contenus (avec consentement)
                </li>
              </ul>
            </section>

            {/* Mineurs */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                11. Protection des Mineurs
              </h2>

              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <h3 className="font-semibold text-red-800 mb-2">
                  🔞 Restriction d'Âge
                </h3>
                <p className="text-red-700 text-sm">
                  disduct est réservé aux personnes âgées de 18 ans et plus.
                  Nous ne collectons pas consciemment de données de mineurs de
                  moins de 18 ans.
                </p>
              </div>
            </section>

            {/* Réclamations */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                12. Réclamations et Autorités de Contrôle
              </h2>

              <p className="text-muted-foreground leading-relaxed mb-4">
                Si vous estimez que vos droits ne sont pas respectés, vous
                pouvez :
              </p>

              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">
                    1. Nous Contacter Directement
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    privacy@disduct.com
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">
                    2. Autorité Camerounaise
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Agence Nationale des Technologies de l'Information et de la
                    Communication (ANTIC)
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">
                    3. Autorités CEMAC
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Selon votre pays de résidence dans la zone CEMAC
                  </p>
                </div>
              </div>
            </section>

            {/* Modifications */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                13. Modifications de cette Politique
              </h2>

              <p className="text-muted-foreground leading-relaxed mb-4">
                Nous nous réservons le droit de modifier cette politique de
                confidentialité pour nous conformer aux évolutions légales ou
                améliorer nos services.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                <strong>Notification des changements :</strong> Vous serez
                informé par email ou notification sur la plateforme au moins 30
                jours avant l'entrée en vigueur de toute modification
                substantielle.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                14. Contact
              </h2>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-foreground mb-4">
                  Pour toute question relative à cette politique :
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <strong>Email :</strong> privacy@disduct.com
                  </p>
                  <p>
                    <strong>Délégué à la Protection des Données :</strong>{" "}
                    dpo@disduct.com
                  </p>
                  <p>
                    <strong>Support général :</strong> support@disduct.com
                  </p>
                  <p>
                    <strong>Téléphone :</strong> +237 697392803
                  </p>
                </div>
              </div>
            </section>

            {/* Footer juridique */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-center text-sm text-muted-foreground">
                Cette politique de confidentialité respecte les exigences
                légales camerounaises, CEMAC, africaines et européennes (RGPD)
                pour garantir la protection optimale de vos données
                personnelles.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PolitiqueConfidentialite;
