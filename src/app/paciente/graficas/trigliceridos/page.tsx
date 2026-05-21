"use client";

import { usePatientData } from "@/features/patient/hooks/use-patient-data";
import { CHART_DEFINITIONS } from "@/features/patient/chart-config";
import { FullChartPage } from "@/shared/components/charts/FullChartPage";

export default function ChartPage() {
  const { records: patientRecords, profile: patient } = usePatientData();

  const config = CHART_DEFINITIONS.find(c => c.id === 'trigliceridos')!;

  if (!patient) return null;

  return <FullChartPage config={config} records={patientRecords} diabetesType={patient.diabetesType} />;
}
