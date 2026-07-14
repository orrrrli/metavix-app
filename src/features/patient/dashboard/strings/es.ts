/**
 * Strings en español de la pantalla del dashboard del paciente. Extraídos del
 * antiguo `app/paciente/dashboard/page.tsx` para separar copy de lógica/UI.
 */
export const dashboardStrings = {
  errorTitle: "No pudimos cargar tus registros.",
  errorBody: "Revisa tu conexión o vuelve a intentarlo en un momento.",
  retryButton: "Reintentar",
  sinTendencia: "Aún no hay suficientes días para mostrar tu tendencia.",
  proximaMedicionFallback: "Cuando puedas — te toca una nueva lectura",
} as const;
