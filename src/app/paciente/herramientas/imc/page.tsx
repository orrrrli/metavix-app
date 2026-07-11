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
import { ArrowLeft, CalendarIcon, TrendingUp } from "lucide-react";
import Link from "next/link";

import { useAuthStore } from "@/features/auth/store";
import { useDailyRecordsInRange } from "@/features/patient/hooks/use-daily-records";
import { usePatientProfile } from "@/features/patient/hooks/use-patient-profile";
import { EmptyState } from "@/features/bmi/components/EmptyState";
import { Calendar } from "@/shared/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button, buttonVariants } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";

type RangeKey = "7d" | "30d" | "90d";

const RANGE_DAYS: Record<RangeKey, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

const RANGE_LABELS: Record<RangeKey, string> = {
  "7d": "7d",
  "30d": "30d",
  "90d": "90d",
};

interface BmiDataPoint {
  date: Date;
  label: string;
  bmi: number;
  weightKg: number;
  waistCm: number | null;
}

interface DateRange {
  from: Date | undefined;
  to?: Date | undefined;
}

function parseDailyDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split("/");
  return new Date(Number(year), Number(month) - 1, Number(day));
}

function toISODate(date: Date): string {
  return format(date, "yyyy-MM-dd");
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
  const [range, setRange] = useState<RangeKey>("30d");
  const [mode, setMode] = useState<"preset" | "custom">("preset");
  const [customRange, setCustomRange] = useState<DateRange | undefined>(undefined);
  const [pendingRange, setPendingRange] = useState<DateRange | undefined>(undefined);
  const [customOpen, setCustomOpen] = useState(false);
  const [customError, setCustomError] = useState<string | null>(null);

  const today = new Date();
  const presetFromDate = new Date(today);
  presetFromDate.setDate(today.getDate() - RANGE_DAYS[range]);

  const fromDate =
    mode === "custom" && customRange?.from ? customRange.from : presetFromDate;
  const toDate =
    mode === "custom" && customRange?.to ? customRange.to : new Date(today);
  const from = toISODate(fromDate);
  const to = toISODate(toDate);

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
        const date = parseDailyDate(r.recordDate);
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

  const handlePresetClick = (key: RangeKey) => {
    setMode("preset");
    setRange(key);
    setCustomError(null);
  };

  const handleCustomOpenChange = (open: boolean) => {
    setCustomOpen(open);
    setCustomError(null);
    if (open) {
      const currentRange: DateRange =
        mode === "custom" && customRange
          ? customRange
          : { from: presetFromDate, to: new Date(today) };
      setPendingRange(currentRange);
    }
  };

  const handleApplyCustom = () => {
    if (!pendingRange?.from || !pendingRange?.to) {
      setCustomError("Selecciona un rango de fechas completo.");
      return;
    }
    setCustomRange({ from: pendingRange.from, to: pendingRange.to });
    setMode("custom");
    setCustomError(null);
    setCustomOpen(false);
  };

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
        <Card className="shadow-sm border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/30">
          <CardContent className="pt-6">
            <p className="text-sm text-amber-800 dark:text-amber-200">
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
                variant={mode === "preset" && range === key ? "default" : "outline"}
                size="sm"
                onClick={() => handlePresetClick(key)}
                className="text-xs"
              >
                {RANGE_LABELS[key]}
              </Button>
            ))}
            <Popover open={customOpen} onOpenChange={handleCustomOpenChange}>
              <PopoverTrigger
                className={cn(
                  buttonVariants({
                    variant: mode === "custom" ? "default" : "outline",
                    size: "sm",
                  }),
                  "text-xs"
                )}
              >
                <CalendarIcon className="size-3 mr-1" />
                Personalizado
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-3">
                  <Calendar
                    mode="range"
                    selected={pendingRange}
                    onSelect={setPendingRange}
                    numberOfMonths={1}
                    locale={es}
                  />
                  {customError && (
                    <p className="text-xs text-destructive mt-2">{customError}</p>
                  )}
                  <div className="flex justify-end gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCustomOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button size="sm" onClick={handleApplyCustom}>
                      Aplicar
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
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
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{minBmi ?? "--"}</div>
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
          ) : !heightCm ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Registra tu estatura para ver la curva de IMC
            </div>
          ) : (
            <EmptyState
              title="Sin registros de peso"
              description="No hay registros de peso en el período seleccionado. Agrega uno para ver tu progreso."
              icon={TrendingUp}
            />
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
