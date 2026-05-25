"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { HeartPulse, Stethoscope, User } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useAuthStore } from "@/features/auth/store";
import { MOCK_PATIENT_ID, MOCK_DOCTOR_ID } from "@/features/mock-db/seed";

export default function LandingPage() {
  const router = useRouter();
  const { role, loginAsPatient, loginAsDoctor } = useAuthStore();

  useEffect(() => {
    if (role === "PATIENT") {
      router.replace("/paciente/dashboard");
    } else if (role === "DOCTOR") {
      router.replace("/doctor/dashboard");
    }
  }, [role, router]);

  const handlePatientLogin = () => {
    loginAsPatient(MOCK_PATIENT_ID);
    router.push("/paciente/dashboard");
  };

  const handleDoctorLogin = () => {
    loginAsDoctor(MOCK_DOCTOR_ID);
    router.push("/doctor/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="z-10 text-center mb-10">
        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6">
          <HeartPulse className="size-12 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
          Metavix
        </h1>
        <p className="text-lg text-muted-foreground max-w-lg mx-auto">
          Plataforma de monitoreo cardiovascular y de diabetes. Selecciona cómo quieres continuar.
        </p>
      </div>

      {/* Auth actions */}
      <div className="z-10 w-full max-w-sm mb-8">
        <div className="flex gap-3">
          <Button
            variant="default"
            className="flex-1"
            onClick={() => router.push("/login")}
          >
            Iniciar sesión
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.push("/register")}
          >
            Registrarse
          </Button>
        </div>
      </div>

      {/* Options grid */}
      <div className="z-10 grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-3xl">
        {/* Demo Patient */}
        <Card className="border-border/60 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto bg-blue-50 text-blue-600 p-4 rounded-2xl mb-4 group-hover:scale-105 transition-transform duration-300">
              <User className="size-10" />
            </div>
            <CardTitle className="text-xl font-display">Demo Paciente</CardTitle>
            <CardDescription className="text-sm mt-2">
              Explora el portal con datos de ejemplo de una paciente con Diabetes Tipo 2.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="bg-muted w-full rounded-lg p-3 mb-5 text-sm text-center">
              <p className="font-semibold mb-0.5">Cuenta simulada</p>
              <p className="text-muted-foreground text-xs">Sarah Jenkins · Diabetes Tipo 2</p>
            </div>
            <Button
              size="lg"
              className="w-full text-base h-12 shadow-sm bg-blue-600 hover:bg-blue-700"
              onClick={handlePatientLogin}
            >
              Ver demo de paciente
            </Button>
          </CardContent>
        </Card>

        {/* Demo Doctor */}
        <Card className="border-border/60 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto bg-primary/10 text-primary p-4 rounded-2xl mb-4 group-hover:scale-105 transition-transform duration-300">
              <Stethoscope className="size-10" />
            </div>
            <CardTitle className="text-xl font-display">Demo Médico</CardTitle>
            <CardDescription className="text-sm mt-2">
              Explora el panel clínico con pacientes simulados y alertas cardiovasculares.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="bg-muted w-full rounded-lg p-3 mb-5 text-sm text-center">
              <p className="font-semibold mb-0.5">Cuenta simulada</p>
              <p className="text-muted-foreground text-xs">Dr. Alexander Thorne · Cardiólogo</p>
            </div>
            <Button
              size="lg"
              className="w-full text-base h-12 shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleDoctorLogin}
            >
              Ver demo médico
            </Button>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
