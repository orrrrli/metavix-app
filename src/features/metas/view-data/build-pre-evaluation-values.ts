import { GlucoseReadingType } from "@/types/daily-record";
import type { DailyRecordResponse } from "@/types/daily-record";
import type { LabRecordResponse } from "@/types/lab-record";
import type { PatientProfileResponse } from "@/types/patient-profile";
import { parseDailyDate } from "@/features/patient/utils/parse-api-date";

export interface PreEvaluationInput {
  labRecords: LabRecordResponse[];
  dailyRecords: DailyRecordResponse[];
  profile: PatientProfileResponse | null;
}

export interface PreEvaluationResult {
  /** Valores pre-poblados por `parameterId` (mismas keys que `PARAMETROS_META`). */
  valores: Record<string, string>;
  /** Creatinina del lab previo al más reciente, para la nota de "aumento ≤ 30%".
   *  null si hay menos de dos labs con creatinina. */
  previousCreatinine: number | null;
}

/**
 * Deriva los valores pre-poblados de la pantalla Metas a partir de los últimos
 * registros. Extraído de `MetasControl` (T3–T5). Puro: no toca la red ni el
 * estado. Sólo 5 parámetros vienen pre-poblados hoy; el resto queda "" hasta
 * evaluar.
 */
export function buildPreEvaluationValues(
  input: PreEvaluationInput,
): PreEvaluationResult {
  const sortedDailyRecords = input.dailyRecords
    .map((r) => ({ r, date: parseDailyDate(r.recordDate) }))
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map(({ r }) => r);

  let fastingGlucose: number | null = null;
  for (const record of sortedDailyRecords) {
    const reading = record.glucoseReadings.find(
      (r) => r.readingType === GlucoseReadingType.Fasting,
    );
    if (reading) {
      fastingGlucose = reading.valueMgDl;
      break;
    }
  }

  const latestWeightKg =
    sortedDailyRecords.find((r) => r.weightKg !== null)?.weightKg ?? null;
  const heightCm = input.profile?.heightCm ?? null;
  const imc =
    latestWeightKg !== null && heightCm !== null
      ? latestWeightKg / Math.pow(heightCm / 100, 2)
      : null;

  const latestSBP =
    sortedDailyRecords.find((r) => r.systolicPressure !== null)
      ?.systolicPressure ?? null;

  const sortedLabRecords = input.labRecords
    .map((r) => ({ r, date: parseDailyDate(r.sampleDate) }))
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map(({ r }) => r);

  const creatinineLabs = sortedLabRecords.filter((r) => r.creatinine !== null);
  const previousCreatinine = creatinineLabs[1]?.creatinine ?? null;

  const valores: Record<string, string> = {
    hba1c: sortedLabRecords.find((r) => r.hba1c !== null)?.hba1c?.toString() ?? "",
    fasting_glucose: fastingGlucose?.toString() ?? "",
    systolic_bp: latestSBP?.toString() ?? "",
    diastolic_bp:
      sortedDailyRecords.find((r) => r.diastolicPressure !== null)
        ?.diastolicPressure?.toString() ?? "",
    heart_rate:
      sortedDailyRecords.find((r) => r.heartRate !== null)?.heartRate?.toString() ??
      "",
    waist_circumference:
      sortedDailyRecords.find((r) => r.waistCm !== null)?.waistCm?.toString() ?? "",
    ldl_primary:
      sortedLabRecords.find((r) => r.ldl !== null)?.ldl?.toString() ?? "",
    hdl: sortedLabRecords.find((r) => r.hdl !== null)?.hdl?.toString() ?? "",
    total_cholesterol:
      sortedLabRecords.find((r) => r.totalCholesterol !== null)
        ?.totalCholesterol?.toString() ?? "",
    triglycerides:
      sortedLabRecords.find((r) => r.triglycerides !== null)
        ?.triglycerides?.toString() ?? "",
    creatinine:
      sortedLabRecords.find((r) => r.creatinine !== null)?.creatinine?.toString() ??
      "",
    bun: sortedLabRecords.find((r) => r.bun !== null)?.bun?.toString() ?? "",
    bmi: imc !== null ? imc.toFixed(1) : "",
  };

  return { valores, previousCreatinine };
}
