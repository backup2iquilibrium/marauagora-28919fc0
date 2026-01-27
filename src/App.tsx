import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { RequireAdmin } from "@/components/auth/RequireAdmin";
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
import TermsOfUse from "./pages/TermsOfUse";
import Agenda from "./pages/Agenda";
import Galleries from "./pages/Galleries";
import GalleryDetails from "./pages/GalleryDetails";
import Services from "./pages/Services";
import Horoscope from "./pages/Horoscope";
import NotFound from "./pages/NotFound";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminClassifieds from "./pages/admin/AdminClassifieds";
import AdminAdManagement from "./pages/admin/AdminAdManagement";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminResetPassword from "./pages/admin/AdminResetPassword";
import AdvertiserClassifiedsDashboard from "./pages/advertiser/AdvertiserClassifiedsDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
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
            <Route path="/termos-de-uso" element={<TermsOfUse />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/galerias" element={<Galleries />} />
            <Route path="/galerias/:slug" element={<GalleryDetails />} />
            <Route path="/servicos" element={<Services />} />
            <Route path="/horoscopo" element={<Horoscope />} />

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/redefinir-senha" element={<AdminResetPassword />} />
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminLayout />
                </RequireAdmin>
              }
            >
              <Route path="publicidade" element={<AdminAdManagement />} />
              <Route path="classificados" element={<AdminClassifieds />} />
              <Route index element={<AdminDashboard />} />
              <Route path="conteudo" element={<div className="p-6 text-muted-foreground">Conteúdo (em breve)</div>} />
              <Route path="usuarios" element={<div className="p-6 text-muted-foreground">Usuários (em breve)</div>} />
              <Route path="configuracoes" element={<div className="p-6 text-muted-foreground">Configurações (em breve)</div>} />
            </Route>

            {/* Advertiser */}
            <Route
              path="/anunciante/classificados"
              element={
                <RequireAuth to="/admin/login">
                  <AdvertiserClassifiedsDashboard />
                </RequireAuth>
              }
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
