import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DevModeToggle from "./components/DevModeToggle";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <DevModeToggle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/vendre" element={<Vendre />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/comment-vendre" element={<CommentVendre />} />
          <Route path="/comment-acheter" element={<CommentAcheter />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/conditions-utilisation" element={<ConditionsUtilisation />} />
          <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
          <Route path="/signaler-probleme" element={<SignalerProbleme />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/category/:category" element={<CategoryProducts />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
