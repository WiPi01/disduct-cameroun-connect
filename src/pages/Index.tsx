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
        title="disduct - Marketplace camerounaise pour acheter et vendre"
        description="Achetez et vendez facilement au Cameroun avec disduct. Des milliers de produits disponibles : électronique, mode, maison, véhicules et plus. Connexion directe entre acheteurs et vendeurs camerounais."
        keywords="acheter Cameroun, vendre Cameroun, marketplace Cameroun, petites annonces Cameroun, produits discount, électronique pas cher, mode Cameroun"
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
