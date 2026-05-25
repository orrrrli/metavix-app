"use client";

import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api/auth";
import { useAuthStore } from "@/features/auth/store";
import type { UserRole } from "@/features/auth/store";
import AuthSignIn, { type SignInFormData } from "@/shared/components/auth/AuthSignIn";
import Image from "next/image";

function mapRole(apiRole: string): UserRole {
  switch (apiRole) {
    case "Patient": return "PATIENT";
    case "Doctor": return "DOCTOR";
    case "Admin": return "ADMIN";
    default: return null;
  }
}

function getRedirectPath(role: UserRole): string {
  switch (role) {
    case "PATIENT": return "/paciente/dashboard";
    case "DOCTOR": return "/doctor/dashboard";
    default: return "/";
  }
}

export default function LoginPage() {
  const router = useRouter();
  const { setSession, role } = useAuthStore();

  const handleSignIn = async (credentials: SignInFormData) => {
    try {
      const response = await loginUser({ 
        email: credentials.email, 
        password: credentials.password 
      });
      const userRole = mapRole(response.role);

      setSession({
        userId: response.userId,
        patientId: response.patientId,
        doctorId: response.doctorId,
        role: userRole,
        fullName: response.fullName,
        email: response.email,
      });

      return { 
        user: { 
          name: response.fullName.split(" ")[0], 
          isAdmin: userRole === "ADMIN" || userRole === "DOCTOR"
        } 
      };
    } catch (error: any) {
      const message = error instanceof Error ? error.message : "";
      if (message.includes("401")) {
        return { error: "Credenciales incorrectas" };
      } else if (message.includes("429")) {
        return { error: "Demasiados intentos. Intenta más tarde." };
      } else {
        return { error: "Error al iniciar sesión. Intenta de nuevo." };
      }
    }
  };

  const handleSuccess = () => {
    // We can read from the store state since it was updated in handleSignIn
    const currentRole = useAuthStore.getState().role;
    router.replace(getRedirectPath(currentRole));
  };

  return (
    <AuthSignIn
      onSignIn={handleSignIn}
      onSuccess={handleSuccess}
      imageSrc="/images/login.jpg"
      imageQuote="Metavix transformó la forma en que atendemos a nuestros pacientes."
      imageAuthor="Dr. Ramses Valenzuela"
      imageAuthorRole="Diabetologo y Educador"
      logoNode={<Image src="/icon.svg" alt="Metavix" width={32} height={32} />}
    />
  );
}
