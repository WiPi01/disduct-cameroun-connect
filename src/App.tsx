import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Vendre from "./pages/Vendre";
import About from "./pages/About";
import Services from "./pages/Services";
import CommentVendre from "./pages/CommentVendre";
import CommentAcheter from "./pages/CommentAcheter";
import Profile from "./pages/Profile";
import ConditionsUtilisation from "./pages/ConditionsUtilisation";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";
import SignalerProbleme from "./pages/SignalerProbleme";
import FAQ from "./pages/FAQ";
import CategoryProducts from "./pages/CategoryProducts";
import AllProducts from "./pages/AllProducts";
import PublierArticle from "./pages/PublierArticle";
import ModifierArticle from "./pages/ModifierArticle";
import ResetPassword from "./pages/ResetPassword";
import ShopView from "./pages/ShopView";
import NotFound from "./pages/NotFound";

const App = () => {
  console.log("App component rendering...");
  return (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/vendre" element={<Vendre />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/comment-vendre" element={<CommentVendre />} />
      <Route path="/comment-acheter" element={<CommentAcheter />} />
      <Route path="/profile" element={<Profile />} />
      <Route
        path="/conditions-utilisation"
        element={<ConditionsUtilisation />}
      />
      <Route
        path="/politique-confidentialite"
        element={<PolitiqueConfidentialite />}
      />
      <Route path="/signaler-probleme" element={<SignalerProbleme />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/produits" element={<AllProducts />} />
      <Route path="/publier-article" element={<PublierArticle />} />
      <Route path="/modifier-article/:id" element={<ModifierArticle />} />
      <Route path="/category/:category" element={<CategoryProducts />} />
      <Route path="/boutique/:userId" element={<ShopView />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
    </Routes>
  </TooltipProvider>
  );
};

export default App;
