"use client";

import { parse, format } from "date-fns";
import { es } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import { SemaforoGlucosa } from "../../../components/SemaforoGlucosa";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { registroDiarioStrings as S } from "../strings/es";
import type { RegistroForm } from "../hooks/use-registro-diario";
import type { RegistroViewData } from "../view-data/build-registro-view-data";

export interface RegistroDiarioScreenProps {
  viewData: RegistroViewData;
  form: RegistroForm;
  setFormField: (name: keyof RegistroForm, value: string) => void;
  fechaDesde: string;
  setFechaDesde: (v: string) => void;
  fechaHasta: string;
  setFechaHasta: (v: string) => void;
  isCreating: boolean;
  onSubmit: () => void;
  onDelete: (id: string) => void;
}

/** UI pura de "Registro Diario". Sin queries ni filtrado (viven en el hook/view-data). */
export function RegistroDiarioScreen({
  viewData,
  form,
  setFormField,
  fechaDesde,
  setFechaDesde,
  fechaHasta,
  setFechaHasta,
  isCreating,
  onSubmit,
  onDelete,
}: RegistroDiarioScreenProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
      {/* Formulario nuevo */}
      <div className="lg:col-span-4 bg-card border rounded-xl p-5 shadow-sm h-fit">
        <h3 className="text-lg font-display font-bold mb-4 border-b pb-2">{S.nuevoTitle}</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="r-fecha">{S.fecha}</Label>
            <Input
              id="r-fecha"
              type="date"
              value={form.fecha}
              onChange={(e) => setFormField("fecha", e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="r-gluc-antes">{S.glucosaAntes}</Label>
              <Input
                id="r-gluc-antes"
                type="number"
                placeholder="mg/dL"
                value={form.glucosa_antes}
                onChange={(e) => setFormField("glucosa_antes", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="r-gluc-despues">{S.glucosaDespues}</Label>
              <Input
                id="r-gluc-despues"
                type="number"
                placeholder="mg/dL"
                value={form.glucosa_despues}
                onChange={(e) => setFormField("glucosa_despues", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="r-hc">{S.hcConsumidos}</Label>
              <Input
                id="r-hc"
                type="number"
                placeholder="g"
                value={form.hc_totales}
                onChange={(e) => setFormField("hc_totales", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="r-dosis">{S.dosisAplicada}</Label>
              <Input
                id="r-dosis"
                type="number"
                step="0.5"
                placeholder="U"
                value={form.dosis_aplicada}
                onChange={(e) => setFormField("dosis_aplicada", e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="r-comida">{S.queComiste}</Label>
            <textarea
              id="r-comida"
              placeholder={S.queComistePlaceholder}
              value={form.que_comi}
              onChange={(e) => setFormField("que_comi", e.target.value)}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none h-20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="r-sentir">{S.comoSentiste}</Label>
            <Input
              id="r-sentir"
              placeholder={S.comoSentistePlaceholder}
              value={form.como_me_senti}
              onChange={(e) => setFormField("como_me_senti", e.target.value)}
            />
          </div>
          <Button type="submit" disabled={isCreating} className="w-full">
            {isCreating ? S.guardando : S.guardar}
          </Button>
        </form>
      </div>

      {/* Historial */}
      <div className="lg:col-span-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h3 className="text-xl font-display font-bold">{S.historialTitle}</h3>
          <div className="flex gap-2">
            <Input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="w-[140px] h-9 text-sm"
            />
            <Input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="w-[140px] h-9 text-sm"
            />
          </div>
        </div>

        <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead>{S.colFecha}</TableHead>
                  <TableHead>{S.colAntes}</TableHead>
                  <TableHead>{S.colDespues}</TableHead>
                  <TableHead>{S.colHc}</TableHead>
                  <TableHead>{S.colDosis}</TableHead>
                  <TableHead className="w-[40px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!viewData.hayRegistros ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {S.emptyPeriodo}
                    </TableCell>
                  </TableRow>
                ) : (
                  viewData.registrosFiltrados.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium whitespace-nowrap">
                        {format(
                          parse(r.recordDate, "dd/MM/yyyy", new Date()),
                          "dd MMM, yyyy",
                          { locale: es },
                        )}
                      </TableCell>
                      <TableCell>
                        {r.glucoseBefore != null ? (
                          <SemaforoGlucosa valor={r.glucoseBefore} />
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>
                        {r.glucoseAfter != null ? (
                          <SemaforoGlucosa valor={r.glucoseAfter} />
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>{r.totalCarbs ?? "—"}</TableCell>
                      <TableCell className="font-semibold text-primary">
                        {r.doseApplied ?? "—"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(r.id)}
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
