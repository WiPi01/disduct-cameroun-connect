import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import LatestProducts from "@/components/LatestProducts";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <CategoriesSection />
      <LatestProducts />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Index;