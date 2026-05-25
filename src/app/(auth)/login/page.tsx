"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { HeartPulse, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { loginUser } from "@/lib/api/auth";
import { useAuthStore } from "@/features/auth/store";
import type { UserRole } from "@/features/auth/store";

const loginSchema = z.object({
  email: z.string().email("Ingresa un correo válido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

type LoginFormData = z.infer<typeof loginSchema>;

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
  const { setSession } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await loginUser(data);
      const role = mapRole(response.role);

      setSession({
        userId: response.userId,
        patientId: response.patientId,
        doctorId: response.doctorId,
        role,
        fullName: response.fullName,
        email: response.email,
      });

      router.replace(getRedirectPath(role));
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (message.includes("401")) {
        toast.error("Credenciales incorrectas");
      } else if (message.includes("429")) {
        toast.error("Demasiados intentos. Intenta más tarde.");
      } else {
        toast.error("Error al iniciar sesión. Intenta de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <HeartPulse className="size-8 text-primary" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">Metavix</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Iniciar sesión</CardTitle>
            <CardDescription>Ingresa tus credenciales para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  autoComplete="email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="size-4 mr-2 animate-spin" />}
                Iniciar sesión
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-4">
              ¿No tienes cuenta?{" "}
              <Link href="/register" className="text-primary underline-offset-4 hover:underline">
                Regístrate
              </Link>
            </p>
            <p className="text-center text-sm text-muted-foreground mt-2">
              <Link href="/" className="text-muted-foreground underline-offset-4 hover:underline">
                Volver al inicio
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
