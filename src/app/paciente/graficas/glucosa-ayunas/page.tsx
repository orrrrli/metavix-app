"use client";

import { CHART_DEFINITIONS } from "@/features/patient/chart-config";
import { usePatientAllRecords } from "@/features/patient/hooks/use-patient-records";
import { FullChartPage } from "@/shared/components/charts/FullChartPage";

export default function ChartPage() {
  const { records, diabetesType, isLoading } = usePatientAllRecords();

  const config = CHART_DEFINITIONS.find((c) => c.id === "glucosa_ayuno")!;

  if (isLoading) {
    return (
      <div className="h-40 flex items-center justify-center text-muted-foreground">
        Cargando...
      </div>
    );
  }

  return <FullChartPage config={config} records={records} diabetesType={diabetesType} />;
}
