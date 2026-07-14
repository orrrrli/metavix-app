import { type ReactNode } from "react";

/** Valor atenuado en cursiva para placeholders ("No registrada", etc.). */
export function Muted({ children }: { children: ReactNode }) {
  return <span className="text-muted-foreground italic">{children}</span>;
}

/**
 * Fila etiqueta/valor de un `<dl>` de perfil. Compartida entre el perfil del
 * paciente y el del doctor. El borde inferior se suprime automáticamente en la
 * última fila (`last:border-0`); pasa `last` para forzarlo cuando el orden de
 * los hijos es condicional.
 */
export function ProfileRow({
  icon,
  label,
  value,
  last,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between py-2.5 ${
        last ? "" : "border-b last:border-0"
      }`}
    >
      <dt className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="text-sm font-medium text-right">{value}</dd>
    </div>
  );
}
