"use client";

import { useAuthStore } from "@/features/auth/store";
import { useGlucosaResumen, RangoVentana } from "@/features/patient/hooks/use-glucosa-resumen";

/**
 * Subcomponente cliente que calcula el sub-saludo del layout del paciente.
 * Issue #9: el default hardcodeado ("Sábado, 28 de junio · llevas 4 días
 * seguidos") se reemplazó por un saludo real basado en el día de hoy y la
 * racha de días consecutivos con al menos una lectura.
 */
export default function SubSaludoPaciente({ rango }: { rango: RangoVentana }) {
  const { patientId } = useAuthStore();
  const resumen = useGlucosaResumen(patientId, rango);

  if (resumen.error) return null;
  if (!resumen.tieneRegistros || resumen.rachaDias === 0) return null;

  const fechaLarga = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const fecha = fechaLarga.charAt(0).toUpperCase() + fechaLarga.slice(1);

  const racha = resumen.rachaDias;
  const rachaTexto =
    racha === 1
      ? "1 día seguido"
      : `${racha} días seguidos`;

  return (
    <>
      {fecha} · llevas{" "}
      <span style={{ color: "var(--text)", fontWeight: 600 }}>{rachaTexto}</span>{" "}
      registrando.
    </>
  );
}
