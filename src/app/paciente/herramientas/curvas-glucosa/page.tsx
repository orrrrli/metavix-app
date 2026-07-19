"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { ArrowLeft, TrendingUp } from "lucide-react";
import Link from "next/link";

import { useAuthStore } from "@/features/auth/store";
import { useDailyRecords } from "@/features/patient/hooks/use-daily-records";
import { usePatientProfile } from "@/features/patient/hooks/use-patient-profile";
import { GlucoseReadingType } from "@/types/daily-record";
import { aggregateGlucoseCurvesByDate } from "@/features/patient/utils/glucose-curve-aggregator";
import { rangoPara, evaluar } from "@/features/patient/utils/rangos-glucosa";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";

/** Solo para etiqueta y orden de despliegue — el rango clínico viene de rangos-glucosa.ts (Ayuno vs Postprandial). */
const MEAL_ORDER: Record<string, { label: string; orden: number }> = {
  ayuno:            { label: "En ayuno",         orden: 0 },
  despues_desayuno: { label: "Después desayuno", orden: 1 },
  antes_comida:     { label: "Antes comida",     orden: 2 },
  despues_comida:   { label: "Después comida",   orden: 3 },
  antes_cena:       { label: "Antes cena",       orden: 4 },
  despues_cena:     { label: "Después cena",     orden: 5 },
  despues_colacion: { label: "Colación",         orden: 6 },
  madrugada:        { label: "Madrugada",        orden: 7 },
};

