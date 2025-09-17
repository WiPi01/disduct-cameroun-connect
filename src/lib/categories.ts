// Mapping bidirectionnel entre les slugs d'URL et les noms de catégories en base de données
export const CATEGORY_MAPPINGS = {
  // Slug URL -> Nom en base de données
  slugToDb: {
    electronique: "Électronique",
    mode: "Mode et Accessoires",
    maison: "Maison & Jardin", 
    automobile: "Automobile",
    agriculture: "Agriculture",
    services: "Services"
  },
  
  // Nom en base de données -> Slug URL
  dbToSlug: {
    "Électronique": "electronique",
    "Mode et Accessoires": "mode",
    "Mode & Beauté": "mode", // Pour la compatibilité
    "Maison & Jardin": "maison",
    "Automobile": "automobile", 
    "Agriculture": "agriculture",
    "Services": "services"
  },

  // Noms d'affichage pour l'interface
  displayNames: {
    electronique: "Électronique",
    mode: "Mode et Accessoires",
    maison: "Maison & Jardin",
    automobile: "Automobile",
    agriculture: "Agriculture", 
    services: "Services"
  }
};

export const getCategoryDisplayName = (slug: string): string => {
  return CATEGORY_MAPPINGS.displayNames[slug as keyof typeof CATEGORY_MAPPINGS.displayNames] || slug;
};

export const getCategoryDbName = (slug: string): string => {
  return CATEGORY_MAPPINGS.slugToDb[slug as keyof typeof CATEGORY_MAPPINGS.slugToDb] || slug;
};

export const getCategorySlug = (dbName: string): string => {
  return CATEGORY_MAPPINGS.dbToSlug[dbName as keyof typeof CATEGORY_MAPPINGS.dbToSlug] || dbName.toLowerCase();
};