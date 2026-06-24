import { useMemo } from "react";
import { useAuthStore } from "@/features/auth/store";
import { useDailyRecords } from "./use-daily-records";
import { useLabRecords } from "./use-lab-records";
import { usePatientProfile } from "./use-patient-profile";
import { HealthRecordDto, GlucoseReading, DiabetesType } from "../types";
import { DailyRecordResponse, GlucoseReadingType } from "@/types/daily-record";
import { LabRecordResponse } from "@/types/lab-record";

function parseDailyDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split("/");
  return new Date(Number(year), Number(month) - 1, Number(day));
}

function mapReadingTypeToTipo(type: GlucoseReadingType): string {
  switch (type) {
    case GlucoseReadingType.Fasting:       return "ayuno";
    case GlucoseReadingType.PostBreakfast: return "despues_desayuno";
    case GlucoseReadingType.PreLunch:      return "antes_comida";
    case GlucoseReadingType.PostLunch:     return "despues_comida";
    case GlucoseReadingType.PreDinner:     return "antes_cena";
    case GlucoseReadingType.PostDinner:    return "despues_cena";
    case GlucoseReadingType.Snack:         return "despues_colacion";
    case GlucoseReadingType.Overnight:     return "madrugada";
    default:                               return "ayuno";
  }
}

function mapDailyToRecord(r: DailyRecordResponse, heightCm: number | null): HealthRecordDto {
  const weightKg = r.weightKg !== null ? Number(r.weightKg) : null;
  const imc =
    weightKg !== null && heightCm !== null
      ? Math.round((weightKg / Math.pow(heightCm / 100, 2)) * 10) / 10
      : null;

  return {
    id: r.id,
    patientId: r.patientId,
    timestamp: parseDailyDate(r.recordDate).toISOString(),
    glucosas_comidas: r.glucoseReadings.map(
      (g): GlucoseReading => ({
        tipo: mapReadingTypeToTipo(g.readingType),
        valor: g.valueMgDl,
        hora: g.time,
        alimentos: g.foods,
      })
    ),
    presion_sistolica: r.systolicPressure,
    presion_diastolica: r.diastolicPressure,
    frecuencia_cardiaca: r.heartRate,
    peso: weightKg,
    cintura: r.waistCm,
    imc,
    hba1c: null,
    colesterol_total: null,
    colesterol_ldl: null,
    colesterol_hdl: null,
    trigliceridos: null,
    bun: null,
    creatinina: null,
    ego_proteinas: null,
    ego_glucosa: null,
    notas: r.notes,
  };
}

function mapLabToRecord(r: LabRecordResponse): HealthRecordDto {
  return {
    id: r.id,
    patientId: r.patientId,
    timestamp: parseDailyDate(r.sampleDate).toISOString(),
    glucosas_comidas: [],
    presion_sistolica: null,
    presion_diastolica: null,
    frecuencia_cardiaca: null,
    peso: null,
    cintura: null,
    imc: null,
    hba1c: r.hba1c !== null ? Number(r.hba1c) : null,
    colesterol_total: r.totalCholesterol !== null ? Number(r.totalCholesterol) : null,
    colesterol_ldl: r.ldl !== null ? Number(r.ldl) : null,
    colesterol_hdl: r.hdl !== null ? Number(r.hdl) : null,
    trigliceridos: r.triglycerides !== null ? Number(r.triglycerides) : null,
    bun: r.bun !== null ? Number(r.bun) : null,
    creatinina: r.creatinine !== null ? Number(r.creatinine) : null,
    ego_proteinas: r.egoProteins,
    ego_glucosa: r.egoGlucose,
    notas: r.notes,
  };
}

function mapDiabetesType(apiType: string): DiabetesType {
  switch (apiType) {
    case "tipo_1":
    case "Type1":
      return "Tipo 1";
    case "tipo_2":
    case "Type2":
      return "Tipo 2";
    case "prediabetes":
    case "Prediabetes":
      return "Prediabetes";
    default:
      return "Ninguna";
  }
}

export function usePatientAllRecords() {
  const { patientId } = useAuthStore();

  const {
    data: profile,
    isLoading: loadingProfile,
  } = usePatientProfile(patientId ?? "");

  const {
    data: dailyRecords,
    isLoading: loadingDaily,
  } = useDailyRecords(patientId ?? "");

  const {
    data: labRecords,
    isLoading: loadingLab,
  } = useLabRecords(patientId ?? "");

  const records = useMemo<HealthRecordDto[]>(() => {
    const heightCm = profile?.heightCm ?? null;
    const daily = (dailyRecords ?? []).map((r) => mapDailyToRecord(r, heightCm));
    const lab = (labRecords ?? []).map(mapLabToRecord);
    return [...daily, ...lab].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [dailyRecords, labRecords, profile?.heightCm]);

  const diabetesType = mapDiabetesType(profile?.diabetesType ?? "none");

  return {
    records,
    diabetesType,
    isLoading: loadingProfile || loadingDaily || loadingLab,
  };
}
