import { Button } from "@/shared/components/ui/button";
import { Loader2 } from "lucide-react";
import { metasStrings } from "../strings/es";

interface EvaluationInviteProps {
  onEvaluate: () => void;
  isEvaluating: boolean;
  totalParametros: number;
  parametrosConDatos: number;
}

/**
 * Pantalla de invitación previa a evaluar metas: explica que la evaluación
 * usa automáticamente los valores ya registrados, sin pedir captura nueva.
 */
export function EvaluationInvite({
  onEvaluate,
  isEvaluating,
  totalParametros,
  parametrosConDatos,
}: EvaluationInviteProps) {
  return (
    <section
      className="flex flex-col items-center text-center rounded-[20px] px-6 py-11 sm:px-10"
      style={{ background: "var(--card)", border: "1.5px solid var(--card-bd)" }}
    >
      <div
        className="flex items-center justify-center size-14 rounded-full mb-5"
        style={{ background: "var(--ok-bg)" }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--ok)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12h4l2 8 4-16 2 8h6" />
        </svg>
      </div>

      <h2 className="font-display text-xl font-extrabold mb-2.5" style={{ color: "var(--text)" }}>
        {metasStrings.evaluationInvite.title}
      </h2>
      <p className="text-sm mb-6 max-w-md leading-relaxed" style={{ color: "var(--mut)" }}>
        {metasStrings.evaluationInvite.description}
      </p>

      <div className="flex flex-wrap justify-center gap-2 mb-7">
        <span className="rounded-full px-3.5 py-1.5 text-xs font-semibold" style={{ background: "var(--ph)", color: "var(--mut)" }}>
          {parametrosConDatos} de {totalParametros} parámetros con datos recientes
        </span>
      </div>

      <Button onClick={onEvaluate} disabled={isEvaluating} className="h-14 px-11 text-base shadow-md">
        {isEvaluating && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
        {metasStrings.evaluateButton}
      </Button>
    </section>
  );
}
