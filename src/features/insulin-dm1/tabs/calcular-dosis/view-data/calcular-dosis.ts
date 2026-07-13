/**
 * Cálculo de dosis de insulina para DM1. CÓDIGO CLÍNICO — un bug aquí es un
 * riesgo para el paciente. Función pura, sin React, testeada con casos de
 * frontera. Captura exactamente el comportamiento que vivía inline en
 * `CalcularDosis.tsx`.
 *
 * Fórmula:
 *   dosisComida     = HC a comer / RIC
 *   dosisCorrección = (glucosa − meta) / factorSensibilidad   (sólo si glucosa > meta)
 *   total           = redondeo a 0.5 U de (comida + corrección)
 *
 * Reglas de seguridad (alertas):
 *   glucosa < 70   → HIPOGLUCEMIA: no aplicar insulina; todas las dosis en 0.
 *   glucosa > 250  → MUY ALTA (danger), pero se calcula corrección.
 *   glucosa > 130  → ALTA (warning).
 *   en otro caso   → EN META (success).
 */

export type AlertaVariant = "info" | "success" | "warning" | "danger";

export interface DosisAlerta {
  variant: AlertaVariant;
  msg: string;
}

export interface DosisResultado {
  dosisComida: number;
  dosisCorreccion: number;
  total: number;
  alerta: DosisAlerta | null;
}

export interface CalcularDosisInput {
  /** Gramos de HC a comer. */
  hc: number;
  /** Glucosa preprandial actual (mg/dL). */
  glucosa: number;
  /** Glucosa meta (mg/dL). */
  meta: number;
  /** Relación insulina:carbohidrato (g/U). */
  ric: number;
  /** Factor de sensibilidad (mg/dL por U). */
  fs: number;
}

const HIPO_MSG =
  "HIPOGLUCEMIA: Consume 15g de carbohidratos rápidos y espera 15 min. No apliques insulina todavía.";
const MUY_ALTA_MSG =
  "MUY ALTA: Revisa cetonas si es posible. Toma agua y considera contactar a tu médico.";
const ALTA_MSG = "ALTA: Se ha añadido insulina de corrección a tu dosis.";
const EN_META_MSG = "EN META: Estás dentro de tu rango objetivo.";

/**
 * Devuelve la dosis sugerida, o `null` si falta cualquier dato (0 / NaN) — el
 * mismo guard que tenía el formulario (`if (!valHc || !valGluc || ...)`).
 */
export function calcularDosis(input: CalcularDosisInput): DosisResultado | null {
  const { hc, glucosa, meta, ric, fs } = input;

  // Guard: cualquier valor ausente o cero invalida el cálculo (los inputs son
  // `required` en el form; esto replica el early-return numérico).
  if (!hc || !glucosa || !meta || !ric || !fs) return null;

  // Hipoglucemia: no se aplica insulina. Corta antes de cualquier cálculo.
  if (glucosa < 70) {
    return {
      dosisComida: 0,
      dosisCorreccion: 0,
      total: 0,
      alerta: { variant: "danger", msg: HIPO_MSG },
    };
  }

  let alerta: DosisAlerta;
  if (glucosa > 250) alerta = { variant: "danger", msg: MUY_ALTA_MSG };
  else if (glucosa > 130) alerta = { variant: "warning", msg: ALTA_MSG };
  else alerta = { variant: "success", msg: EN_META_MSG };

  const dosisComida = hc / ric;
  const dosisCorreccion = glucosa > meta ? (glucosa - meta) / fs : 0;

  const total = Math.round((dosisComida + dosisCorreccion) * 2) / 2;

  return {
    dosisComida: Number(dosisComida.toFixed(2)),
    dosisCorreccion: Number(dosisCorreccion.toFixed(2)),
    total,
    alerta,
  };
}
