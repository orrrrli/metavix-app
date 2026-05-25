"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { useAuthStore } from "@/features/auth/store";
import { usePatientResumen } from "@/features/patient/hooks/use-patient-resumen";
import { useDailyRecords } from "@/features/patient/hooks/use-daily-records";
import { useLabRecords } from "@/features/patient/hooks/use-lab-records";
import { DailyRecordResponse, GlucoseReadingType } from "@/types/daily-record";
import { LabRecordResponse } from "@/types/lab-record";
import { HealthRecordDto, GlucoseReading, DiabetesType } from "@/features/patient/types";
import { CHART_DEFINITIONS, getStatus } from "@/features/patient/chart-config";
import { MiniChartCard } from "@/shared/components/charts/MiniChartCard";
import { GooeyLoader } from "@/shared/components/ui/gooey-loader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";

function parseDDMMYYYY(dateStr: string): Date {
  const [day, month, year] = dateStr.split('/');
  return new Date(Number(year), Number(month) - 1, Number(day));
}

function mapReadingTypeToTipo(type: GlucoseReadingType): string {
  switch (type) {
    case GlucoseReadingType.Fasting:       return 'ayuno';
    case GlucoseReadingType.PostBreakfast: return 'despues_desayuno';
    case GlucoseReadingType.PreLunch:      return 'antes_comida';
    case GlucoseReadingType.PostLunch:     return 'despues_comida';
    case GlucoseReadingType.PreDinner:     return 'antes_cena';
    case GlucoseReadingType.PostDinner:    return 'despues_cena';
    case GlucoseReadingType.Snack:         return 'despues_colacion';
    case GlucoseReadingType.Overnight:     return 'madrugada';
    default:                               return 'ayuno';
  }
}

function mapDiabetesType(apiType: string): DiabetesType {
  switch (apiType) {
    case 'tipo_1':      return 'Tipo 1';
    case 'tipo_2':      return 'Tipo 2';
    case 'prediabetes': return 'Prediabetes';
    default:            return 'Ninguna';
  }
}

function mapDailyToRecord(r: DailyRecordResponse): HealthRecordDto {
  return {
    id: r.id,
    patientId: r.patientId,
    timestamp: parseDDMMYYYY(r.recordDate).toISOString(),
    glucosas_comidas: r.glucoseReadings.map((g): GlucoseReading => ({
      tipo: mapReadingTypeToTipo(g.readingType),
      valor: g.valueMgDl,
      hora: g.time,
      alimentos: g.foods,
    })),
    presion_sistolica: r.systolicPressure,
    presion_diastolica: r.diastolicPressure,
    frecuencia_cardiaca: r.heartRate,
    peso: r.weightKg !== null ? Number(r.weightKg) : null,
    cintura: r.waistCm,
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
    timestamp: parseDDMMYYYY(r.sampleDate).toISOString(),
    glucosas_comidas: [],
    presion_sistolica: null,
    presion_diastolica: null,
    frecuencia_cardiaca: null,
    peso: null,
    cintura: null,
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

export default function PatientDashboard() {
  const { patientId, fullName } = useAuthStore();
  const firstName = fullName?.split(' ')[0] ?? 'Paciente';

  const {
    data: resumen,
    isLoading: loadingResumen,
    isError: errorResumen,
  } = usePatientResumen(patientId ?? '');

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

  const allRecords = useMemo<HealthRecordDto[]>(() => {
    const daily = (dailyRecords ?? []).map(mapDailyToRecord);
    const lab = (labRecords ?? []).map(mapLabToRecord);
    return [...daily, ...lab].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [dailyRecords, labRecords]);

  const diabetesType = mapDiabetesType(resumen?.perfil.tipoDiabetes ?? 'none');
  const hasDiabetes = diabetesType !== 'Ninguna';

  // Most recent daily record that has glucose readings
  const todayRecord = useMemo(
    () => (dailyRecords ?? []).find(r => r.glucoseReadings.length > 0),
    [dailyRecords]
  );
  const todayReadings = todayRecord?.glucoseReadings ?? [];
  const todayValues = todayReadings.map(g => g.valueMgDl);
  const todayAvg = todayValues.length > 0 ? Math.round(todayValues.reduce((a, b) => a + b, 0) / todayValues.length) : null;
  const todayMax = todayValues.length > 0 ? Math.max(...todayValues) : null;
  const todayMin = todayValues.length > 0 ? Math.min(...todayValues) : null;

  const supAyuno = hasDiabetes ? 130 : 100;
  const supPost  = hasDiabetes ? 180 : 140;
  const infMin   = hasDiabetes ? 80 : 70;
  const enMeta = todayReadings.filter(g => {
    const isPost = g.readingType === GlucoseReadingType.PostBreakfast ||
                   g.readingType === GlucoseReadingType.PostLunch ||
                   g.readingType === GlucoseReadingType.PostDinner;
    const lim = isPost ? supPost : supAyuno;
    return g.valueMgDl <= lim && g.valueMgDl >= infMin;
  }).length;

  if (loadingResumen || loadingDaily || loadingLab) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <GooeyLoader />
      </div>
    );
  }

  if (errorResumen || errorDaily || errorLab) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-destructive text-sm">Error al cargar el dashboard. Intenta de nuevo.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight text-foreground">
            Bienvenido(a), {firstName}
          </h2>
          <p className="text-muted-foreground">Aquí está tu resumen clínico del día de hoy.</p>
        </div>
        <Link href="/paciente/nuevo-registro">
          <Button size="lg" className="shadow-sm">Registrar Nueva Lectura</Button>
        </Link>
      </div>

      {/* Glucose Curves of the Day */}
      <Card className="shadow-sm border-primary/20 bg-primary/[0.02]">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle>Curvas de glucosa del día</CardTitle>
            <CardDescription>
              {todayRecord
                ? format(parseDDMMYYYY(todayRecord.recordDate), "EEEE, d 'de' MMMM", { locale: es })
                : "Sin registros hoy"}
            </CardDescription>
          </div>
          <Link href="/paciente/herramientas/curvas-glucosa">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              Ver gráfica completa <ArrowRight className="size-4 ml-2" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {todayValues.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div className="text-center p-3 bg-background rounded-lg border">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Mediciones</p>
                <p className="text-2xl font-bold text-primary mt-1">{todayValues.length}</p>
              </div>
              <div className="text-center p-3 bg-background rounded-lg border">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Promedio</p>
                <p className="text-2xl font-bold mt-1">{todayAvg} <span className="text-xs font-normal">mg/dL</span></p>
              </div>
              <div className="text-center p-3 bg-background rounded-lg border">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Máxima</p>
                <p className="text-2xl font-bold text-destructive mt-1">{todayMax}</p>
              </div>
              <div className="text-center p-3 bg-background rounded-lg border">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Mínima</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{todayMin}</p>
              </div>
              <div className="text-center p-3 bg-background rounded-lg border">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">En meta</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{enMeta}/{todayValues.length}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No hay mediciones de glucosa recientes.{" "}
              <Link href="/paciente/nuevo-registro" className="text-primary underline">Registrar ahora</Link>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Clinical Indicator Mini Charts */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Indicadores clínicos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CHART_DEFINITIONS.map(config => (
            <MiniChartCard
              key={config.id}
              config={config}
              records={allRecords}
              diabetesType={diabetesType}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
