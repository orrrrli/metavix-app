/**
 * Strings en español de la pantalla del dashboard del paciente. Extraídos del
 * antiguo `app/paciente/dashboard/page.tsx` para separar copy de lógica/UI.
 */
export const dashboardStrings = {
  title: "Mi Panel",
  subtitle: (firstName: string, rachaDias: number) => {
    const base = `Este es tu resumen de hoy, ${firstName}.`;
    if (rachaDias === 0) return base;
    const rachaTexto = rachaDias === 1 ? "1 día seguido" : `${rachaDias} días seguidos`;
    return `${base} Llevas ${rachaTexto} registrando.`;
  },
  subtitleFallback: "Este es tu resumen de hoy.",
  errorTitle: "No pudimos cargar tus registros.",
  errorBody: "Revisa tu conexión o vuelve a intentarlo en un momento.",
  retryButton: "Reintentar",
  sinTendencia: "Aún no hay suficientes días para mostrar tu tendencia.",
  proximaMedicionFallback: "Cuando puedas — te toca una nueva lectura",
} as const;
