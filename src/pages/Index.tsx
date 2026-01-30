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

const LOGO_URL = "/logo.png";

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
