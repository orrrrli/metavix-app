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
          (r.notas && r.notas.toLowerCase().includes(search.toLowerCase())) ||
          r.glucosas_comidas.some(g => g.alimentos && g.alimentos.toLowerCase().includes(search.toLowerCase()))
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
          <h2 className="text-3xl font-display font-bold text-foreground">Historial de Salud</h2>
          <p className="text-muted-foreground mt-1">Revisa todas tus medidas pasadas y registros clínicos.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 space-y-4 sm:space-y-0">
          <div>
            <CardTitle>Registros Clínicos</CardTitle>
            <CardDescription>Un registro completo de tus datos de salud a lo largo del tiempo.</CardDescription>
          </div>
          <div className="w-full sm:w-72">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar en notas o alimentos..." 
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
                  <TableHead>Fecha</TableHead>
                  <TableHead>Glucosas Registradas</TableHead>
                  <TableHead>Presión Arterial</TableHead>
                  <TableHead>Frecuencia Cardíaca</TableHead>
                  <TableHead>Notas Adicionales</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patientRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <FileText className="size-8 mb-2 opacity-50" />
                        <p>No se encontraron registros.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  patientRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium whitespace-nowrap align-top pt-4">
                        {format(parseISO(record.timestamp), "MMM dd, yyyy")}
                        <div className="text-xs text-muted-foreground mt-1">
                          {format(parseISO(record.timestamp), "HH:mm")}
                        </div>
                      </TableCell>
                      <TableCell className="align-top pt-4">
                        <div className="space-y-2">
                          {record.glucosas_comidas.map((g, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground w-16 truncate" title={g.tipo}>
                                {g.tipo.replace('_', ' ')}
                              </span>
                              <span className="font-medium">{g.valor}</span>
                              {g.valor > 130 && g.tipo === 'ayuno' ? (
                                <Badge variant="destructive" className="text-[10px] h-4">Alto</Badge>
                              ) : g.valor > 180 ? (
                                <Badge variant="destructive" className="text-[10px] h-4">Alto</Badge>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="align-top pt-4">
                        {record.presion_sistolica && record.presion_diastolica ? (
                          <div className="flex flex-col gap-1">
                            <span>{record.presion_sistolica}/{record.presion_diastolica}</span>
                            {(record.presion_sistolica >= 140 || record.presion_diastolica >= 90) && (
                              <Badge variant="destructive" className="text-[10px] w-fit">Alto</Badge>
                            )}
                          </div>
                        ) : "--"}
                      </TableCell>
                      <TableCell className="align-top pt-4">{record.frecuencia_cardiaca || "--"}</TableCell>
                      <TableCell className="max-w-[200px] align-top pt-4 text-sm">
                        <span className="text-muted-foreground line-clamp-3">{record.notas || "--"}</span>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap align-top pt-3">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <Edit className="size-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => {
                            if(window.confirm("¿Estás seguro de que deseas eliminar este registro?")) {
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
