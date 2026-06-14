"use client";

import { useRouter } from "next/navigation";
import { loginUser, registerDoctor, registerPatient } from "@/lib/api/auth";
import { useAuthStore } from "@/features/auth/store";
import type { UserRole } from "@/features/auth/store";
import AuthSignUp from "@/shared/components/auth/AuthSignUp";
import Image from "next/image";

const API = process.env.NEXT_PUBLIC_API_URL ?? '';

function mapRole(apiRole: string): UserRole {
  switch (apiRole) {
    case "Patient": return "PATIENT";
    case "Doctor": return "DOCTOR";
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

export default function RegisterPage() {
  const router = useRouter();
  const { setSession } = useAuthStore();

  const handleGoogleSignUp = (role: 'patient' | 'doctor') => {
    window.location.href = `${API}/api/auth/google?role=${role}`;
  };

  const handleRegister = async (data: any) => {
    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      };

      await (data.role === "patient"
        ? registerPatient(payload)
        : registerDoctor(payload));

      // Register sets cookies but doesn't return patientId/doctorId.
      // Login immediately after to get the full session.
      const session = await loginUser({ email: data.email, password: data.password });
      const role = mapRole(session.role);

      setSession({
        userId: session.userId,
        patientId: session.patientId,
        doctorId: session.doctorId,
        role,
        fullName: `${data.firstName} ${data.lastName}`,
        email: session.email,
      });

      // Redirect manually after a short delay since AuthSignUp shows a success state natively
      setTimeout(() => {
        router.replace(getRedirectPath(role));
      }, 2000);

      return { success: "Cuenta creada exitosamente. Redirigiendo..." };
    } catch (error: any) {
      const message = error instanceof Error ? error.message : "";
      if (message.includes("409")) {
        return { error: "Este correo ya está registrado" };
      } else if (message.includes("400")) {
        return { error: "Datos inválidos. Revisa el formulario." };
      } else {
        return { error: "Error al crear la cuenta. Intenta de nuevo." };
      }
    }
  };

  return (
    <AuthSignUp
      onRegister={handleRegister}
      onGoogleSignUp={handleGoogleSignUp}
      imageSrc="/images/register.jpg"
      imageQuote="Monitorea y previene con datos reales en tiempo real."
      imageAuthor="Dr. Ramses Valenzuela"
      imageAuthorRole="Diabetologo y Educador"
      logoNode={<Image src="/icon.svg" alt="Metavix" width={32} height={32} />}
    />
  );
}
