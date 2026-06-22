"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Save, AlertCircle, Plus, Trash2 } from "lucide-react";

import { useAuthStore } from "@/features/auth/store";
import { usePatientProfile, useUpdatePatientProfile } from "@/features/patient/hooks/use-patient-profile";
import { useCreateDailyRecord, useDailyRecordSnapshot } from "@/features/patient/hooks/use-daily-records";
import { useCreateLabRecord } from "@/features/patient/hooks/use-lab-records";
import { GlucoseReadingType } from "@/types/daily-record";
import { MealTimeSelector } from "@/shared/components/ui/meal-time-selector";
import { GooeyLoader } from "@/shared/components/ui/gooey-loader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

const optionalNum = (min: number, max: number, msg: string) =>
  z.union([
    z.coerce.number().min(min, msg).max(max, msg),
    z.literal(""),
    z.literal(null),
    z.undefined(),
  ]).transform(val => (val === "" || val == null) ? null : Number(val));

const recordSchema = z.object({
  fecha: z.string().min(1, "La fecha es requerida"),
  glucoseReadings: z.array(z.object({
    readingType: z.coerce.number().int(),
    valueMgDl: z.coerce.number().min(40, "Mínimo 40").max(600, "Máximo 600"),
    time: z.string().optional().transform(v => v === "" ? null : v ?? null),
    foods: z.string().optional().transform(v => v === "" ? null : v ?? null),
  })),
  presion_sistolica:   optionalNum(60, 260, "Rango: 60-260"),
  presion_diastolica:  optionalNum(40, 160, "Rango: 40-160"),
  frecuencia_cardiaca: optionalNum(30, 250, "Rango: 30-250"),
  peso:                optionalNum(20, 300, "Rango: 20-300"),
  cintura:             optionalNum(40, 200, "Rango: 40-200"),
  altura:              optionalNum(100, 250, "Rango: 100-250"),
  hba1c:               optionalNum(3, 20,   "Rango: 3-20"),
  colesterol_total:    optionalNum(50, 600,  "Rango: 50-600"),
  colesterol_ldl:      optionalNum(20, 400,  "Rango: 20-400"),
  colesterol_hdl:      optionalNum(10, 200,  "Rango: 10-200"),
  trigliceridos:       optionalNum(20, 3000, "Rango: 20-3000"),
  bun:                 optionalNum(1, 200,   "Rango: 1-200"),
  creatinina:          optionalNum(0.1, 30,  "Rango: 0.1-30"),
  ego_proteinas: z.string().optional().transform(v => v === "" ? null : v ?? null),
  ego_glucosa:   z.string().optional().transform(v => v === "" ? null : v ?? null),
  notas:         z.string().optional().transform(v => v === "" ? null : v ?? null),
  embarazada:    z.boolean().optional(),
});

type RecordFormValues = z.infer<typeof recordSchema>;

