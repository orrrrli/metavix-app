import type { CkdStage } from "@/types/goal-evaluation";

/**
 * Etapas KDIGO 2024 de enfermedad renal crónica (ERC). Tabla de referencia
 * que se muestra en la sección educativa `CkdStageExplainer`. La fila de la
 * etapa actual (si hay eGFR numérico) se resalta; si no hay valor, la tabla
 * se renderiza sin highlight para que sirva de glosario.
 *
 * Fuentes:
 *  - KDIGO 2024 Clinical Practice Guideline for CKD (Tabla 1, GFR categories)
 *  - ADA 2026 Standards of Care, Sec. 11 (Chronic Kidney Disease and Risk
 *    Management): acciones clínicas por etapa para pacientes con diabetes.
 *
 * El `id` coincide con `CkdStage` y con `AdaGoalConstants.CkdStageG*` en el
 * backend. `range` se muestra al paciente como referencia rápida; `action`
 * es la recomendación clínica que el médico ajusta caso por caso.
 */
export interface CkdStageMeta {
  id: CkdStage;
  /** Nombre completo de la etapa en lenguaje del paciente. */
  name: string;
  /** Rango de eGFR correspondiente, en ml/min/1.73m². */
  range: string;
  /** Recomendación clínica resumida (1 línea, español). */
  action: string;
}

export const CKD_STAGES: readonly CkdStageMeta[] = [
  {
    id: "G1",
    name: "G1 — Función renal normal o alta",
    range: "≥ 90 ml/min/1.73m²",
    action:
      "Función preservada. Mantener control glucémico y de presión arterial; revisión anual.",
  },
  {
    id: "G2",
    name: "G2 — Daño renal leve",
    range: "60–89 ml/min/1.73m²",
    action:
      "Daño leve con filtrado aún normal. Optimizar control de glucemia y PA; evaluar causa si hay proteinuria.",
  },
  {
    id: "G3a",
    name: "G3a — Daño renal leve a moderado",
    range: "45–59 ml/min/1.73m²",
    action:
      "Requiere nefroprotección activa: iSGLT2, control estricto de PA y glucemia. Vigilancia cada 6 meses.",
  },
  {
    id: "G3b",
    name: "G3b — Daño renal moderado a severo",
    range: "30–44 ml/min/1.73m²",
    action:
      "Valorar derivación a nefrología. Ajustar dosis de medicamentos nefrotóxicos; mantener iSGLT2 si se tolera.",
  },
  {
    id: "G4",
    name: "G4 — Daño renal severo",
    range: "15–29 ml/min/1.73m²",
    action:
      "Manejo conjunto con nefrología. Preparar acceso vascular para posible terapia de reemplazo renal.",
  },
  {
    id: "G5",
    name: "G5 — Falla renal",
    range: "< 15 ml/min/1.73m²",
    action:
      "Terapia de reemplazo renal (diálisis o trasplante). Seguimiento conjunto con nefrología.",
  },
] as const;

const CKD_STAGES_BY_ID: ReadonlyMap<CkdStage, CkdStageMeta> = new Map(
  CKD_STAGES.map((s) => [s.id, s]),
);

/** Devuelve la metadata de la etapa, o null si el id es null/undefined. */
export function getCkdStageMeta(stage: CkdStage | null | undefined): CkdStageMeta | null {
  if (!stage) return null;
  return CKD_STAGES_BY_ID.get(stage) ?? null;
}
