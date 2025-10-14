// Mapping bidirectionnel entre les slugs d'URL et les noms de catégories en base de données
export const CATEGORY_MAPPINGS = {
  // Slug URL -> Nom en base de données
  slugToDb: {
    electronique: "Électronique",
    mode: "Mode et Accessoires",
    vehicules: "Véhicules",
    livres: "Livres et Médias",
    autres: "Autres"
  },
  
  // Nom en base de données -> Slug URL
  dbToSlug: {
    "Électronique": "electronique",
    "Mode et Accessoires": "mode",
    "Véhicules": "vehicules",
    "Livres et Médias": "livres",
    "Autres": "autres"
  },

  // Noms d'affichage pour l'interface
  displayNames: {
    electronique: "Électronique",
    mode: "Mode et Accessoires",
    vehicules: "Véhicules",
    livres: "Livres et Médias",
    autres: "Autres"
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