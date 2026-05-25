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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { registerPatient, registerDoctor } from "@/lib/api/auth";
import { useAuthStore } from "@/features/auth/store";
import type { UserRole } from "@/features/auth/store";

const registerSchema = z.object({
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  email: z.string().email("Ingresa un correo válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  role: z.enum(["patient", "doctor"], { message: "Selecciona un rol" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

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
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      };

      const response =
        data.role === "patient"
          ? await registerPatient(payload)
          : await registerDoctor(payload);

      const role = mapRole(response.role);

      setSession({
        userId: response.userId,
        patientId: null,
        doctorId: null,
        role,
        fullName: `${data.firstName} ${data.lastName}`,
        email: response.email,
      });

      toast.success("Cuenta creada exitosamente");
      router.replace(getRedirectPath(role));
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (message.includes("409")) {
        toast.error("Este correo ya está registrado");
      } else if (message.includes("400")) {
        toast.error("Datos inválidos. Revisa el formulario.");
      } else {
        toast.error("Error al crear la cuenta. Intenta de nuevo.");
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
            <CardTitle className="text-xl">Crear cuenta</CardTitle>
            <CardDescription>Completa tus datos para registrarte</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    placeholder="Ana"
                    autoComplete="given-name"
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    placeholder="García"
                    autoComplete="family-name"
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

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
                <Label htmlFor="role">Soy...</Label>
                <Select onValueChange={(val) => setValue("role", val as "patient" | "doctor")}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Selecciona tu rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient">Paciente</SelectItem>
                    <SelectItem value="doctor">Médico</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-destructive">{errors.role.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="size-4 mr-2 animate-spin" />}
                Crear cuenta
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-4">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                Inicia sesión
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
