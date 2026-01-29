// Redeveloped based on the new design requirements
import { SiteHeader } from "@/components/marau/SiteHeader";
import { Hero } from "@/components/marau/Hero";
import { MissionValues } from "@/components/marau/MissionValues";
import { OurJourney } from "@/components/marau/OurJourney";
import { Team } from "@/components/marau/Team";
import { Newsletter } from "@/components/marau/Newsletter";
import { Footer } from "@/components/marau/Footer";

const LOGO_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuAxrvhZIsLpFBhL4Fdg88ttSHjhIb-frJZQZlaxm8GNQc7IW4mGb6BEqX2FQHmaj5bWS_a_MAl-WrKOfqZv531UtiOEoVWECnv_zEkdUgFQPP4xOUlX1yLx1i1OZJ8scM7yIzgQ_kxoKeircZhd3n99pbXddvrZNxvVJ0LngrGdOEY6Erpyltdl5OirCSp02ao8a-6h_Tq9XGEvnDmkDVa-vtppe-1SASqAQ2YWNx6p66Oa5ofAncc0fEvxM9h_FbKYN9e7c07h";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-sans">
      <SiteHeader logoUrl={LOGO_URL} />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <Hero />
      </main>

      <MissionValues />
      <OurJourney />
      <Team />
      <Newsletter />

      <Footer logoUrl={LOGO_URL} />
    </div>
  );
};

export default Index;
