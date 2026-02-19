import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { RequireAdmin } from "@/components/auth/RequireAdmin";

// Lazy loaded components
const Index = lazy(() => import("./pages/Index"));
const NewsDetails = lazy(() => import("./pages/NewsDetails"));
const CategoryNews = lazy(() => import("./pages/CategoryNews"));
const Jobs = lazy(() => import("./pages/Jobs"));
const JobDetails = lazy(() => import("./pages/JobDetails"));
const CityPoints = lazy(() => import("./pages/CityPoints"));
const Contact = lazy(() => import("./pages/Contact"));
const QuemSomos = lazy(() => import("./pages/QuemSomos"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfUse = lazy(() => import("./pages/TermsOfUse"));
const Agenda = lazy(() => import("./pages/Agenda"));
const Galleries = lazy(() => import("./pages/Galleries"));
const GalleryDetails = lazy(() => import("./pages/GalleryDetails"));
const Services = lazy(() => import("./pages/Services"));
const Horoscope = lazy(() => import("./pages/Horoscope"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminForgotPassword = lazy(() => import("./pages/admin/AdminForgotPassword"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminClassifieds = lazy(() => import("./pages/admin/AdminClassifieds"));
const AdminAdManagement = lazy(() => import("./pages/admin/AdminAdManagement"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminResetPassword = lazy(() => import("./pages/admin/AdminResetPassword"));
const AdminContent = lazy(() => import("./pages/admin/AdminContent"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminNewsEditor = lazy(() => import("./pages/admin/AdminNewsEditor"));
const AdvertiserClassifiedsDashboard = lazy(() => import("./pages/advertiser/AdvertiserClassifiedsDashboard"));
const AdvertiserLayout = lazy(() => import("./pages/advertiser/AdvertiserLayout"));
const AdvertiserAdDashboard = lazy(() => import("./pages/advertiser/AdvertiserAdDashboard"));
const CreateClassifiedAd = lazy(() => import("./pages/advertiser/CreateClassifiedAd"));

const queryClient = new QueryClient();

import { SettingsProvider } from "@/context/SettingsContext";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SettingsProvider>
        <AuthProvider>
          <BrowserRouter>
            <Suspense
              fallback={
                <div className="flex h-screen w-full items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              }
            >
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
                <Route path="/admin/recuperar-senha" element={<AdminForgotPassword />} />
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
                  <Route path="conteudo" element={<AdminContent />} />
                  <Route path="conteudo/novo" element={<AdminNewsEditor />} />
                  <Route path="conteudo/:id/editar" element={<AdminNewsEditor />} />
                  <Route path="usuarios" element={<AdminUsers />} />
                  <Route path="configuracoes" element={<AdminSettings />} />
                </Route>

                {/* Advertiser */}
                <Route
                  path="/anunciante"
                  element={
                    <RequireAuth to="/admin/login">
                      <AdvertiserLayout />
                    </RequireAuth>
                  }
                >
                  <Route path="publicidade" element={<AdvertiserAdDashboard />} />
                  <Route path="classificados" element={<AdvertiserClassifiedsDashboard />} />
                  <Route path="classificados/novo" element={<CreateClassifiedAd />} />
                </Route>

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </SettingsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
