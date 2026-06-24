"use client";

import { useMemo } from "react";
import { useAuthStore } from "@/features/auth/store";
import { TablaHistorial } from "@/features/historial/components/TablaHistorial";
import { Registro } from "@/features/historial/components/FilaRegistro";
import { TipoDiabetes } from "@/features/historial/utils/semaforo";
import { GooeyLoader } from "@/shared/components/ui/gooey-loader";
import { useDailyRecords } from "@/features/patient/hooks/use-daily-records";
import { useLabRecords } from "@/features/patient/hooks/use-lab-records";
import { DailyRecordResponse, GlucoseReadingType } from "@/types/daily-record";
import { LabRecordResponse } from "@/types/lab-record";

const tipoDiabetes: TipoDiabetes = 'dm2';

const READING_TYPE_TO_TIPO: Record<GlucoseReadingType, string> = {
  [GlucoseReadingType.Fasting]:       'ayuno',
  [GlucoseReadingType.PostBreakfast]: 'despues_desayuno',
  [GlucoseReadingType.PreLunch]:      'antes_comida',
  [GlucoseReadingType.PostLunch]:     'despues_comida',
  [GlucoseReadingType.PreDinner]:     'antes_cena',
  [GlucoseReadingType.PostDinner]:    'despues_cena',
  [GlucoseReadingType.Snack]:         'antes_colacion',
  [GlucoseReadingType.Overnight]:     'madrugada',
};

function parseDailyDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('/');
  return new Date(Number(year), Number(month) - 1, Number(day));
}

function mapDailyToRegistro(r: DailyRecordResponse): Registro {
  const fasting = r.glucoseReadings.find(g => g.readingType === GlucoseReadingType.Fasting);
  const meals = r.glucoseReadings
    .filter(g => g.readingType !== GlucoseReadingType.Fasting)
    .map(g => ({
      tipo: READING_TYPE_TO_TIPO[g.readingType] ?? String(g.readingType),
      valor: g.valueMgDl,
      hora: g.time ?? '',
      alimentos: g.foods ?? '',
    }));

  return {
    id: r.id,
    fecha: r.recordDate,
    glucosa_ayuno: fasting?.valueMgDl,
    glucosas_comidas: meals.length > 0 ? meals : undefined,
    presion_sistolica: r.systolicPressure ?? undefined,
    presion_diastolica: r.diastolicPressure ?? undefined,
    frecuencia_cardiaca: r.heartRate ?? undefined,
    peso: r.weightKg ?? undefined,
    cintura: r.waistCm ?? undefined,
    notas: r.notes ?? undefined,
  };
}

function mapLabToRegistro(r: LabRecordResponse): Registro {
  return {
    id: r.id,
    fecha: r.sampleDate,
    hba1c: r.hba1c ?? undefined,
    colesterol_total: r.totalCholesterol ?? undefined,
    colesterol_ldl: r.ldl ?? undefined,
    colesterol_hdl: r.hdl ?? undefined,
    trigliceridos: r.triglycerides ?? undefined,
    bun: r.bun ?? undefined,
    creatinina: r.creatinine ?? undefined,
    ego_proteinas: r.egoProteins ?? undefined,
    ego_glucosa: r.egoGlucose ?? undefined,
    notas: r.notes ?? undefined,
  };
}

export default function HistorialPage() {
  const { patientId } = useAuthStore();

  const {
    data: dailyRecords,
    isLoading: loadingDaily,
    isError: errorDaily,
  } = useDailyRecords(patientId ?? '');

  const {
    data: labRecords,
    isLoading: loadingLab,
    isError: errorLab,
  } = useLabRecords(patientId ?? '');

  const registros = useMemo<Registro[]>(() => {
    const daily = (dailyRecords ?? []).map(mapDailyToRegistro);
    const lab = (labRecords ?? []).map(mapLabToRegistro);

    return [...daily, ...lab].sort(
      (a, b) => parseDailyDate(b.fecha).getTime() - parseDailyDate(a.fecha).getTime()
    );
  }, [dailyRecords, labRecords]);

  if (loadingDaily || loadingLab) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <GooeyLoader />
      </div>
    );
  }

  if (errorDaily || errorLab) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-destructive text-sm">Error al cargar el historial. Intenta de nuevo.</p>
      </div>
    );
  }

  if (registros.length === 0) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <h2 className="text-3xl font-display font-bold text-foreground">Mi Historial</h2>
          <p className="text-muted-foreground mt-1">Visualiza todos tus registros diarios y monitorea tus metas.</p>
        </div>
        <p className="text-muted-foreground text-sm text-center py-12">Aún no tienes registros. Comienza registrando tu primera lectura.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-3xl font-display font-bold text-foreground">Mi Historial</h2>
        <p className="text-muted-foreground mt-1">
          Visualiza todos tus registros diarios y monitorea tus metas.
        </p>
      </div>

      <TablaHistorial registros={registros} tipoDiabetes={tipoDiabetes} />
    </div>
  );
}
