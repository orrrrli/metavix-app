"use client";

import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { Search, FileText, Trash2, Edit } from "lucide-react";

import { useAuthStore } from "@/features/auth/store";
import { useMockDb } from "@/features/mock-db/store";
import { HealthRecordDto } from "@/features/patient/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";

export default function PatientHistoryPage() {
  const { userId } = useAuthStore();
  const { records, deleteRecord } = useMockDb();
  
  const [patientRecords, setPatientRecords] = useState<HealthRecordDto[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (userId) {
      let filtered = records.filter(r => r.patientId === userId);
      
      if (search) {
        filtered = filtered.filter(r => 
          (r.notes && r.notes.toLowerCase().includes(search.toLowerCase())) ||
          (r.symptoms && r.symptoms.toLowerCase().includes(search.toLowerCase()))
        );
      }
      
      filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setPatientRecords(filtered);
    }
  }, [userId, records, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-foreground">Health History</h2>
          <p className="text-muted-foreground mt-1">Review all your past measurements and clinical logs.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 space-y-4 sm:space-y-0">
          <div>
            <CardTitle>Clinical Records</CardTitle>
            <CardDescription>A complete log of your health data over time.</CardDescription>
          </div>
          <div className="w-full sm:w-72">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
              <Input 
                placeholder="Search notes or symptoms..." 
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
                  <TableHead>Date</TableHead>
                  <TableHead>Glucose (Fasting)</TableHead>
                  <TableHead>Blood Pressure</TableHead>
                  <TableHead>Heart Rate</TableHead>
                  <TableHead>Symptoms / Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patientRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <FileText className="size-8 mb-2 opacity-50" />
                        <p>No records found.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  patientRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium whitespace-nowrap">
                        {format(parseISO(record.timestamp), "MMM dd, yyyy")}
                        <div className="text-xs text-muted-foreground">
                          {format(parseISO(record.timestamp), "HH:mm")}
                        </div>
                      </TableCell>
                      <TableCell>
                        {record.fastingGlucose ? (
                          <div className="flex items-center gap-2">
                            <span>{record.fastingGlucose}</span>
                            {record.fastingGlucose > 130 ? (
                              <Badge variant="destructive" className="text-[10px]">High</Badge>
                            ) : record.fastingGlucose > 100 ? (
                              <Badge variant="outline" className="text-[10px] text-warning border-warning">Elevated</Badge>
                            ) : null}
                          </div>
                        ) : "--"}
                      </TableCell>
                      <TableCell>
                        {record.systolicBP && record.diastolicBP ? (
                          <div className="flex items-center gap-2">
                            <span>{record.systolicBP}/{record.diastolicBP}</span>
                            {record.systolicBP >= 140 || record.diastolicBP >= 90 ? (
                              <Badge variant="destructive" className="text-[10px]">High</Badge>
                            ) : null}
                          </div>
                        ) : "--"}
                      </TableCell>
                      <TableCell>{record.heartRate || "--"}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-sm">
                        {record.symptoms && (
                          <div className="text-destructive text-xs font-medium mb-1 truncate">{record.symptoms}</div>
                        )}
                        <span className="text-muted-foreground truncate">{record.notes || "--"}</span>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <Edit className="size-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => {
                            if(window.confirm("Are you sure you want to delete this record?")) {
                              deleteRecord(record.id);
                            }
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
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
