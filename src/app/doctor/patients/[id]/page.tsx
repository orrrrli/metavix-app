"use client";

import { useEffect, useState, use } from "react";
import { format, parseISO, differenceInYears } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ArrowLeft, Activity, HeartPulse, Droplet, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/features/auth/store";
import { useMockDb } from "@/features/mock-db/store";
import { PatientProfileDto, HealthRecordDto } from "@/features/patient/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

export default function PatientDetailView({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { userId, role } = useAuthStore();
  const { records, patients } = useMockDb();
  
  const [patient, setPatient] = useState<PatientProfileDto | null>(null);
  const [patientRecords, setPatientRecords] = useState<HealthRecordDto[]>([]);

  useEffect(() => {
    if (role !== "DOCTOR") {
      router.replace("/");
      return;
    }

    const foundPatient = patients.find(p => p.id === id);
    if (foundPatient) {
      setPatient(foundPatient);
      const filtered = records.filter(r => r.patientId === id).sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime() // Ascending for charts
      );
      setPatientRecords(filtered);
    } else {
      router.push("/doctor/dashboard");
    }
  }, [id, patients, records, role, router]);

  if (!patient) return null;

  const chartData = patientRecords.map(record => ({
    date: format(parseISO(record.timestamp), "MMM dd"),
    fasting: record.fastingGlucose,
    post1h: record.postprandial1hGlucose,
    systolic: record.systolicBP,
    diastolic: record.diastolicBP,
    heartRate: record.heartRate,
    hba1c: record.hba1c
  }));

  const reversedRecords = [...patientRecords].reverse();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/doctor/dashboard">
          <Button variant="outline" size="icon" className="shrink-0"><ArrowLeft className="size-4"/></Button>
        </Link>
        <div>
          <h2 className="text-3xl font-display font-bold text-foreground">
            {patient.firstName} {patient.lastName}
          </h2>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <span>{differenceInYears(new Date(), parseISO(patient.dateOfBirth))} años</span>
            <span>&bull;</span>
            <span>{patient.diabetesType}</span>
            {patient.pregnancyStatus && (
              <>
                <span>&bull;</span>
                <span className="text-primary font-medium">Embarazada</span>
              </>
            )}
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Resumen Clínico</TabsTrigger>
          <TabsTrigger value="history">Línea de Tiempo</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="col-span-1 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Droplet className="size-5 text-blue-500"/> Tendencias de Glucosa</CardTitle>
                <CardDescription>Seguimiento Ayunas vs Posprandial</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8DFD4" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6A7B78" }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6A7B78" }} dx={-10} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Line type="monotone" name="Ayunas" dataKey="fasting" stroke="#00BFA5" strokeWidth={3} dot={{ r: 4 }} connectNulls />
                      <Line type="monotone" name="1h Posprandial" dataKey="post1h" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} connectNulls />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">Datos no disponibles</div>
                )}
              </CardContent>
            </Card>

            <Card className="col-span-1 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><HeartPulse className="size-5 text-rose-500"/> Cardiovascular</CardTitle>
                <CardDescription>Sistólica, Diastólica y Frecuencia Cardíaca</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8DFD4" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6A7B78" }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6A7B78" }} dx={-10} domain={[40, 200]} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Line type="monotone" name="Sistólica" dataKey="systolic" stroke="#EF4444" strokeWidth={3} dot={false} activeDot={{ r: 6 }} connectNulls />
                      <Line type="monotone" name="Diastólica" dataKey="diastolic" stroke="#3B82F6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} connectNulls />
                      <Line type="monotone" name="Frec. Cardíaca" dataKey="heartRate" stroke="#8B5CF6" strokeWidth={2} strokeDasharray="5 5" dot={false} connectNulls />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">Datos no disponibles</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Línea de Tiempo Médica</CardTitle>
              <CardDescription>Registro cronológico de todas las medidas y notas.</CardDescription>
            </CardHeader>
            <CardContent>
              {reversedRecords.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="size-12 mx-auto mb-4 opacity-20" />
                  <p>Este paciente aún no tiene registros.</p>
                </div>
              ) : (
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                  {reversedRecords.map((record, idx) => (
                    <div key={record.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center size-10 rounded-full border border-background bg-primary text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <Activity className="size-4" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border bg-card shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-foreground">{format(parseISO(record.timestamp), "MMM dd, yyyy")}</span>
                          <span className="text-xs text-muted-foreground">{format(parseISO(record.timestamp), "HH:mm")}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                          {record.fastingGlucose && (
                            <div className="bg-muted/50 p-2 rounded">
                              <span className="block text-xs text-muted-foreground">Glucosa Ayunas</span>
                              <span className={`font-semibold ${record.fastingGlucose > 130 ? 'text-destructive' : ''}`}>{record.fastingGlucose} mg/dL</span>
                            </div>
                          )}
                          {record.systolicBP && (
                            <div className="bg-muted/50 p-2 rounded">
                              <span className="block text-xs text-muted-foreground">Presión (BP)</span>
                              <span className={`font-semibold ${record.systolicBP >= 140 ? 'text-destructive' : ''}`}>{record.systolicBP}/{record.diastolicBP}</span>
                            </div>
                          )}
                        </div>
                        {(record.symptoms || record.notes) && (
                          <div className="mt-3 pt-3 border-t border-border/50 text-sm">
                            {record.symptoms && <p className="text-destructive text-xs font-medium mb-1">Síntomas: {record.symptoms}</p>}
                            {record.notes && <p className="text-muted-foreground italic">"{record.notes}"</p>}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
