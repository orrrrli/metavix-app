"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Stethoscope } from "lucide-react";

import { useUpdateDoctorProfile } from "@/features/doctor/hooks/use-doctor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

const onboardingSchema = z.object({
  licenseNumber: z.string().min(1, "La cédula profesional es requerida"),
  speciality: z.string().min(1, "La especialidad es requerida"),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

export default function DoctorOnboardingPage(): React.ReactElement {
  const router = useRouter();
  const { mutateAsync: updateProfile, isPending } = useUpdateDoctorProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
  });

  async function onSubmit(data: OnboardingFormData): Promise<void> {
    try {
      await updateProfile({ licenseNumber: data.licenseNumber, speciality: data.speciality });
      toast.success("Credenciales guardadas correctamente");
      router.replace("/doctor/dashboard");
    } catch {
      toast.error("No se pudieron guardar las credenciales. Intenta de nuevo.");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <div className="p-3 rounded-full bg-primary/10">
              <Stethoscope className="size-7 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-display">Completa tu perfil médico</CardTitle>
          <CardDescription>
            Ingresa tu cédula profesional y especialidad para comenzar a atender pacientes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="licenseNumber">Cédula Profesional</Label>
              <Input
                id="licenseNumber"
                placeholder="Ej. 12345678"
                {...register("licenseNumber")}
              />
              {errors.licenseNumber && (
                <p className="text-xs text-destructive">{errors.licenseNumber.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="speciality">Especialidad</Label>
              <Input
                id="speciality"
                placeholder="Ej. Endocrinología"
                {...register("speciality")}
              />
              {errors.speciality && (
                <p className="text-xs text-destructive">{errors.speciality.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar y continuar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
