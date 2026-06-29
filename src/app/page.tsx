import { Hero } from "@/shared/components/landing/Hero";
import { PainPoints } from "@/shared/components/landing/PainPoints";
import { Features } from "@/shared/components/landing/Features";
import { Benefits } from "@/shared/components/landing/Benefits";
import { HowItWorks } from "@/shared/components/landing/HowItWorks";
import { TargetAudience } from "@/shared/components/landing/TargetAudience";
import { FinalCTA } from "@/shared/components/landing/FinalCTA";
import { DoctorCTA } from "@/shared/components/landing/DoctorCTA";
import { Footer } from "@/shared/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <main className="flex-1">
        <Hero />
        <PainPoints />
        <Features />
        <Benefits />
        <HowItWorks />
        <TargetAudience />
        <DoctorCTA />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}
