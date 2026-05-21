import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { cn } from "@/shared/utils/index";

interface HistorialIMCProps {
  historial: any[];
}

export function HistorialIMC({ historial }: HistorialIMCProps) {
  if (historial.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground border rounded-xl bg-muted/20 mt-8">
        No hay registros históricos. Calcula tu IMC para guardar tu primera medición.
      </div>
    );
  }

  const getBadgeColor = (cat: string) => {
    if (cat === "Bajo peso") return "text-amber-700 bg-amber-100";
    if (cat === "Normal") return "text-emerald-700 bg-emerald-100";
    if (cat === "Sobrepeso") return "text-orange-700 bg-orange-100";
    if (cat.includes("grado I")) return "text-red-600 bg-red-100";
    if (cat.includes("grado II")) return "text-red-700 bg-red-100";
    return "text-red-800 bg-red-200";
  };

  // Mostrar maximo 20
  const records = historial.slice(0, 20);

  return (
    <div className="mt-8">
      <h3 className="text-xl font-display font-bold mb-4">Historial de Mediciones</h3>
      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Peso</TableHead>
                <TableHead>Estatura</TableHead>
                <TableHead>IMC</TableHead>
                <TableHead>Categoría</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {format(parseISO(r.fecha), "dd MMM, yyyy - HH:mm", { locale: es })}
                  </TableCell>
                  <TableCell>{r.peso_kg} kg</TableCell>
                  <TableCell>{r.estatura_cm} cm</TableCell>
                  <TableCell className="font-bold">{r.imc.toFixed(1)}</TableCell>
                  <TableCell>
                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold", getBadgeColor(r.categoria))}>
                      {r.categoria}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
