import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { cn } from "@/shared/utils/index";
import { imcLevel, statusBadgeClasses } from "@/shared/utils/status-colors";

export function TablaReferenciaIMC() {
  const referencias = [
    { cat: "Bajo peso", rango: "< 18.5", riesgo: "Aumentado" },
    { cat: "Normal", rango: "18.5 - 24.9", riesgo: "Promedio" },
    { cat: "Sobrepeso", rango: "25.0 - 29.9", riesgo: "Aumentado" },
    { cat: "Obesidad grado I", rango: "30.0 - 34.9", riesgo: "Moderado" },
    { cat: "Obesidad grado II", rango: "35.0 - 39.9", riesgo: "Severo" },
    { cat: "Obesidad grado III", rango: "≥ 40.0", riesgo: "Muy severo" },
  ];

  return (
    <div className="border rounded-xl overflow-hidden mt-8 shadow-sm bg-card">
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
                  <span className={cn("px-2 py-1 rounded-md text-xs font-semibold border", statusBadgeClasses(imcLevel(item.cat)))}>
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
