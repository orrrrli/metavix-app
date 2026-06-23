"use client";

import { usePatientData } from "@/features/patient/hooks/use-patient-data";
import { CHART_DEFINITIONS } from "@/features/patient/chart-config";
import { FullChartPage } from "@/shared/components/charts/FullChartPage";

function normalizeGender(g: string | null | undefined): string | null {
  if (g === 'F') return 'Female';
  if (g === 'M') return 'Male';
  return null;
}

export default function ChartPage() {
  const { records: patientRecords, profile: patient } = usePatientData();

  const config = CHART_DEFINITIONS.find(c => c.id === 'cintura')!;

  if (!patient) return null;

  return (
    <FullChartPage
      config={config}
      records={patientRecords}
      diabetesType={patient.diabetesType}
      gender={normalizeGender(patient.gender)}
    />
  );
}
