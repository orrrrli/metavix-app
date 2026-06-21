"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { ArrowLeft, TrendingUp } from "lucide-react";
import Link from "next/link";

import { useAuthStore } from "@/features/auth/store";
import { useDailyRecordsInRange } from "@/features/patient/hooks/use-daily-records";
import { usePatientProfile } from "@/features/patient/hooks/use-patient-profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";

type RangeKey = "7D" | "1M" | "3M" | "6M";

const RANGE_DAYS: Record<RangeKey, number> = {
  "7D": 7,
  "1M": 30,
  "3M": 90,
  "6M": 180,
};

const RANGE_LABELS: Record<RangeKey, string> = {
  "7D": "7 días",
  "1M": "1 mes",
  "3M": "3 meses",
  "6M": "6 meses",
};

interface BmiDataPoint {
  date: Date;
  label: string;
  bmi: number;
  weightKg: number;
  waistCm: number | null;
}

function parseDDMMYYYY(dateStr: string): Date {
  const [day, month, year] = dateStr.split("/");
  return new Date(Number(year), Number(month) - 1, Number(day));
}

function toISODate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function getBmiCategory(bmi: number): string {
  if (bmi < 18.5) return "Bajo peso";
  if (bmi < 25.0) return "Normal";
  if (bmi < 30.0) return "Sobrepeso";
  if (bmi < 35.0) return "Obesidad grado I";
  if (bmi < 40.0) return "Obesidad grado II";
  return "Obesidad grado III";
}

function getBmiColor(bmi: number): string {
  if (bmi < 18.5) return "#3B82F6";
  if (bmi < 25.0) return "#10B981";
  if (bmi < 30.0) return "#F59E0B";
  return "#EF4444";
}

export default function BmiTrendPage() {
  const { patientId } = useAuthStore();
  const [range, setRange] = useState<RangeKey>("1M");

  const today = new Date();
  const fromDate = new Date(today);
  fromDate.setDate(today.getDate() - RANGE_DAYS[range]);
  const from = toISODate(fromDate);
  const to = toISODate(today);

  const { data: profile, isLoading: profileLoading } = usePatientProfile(patientId ?? "");
  const { data: records = [], isLoading: recordsLoading } = useDailyRecordsInRange(
    patientId ?? "",
    from,
    to,
  );

  const heightCm = profile?.heightCm ?? null;

  const bmiData: BmiDataPoint[] = useMemo(() => {
    if (!heightCm) return [];

    const byDate = new Map<string, (typeof records)[0]>();
    for (const r of records) {
      if (r.weightKg === null) continue;
      const existing = byDate.get(r.recordDate);
      if (!existing || r.createdAt < existing.createdAt) {
        byDate.set(r.recordDate, r);
      }
    }

    return Array.from(byDate.values())
      .map((r) => {
        const date = parseDDMMYYYY(r.recordDate);
        const bmi = r.weightKg! / Math.pow(heightCm / 100, 2);
        return {
          date,
          label: format(date, "dd MMM", { locale: es }),
          bmi: Math.round(bmi * 10) / 10,
          weightKg: r.weightKg!,
          waistCm: r.waistCm ?? null,
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [records, heightCm]);

  const bmis = bmiData.map((d) => d.bmi);
  const currentBmi = bmis.length > 0 ? bmis[bmis.length - 1] : null;
  const avgBmi =
    bmis.length > 0
      ? Math.round((bmis.reduce((a, b) => a + b, 0) / bmis.length) * 10) / 10
      : null;
  const minBmi = bmis.length > 0 ? Math.min(...bmis) : null;
  const maxBmi = bmis.length > 0 ? Math.max(...bmis) : null;

  const isLoading = profileLoading || recordsLoading;
  const tooltipStyle = {
    borderRadius: "8px",
    border: "none",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  };

  if (isLoading) {
    return (
      <div className="h-40 flex items-center justify-center text-muted-foreground">
        Cargando datos...
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
          <h2 className="text-3xl font-display font-bold text-foreground">Tendencia de IMC</h2>
          <p className="text-muted-foreground mt-1">
            Evolución de tu Índice de Masa Corporal a lo largo del tiempo
          </p>
        </div>
      </div>

      {/* Height null CTA */}
      {!heightCm && (
        <Card className="shadow-sm border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <p className="text-sm text-amber-800">
              Necesitas registrar tu estatura para calcular el IMC.{" "}
              <Link
                href="/paciente/herramientas/calculadora-imc"
                className="font-medium underline underline-offset-2"
              >
                Ir a la calculadora de IMC
              </Link>{" "}
              para ingresarla.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Date range selector */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(RANGE_DAYS) as RangeKey[]).map((key) => (
              <Button
                key={key}
                variant={key === range ? "default" : "outline"}
                size="sm"
                onClick={() => setRange(key)}
                className="text-xs"
              >
                {RANGE_LABELS[key]}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              IMC actual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{currentBmi ?? "--"}</div>
            {currentBmi && (
              <p className="text-xs text-muted-foreground mt-1">{getBmiCategory(currentBmi)}</p>
            )}
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgBmi ?? "--"}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Mínimo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{minBmi ?? "--"}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Máximo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{maxBmi ?? "--"}</div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-5 text-primary" />
            Curva de IMC
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bmiData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={bmiData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8DFD4" />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#6A7B78" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6A7B78" }}
                  dx={-10}
                  domain={[12, 42]}
                  allowDataOverflow
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload as BmiDataPoint;
                    return (
                      <div style={tooltipStyle} className="bg-background px-3 py-2 text-sm">
                        <p className="font-semibold text-foreground mb-1">{d.label}</p>
                        <p className="text-muted-foreground">
                          IMC: <span className="font-medium text-foreground">{d.bmi}</span>
                        </p>
                        {d.waistCm !== null && (
                          <p className="text-muted-foreground">
                            Cintura: <span className="font-medium text-foreground">{d.waistCm} cm</span>
                          </p>
                        )}
                      </div>
                    );
                  }}
                />
                <ReferenceLine
                  y={18.5}
                  stroke="#3B82F6"
                  strokeDasharray="8 4"
                  strokeWidth={1.5}
                  label={{ value: "Bajo peso 18.5", position: "insideTopRight", fontSize: 10, fill: "#3B82F6" }}
                />
                <ReferenceLine
                  y={25}
                  stroke="#10B981"
                  strokeDasharray="8 4"
                  strokeWidth={1.5}
                  label={{ value: "Normal 25", position: "insideTopRight", fontSize: 10, fill: "#10B981" }}
                />
                <ReferenceLine
                  y={30}
                  stroke="#F59E0B"
                  strokeDasharray="8 4"
                  strokeWidth={1.5}
                  label={{ value: "Sobrepeso 30", position: "insideTopRight", fontSize: 10, fill: "#F59E0B" }}
                />
                <Line
                  type="monotone"
                  dataKey="bmi"
                  stroke="#00BFA5"
                  strokeWidth={3}
                  dot={{ r: 5, strokeWidth: 2 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              {!heightCm
                ? "Registra tu estatura para ver la curva de IMC"
                : "Sin registros de peso en el período seleccionado"}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail table */}
      {bmiData.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm">Detalle por día</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {[...bmiData].reverse().map((d, i) => (
                <div key={i} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: getBmiColor(d.bmi) }}
                    />
                    <p className="font-medium text-sm">
                      {format(d.date, "EEEE, d 'de' MMMM", { locale: es })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {d.bmi}{" "}
                      <span className="text-xs font-normal text-muted-foreground">IMC</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {d.weightKg} kg — {getBmiCategory(d.bmi)}
                    </p>
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
