import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NewsDetails from "./pages/NewsDetails";
import CategoryNews from "./pages/CategoryNews";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import CityPoints from "./pages/CityPoints";
import Contact from "./pages/Contact";
import QuemSomos from "./pages/QuemSomos";
import SearchResults from "./pages/SearchResults";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/noticia/:slug" element={<NewsDetails />} />
          <Route path="/categoria/:slug" element={<CategoryNews />} />
          <Route path="/vagas" element={<Jobs />} />
          <Route path="/vagas/:id" element={<JobDetails />} />
          <Route path="/pontos" element={<CityPoints />} />
          <Route path="/points" element={<CityPoints />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/quem-somos" element={<QuemSomos />} />
          <Route path="/busca" element={<SearchResults />} />
          <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
