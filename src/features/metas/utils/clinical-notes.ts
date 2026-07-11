import type { GoalStatus } from '@/types/goal-evaluation';

export interface ParameterNoteContext {
  parameterId: string;
  status: GoalStatus;
  isPregnant: boolean;
}

/**
 * Textos exactos de la tabla "Por parámetro" (RF-005 a RF-016) —
 * plan-motor-evaluacion-metas-clinicas.md §7. Todas condicionadas a
 * `IsPregnant`; no se traducen códigos aquí porque el backend no emite
 * ninguno para estas notas (son derivación pura en tiempo de render).
 */
const PREGNANCY_NOTES: Record<string, string> = {
  systolic_bp: 'En embarazo, la PA elevada puede indicar preeclampsia. Confirmar con especialista.',
  diastolic_bp: 'En embarazo, la PA elevada puede indicar preeclampsia. Confirmar con especialista.',
  bmi: 'El IMC no se evalúa durante la gestación. Mostrar peso pregestacional como referencia.',
  ldl_primary: 'Estatinas contraindicadas en embarazo. Meta numérica no aplica.',
  hdl: 'HDL en embarazo: usar solo como referencia basal. Los rangos estándar no aplican.',
  total_cholesterol: 'El colesterol total aumenta 25-50 % fisiológicamente en embarazo. No se evalúa.',
  creatinine: 'En embarazo, creatinina ≥ 1.0 mg/dL ya es anormal. Consultar con especialista.',
  egfr: 'eGFR (CKD-EPI) en embarazo: interpretar con cautela. Fórmula validada en no-embarazadas.',
  bun: 'En embarazo, BUN > 15 mg/dL sugiere disfunción renal.',
  waist_circumference: 'La circunferencia de cintura no se evalúa durante la gestación.',
};

/** RF-005: la PA sólo muestra nota cuando el status no está en meta. */
const BP_PARAMETER_IDS = new Set(['systolic_bp', 'diastolic_bp']);

/**
 * Deriva la nota clínica de un parámetro a partir de su id, status y el
 * estado de embarazo de la paciente. Devuelve `null` cuando no aplica
 * ninguna nota. Pura función — sin acceso a red ni almacenamiento (las
 * notas no se persisten en `GoalEvaluation`, preservan su inmutabilidad).
 */
export function getParameterNote({ parameterId, status, isPregnant }: ParameterNoteContext): string | null {
  if (!isPregnant) return null;
  const note = PREGNANCY_NOTES[parameterId];
  if (!note) return null;
  if (BP_PARAMETER_IDS.has(parameterId) && status === 'InRange') return null;
  return note;
}

/**
 * Evento "TG ≥ 500" — plan-motor-evaluacion-metas-clinicas.md §7 "Por evento".
 * Texto exacto sin el glifo ⚠ (el ícono de CriticalAlert ya lo transmite).
 */
export function getTriglyceridesCriticalAlert(status: GoalStatus, valueUsed: number | null): string | null {
  if (status !== 'OutOfRange' || valueUsed === null || valueUsed < 500) return null;
  return 'Riesgo de pancreatitis aguda. Tratamiento farmacológico urgente (fibrato + aceite de pescado).';
}

/**
 * Evento "Aumento de creatinina ≤ 30 %" — plan-motor-evaluacion-metas-clinicas.md
 * §7 "Por evento". Compara el valor actual contra el lab previo; sólo aplica a
 * un aumento estrictamente positivo y no mayor al 30 %.
 */
export function getCreatinineIncreaseNote(
  valueUsed: number | null,
  previousValue: number | null | undefined,
): string | null {
  if (valueUsed === null || previousValue === null || previousValue === undefined || previousValue <= 0) {
    return null;
  }
  // Redondeado a 6 decimales para evitar falsos negativos en el límite del
  // 30 % por error de precisión de punto flotante (ej. (1.3-1.0)/1.0*100
  // da 30.000000000000004 en vez de 30).
  const pctIncrease = Math.round((((valueUsed - previousValue) / previousValue) * 100) * 1e6) / 1e6;
  if (pctIncrease <= 0 || pctIncrease > 30) return null;
  return 'Aumento menor de creatinina. Si coincide con inicio de IECA/ARA-II/iSGLT2, es esperado. No suspender.';
}
