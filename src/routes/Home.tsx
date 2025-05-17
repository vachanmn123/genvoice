import { LandingHero } from "@/components/landing/LandingHero";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingPrivacy } from "@/components/landing/LandingPrivacy";
import { LandingCta } from "@/components/landing/LandingCTA";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNav } from "@/components/landing/LandingNav";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFFAF0] text-black">
      <LandingNav />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingPrivacy />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  );
}
