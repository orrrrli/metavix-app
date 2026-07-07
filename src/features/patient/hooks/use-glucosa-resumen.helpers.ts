/**
 * Helpers puros para `useGlucosaResumen`.
 * Se mantienen en un módulo aparte para poderlos testear sin montar React Query.
 */

function parseDailyDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split("/");
  return new Date(Number(year), Number(month) - 1, Number(day));
}

/**
 * Combina una fecha `dd/MM/yyyy` con una hora `HH:mm` o `HH:mm:ss` y devuelve
 * el timestamp local. Si no hay hora, devuelve el timestamp del día con un
 * sesgo de -1ms para que las lecturas sin hora queden por debajo de las que
 * sí la tienen (no se mezclan al comparar contra el mismo día).
 */
export function tsDeLectura(recordDate: string, time: string | null): number {
  const d = parseDailyDate(recordDate);
  if (!time) return d.getTime() - 1;
  const [hh, mm] = time.split(":").map(Number);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), hh ?? 0, mm ?? 0).getTime();
}
