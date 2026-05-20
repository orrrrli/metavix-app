"use client";

import { useAuthStore } from "@/features/auth/store";
import { useMockDb } from "@/features/mock-db/store";
import { CHART_DEFINITIONS } from "@/features/patient/chart-config";
import { FullChartPage } from "@/shared/components/charts/FullChartPage";

export default function ChartPage() {
  const { userId } = useAuthStore();
  const { records, patients } = useMockDb();
  
  const config = CHART_DEFINITIONS.find(c => c.id === 'frecuencia_cardiaca')!;
  const patientRecords = records.filter(r => r.patientId === userId);
  const patient = patients.find(p => p.id === userId);
  
  if (!patient) return null;
  
  return <FullChartPage config={config} records={patientRecords} diabetesType={patient.diabetesType} />;
}
