// Mots-clés SEO optimisés par catégorie pour les recherches camerounaises
export const SEO_KEYWORDS = {
  electronique: {
    title: "Acheter Électronique au Cameroun",
    description: "Achetez et vendez ordinateurs, smartphones, tablettes, TV au Cameroun. Prix abordables, livraison Douala, Yaoundé. Meilleure plateforme électronique camerounaise.",
    keywords: [
      "acheter ordinateur Cameroun",
      "vendre smartphone Douala",
      "acheter laptop Yaoundé",
      "ordinateur portable pas cher Cameroun",
      "téléphone android Cameroun",
      "iPhone occasion Douala",
      "PC gamer Cameroun",
      "tablette Samsung Yaoundé",
      "accessoires téléphone Cameroun",
      "TV écran plat Douala",
      "électronique discount Cameroun",
      "marketplace électronique Cameroun"
    ].join(", ")
  },
  mode: {
    title: "Mode et Vêtements au Cameroun",
    description: "Achetez vêtements, chaussures, sacs, accessoires mode au Cameroun. Collections hommes, femmes, enfants. Livraison Douala, Yaoundé. Mode africaine moderne.",
    keywords: [
      "acheter vêtements Cameroun",
      "mode femme Douala",
      "vêtements homme Yaoundé",
      "chaussures pas cher Cameroun",
      "sac à main Douala",
      "mode africaine Cameroun",
      "vêtements enfants Yaoundé",
      "bijoux accessoires Cameroun",
      "tenue africaine moderne Douala",
      "fashion Cameroun",
      "boutique en ligne mode Cameroun",
      "marketplace mode Cameroun"
    ].join(", ")
  },
  livres: {
    title: "Livres et Médias au Cameroun",
    description: "Achetez et vendez livres, magazines, CD, DVD au Cameroun. Romans, essais, livres scolaires, musique. Livraison Douala, Yaoundé.",
    keywords: [
      "acheter livres Cameroun",
      "vendre livres occasion Douala",
      "livres scolaires Yaoundé",
      "romans africains Cameroun",
      "magazines Cameroun",
      "CD musique Douala",
      "DVD films Yaoundé",
      "livres universitaires Cameroun",
      "bandes dessinées Douala",
      "livres enfants Cameroun",
      "librairie en ligne Cameroun",
      "marketplace livres Cameroun"
    ].join(", ")
  },
  autres: {
    title: "Produits Divers au Cameroun",
    description: "Achetez et vendez articles variés au Cameroun. Maison, sport, loisirs, services. Petites annonces Douala, Yaoundé. Marketplace camerounaise.",
    keywords: [
      "acheter articles Cameroun",
      "petites annonces Douala",
      "marketplace Yaoundé",
      "vendre produits Cameroun",
      "articles maison Douala",
      "équipement sport Cameroun",
      "loisirs Yaoundé",
      "services Cameroun",
      "annonces gratuites Douala",
      "acheter vendre Cameroun",
      "marketplace camerounaise",
      "plateforme achat vente Cameroun"
    ].join(", ")
  },
  general: {
    title: "disduct - Achat et Vente au Cameroun",
    description: "Première marketplace camerounaise pour acheter et vendre en ligne. Électronique, mode, livres, services. Connexion directe entre vendeurs et acheteurs au Cameroun. Livraison Douala, Yaoundé.",
    keywords: [
      "marketplace Cameroun",
      "acheter en ligne Cameroun",
      "vendre en ligne Douala",
      "petites annonces Cameroun",
      "e-commerce Cameroun",
      "acheter pas cher Yaoundé",
      "plateforme vente Cameroun",
      "marketplace camerounaise",
      "disduct Cameroun",
      "acheter vendre Douala",
      "site achat Cameroun",
      "vendre produits Yaoundé",
      "marketplace africaine",
      "commerce électronique Cameroun",
      "annonces gratuites Cameroun"
    ].join(", ")
  }
};

export const getProductKeywords = (category: string, productTitle: string, location?: string) => {
  const categoryKey = category.toLowerCase();
  const baseKeywords = SEO_KEYWORDS[categoryKey as keyof typeof SEO_KEYWORDS]?.keywords || SEO_KEYWORDS.general.keywords;
  
  // Ajouter des mots-clés spécifiques au produit et à la localisation
  const productWords = productTitle.toLowerCase().split(' ').slice(0, 3).join(' ');
  const locationKeywords = location 
    ? `${productWords} ${location}, acheter ${productWords} ${location}, vendre ${productWords} ${location}`
    : `${productWords} Cameroun, acheter ${productWords} Cameroun, vendre ${productWords} Cameroun`;
  
  return `${baseKeywords}, ${locationKeywords}`;
};

export const getCategoryKeywords = (categorySlug: string) => {
  return SEO_KEYWORDS[categorySlug as keyof typeof SEO_KEYWORDS] || SEO_KEYWORDS.general;
};
