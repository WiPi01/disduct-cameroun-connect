import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <CategoriesSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Index;