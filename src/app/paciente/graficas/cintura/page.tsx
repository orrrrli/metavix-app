"use client";

import { useChartPatientData } from "@/features/patient/hooks/use-chart-patient-data";
import { CHART_DEFINITIONS } from "@/features/patient/chart-config";
import { FullChartPage } from "@/shared/components/charts/FullChartPage";

export default function ChartPage() {
  const { records, diabetesType, gender, isLoading } = useChartPatientData();
  const config = CHART_DEFINITIONS.find(c => c.id === 'cintura')!;

  if (isLoading) return null;

  return <FullChartPage config={config} records={records} diabetesType={diabetesType} gender={gender} />;
}
