"use client";

import { use } from "react";
import { format, differenceInYears } from "date-fns";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { ArrowLeft, Activity, HeartPulse, Droplet, FlaskConical, FileText } from "lucide-react";
import Link from "next/link";

import { useAuthStore } from "@/features/auth/store";
import { parseApiDate, parseDailyDate } from "@/features/patient/utils/parse-api-date";
import {
  useLinkedPatients,
  useLinkedPatientProfile,
  useLinkedPatientDailyRecords,
  useLinkedPatientLabResults,
} from "@/features/doctor/hooks/use-doctor";
import { ClinicalGoalsEditorControl } from "@/features/doctor/clinical-goals/components/ClinicalGoalsEditorControl";
import { DailyRecordResponse, GlucoseReadingResponse, GlucoseReadingType } from "@/types/daily-record";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Badge } from "@/shared/components/ui/badge";
import { GooeyLoader } from "@/shared/components/ui/gooey-loader";

function getFastingGlucose(readings: GlucoseReadingResponse[]): number | undefined {
  return readings.find(r => r.readingType === GlucoseReadingType.Fasting)?.valueMgDl;
}

function getPostprandialGlucose(readings: GlucoseReadingResponse[]): number | undefined {
  const postTypes = [
    GlucoseReadingType.PostBreakfast,
    GlucoseReadingType.PostLunch,
    GlucoseReadingType.PostDinner,
  ];
  return readings.find(r => postTypes.includes(r.readingType))?.valueMgDl;
}

function buildChartData(records: DailyRecordResponse[]): object[] {
  return records
    .map(r => ({ r, date: parseDailyDate(r.recordDate) }))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map(({ r, date }) => ({
      date: format(date, "MMM dd"),
      fasting: getFastingGlucose(r.glucoseReadings),
      postprandial: getPostprandialGlucose(r.glucoseReadings),
      systolic: r.systolicPressure,
      diastolic: r.diastolicPressure,
      heartRate: r.heartRate,
    }));
}

interface Props {
  params: Promise<{ mrn: string }>;
}

