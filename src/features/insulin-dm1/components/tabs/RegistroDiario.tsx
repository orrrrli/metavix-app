"use client";

import { useState, useMemo } from "react";
import { parse, format, isBefore, isAfter, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import { SemaforoGlucosa } from "../SemaforoGlucosa";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { toast } from "sonner";
import {
  useInsulinRecords,
  useCreateInsulinRecord,
  useDeleteInsulinRecord,
} from "@/features/patient/hooks/use-insulin-dm1";

interface RegistroDiarioProps {
  patientId: string;
}

const EMPTY_FORM = {
  fecha: new Date().toISOString().split("T")[0],
  glucosa_antes: "",
  glucosa_despues: "",
  hc_totales: "",
  dosis_aplicada: "",
  que_comi: "",
  como_me_senti: "",
};

export function RegistroDiario({ patientId }: RegistroDiarioProps) {
  const { data: registros = [] } = useInsulinRecords(patientId);
  const { mutate: createRecord, isPending: isCreating } = useCreateInsulinRecord(patientId);
  const { mutate: deleteRecord } = useDeleteInsulinRecord(patientId);

  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);

  const registrosFiltrados = useMemo(() => {
    if (!fechaDesde && !fechaHasta) return registros;
    return registros.filter(r => {
      const fecha = parse(r.recordDate, "dd/MM/yyyy", new Date());
      if (fechaDesde && isBefore(fecha, parseISO(fechaDesde))) return false;
      if (fechaHasta && isAfter(fecha, parseISO(fechaHasta + "T23:59:59"))) return false;
      return true;
    });
  }, [registros, fechaDesde, fechaHasta]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRecord(
      {
        recordDate: form.fecha,
        glucoseBefore: Number(form.glucosa_antes) || null,
        glucoseAfter: Number(form.glucosa_despues) || null,
        totalCarbs: Number(form.hc_totales) || null,
        doseApplied: Number(form.dosis_aplicada) || null,
        mealDescription: form.que_comi || null,
        howIFelt: form.como_me_senti || null,
      },
      {
        onSuccess: () => {
          toast.success("Registro guardado exitosamente");
          setForm(EMPTY_FORM);
        },
        onError: () => toast.error("Error al guardar el registro"),
      }
    );
  };

  const handleDelete = (id: string) => {
    if (!confirm("¿Eliminar este registro?")) return;
    deleteRecord(id, {
      onSuccess: () => toast.success("Registro eliminado"),
      onError: () => toast.error("Error al eliminar"),
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
      {/* Formulario nuevo */}
      <div className="lg:col-span-4 bg-card border rounded-xl p-5 shadow-sm h-fit">
        <h3 className="text-lg font-display font-bold mb-4 border-b pb-2">Nuevo Registro</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="r-fecha">Fecha</Label>
            <Input
              id="r-fecha"
              type="date"
              value={form.fecha}
              onChange={e => setForm({ ...form, fecha: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="r-gluc-antes">Glucosa Antes</Label>
              <Input
                id="r-gluc-antes"
                type="number"
                placeholder="mg/dL"
                value={form.glucosa_antes}
                onChange={e => setForm({ ...form, glucosa_antes: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="r-gluc-despues">Glucosa Después (2h)</Label>
              <Input
                id="r-gluc-despues"
                type="number"
                placeholder="mg/dL"
                value={form.glucosa_despues}
                onChange={e => setForm({ ...form, glucosa_despues: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="r-hc">HC Consumidos</Label>
              <Input
                id="r-hc"
                type="number"
                placeholder="g"
                value={form.hc_totales}
                onChange={e => setForm({ ...form, hc_totales: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="r-dosis">Dosis Aplicada</Label>
              <Input
                id="r-dosis"
                type="number"
                step="0.5"
                placeholder="U"
                value={form.dosis_aplicada}
                onChange={e => setForm({ ...form, dosis_aplicada: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="r-comida">¿Qué comiste?</Label>
            <textarea
              id="r-comida"
              placeholder="Ej. 2 rebanadas de pan..."
              value={form.que_comi}
              onChange={e => setForm({ ...form, que_comi: e.target.value })}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none h-20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="r-sentir">¿Cómo te sentiste?</Label>
            <Input
              id="r-sentir"
              placeholder="Breve nota..."
              value={form.como_me_senti}
              onChange={e => setForm({ ...form, como_me_senti: e.target.value })}
            />
          </div>
          <Button type="submit" disabled={isCreating} className="w-full">
            {isCreating ? "Guardando..." : "Guardar Registro"}
          </Button>
        </form>
      </div>

      {/* Historial */}
      <div className="lg:col-span-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h3 className="text-xl font-display font-bold">Historial de Registros</h3>
          <div className="flex gap-2">
            <Input
              type="date"
              value={fechaDesde}
              onChange={e => setFechaDesde(e.target.value)}
              className="w-[140px] h-9 text-sm"
            />
            <Input
              type="date"
              value={fechaHasta}
              onChange={e => setFechaHasta(e.target.value)}
              className="w-[140px] h-9 text-sm"
            />
          </div>
        </div>

        <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Antes</TableHead>
                  <TableHead>Después</TableHead>
                  <TableHead>HC (g)</TableHead>
                  <TableHead>Dosis (U)</TableHead>
                  <TableHead className="w-[40px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrosFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No hay registros en este periodo
                    </TableCell>
                  </TableRow>
                ) : (
                  registrosFiltrados.map(r => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium whitespace-nowrap">
                        {format(parse(r.recordDate, "dd/MM/yyyy", new Date()), "dd MMM, yyyy", { locale: es })}
                      </TableCell>
                      <TableCell>
                        {r.glucoseBefore != null ? <SemaforoGlucosa valor={r.glucoseBefore} /> : "—"}
                      </TableCell>
                      <TableCell>
                        {r.glucoseAfter != null ? <SemaforoGlucosa valor={r.glucoseAfter} /> : "—"}
                      </TableCell>
                      <TableCell>{r.totalCarbs ?? "—"}</TableCell>
                      <TableCell className="font-semibold text-primary">{r.doseApplied ?? "—"}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(r.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-950/30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
