"use client";

import { useMemo, useState } from "react";
import { useAuthStore } from "@/features/auth/store";
import { usePatientProfile, useUpdatePatientProfile } from "@/features/patient/hooks/use-patient-profile";
import { useDailyRecords, useCreateDailyRecord } from "@/features/patient/hooks/use-daily-records";
import { FormularioIMC } from "../FormularioIMC";
import { ResultadoIMC } from "../ResultadoIMC";
import { HistorialIMC, ImcEntry } from "../HistorialIMC";
import { TablaReferenciaIMC } from "../TablaReferenciaIMC";
import { toast } from "sonner";

function getCategoria(imc: number): string {
  if (imc < 18.5) return "Bajo peso";
  if (imc < 25.0) return "Normal";
  if (imc < 30.0) return "Sobrepeso";
  if (imc < 35.0) return "Obesidad grado I";
  if (imc < 40.0) return "Obesidad grado II";
  return "Obesidad grado III";
}

export function BmiCalculator() {
  const { patientId } = useAuthStore();

  const { data: profile } = usePatientProfile(patientId ?? "");
  const { data: dailyRecords = [] } = useDailyRecords(patientId ?? "");
  const { mutate: createRecord, isPending: isSaving } = useCreateDailyRecord(patientId ?? "");
  const { mutate: updateProfile } = useUpdatePatientProfile(patientId ?? "");

  const [currentImc, setCurrentImc] = useState<number | null>(null);
  const [currentCat, setCurrentCat] = useState<string | null>(null);

  const latestWeight = useMemo(() => {
    const withWeight = dailyRecords.filter(r => r.weightKg !== null);
    return withWeight.length > 0 ? withWeight[0].weightKg ?? undefined : undefined;
  }, [dailyRecords]);

  const latestWaist = useMemo(() => {
    const withWaist = dailyRecords.filter(r => r.waistCm !== null);
    return withWaist.length > 0 ? withWaist[0].waistCm ?? undefined : undefined;
  }, [dailyRecords]);

  // Build IMC history from daily records that have weight, using profile height
  const historial: ImcEntry[] = useMemo(() => {
    const heightCm = profile?.heightCm;
    if (!heightCm) return [];
    return dailyRecords
      .filter(r => r.weightKg !== null)
      .map(r => {
        const imc = r.weightKg! / Math.pow(heightCm / 100, 2);
        return {
          id: r.id,
          fecha: r.recordDate,
          peso_kg: r.weightKg!,
          estatura_cm: heightCm,
          imc: Math.round(imc * 10) / 10,
          categoria: getCategoria(imc),
          cintura_cm: r.waistCm ?? null,
        };
      });
  }, [dailyRecords, profile?.heightCm]);

  const handleCalcular = async (peso_kg: number, estatura_cm: number, cintura: number | null): Promise<void> => {
    const imc = peso_kg / Math.pow(estatura_cm / 100, 2);
    const imcRedondeado = Math.round(imc * 10) / 10;
    setCurrentImc(imcRedondeado);
    setCurrentCat(getCategoria(imc));

    // Save weight (and optionally cintura) as daily record
    createRecord(
      {
        recordDate: new Date().toISOString().split("T")[0],
        recordTime: null,
        systolicPressure: null,
        diastolicPressure: null,
        heartRate: null,
        weightKg: peso_kg,
        waistCm: cintura,
        notes: null,
        glucoseReadings: null,
      },
      {
        onSuccess: () => toast.success("Medición guardada correctamente"),
        onError: () => toast.error("Error al guardar la medición"),
      }
    );

    // If height changed, update the profile
    if (profile?.heightCm !== estatura_cm) {
      updateProfile({ heightCm: estatura_cm });
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-8">
          <FormularioIMC
            onCalcular={handleCalcular}
            loading={isSaving}
            initialPeso={latestWeight}
            initialEstatura={profile?.heightCm ?? undefined}
            latestCintura={latestWaist ?? undefined}
          />
        </div>
        <div>
          <ResultadoIMC imc={currentImc} categoria={currentCat} />
        </div>
      </div>

      <HistorialIMC historial={historial} />

      <TablaReferenciaIMC />
    </div>
  );
}