export default function NewRecordPage() {
  const router = useRouter();
  const { patientId } = useAuthStore();

  const todayISO = new Date().toISOString().split('T')[0];

  const { data: profile, isLoading: loadingProfile } = usePatientProfile(patientId ?? '');
  const { mutateAsync: submitDailyRecord } = useCreateDailyRecord(patientId ?? '');
  const { mutateAsync: submitLabRecord }   = useCreateLabRecord(patientId ?? '');
  const { mutateAsync: submitProfilePatch } = useUpdatePatientProfile(patientId ?? '');

  const { data: snapshot, error: snapshotError } = useDailyRecordSnapshot(patientId ?? '', todayISO);

  const [prefilled, setPrefilled] = useState({ peso: false, cintura: false });

  const { register, handleSubmit, control, setValue, formState: { errors, isSubmitting, dirtyFields } } = useForm<RecordFormValues>({
    resolver: zodResolver(recordSchema) as any,
    defaultValues: {
      fecha:               todayISO,
      glucoseReadings:     [],
      presion_sistolica:   undefined,
      presion_diastolica:  undefined,
      frecuencia_cardiaca: undefined,
      peso:                undefined,
      cintura:             undefined,
      altura:              profile?.heightCm ?? undefined,
      hba1c:               undefined,
      colesterol_total:    undefined,
      colesterol_ldl:      undefined,
      colesterol_hdl:      undefined,
      trigliceridos:       undefined,
      bun:                 undefined,
      creatinina:          undefined,
      ego_proteinas:       "",
      ego_glucosa:         "",
      notas:               "",
      embarazada:          profile?.isPregnant ?? false,
    },
  });

  useEffect(() => {
    if (!snapshot) return;
    if (snapshot.weightKg !== null) {
      setValue('peso', snapshot.weightKg, { shouldDirty: false });
      setPrefilled(prev => ({ ...prev, peso: true }));
    }
    if (snapshot.waistCm !== null) {
      setValue('cintura', snapshot.waistCm, { shouldDirty: false });
      setPrefilled(prev => ({ ...prev, cintura: true }));
    }
  }, [snapshot, setValue]);

  useEffect(() => {
    if (snapshotError) {
      console.error('[nuevo-registro] snapshot pre-fill failed, continuing with blank fields:', snapshotError);
    }
  }, [snapshotError]);

  const { fields, append, remove } = useFieldArray({ control, name: "glucoseReadings" });

  const onSubmit = async (data: RecordFormValues) => {
    const hasDaily = [
      data.presion_sistolica, data.presion_diastolica,
      data.frecuencia_cardiaca, data.peso, data.cintura,
    ].some(v => v !== null && v !== undefined);

    const hasGlucose = data.glucoseReadings.length > 0;

    const hasLab = [
      data.hba1c, data.colesterol_total, data.colesterol_ldl,
      data.colesterol_hdl, data.trigliceridos, data.bun, data.creatinina,
    ].some(v => v !== null && v !== undefined)
      || data.ego_proteinas !== null
      || data.ego_glucosa !== null;

    const hasHeight = data.altura !== null && data.altura !== undefined;

    if (!hasDaily && !hasGlucose && !hasLab && !hasHeight) {
      toast.error("Completa al menos un campo antes de guardar.");
      return;
    }

    try {
      const submitting: Promise<unknown>[] = [];

      if (hasDaily || hasGlucose) {
        submitting.push(submitDailyRecord({
          recordDate:        data.fecha,
          recordTime:        null,
          systolicPressure:  data.presion_sistolica as number | null,
          diastolicPressure: data.presion_diastolica as number | null,
          heartRate:         data.frecuencia_cardiaca as number | null,
          weightKg:          data.peso as number | null,
          waistCm:           data.cintura as number | null,
          notes:             data.notas as string | null,
          glucoseReadings:   hasGlucose
            ? data.glucoseReadings.map(g => ({
                readingType: g.readingType as GlucoseReadingType,
                valueMgDl:   g.valueMgDl,
                time:        g.time ?? null,
                foods:       g.foods ?? null,
              }))
            : null,
        }));
      }

      if (hasLab) {
        submitting.push(submitLabRecord({
          sampleDate:      data.fecha,
          hba1c:           data.hba1c as number | null,
          totalCholesterol: data.colesterol_total as number | null,
          ldl:             data.colesterol_ldl as number | null,
          hdl:             data.colesterol_hdl as number | null,
          triglycerides:   data.trigliceridos as number | null,
          bun:             data.bun as number | null,
          creatinine:      data.creatinina as number | null,
          egoProteins:     data.ego_proteinas as string | null,
          egoGlucose:      data.ego_glucosa as string | null,
          notes:           (!hasDaily && !hasGlucose) ? (data.notas as string | null) : null,
        }));
      }

      const profilePatch: { isPregnant?: boolean; heightCm?: number } = {};
      if (hasHeight) profilePatch.heightCm = data.altura as number;
      if (data.embarazada !== undefined && data.embarazada !== profile?.isPregnant) profilePatch.isPregnant = data.embarazada;
      if (Object.keys(profilePatch).length > 0) {
        submitting.push(submitProfilePatch(profilePatch));
      }

      await Promise.all(submitting);
      toast.success("¡Registro médico guardado exitosamente!");
      router.push("/paciente/dashboard");
    } catch {
      toast.error("Error al guardar el registro. Intenta de nuevo.");
    }
  };

  if (loadingProfile) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <GooeyLoader />
      </div>
    );
  }

  const isFemale = profile?.gender === 'Female';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h2 className="text-3xl font-display font-bold text-foreground">Registro Diario de Salud</h2>
        <p className="text-muted-foreground mt-1">Completa únicamente las secciones donde tengas medidas recientes hoy.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {errors.root && (
          <div className="bg-destructive/15 text-destructive text-sm p-4 rounded-lg flex items-center">
            <AlertCircle className="size-4 mr-2" />
            {errors.root.message}
          </div>
        )}

        {/* 1. Fecha */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha del registro <span className="text-destructive">*</span></Label>
              <Input id="fecha" type="date" className="w-full sm:w-auto" {...register("fecha")} />
              {errors.fecha && <p className="text-sm text-destructive">{errors.fecha.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* 2. Glucosa */}
        <Card className="border-blue-200">
          <CardHeader className="bg-blue-50/50 pb-4">
            <CardTitle className="text-blue-700">Monitoreo de glucosa</CardTitle>
            <CardDescription>Puede registrar múltiples mediciones por día</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-lg bg-muted/20 relative">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-sm text-muted-foreground">Medición #{index + 1}</h4>
                  <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} className="text-destructive hover:text-destructive h-8">
                    <Trash2 className="size-4 mr-1" /> Eliminar
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tiempo de comida <span className="text-destructive">*</span></Label>
                    <Controller
                      control={control}
                      name={`glucoseReadings.${index}.readingType`}
                      render={({ field }) => (
                        <MealTimeSelector
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Glucosa (mg/dL) <span className="text-destructive">*</span></Label>
                      <Input type="number" step="1" placeholder="ej: 120" {...register(`glucoseReadings.${index}.valueMgDl`)} />
                      {errors.glucoseReadings?.[index]?.valueMgDl && (
                        <p className="text-xs text-destructive">{errors.glucoseReadings[index]?.valueMgDl?.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Hora</Label>
                      <Input type="time" {...register(`glucoseReadings.${index}.time`)} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Alimentos consumidos</Label>
                    <textarea
                      className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Ej: 2 tortillas con frijoles, 1 vaso de leche..."
                      {...register(`glucoseReadings.${index}.foods`)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed"
              onClick={() => append({ readingType: GlucoseReadingType.Fasting, valueMgDl: undefined as any, time: "", foods: "" })}
            >
              <Plus className="size-4 mr-2" /> Añadir medición de glucosa
            </Button>
          </CardContent>
        </Card>

        {/* 3. Presión y Antropometría */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Presión arterial</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sistólica (mmHg)</Label>
                  <Input type="number" placeholder="<130" {...register("presion_sistolica")} />
                  {errors.presion_sistolica && <p className="text-xs text-destructive">{errors.presion_sistolica.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Diastólica (mmHg)</Label>
                  <Input type="number" placeholder="<80" {...register("presion_diastolica")} />
                  {errors.presion_diastolica && <p className="text-xs text-destructive">{errors.presion_diastolica.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Frecuencia cardiaca (lpm)</Label>
                <Input type="number" placeholder="60-100" {...register("frecuencia_cardiaca")} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Antropometría</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Peso (kg)</Label>
                <Input type="number" step="0.1" placeholder="ej: 72.5" {...register("peso")} />
                {errors.peso && <p className="text-xs text-destructive">{errors.peso.message}</p>}
                {prefilled.peso && !dirtyFields.peso && (
                  <p className="text-xs text-muted-foreground">Pre-completado con tu primer registro de hoy. Edita el campo para cambiarlo.</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Cintura (cm)</Label>
                <Input type="number" placeholder="ej: 88" {...register("cintura")} />
                {prefilled.cintura && !dirtyFields.cintura && (
                  <p className="text-xs text-muted-foreground">Pre-completado con tu primer registro de hoy. Edita el campo para cambiarlo.</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Altura (cm)</Label>
                <Input type="number" placeholder="ej: 170" {...register("altura")} />
                {errors.altura && <p className="text-xs text-destructive">{errors.altura.message}</p>}
                {profile?.heightCm != null && !dirtyFields.altura && (
                  <p className="text-xs text-muted-foreground">Tomado de tu perfil médico. Edita para actualizar tu estatura.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 4. Laboratorio */}
        <Card>
          <CardHeader>
            <CardTitle>Laboratorio</CardTitle>
            <CardDescription>Solo si tiene resultados disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>HbA1c (%)</Label>
                <Input type="number" step="0.1" placeholder="ej: 7.2" {...register("hba1c")} />
              </div>
              <div className="space-y-2">
                <Label>Colesterol Total (mg/dL)</Label>
                <Input type="number" placeholder="<200" {...register("colesterol_total")} />
              </div>
              <div className="space-y-2">
                <Label>Colesterol LDL (mg/dL)</Label>
                <Input type="number" placeholder="<100" {...register("colesterol_ldl")} />
              </div>
              <div className="space-y-2">
                <Label>Colesterol HDL (mg/dL)</Label>
                <Input type="number" placeholder=">40" {...register("colesterol_hdl")} />
              </div>
              <div className="space-y-2">
                <Label>Triglicéridos (mg/dL)</Label>
                <Input type="number" placeholder="<150" {...register("trigliceridos")} />
              </div>
              <div className="space-y-2">
                <Label>BUN (mg/dL)</Label>
                <Input type="number" placeholder="7-20" {...register("bun")} />
              </div>
              <div className="space-y-2">
                <Label>Creatinina (mg/dL)</Label>
                <Input type="number" step="0.01" placeholder="0.6-1.2" {...register("creatinina")} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 5. EGO & Notas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>EGO — Examen General de Orina</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Proteínas en orina</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  {...register("ego_proteinas")}
                >
                  <option value="">Seleccione...</option>
                  <option value="negativo">Negativo</option>
                  <option value="trazas">Trazas</option>
                  <option value="1+">1+</option>
                  <option value="2+">2+</option>
                  <option value="3+">3+</option>
                  <option value="4+">4+</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Glucosa en orina</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  {...register("ego_glucosa")}
                >
                  <option value="">Seleccione...</option>
                  <option value="0">0 mg/dL (Negativo)</option>
                  <option value="500">500 mg/dL</option>
                  <option value="1000">1000 mg/dL</option>
                  <option value=">1000">&gt;1000 mg/dL</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Notas</CardTitle></CardHeader>
              <CardContent>
                <textarea
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Síntomas, actividad física, qué comió, ajustes de medicamento..."
                  {...register("notas")}
                />
              </CardContent>
            </Card>

            {isFemale && (
              <Card className="border-rose-200">
                <CardHeader className="bg-rose-50/50 pb-4">
                  <CardTitle className="text-rose-700">Flags clínicos</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="embarazada"
                      className="size-4 rounded border-gray-300 text-rose-600 focus:ring-rose-600"
                      {...register("embarazada")}
                    />
                    <Label htmlFor="embarazada" className="font-medium cursor-pointer">Paciente embarazada</Label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Ajusta metas glucémicas a guías ADA 2026 para embarazo. Este ajuste se guardará en tu perfil.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-background/80 backdrop-blur-md p-4 border-t border-border flex justify-end mt-8 z-10 -mx-4 sm:mx-0 sm:rounded-b-lg">
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
