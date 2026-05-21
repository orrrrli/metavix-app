"use client";

import { useEffect, useState, useMemo } from "react";
import { format, parseISO, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { ArrowLeft, TrendingUp } from "lucide-react";
import Link from "next/link";

import { usePatientData } from "@/features/patient/hooks/use-patient-data";
import { GlucoseReading, DiabetesType } from "@/features/patient/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";

const MEAL_ORDER = [
  { value: "ayuno", label: "En ayuno", orden: 0, tipo: "preprandial" },
  { value: "antes_desayuno", label: "Antes desayuno", orden: 1, tipo: "preprandial" },
  { value: "despues_desayuno", label: "Después desayuno", orden: 2, tipo: "postprandial" },
  { value: "antes_comida", label: "Antes comida", orden: 3, tipo: "preprandial" },
  { value: "despues_comida", label: "Después comida", orden: 4, tipo: "postprandial" },
  { value: "antes_cena", label: "Antes cena", orden: 5, tipo: "preprandial" },
  { value: "despues_cena", label: "Después cena", orden: 6, tipo: "postprandial" },
  { value: "antes_colacion", label: "Antes colación", orden: 7, tipo: "preprandial" },
  { value: "despues_colacion", label: "Después colación", orden: 8, tipo: "postprandial" },
  { value: "madrugada", label: "Madrugada", orden: 9, tipo: "preprandial" },
];

function getRefLimits(diabetesType: DiabetesType) {
  const hasDiabetes = diabetesType !== 'Ninguna';
  return {
    supAyuno: hasDiabetes ? 130 : 100,
    supPost: hasDiabetes ? 180 : 140,
    infMin: hasDiabetes ? 80 : 70,
  };
}

export default function GlucoseCurvesPage() {
  const { records: patientRecords, profile: patient } = usePatientData();

  // Find unique days that have glucose readings
  const daysWithData = useMemo(() => {
    const days: { date: Date; label: string; readings: GlucoseReading[] }[] = [];
    const seen = new Set<string>();

    [...patientRecords]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .forEach(r => {
        if (r.glucosas_comidas.length > 0) {
          const dateKey = format(parseISO(r.timestamp), "yyyy-MM-dd");
          if (!seen.has(dateKey)) {
            seen.add(dateKey);
            days.push({
              date: parseISO(r.timestamp),
              label: format(parseISO(r.timestamp), "MMM dd", { locale: es }),
              readings: r.glucosas_comidas,
            });
          }
        }
      });

    return days;
  }, [patientRecords]);

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const selectedDay = daysWithData[selectedDayIndex];

  if (!patient) return null;

  const limits = getRefLimits(patient.diabetesType);

  // Build chart data for the selected day
  const chartData = selectedDay
    ? selectedDay.readings
        .map(g => {
          const mealInfo = MEAL_ORDER.find(m => m.value === g.tipo);
          return {
            tipo: g.tipo,
            label: mealInfo?.label || g.tipo,
            orden: mealInfo?.orden ?? 99,
            valor: g.valor,
            hora: g.hora || "",
            alimentos: g.alimentos || "",
            tipoComida: mealInfo?.tipo || "preprandial",
          };
        })
        .sort((a, b) => a.orden - b.orden)
    : [];

  // Stats
  const valores = chartData.map(d => d.valor);
  const totalMediciones = valores.length;
  const promedio = totalMediciones > 0 ? Math.round(valores.reduce((a, b) => a + b, 0) / totalMediciones) : null;
  const maximo = totalMediciones > 0 ? Math.max(...valores) : null;
  const minimo = totalMediciones > 0 ? Math.min(...valores) : null;
  const enMeta = chartData.filter(d => {
    const lim = d.tipoComida === "postprandial" ? limits.supPost : limits.supAyuno;
    return d.valor <= lim && d.valor >= limits.infMin;
  }).length;

  const tooltipStyle = { borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' };

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
          <p className="text-muted-foreground mt-1">Comportamiento de la glucosa a lo largo de un día, por tiempo de comida</p>
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

      {/* KPI Cards for the selected day */}
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
              <div className="text-3xl font-bold text-blue-600">{minimo ?? "--"} <span className="text-sm font-normal">mg/dL</span></div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">En meta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">{enMeta}/{totalMediciones}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Chart */}
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
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#6A7B78" }}
                  dy={10}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6A7B78" }}
                  dx={-10}
                  domain={[
                    Math.min(limits.infMin - 10, (minimo ?? 70) - 10),
                    Math.max(limits.supPost + 20, (maximo ?? 180) + 20),
                  ]}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />

                {/* Data line */}
                <Line
                  type="monotone"
                  name="Glucosa registrada (mg/dL)"
                  dataKey="valor"
                  stroke="#00BFA5"
                  strokeWidth={3}
                  dot={{ r: 5, strokeWidth: 2 }}
                  activeDot={{ r: 7 }}
                />

                {/* Reference lines */}
                <ReferenceLine
                  y={limits.supPost}
                  stroke="#EF4444"
                  strokeDasharray="8 4"
                  strokeWidth={2}
                  label={{ value: `Límite post. ${limits.supPost}`, position: "insideTopRight", fontSize: 11, fill: "#EF4444" }}
                />
                <ReferenceLine
                  y={limits.supAyuno}
                  stroke="#F59E0B"
                  strokeDasharray="8 4"
                  strokeWidth={2}
                  label={{ value: `Límite ayuno ${limits.supAyuno}`, position: "insideTopRight", fontSize: 11, fill: "#F59E0B" }}
                />
                <ReferenceLine
                  y={limits.infMin}
                  stroke="#3B82F6"
                  strokeDasharray="8 4"
                  strokeWidth={2}
                  label={{ value: `Mínimo ${limits.infMin}`, position: "insideBottomRight", fontSize: 11, fill: "#3B82F6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Selecciona un día con registros de glucosa
            </div>
          )}
        </CardContent>
      </Card>

      {/* Meal details table */}
      {chartData.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm">Detalle de mediciones del día</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {chartData.map((d, i) => (
                <div key={i} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.valor > (d.tipoComida === "postprandial" ? limits.supPost : limits.supAyuno) ? "#EF4444" : d.valor < limits.infMin ? "#3B82F6" : "#10B981" }} />
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
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
