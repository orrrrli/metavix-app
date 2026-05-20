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

  // Auto-redirect if already logged in
  useEffect(() => {
    if (role === "PATIENT") {
      router.replace("/patient/dashboard");
    } else if (role === "DOCTOR") {
      router.replace("/doctor/dashboard");
    }
  }, [role, router]);

  const handlePatientLogin = () => {
    loginAsPatient(MOCK_PATIENT_ID);
    router.push("/patient/dashboard");
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
      
      <div className="z-10 text-center mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6">
          <HeartPulse className="size-12 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
          Metavix
        </h1>
        <p className="text-lg text-muted-foreground max-w-lg mx-auto">
          Enterprise-grade diabetes and cardiovascular monitoring platform. Please select your portal to continue.
        </p>
      </div>

      <div className="z-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Patient Login Card */}
        <Card className="border-border/60 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto bg-blue-50 text-blue-600 p-4 rounded-2xl mb-4 group-hover:scale-105 transition-transform duration-300">
              <User className="size-10" />
            </div>
            <CardTitle className="text-2xl font-display">Patient Portal</CardTitle>
            <CardDescription className="text-base mt-2">
              Monitor your vitals, view health history, and track your progress over time.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="bg-muted w-full rounded-lg p-4 mb-6 text-sm text-center">
              <p className="font-semibold mb-1">Simulated Account:</p>
              <p className="text-muted-foreground">Sarah Jenkins (Type 2 Diabetes)</p>
            </div>
            <Button 
              size="lg" 
              className="w-full text-base h-12 shadow-sm bg-blue-600 hover:bg-blue-700" 
              onClick={handlePatientLogin}
            >
              Access Patient Dashboard
            </Button>
          </CardContent>
        </Card>

        {/* Doctor Login Card */}
        <Card className="border-border/60 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto bg-primary/10 text-primary p-4 rounded-2xl mb-4 group-hover:scale-105 transition-transform duration-300">
              <Stethoscope className="size-10" />
            </div>
            <CardTitle className="text-2xl font-display">Doctor Portal</CardTitle>
            <CardDescription className="text-base mt-2">
              Supervise your patients, analyze clinical trends, and review cardiovascular alerts.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="bg-muted w-full rounded-lg p-4 mb-6 text-sm text-center">
              <p className="font-semibold mb-1">Simulated Account:</p>
              <p className="text-muted-foreground">Dr. Alexander Thorne (Cardiologist)</p>
            </div>
            <Button 
              size="lg" 
              className="w-full text-base h-12 shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground" 
              onClick={handleDoctorLogin}
            >
              Access Clinical Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
