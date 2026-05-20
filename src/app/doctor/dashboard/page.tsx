"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format, parseISO, differenceInYears } from "date-fns";
import { Search, Users, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";

import { useAuthStore } from "@/features/auth/store";
import { useMockDb } from "@/features/mock-db/store";
import { PatientProfileDto, HealthRecordDto, ControlStatus } from "@/features/patient/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";

function determineStatus(latestRecord?: HealthRecordDto): ControlStatus {
  if (!latestRecord) return "Unknown";
  
  const hasDanger = (latestRecord.fastingGlucose && latestRecord.fastingGlucose > 130) ||
                    (latestRecord.systolicBP && latestRecord.systolicBP >= 140) ||
                    (latestRecord.diastolicBP && latestRecord.diastolicBP >= 90) ||
                    (latestRecord.heartRate && latestRecord.heartRate > 100);
                    
  const hasCaution = (latestRecord.fastingGlucose && latestRecord.fastingGlucose > 100) ||
                     (latestRecord.systolicBP && latestRecord.systolicBP >= 130);

  if (hasDanger) return "Danger";
  if (hasCaution) return "Caution";
  return "Good Control";
}

export default function DoctorDashboard() {
  const { userId } = useAuthStore();
  const { records, patients } = useMockDb();
  
  const [assignedPatients, setAssignedPatients] = useState<(PatientProfileDto & { latestRecord?: HealthRecordDto, status: ControlStatus, recordCount: number })[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (userId) {
      const myPatients = patients.filter(p => p.assignedDoctorId === userId);
      
      const enriched = myPatients.map(p => {
        const pRecords = records.filter(r => r.patientId === p.id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        const latestRecord = pRecords[0];
        return {
          ...p,
          latestRecord,
          status: determineStatus(latestRecord),
          recordCount: pRecords.length
        };
      });
      
      let filtered = enriched;
      if (search) {
        filtered = filtered.filter(p => 
          `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
          p.diabetesType.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      setAssignedPatients(filtered);
    }
  }, [userId, records, patients, search]);

  const StatusBadge = ({ status }: { status: ControlStatus }) => {
    switch (status) {
      case "Danger": return <Badge variant="destructive" className="flex items-center gap-1 w-fit"><AlertTriangle className="size-3"/> Danger</Badge>;
      case "Caution": return <Badge variant="outline" className="flex items-center gap-1 w-fit border-warning text-warning"><AlertTriangle className="size-3"/> Caution</Badge>;
      case "Good Control": return <Badge variant="default" className="flex items-center gap-1 w-fit bg-success hover:bg-success/80 text-success-foreground"><CheckCircle className="size-3"/> Good</Badge>;
      default: return <Badge variant="secondary" className="flex items-center gap-1 w-fit"><HelpCircle className="size-3"/> Unknown</Badge>;
    }
  };

  const dangerCount = assignedPatients.filter(p => p.status === "Danger").length;
  const cautionCount = assignedPatients.filter(p => p.status === "Caution").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-foreground">Clinical Dashboard</h2>
          <p className="text-muted-foreground mt-1">Supervise your assigned patients and identify critical alerts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedPatients.length}</div>
          </CardContent>
        </Card>
        <Card className={dangerCount > 0 ? "border-destructive/50 bg-destructive/5" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Attention (Danger)</CardTitle>
            <AlertTriangle className={`size-4 ${dangerCount > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${dangerCount > 0 ? 'text-destructive' : ''}`}>{dangerCount}</div>
          </CardContent>
        </Card>
        <Card className={cautionCount > 0 ? "border-warning/50 bg-warning/5" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Review (Caution)</CardTitle>
            <AlertTriangle className={`size-4 ${cautionCount > 0 ? 'text-warning' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${cautionCount > 0 ? 'text-warning' : ''}`}>{cautionCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 space-y-4 sm:space-y-0">
          <div>
            <CardTitle>Patient Registry</CardTitle>
            <CardDescription>Select a patient to view detailed longitudinal data.</CardDescription>
          </div>
          <div className="w-full sm:w-72">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
              <Input 
                placeholder="Search patient name..." 
                className="pl-8" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Control Status</TableHead>
                  <TableHead>Last Record</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignedPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      No patients found.
                    </TableCell>
                  </TableRow>
                ) : (
                  assignedPatients.map((patient) => (
                    <TableRow key={patient.id} className="cursor-pointer hover:bg-muted/50" onClick={() => window.location.href = `/doctor/patients/${patient.id}`}>
                      <TableCell className="font-medium">
                        {patient.firstName} {patient.lastName}
                      </TableCell>
                      <TableCell>{differenceInYears(new Date(), parseISO(patient.dateOfBirth))}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{patient.diabetesType}</Badge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={patient.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {patient.latestRecord ? format(parseISO(patient.latestRecord.timestamp), "MMM dd, yyyy") : "No records"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/doctor/patients/${patient.id}`}>
                          <Button variant="ghost" size="sm">View Profile</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
