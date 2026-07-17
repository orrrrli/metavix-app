/**
 * Strings en español específicos de la pantalla "Mis metas". Extraídos del
 * antiguo `MetasControl/index.tsx` para separar copy de lógica/UI. No es i18n
 * completo (por ahora sólo hay un idioma); es el punto único de edición del
 * texto de la página.
 */
export const metasStrings = {
  title: "Mis Metas de Control",
  subtitle: "Lo más importante primero, para que sepas qué hacer hoy.",
  pregnancyBadge: "Embarazo · metas ajustadas",
  pregnancyMode: {
    title: "Estás en modo embarazo",
    body: "Las metas clínicas que ves están ajustadas para el embarazo. Las metas personalizadas que tenías antes quedan en pausa y se reactivarán cuando se desactive el embarazo.",
  },
  pregnancyDeactivatedNote:
    "Metas de embarazo desactivadas. Se reactivan las metas personalizadas del paciente, si existen. Recomendar nueva evaluación.",
  dueDateReachedNote:
    "Fecha probable de parto alcanzada. ¿Confirmar desactivación del modo embarazo?",
  preEvaluationBanner:
    "Tus últimos resultados disponibles han sido cargados automáticamente. Los parámetros sin datos no cuentan con registros recientes.",
  evaluateButton: "Evaluar mis metas",
  evaluateError: "No se pudo evaluar las metas. Inténtalo de nuevo.",
  adaDisclaimer:
    "Valores de referencia basados en los estándares de atención médica de la ADA (Standards of Care 2026).",
  loadingMessage: "Cargando tus datos clínicos...",
} as const;
