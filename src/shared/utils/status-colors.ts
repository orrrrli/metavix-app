/**
 * Helpers de colores con variantes light/dark para componentes clínicos.
 *
 * Mantienen la jerarquía clínica (verde = en meta, ámbar = revisar,
 * naranja = alerta, rojo = fuera de meta) en ambos modos de tema.
 *
 * Usado por: SemaforoGlucosa, BadgeEstado, Callout, AvisoLegal,
 * TablaEquivalencias, TablaReferenciaIMC, ResultadoIMC, HistorialIMC,
 * ResultadoRiesgoCV, ResultadoFINDRISC, Aprender.tsx, ResumenSalud, etc.
 */

export type ClinicalLevel =
  | "success"
  | "info"
  | "warning"
  | "danger"
  | "neutral"
  | "muted";

/**
 * Devuelve las clases de Tailwind para un badge de estado clínico,
 * incluyendo variantes `dark:` para que funcione en ambos modos.
 *
 * Ejemplo: `statusBadgeClasses("success")` →
 *   `bg-emerald-100 text-emerald-800 border-emerald-300
 *    dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-700`
 */
export function statusBadgeClasses(level: ClinicalLevel): string {
  switch (level) {
    case "success":
      return "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-700";
    case "info":
      return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-700";
    case "warning":
      return "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-700";
    case "danger":
      return "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-200 dark:border-red-700";
    case "muted":
      return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800/40 dark:text-gray-200 dark:border-gray-600";
    case "neutral":
      return "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-200 dark:border-orange-700";
  }
}

/**
 * Clases para callouts (aviso con borde izquierdo coloreado + fondo tenue).
 *
 * Ejemplo: `statusCalloutClasses("warning")` →
 *   `border-amber-500 bg-amber-50 text-amber-900
 *    dark:border-amber-400 dark:bg-amber-950/40 dark:text-amber-100`
 */
export function statusCalloutClasses(
  level: "info" | "success" | "warning" | "danger"
): string {
  switch (level) {
    case "info":
      return "border-blue-500 bg-blue-50 text-blue-900 dark:border-blue-400 dark:bg-blue-950/40 dark:text-blue-100";
    case "success":
      return "border-emerald-500 bg-emerald-50 text-emerald-900 dark:border-emerald-400 dark:bg-emerald-950/40 dark:text-emerald-100";
    case "warning":
      return "border-amber-500 bg-amber-50 text-amber-900 dark:border-amber-400 dark:bg-amber-950/40 dark:text-amber-100";
    case "danger":
      return "border-red-500 bg-red-50 text-red-900 dark:border-red-400 dark:bg-red-950/40 dark:text-red-100";
  }
}

/**
 * Clases para secciones de página con fondo azulado tenue (slate-50/50).
 * Usado por las secciones del resumen de salud.
 */
export function sectionContainerClasses(): string {
  return "bg-slate-50/50 border-slate-100 dark:bg-white/[0.03] dark:border-white/10";
}

/**
 * Clases para iconos dentro de un callout. El icono lleva el color saturado
 * para destacar sobre el fondo tenue.
 */
export function statusCalloutIconClasses(
  level: "info" | "success" | "warning" | "danger"
): string {
  switch (level) {
    case "info":
      return "text-blue-500 dark:text-blue-300";
    case "success":
      return "text-emerald-500 dark:text-emerald-300";
    case "warning":
      return "text-amber-500 dark:text-amber-300";
    case "danger":
      return "text-red-500 dark:text-red-300";
  }
}

/**
 * Mapea el resultado del IMC a un nivel clínico para usar con los helpers
 * de arriba. Centraliza la lógica de categorización de IMC.
 */
export function imcLevel(categoria: string): ClinicalLevel {
  if (categoria === "Bajo peso") return "warning";
  if (categoria === "Normal") return "success";
  if (categoria === "Sobrepeso") return "neutral";
  if (categoria.includes("grado I")) return "danger";
  if (categoria.includes("grado II")) return "danger";
  // grado III
  return "danger";
}
