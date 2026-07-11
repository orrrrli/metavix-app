import { AlertTriangle } from "lucide-react";
import { cn } from "@/shared/utils/index";
import { statusCalloutClasses, statusCalloutIconClasses } from "@/shared/utils/status-colors";

export function AvisoLegal() {
  return (
    <>
      {/* Aviso Superior */}
      <div className={cn("border-l-4 p-4 rounded-r-md mb-8", statusCalloutClasses("warning"))}>
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className={cn("h-5 w-5", statusCalloutIconClasses("warning"))} />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">
              Este resumen es únicamente informativo y no sustituye la evaluación, diagnóstico ni tratamiento de un profesional de la salud. Ante cualquier duda, consulte con su médico.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export function PieResumen() {
  return (
    <div className="mt-12 pt-6 border-t border-muted text-center text-xs text-muted-foreground">
      <div className="font-semibold text-foreground mb-1">Dr. Ramses Castañeda</div>
      <p>Endocrinología Clínica · Cédula: 12345678</p>
      <p>Blvd. Agua Caliente 1234, Tijuana B.C. · Tel: (664) 123-4567</p>
      <p className="mt-4 italic opacity-80">Herramienta de referencia, no sustituye valoración médica integral.</p>
    </div>
  );
}
