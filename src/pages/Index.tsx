// Update this page (the content is just a fallback if you fail to update the page)

import { TopBar } from "@/components/marau/TopBar";
import { SiteHeader } from "@/components/marau/SiteHeader";
import { WeatherBanner } from "@/components/marau/WeatherBanner";
import { Hero } from "@/components/marau/Hero";
import { LatestNews } from "@/components/marau/LatestNews";
import { AdSlot } from "@/components/marau/AdSlot";
import { Jobs } from "@/components/marau/Jobs";
import { CityGuide } from "@/components/marau/CityGuide";
import { Sidebar } from "@/components/marau/Sidebar";
import { Footer } from "@/components/marau/Footer";

const LOGO_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAxrvhZIsLpFBhL4Fdg88ttSHjhIb-frJZQZlaxm8GNQc7IW4mGb6BEqX2FQHmaj5bWS_a_MAl-WrKOfqZv531UtiOEoVWECnv_zEkdUgFQPP4xOUlX1yLx1i1OZJ8scM7yIzgQ_kxoKeircZhd3n99pbXddvrZNxvVJ0LngrGdOEY6Erpyltdl5OirCSp02ao8a-6h_Tq9XGEvnDmkDVa-vtppe-1SASqAQ2YWNx6p66Oa5ofAncc0fEvxM9h_FbKYN9e7c07h";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <SiteHeader logoUrl={LOGO_URL} />

      <main className="container px-4 py-8">
        <WeatherBanner />
        <Hero />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-12">
            <LatestNews />
            <AdSlot />
            <Jobs />
            <CityGuide />
          </div>

          <Sidebar />
        </div>
      </main>

      <Footer logoUrl={LOGO_URL} />
    </div>
  );
};

export default Index;
