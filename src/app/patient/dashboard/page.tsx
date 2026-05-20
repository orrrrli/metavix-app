"use client";

import { useEffect, useState, useMemo } from "react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { useAuthStore } from "@/features/auth/store";
import { useMockDb } from "@/features/mock-db/store";
import { HealthRecordDto, GlucoseReading } from "@/features/patient/types";
import { CHART_DEFINITIONS, getStatus, extractMetricValue } from "@/features/patient/chart-config";
import { MiniChartCard } from "@/shared/components/charts/MiniChartCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";

export default function PatientDashboard() {
  const { userId } = useAuthStore();
  const { records, patients } = useMockDb();
  
  const [patientRecords, setPatientRecords] = useState<HealthRecordDto[]>([]);
  const [patientProfile, setPatientProfile] = useState<any>(null);

  useEffect(() => {
    if (userId) {
      const filtered = records.filter(r => r.patientId === userId).sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setPatientRecords(filtered);
      
      const profile = patients.find(p => p.id === userId);
      setPatientProfile(profile);
    }
  }, [userId, records, patients]);

  if (!patientProfile) return null;

  // --- Glucose Curves of the Day (special card) ---
  const todayRecord = patientRecords[0]; // most recent
  const todayReadings = todayRecord?.glucosas_comidas || [];
  const todayValues = todayReadings.map(g => g.valor);
  const todayAvg = todayValues.length > 0 ? Math.round(todayValues.reduce((a, b) => a + b, 0) / todayValues.length) : null;
  const todayMax = todayValues.length > 0 ? Math.max(...todayValues) : null;
  const todayMin = todayValues.length > 0 ? Math.min(...todayValues) : null;

  const hasDiabetes = patientProfile.diabetesType !== 'Ninguna';
  const supAyuno = hasDiabetes ? 130 : 100;
  const supPost = hasDiabetes ? 180 : 140;
  const infMin = hasDiabetes ? 80 : 70;
  const enMeta = todayReadings.filter((g: GlucoseReading) => {
    const isPost = g.tipo.includes("despues");
    const lim = isPost ? supPost : supAyuno;
    return g.valor <= lim && g.valor >= infMin;
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight text-foreground">Bienvenido(a), {patientProfile.firstName}</h2>
          <p className="text-muted-foreground">Aquí está tu resumen clínico del día de hoy.</p>
        </div>
        <Link href="/patient/new-record">
          <Button size="lg" className="shadow-sm">Registrar Nueva Lectura</Button>
        </Link>
      </div>

      {/* Glucose Curves of the Day (Special Card) */}
      <Card className="shadow-sm border-primary/20 bg-primary/[0.02]">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle>Curvas de glucosa del día</CardTitle>
            <CardDescription>
              {todayRecord ? format(parseISO(todayRecord.timestamp), "EEEE, d 'de' MMMM", { locale: es }) : "Sin registros hoy"}
            </CardDescription>
          </div>
          <Link href="/patient/tools/glucose-curves">
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
            <p className="text-sm text-muted-foreground py-4 text-center">No hay mediciones de glucosa recientes. <Link href="/patient/new-record" className="text-primary underline">Registrar ahora</Link></p>
          )}
        </CardContent>
      </Card>

      {/* Mini Chart Cards Grid */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Indicadores clínicos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CHART_DEFINITIONS.map(config => (
            <MiniChartCard
              key={config.id}
              config={config}
              records={patientRecords}
              diabetesType={patientProfile.diabetesType}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
