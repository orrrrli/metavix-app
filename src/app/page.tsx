import { Hero } from "@/shared/components/landing/Hero";
import { PainPoints } from "@/shared/components/landing/PainPoints";
import { Features } from "@/shared/components/landing/Features";
import { Benefits } from "@/shared/components/landing/Benefits";
import { HowItWorks } from "@/shared/components/landing/HowItWorks";
import { TargetAudience } from "@/shared/components/landing/TargetAudience";
import { FinalCTA } from "@/shared/components/landing/FinalCTA";
import { DoctorCTA } from "@/shared/components/landing/DoctorCTA";

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

      <footer style={{ padding: "52px 56px", background: "#fafafa", borderTop: "1.5px solid #f2f2f2" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00c9a7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
            </svg>
            <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 700, color: "#0a0a0a", letterSpacing: "-0.03em" }}>Metavix</span>
          </div>
          <div style={{ display: "flex", gap: 30 }}>
            <a href="#registrar" style={{ fontFamily: "'Sora', sans-serif", fontSize: 14, color: "#666666", textDecoration: "none" }}>Características</a>
            <a href="#beneficios" style={{ fontFamily: "'Sora', sans-serif", fontSize: 14, color: "#666666", textDecoration: "none" }}>Beneficios</a>
            <a href="#medicos" style={{ fontFamily: "'Sora', sans-serif", fontSize: 14, color: "#666666", textDecoration: "none" }}>Para médicos</a>
          </div>
          <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, color: "#bbbbbb" }}>© {new Date().getFullYear()} Metavix · Salud personal digital</span>
        </div>
      </footer>
    </div>
  );
}
