"use client";

import { type RefObject } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { sectionContainerClasses } from "@/shared/utils/status-colors";
import { EncabezadoResumen } from "./EncabezadoResumen";
import { AvisoLegal, PieResumen } from "./AvisoLegal";
import { SeccionMetrica } from "./SeccionMetrica";
import { resumenStrings as S } from "../strings/es";
import type { ResumenViewData } from "../view-data/build-resumen-view-data";

export interface ResumenScreenProps {
  viewData: ResumenViewData;
  pdfRef: RefObject<HTMLDivElement | null>;
  isExporting: boolean;
  onExport: () => void;
}

function cnSec(extra: string): string {
  return `${sectionContainerClasses()} ${extra}`;
}

/**
 * UI pura del resumen clínico. Itera `viewData.secciones` — sin
 * `calcularEstadoMetrica` inline (vive en `view-data/`). La exportación a PDF
 * la maneja el Control vía `onExport` + `pdfRef`.
 */
export function ResumenScreen({ viewData, pdfRef, isExporting, onExport }: ResumenScreenProps) {
  if (viewData.todasNulas) {
    return (
      <div className="bg-muted/40 text-muted-foreground p-10 rounded-xl text-center border">
        <p className="text-base font-medium">{S.emptyTitle}</p>
        <p className="text-sm mt-1">{S.emptyBody}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-3 print:hidden">
        <Button onClick={onExport} disabled={isExporting} className="gap-2">
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {isExporting ? S.exporting : S.exportPdf}
        </Button>
      </div>

      <div className="bg-white dark:bg-card text-black dark:text-card-foreground shadow-lg rounded-xl overflow-hidden border border-black/5 dark:border-border">
        <div
          ref={pdfRef}
          className="p-8 sm:p-12 max-w-4xl mx-auto bg-white"
          style={{ minHeight: "297mm" }}
        >
          <EncabezadoResumen nombrePaciente={viewData.nombrePaciente} />
          <AvisoLegal />

          <div className="space-y-8">
            {viewData.secciones.map((seccion) => (
              <section key={seccion.titulo}>
                <h3 className="text-lg font-display font-bold text-primary border-b-2 border-primary/20 pb-2 mb-4 uppercase tracking-wider">
                  {seccion.titulo}
                </h3>
                <div className={cnSec("p-4 rounded-lg border")}>
                  {seccion.metricas.map((m) => (
                    <SeccionMetrica
                      key={m.id}
                      nombre={m.nombre}
                      valor={m.valor}
                      fecha={m.fecha}
                      unidad={m.unidad}
                      estado={m.estado}
                      meta={m.meta}
                    />
                  ))}
                </div>
              </section>
            ))}

            <section className="bg-indigo-50/50 dark:bg-indigo-950/30 p-6 rounded-lg border border-indigo-100 dark:border-indigo-800/60 mt-8">
              <h3 className="text-lg font-display font-bold text-indigo-900 dark:text-indigo-200 border-b-2 border-indigo-200 dark:border-indigo-800 pb-2 mb-4 uppercase tracking-wider flex items-center gap-2">
                <span className="bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-100 p-1 rounded">
                  IA
                </span>
                {S.iaTitle}
              </h3>
              <div className="text-indigo-800/70 dark:text-indigo-300/70 italic text-center py-8">
                {S.iaPlaceholder}
              </div>
            </section>
          </div>

          <PieResumen />
        </div>
      </div>
    </div>
  );
}
