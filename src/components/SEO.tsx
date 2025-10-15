import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  productData?: {
    price?: number;
    currency?: string;
    availability?: 'in_stock' | 'out_of_stock';
    condition?: 'new' | 'used';
    brand?: string;
  };
}

export const SEO = ({
  title = 'disduct - Marketplace Camerounaise | Acheter et Vendre en Ligne au Cameroun',
  description = 'Première marketplace camerounaise pour acheter et vendre facilement. Électronique, mode, livres, services. Connexion directe acheteurs-vendeurs. Livraison Douala, Yaoundé, toutes villes du Cameroun.',
  keywords = 'marketplace Cameroun, acheter en ligne Cameroun, vendre Douala, petites annonces Yaoundé, e-commerce Cameroun, acheter pas cher Cameroun, plateforme vente camerounaise, disduct, marketplace africaine',
  image = 'https://storage.googleapis.com/gpt-engineer-file-uploads/TM45LeeZmThy7iiznlliB4K4rjW2/social-images/social-1758055635885-logo disduct.png',
  url = 'https://disduct.fr',
  type = 'website',
  productData,
}: SEOProps) => {
  const fullTitle = title.includes('disduct') ? title : `${title} | disduct`;
  const canonicalUrl = url.startsWith('http') ? url : `https://disduct.fr${url}`;

  // Schéma JSON-LD pour l'organisation
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'disduct',
    description: 'Plateforme camerounaise d\'achat et vente en ligne',
    url: 'https://disduct.fr',
    logo: image,
    sameAs: [
      'https://www.facebook.com/disduct',
      'https://twitter.com/disduct',
      'https://www.instagram.com/disduct',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      areaServed: 'CM',
      availableLanguage: ['fr'],
    },
  };

  // Schéma JSON-LD pour les produits
  const productSchema = productData ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    description: description,
    image: image,
    brand: productData.brand ? {
      '@type': 'Brand',
      name: productData.brand,
    } : undefined,
    offers: {
      '@type': 'Offer',
      price: productData.price,
      priceCurrency: productData.currency || 'XAF',
      availability: productData.availability === 'in_stock' 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      itemCondition: productData.condition === 'new'
        ? 'https://schema.org/NewCondition'
        : 'https://schema.org/UsedCondition',
    },
  } : null;

  return (
    <Helmet>
      {/* Meta tags de base */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="disduct" />
      <meta property="og:locale" content="fr_CM" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@disduct" />

      {/* Mobile */}
      <meta name="theme-color" content="#8B5CF6" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      {/* Schemas JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      {productSchema && (
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      )}
    </Helmet>
  );
};