export default function PatientDetailView({ params }: Props): React.ReactElement {
  const { mrn } = use(params);
  const { doctorId, _hasHydrated } = useAuthStore();

  // Todos los hooks se llaman incondicionalmente (rules-of-hooks). No disparan
  // queries hasta que el store hidrata: cada uno gatea con `enabled: hydrated
  // && isValidId` internamente (ver use-doctor.ts), evitando el 404-retry-loop
  // con doctorId vacío en hard-reload. El guard de `_hasHydrated` de abajo solo
  // controla qué se muestra, no si las queries corren.
  const { data: patients = [], isLoading: loadingPatients } = useLinkedPatients(doctorId ?? "");
  const patient = patients.find(p => p.medicalRecordNumber === mrn);
  const patientId = patient?.id ?? "";

  const { data: profile, isLoading: loadingProfile, isError: profileError } = useLinkedPatientProfile(doctorId ?? "", patientId);
  const { data: dailyRecords = [], isLoading: loadingDaily } = useLinkedPatientDailyRecords(doctorId ?? "", patientId);
  const { data: labRecords = [], isLoading: loadingLab } = useLinkedPatientLabResults(doctorId ?? "", patientId);

  if (!_hasHydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <GooeyLoader />
      </div>
    );
  }

  if (loadingPatients || loadingProfile || loadingDaily || loadingLab) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <GooeyLoader />
      </div>
    );
  }

  if (!patient || profileError || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-muted-foreground">Paciente no encontrado o sin acceso.</p>
        <Link href="/doctor/dashboard">
          <Button variant="outline">Volver al panel</Button>
        </Link>
      </div>
    );
  }

  const dateOfBirth = parseApiDate(profile.dateOfBirth);
  const age = dateOfBirth ? differenceInYears(new Date(), dateOfBirth) : null;
  const chartData = buildChartData(dailyRecords);
  const sortedDaily = dailyRecords
    .map(r => ({ r, date: parseDailyDate(r.recordDate) }))
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map(({ r }) => r);
  const sortedLab = labRecords
    .map(r => ({ r, date: parseDailyDate(r.sampleDate) }))
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map(({ r }) => r);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/doctor/dashboard">
          <Button variant="outline" size="icon" className="shrink-0">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-display font-bold text-foreground">
            {profile.firstName} {profile.lastName}
          </h2>
          <p className="text-muted-foreground flex items-center gap-2 mt-1 flex-wrap">
            <span>{age !== null ? `${age} años` : "—"} ({profile.gender ?? "—"})</span>
            <span>&bull;</span>
            <span>{profile.diabetesType}</span>
            <span>&bull;</span>
            <span className="font-mono text-xs">{profile.medicalRecordNumber}</span>
            {profile.isPregnant && (
              <>
                <span>&bull;</span>
                <span className="text-primary font-medium">Embarazada</span>
              </>
            )}
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <div className="overflow-x-auto mb-4">
          <TabsList className="w-max min-w-full">
            <TabsTrigger value="overview">Resumen Clínico</TabsTrigger>
            <TabsTrigger value="daily">Registros Diarios</TabsTrigger>
            <TabsTrigger value="lab">Resultados de Lab</TabsTrigger>
            <TabsTrigger value="goals">Metas</TabsTrigger>
          </TabsList>
        </div>

        {/* Overview — charts */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplet className="size-5 text-blue-500 dark:text-blue-400" />
                  Tendencias de Glucosa
                </CardTitle>
                <CardDescription>Ayunas vs Posprandial</CardDescription>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8DFD4" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6A7B78" }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6A7B78" }} dx={-10} />
                      <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                      <Line type="monotone" name="Ayunas" dataKey="fasting" stroke="#00BFA5" strokeWidth={3} dot={{ r: 4 }} connectNulls />
                      <Line type="monotone" name="Posprandial" dataKey="postprandial" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} connectNulls />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">Sin datos</div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HeartPulse className="size-5 text-rose-500 dark:text-rose-400" />
                  Cardiovascular
                </CardTitle>
                <CardDescription>Sistólica, Diastólica y Frecuencia Cardíaca</CardDescription>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8DFD4" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6A7B78" }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6A7B78" }} dx={-10} domain={[40, 200]} />
                      <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                      <Line type="monotone" name="Sistólica" dataKey="systolic" stroke="#EF4444" strokeWidth={3} dot={false} activeDot={{ r: 6 }} connectNulls />
                      <Line type="monotone" name="Diastólica" dataKey="diastolic" stroke="#3B82F6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} connectNulls />
                      <Line type="monotone" name="Frec. Cardíaca" dataKey="heartRate" stroke="#8B5CF6" strokeWidth={2} strokeDasharray="5 5" dot={false} connectNulls />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">Sin datos</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Daily Records timeline */}
        <TabsContent value="daily">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="size-5" />
                Registros Diarios
              </CardTitle>
              <CardDescription>Historial cronológico de signos vitales y glucosa.</CardDescription>
            </CardHeader>
            <CardContent>
              {sortedDaily.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="size-12 mx-auto mb-4 opacity-20" />
                  <p>Sin registros diarios.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedDaily.map((record) => {
                    const fasting = getFastingGlucose(record.glucoseReadings);
                    return (
                      <div key={record.id} className="p-4 rounded-xl border border-border bg-card shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-bold text-foreground">
                            {format(parseDailyDate(record.recordDate), "MMM dd, yyyy")}
                          </span>
                          {record.recordTime && (
                            <span className="text-xs text-muted-foreground">{record.recordTime.slice(0, 5)}</span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                          {fasting !== undefined && (
                            <div className="bg-muted/50 p-2 rounded">
                              <span className="block text-xs text-muted-foreground">Glucosa Ayunas</span>
                              <span className={`font-semibold ${fasting > 130 ? "text-destructive" : ""}`}>
                                {fasting} mg/dL
                              </span>
                            </div>
                          )}
                          {record.systolicPressure && record.diastolicPressure && (
                            <div className="bg-muted/50 p-2 rounded">
                              <span className="block text-xs text-muted-foreground">Presión (BP)</span>
                              <span className={`font-semibold ${record.systolicPressure >= 140 ? "text-destructive" : ""}`}>
                                {record.systolicPressure}/{record.diastolicPressure}
                              </span>
                            </div>
                          )}
                          {record.heartRate && (
                            <div className="bg-muted/50 p-2 rounded">
                              <span className="block text-xs text-muted-foreground">Frec. Cardíaca</span>
                              <span className="font-semibold">{record.heartRate} bpm</span>
                            </div>
                          )}
                          {record.weightKg && (
                            <div className="bg-muted/50 p-2 rounded">
                              <span className="block text-xs text-muted-foreground">Peso</span>
                              <span className="font-semibold">{record.weightKg} kg</span>
                            </div>
                          )}
                        </div>
                        {record.glucoseReadings.length > 1 && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            {record.glucoseReadings.length} mediciones de glucosa registradas.
                          </p>
                        )}
                        {record.notes && (
                          <div className="mt-3 pt-3 border-t border-border/50 text-sm">
                            <p className="text-muted-foreground italic">&ldquo;{record.notes}&rdquo;</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lab Results */}
        <TabsContent value="lab">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="size-5" />
                Resultados de Laboratorio
              </CardTitle>
              <CardDescription>HbA1c, perfil lipídico, función renal y EGO.</CardDescription>
            </CardHeader>
            <CardContent>
              {sortedLab.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FlaskConical className="size-12 mx-auto mb-4 opacity-20" />
                  <p>Sin resultados de laboratorio.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedLab.map((lab) => (
                    <div key={lab.id} className="p-4 rounded-xl border border-border bg-card shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-foreground">
                          {format(parseDailyDate(lab.sampleDate), "MMM dd, yyyy")}
                        </span>
                        <Badge variant="outline">Laboratorio</Badge>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                        {lab.hba1c !== null && (
                          <div className="bg-muted/50 p-2 rounded">
                            <span className="block text-xs text-muted-foreground">HbA1c</span>
                            <span className="font-semibold">{lab.hba1c}%</span>
                          </div>
                        )}
                        {lab.totalCholesterol !== null && (
                          <div className="bg-muted/50 p-2 rounded">
                            <span className="block text-xs text-muted-foreground">Colesterol Total</span>
                            <span className="font-semibold">{lab.totalCholesterol} mg/dL</span>
                          </div>
                        )}
                        {lab.ldl !== null && (
                          <div className="bg-muted/50 p-2 rounded">
                            <span className="block text-xs text-muted-foreground">LDL</span>
                            <span className="font-semibold">{lab.ldl} mg/dL</span>
                          </div>
                        )}
                        {lab.hdl !== null && (
                          <div className="bg-muted/50 p-2 rounded">
                            <span className="block text-xs text-muted-foreground">HDL</span>
                            <span className="font-semibold">{lab.hdl} mg/dL</span>
                          </div>
                        )}
                        {lab.triglycerides !== null && (
                          <div className="bg-muted/50 p-2 rounded">
                            <span className="block text-xs text-muted-foreground">Triglicéridos</span>
                            <span className="font-semibold">{lab.triglycerides} mg/dL</span>
                          </div>
                        )}
                        {lab.creatinine !== null && (
                          <div className="bg-muted/50 p-2 rounded">
                            <span className="block text-xs text-muted-foreground">Creatinina</span>
                            <span className="font-semibold">{lab.creatinine} mg/dL</span>
                          </div>
                        )}
                        {lab.bun !== null && (
                          <div className="bg-muted/50 p-2 rounded">
                            <span className="block text-xs text-muted-foreground">BUN</span>
                            <span className="font-semibold">{lab.bun} mg/dL</span>
                          </div>
                        )}
                        {(lab.egoProteins || lab.egoGlucose) && (
                          <div className="bg-muted/50 p-2 rounded">
                            <span className="block text-xs text-muted-foreground">EGO</span>
                            <span className="font-semibold text-xs">
                              Prot: {lab.egoProteins ?? "—"} / Gluc: {lab.egoGlucose ?? "—"}
                            </span>
                          </div>
                        )}
                      </div>
                      {lab.notes && (
                        <div className="mt-3 pt-3 border-t border-border/50 text-sm">
                          <p className="text-muted-foreground italic">&ldquo;{lab.notes}&rdquo;</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clinical Goals — doctor-set per-parameter custom thresholds */}
        <TabsContent value="goals">
          <ClinicalGoalsEditorControl
            doctorId={doctorId ?? ""}
            patientId={patientId}
            isPregnant={Boolean(profile.isPregnant)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