function mapReadingType(rt: GlucoseReadingType): string {
  switch (rt) {
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

function parseDailyDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split("/");
  return new Date(Number(year), Number(month) - 1, Number(day));
}

export default function GlucoseCurvesPage() {
  const { patientId, fullName } = useAuthStore();
  const firstName = (fullName ?? "").split(" ")[0] || fullName;

  const { data: records = [], isLoading } = useDailyRecords(patientId ?? "");
  const { data: profile } = usePatientProfile(patientId ?? "");

  const daysWithData = useMemo(() => {
    return aggregateGlucoseCurvesByDate(records)
      .sort((a, b) => parseDailyDate(b.dateKey).getTime() - parseDailyDate(a.dateKey).getTime())
      .map(({ dateKey, glucoseReadings }) => {
        const date = parseDailyDate(dateKey);
        return {
          date,
          label: format(date, "MMM dd", { locale: es }),
          readings: buildChartData(glucoseReadings),
        };
      });
  }, [records]);

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const selectedDay = daysWithData[selectedDayIndex];
  const chartData = selectedDay?.readings ?? [];

  const diabetesType = profile?.diabetesType ?? "None";
  const hasDiabetes = diabetesType !== "None" && diabetesType !== "none";
  const isPregnant = profile?.isPregnant ?? false;

  // Rangos de referencia (Ayuno / Postprandial) para las líneas del chart —
  // misma fuente de verdad que el wizard/dashboard/historial.
  const rangoAyunoRef = rangoPara(GlucoseReadingType.Fasting, hasDiabetes, isPregnant);
  const rangoPostRef = rangoPara(GlucoseReadingType.PostLunch, hasDiabetes, isPregnant);
  const limits = {
    supAyuno: rangoAyunoRef.sup,
    supPost: rangoPostRef.sup,
    infMin: Math.min(rangoAyunoRef.inf, rangoPostRef.inf),
  };

  const valores = chartData.map(d => d.valor);
  const totalMediciones = valores.length;
  const promedio = totalMediciones > 0 ? Math.round(valores.reduce((a, b) => a + b, 0) / totalMediciones) : null;
  const maximo = totalMediciones > 0 ? Math.max(...valores) : null;
  const minimo = totalMediciones > 0 ? Math.min(...valores) : null;
  const enMeta = chartData.filter(d => {
    const rango = rangoPara(d.readingType, hasDiabetes, isPregnant);
    return evaluar(d.valor, rango).estado === "ok";
  }).length;

  const tooltipStyle = { borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" };

  if (isLoading) {
    return (
      <div className="h-40 flex items-center justify-center text-muted-foreground">
        Cargando registros...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/paciente/dashboard">
          <Button variant="outline" size="icon" className="shrink-0">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-display font-bold text-foreground">Curvas de glucosa del día</h2>
          <p className="text-muted-foreground mt-1">
            {firstName ? `Así se comportó tu glucosa a lo largo del día, ${firstName}, por tiempo de comida.` : "Comportamiento de la glucosa a lo largo de un día, por tiempo de comida"}
          </p>
        </div>
      </div>

      {/* Date selector */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Seleccionar fecha</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {daysWithData.length > 0 ? (
              daysWithData.map((day, idx) => (
                <Button
                  key={idx}
                  variant={idx === selectedDayIndex ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDayIndex(idx)}
                  className="text-xs"
                >
                  {day.label}
                  <Badge variant="secondary" className="ml-2 text-[10px] h-4">{day.readings.length}</Badge>
                </Button>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No hay días con registros de glucosa</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      {selectedDay && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Mediciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{totalMediciones}</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Promedio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{promedio ?? "--"} <span className="text-sm font-normal">mg/dL</span></div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Máxima</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{maximo ?? "--"} <span className="text-sm font-normal">mg/dL</span></div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Mínima</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{minimo ?? "--"} <span className="text-sm font-normal">mg/dL</span></div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">En meta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{enMeta}/{totalMediciones}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chart */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-5 text-primary" />
            Curva de glucosa — {selectedDay ? format(selectedDay.date, "EEEE, d 'de' MMMM yyyy", { locale: es }) : "Sin datos"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 40, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8DFD4" />
                <XAxis dataKey="id" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#6A7B78" }} dy={10} angle={-25} textAnchor="end" tickFormatter={(id) => id.replace(/-\d+$/, "")} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6A7B78" }} dx={-10}
                  domain={[
                    Math.min(limits.infMin - 10, (minimo ?? 70) - 10),
                    Math.max(limits.supPost + 20, (maximo ?? 180) + 20),
                  ]}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div style={{ ...tooltipStyle, backgroundColor: 'white' }} className="text-sm px-3 py-2">
                        <p className="font-semibold">{d.hora ? `${d.label}, ${d.hora}` : d.label}</p>
                        <p className="mt-1">{d.valor} mg/dL</p>
                        <div className="mt-2 pt-2 border-t text-muted-foreground text-xs">
                          <p>Promedio día: {promedio} mg/dL</p>
                          <p>Mín: {minimo} / Máx: {maximo}</p>
                          <p>Mediciones: {totalMediciones}</p>
                        </div>
                      </div>
                    );
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: "20px" }} />
                <Line type="monotone" name="Glucosa registrada (mg/dL)" dataKey="valor" stroke="#00BFA5" strokeWidth={3} dot={{ r: 5, strokeWidth: 2 }} activeDot={{ r: 7 }} />
                <ReferenceLine y={limits.supPost}  stroke="#EF4444" strokeDasharray="8 4" strokeWidth={2} label={{ value: `Límite post. ${limits.supPost}`,  position: "insideTopRight",    fontSize: 11, fill: "#EF4444" }} />
                <ReferenceLine y={limits.supAyuno} stroke="#F59E0B" strokeDasharray="8 4" strokeWidth={2} label={{ value: `Límite ayuno ${limits.supAyuno}`, position: "insideTopRight",    fontSize: 11, fill: "#F59E0B" }} />
                <ReferenceLine y={limits.infMin}   stroke="#3B82F6" strokeDasharray="8 4" strokeWidth={2} label={{ value: `Mínimo ${limits.infMin}`,         position: "insideBottomRight", fontSize: 11, fill: "#3B82F6" }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Selecciona un día con registros de glucosa
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail table */}
      {chartData.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm">Detalle de mediciones del día</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {chartData.map((d, i) => {
                const ev = evaluar(d.valor, rangoPara(d.readingType, hasDiabetes, isPregnant));
                const dotColor = ev.estado === "bad" ? "#EF4444" : ev.estado === "warn" ? "#F59E0B" : "#10B981";
                return (
                <div key={i} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }} />
                    <div>
                      <p className="font-medium text-sm">{d.label}</p>
                      {d.hora && <p className="text-xs text-muted-foreground">{d.hora} hrs</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{d.valor} <span className="text-xs font-normal text-muted-foreground">mg/dL</span></p>
                    {d.alimentos && <p className="text-xs text-muted-foreground max-w-[200px] truncate">{d.alimentos}</p>}
                  </div>
                </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function buildChartData(readings: import("@/types/daily-record").GlucoseReadingResponse[]) {
  return readings
    .map((g, i) => {
      const tipo = mapReadingType(g.readingType);
      const info = MEAL_ORDER[tipo];
      return {
        id: `${info?.label ?? tipo}-${i}`,
        tipo,
        readingType: g.readingType,
        label:     info?.label    ?? tipo,
        orden:     info?.orden    ?? 99,
        valor:     g.valueMgDl,
        hora:      g.time ?? "",
        alimentos: g.foods ?? "",
      };
    })
    .sort((a, b) => a.orden - b.orden);
}
