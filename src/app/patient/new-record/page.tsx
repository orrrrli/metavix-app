"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Save, AlertCircle } from "lucide-react";

import { useAuthStore } from "@/features/auth/store";
import { useMockDb } from "@/features/mock-db/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

const recordSchema = z.object({
  fastingGlucose: z.coerce.number().min(20, "Valor muy bajo").max(600, "Valor muy alto").nullable().optional(),
  postprandial1hGlucose: z.coerce.number().min(20, "Valor muy bajo").max(600, "Valor muy alto").nullable().optional(),
  postprandial2hGlucose: z.coerce.number().min(20, "Valor muy bajo").max(600, "Valor muy alto").nullable().optional(),
  systolicBP: z.coerce.number().min(50, "Valor muy bajo").max(250, "Valor muy alto").nullable().optional(),
  diastolicBP: z.coerce.number().min(30, "Valor muy bajo").max(150, "Valor muy alto").nullable().optional(),
  heartRate: z.coerce.number().min(30, "Valor muy bajo").max(220, "Valor muy alto").nullable().optional(),
  weightKg: z.coerce.number().min(20, "Valor muy bajo").max(300, "Valor muy alto").nullable().optional(),
  notes: z.string().nullable().optional(),
  symptoms: z.string().nullable().optional(),
}).refine(data => {
  return data.fastingGlucose || data.systolicBP || data.heartRate || data.weightKg;
}, {
  message: "Por favor ingresa al menos una métrica para guardar el registro.",
  path: ["root"]
});

type RecordFormValues = z.infer<typeof recordSchema>;

export default function NewRecordPage() {
  const router = useRouter();
  const { userId } = useAuthStore();
  const { addRecord } = useMockDb();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RecordFormValues>({
    resolver: zodResolver(recordSchema) as any,
    defaultValues: {
      fastingGlucose: undefined,
      postprandial1hGlucose: undefined,
      postprandial2hGlucose: undefined,
      systolicBP: undefined,
      diastolicBP: undefined,
      heartRate: undefined,
      weightKg: undefined,
      notes: "",
      symptoms: ""
    }
  });

  const onSubmit = async (data: RecordFormValues) => {
    if (!userId) return;
    setIsSubmitting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    addRecord({
      id: `rec-${Date.now()}`,
      patientId: userId,
      timestamp: new Date().toISOString(),
      fastingGlucose: data.fastingGlucose || null,
      postprandial1hGlucose: data.postprandial1hGlucose || null,
      postprandial2hGlucose: data.postprandial2hGlucose || null,
      systolicBP: data.systolicBP || null,
      diastolicBP: data.diastolicBP || null,
      heartRate: data.heartRate || null,
      hba1c: null,
      ldl: null,
      triglycerides: null,
      weightKg: data.weightKg || null,
      notes: data.notes || null,
      symptoms: data.symptoms || null,
      medicationComments: null,
    });

    setIsSubmitting(false);
    toast.success("¡Registro de salud guardado con éxito!");
    router.push("/patient/dashboard");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-display font-bold text-foreground">Registrar Nueva Lectura</h2>
        <p className="text-muted-foreground mt-1">Ingresa tus últimas métricas clínicas. Solo completa lo que hayas medido hoy.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {errors.root && (
          <div className="bg-destructive/15 text-destructive text-sm p-4 rounded-lg flex items-center mb-6">
            <AlertCircle className="size-4 mr-2" />
            {errors.root.message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Glucosa (mg/dL)</CardTitle>
              <CardDescription>Medidas de azúcar en sangre</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fastingGlucose">Glucosa en Ayunas</Label>
                <Input id="fastingGlucose" type="number" step="0.1" placeholder="ej. 105" {...register("fastingGlucose")} />
                {errors.fastingGlucose && <p className="text-sm text-destructive">{errors.fastingGlucose.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="postprandial1hGlucose">Posprandial a 1 Hora</Label>
                <Input id="postprandial1hGlucose" type="number" step="0.1" placeholder="ej. 140" {...register("postprandial1hGlucose")} />
                {errors.postprandial1hGlucose && <p className="text-sm text-destructive">{errors.postprandial1hGlucose.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="postprandial2hGlucose">Posprandial a 2 Horas</Label>
                <Input id="postprandial2hGlucose" type="number" step="0.1" placeholder="ej. 120" {...register("postprandial2hGlucose")} />
                {errors.postprandial2hGlucose && <p className="text-sm text-destructive">{errors.postprandial2hGlucose.message}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cardiovascular</CardTitle>
              <CardDescription>Presión arterial y frecuencia cardíaca</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="systolicBP">Sistólica (mmHg)</Label>
                  <Input id="systolicBP" type="number" placeholder="120" {...register("systolicBP")} />
                  {errors.systolicBP && <p className="text-sm text-destructive">{errors.systolicBP.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diastolicBP">Diastólica (mmHg)</Label>
                  <Input id="diastolicBP" type="number" placeholder="80" {...register("diastolicBP")} />
                  {errors.diastolicBP && <p className="text-sm text-destructive">{errors.diastolicBP.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="heartRate">Frecuencia Cardíaca (lpm)</Label>
                <Input id="heartRate" type="number" placeholder="ej. 72" {...register("heartRate")} />
                {errors.heartRate && <p className="text-sm text-destructive">{errors.heartRate.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="weightKg">Peso (kg)</Label>
                <Input id="weightKg" type="number" step="0.1" placeholder="ej. 75.5" {...register("weightKg")} />
                {errors.weightKg && <p className="text-sm text-destructive">{errors.weightKg.message}</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Notas Clínicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="symptoms">Síntomas (separados por coma)</Label>
              <Input id="symptoms" placeholder="ej. Mareo, Sed, Dolor de cabeza" {...register("symptoms")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notas Adicionales</Label>
              <Input id="notes" placeholder="¿Algún comentario para tu doctor?" {...register("notes")} />
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-end">
          <Button type="button" variant="outline" className="mr-4" onClick={() => router.back()}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting} size="lg">
            {isSubmitting ? "Guardando..." : "Guardar Registro"}
            {!isSubmitting && <Save className="ml-2 size-4" />}
          </Button>
        </div>
      </form>
    </div>
  );
}
