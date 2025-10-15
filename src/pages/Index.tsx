import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";

const Index = () => {
  return (
    <>
      <SEO 
        title="disduct - Marketplace Camerounaise N°1 | Acheter et Vendre en Ligne"
        description="Première marketplace camerounaise pour acheter et vendre facilement. Ordinateurs, smartphones, vêtements, livres, services. Connexion directe acheteurs-vendeurs. Livraison Douala, Yaoundé, Bafoussam, Garoua."
        keywords="marketplace Cameroun, acheter ordinateur Cameroun, vendre smartphone Douala, acheter en ligne Yaoundé, petites annonces Cameroun, e-commerce Cameroun, acheter pas cher Cameroun, vendre produits Douala, marketplace camerounaise, disduct, acheter vendre Yaoundé, plateforme camerounaise"
        url="/"
        type="website"
      />
      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <HeroSection />
          <CategoriesSection />
          <FeaturesSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
