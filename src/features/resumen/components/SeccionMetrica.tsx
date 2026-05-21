import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { BadgeEstado } from "./BadgeEstado";
import { EstadoMetrica } from "../utils/interpretacionADA";

interface SeccionMetricaProps {
  nombre: string;
  valor: number | null;
  unidad: string;
  fecha: string | null;
  estado?: EstadoMetrica;
  meta?: string;
}

export function SeccionMetrica({ nombre, valor, unidad, fecha, estado, meta }: SeccionMetricaProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 border-b last:border-0 hover:bg-muted/30 transition-colors px-2 -mx-2 rounded-md">
      <div className="flex-1">
        <h4 className="font-semibold text-foreground text-sm sm:text-base">{nombre}</h4>
        {fecha ? (
          <p className="text-xs text-muted-foreground mt-0.5">
            Registrado: {format(parseISO(fecha), "dd MMM yyyy", { locale: es })}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground mt-0.5">Sin registro reciente</p>
        )}
      </div>

      <div className="flex-1 flex flex-col items-start sm:items-end mt-2 sm:mt-0 space-y-1">
        <div className="flex items-center gap-3">
          {valor !== null ? (
            <span className="font-bold text-lg">{valor} <span className="text-sm font-normal text-muted-foreground">{unidad}</span></span>
          ) : (
            <span className="text-muted-foreground italic text-sm">Sin registro</span>
          )}
          {valor !== null && estado && <BadgeEstado estado={estado} />}
        </div>
        {meta && (
          <p className="text-xs text-muted-foreground">
            Meta: <span className="font-medium text-foreground/80">{meta}</span>
          </p>
        )}
      </div>
    </div>
  );
}
