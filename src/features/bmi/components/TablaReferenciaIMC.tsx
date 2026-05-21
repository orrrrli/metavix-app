import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { cn } from "@/shared/utils/index";

export function TablaReferenciaIMC() {
  const referencias = [
    { cat: "Bajo peso", rango: "< 18.5", riesgo: "Aumentado", color: "text-amber-600 bg-amber-50" },
    { cat: "Normal", rango: "18.5 - 24.9", riesgo: "Promedio", color: "text-emerald-600 bg-emerald-50" },
    { cat: "Sobrepeso", rango: "25.0 - 29.9", riesgo: "Aumentado", color: "text-orange-600 bg-orange-50" },
    { cat: "Obesidad grado I", rango: "30.0 - 34.9", riesgo: "Moderado", color: "text-red-600 bg-red-50" },
    { cat: "Obesidad grado II", rango: "35.0 - 39.9", riesgo: "Severo", color: "text-red-700 bg-red-100" },
    { cat: "Obesidad grado III", rango: "≥ 40.0", riesgo: "Muy severo", color: "text-red-800 bg-red-200" },
  ];

  return (
    <div className="border rounded-xl overflow-hidden mt-8 shadow-sm bg-white">
      <div className="bg-muted/50 p-4 border-b">
        <h3 className="font-display font-semibold text-lg text-foreground">Clasificación de la OMS</h3>
        <p className="text-sm text-muted-foreground">Tabla de referencia estándar para adultos.</p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Categoría</TableHead>
              <TableHead>IMC</TableHead>
              <TableHead>Riesgo Asociado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {referencias.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">
                  <span className={cn("px-2 py-1 rounded-md text-xs font-semibold", item.color)}>
                    {item.cat}
                  </span>
                </TableCell>
                <TableCell>{item.rango}</TableCell>
                <TableCell className="text-muted-foreground">{item.riesgo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
