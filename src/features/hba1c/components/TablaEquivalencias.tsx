import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { cn } from "@/shared/utils/index";
import { statusBadgeClasses, type ClinicalLevel } from "@/shared/utils/status-colors";

export function TablaEquivalencias() {
  const referencias: { hba1c: string; glucosa: string; interp: string; level: ClinicalLevel }[] = [
    { hba1c: "< 5.7", glucosa: "< 117", interp: "Sin diabetes", level: "success" },
    { hba1c: "5.7 - 6.4", glucosa: "117 - 137", interp: "Prediabetes", level: "warning" },
    { hba1c: "6.5", glucosa: "140", interp: "Diagnóstico DM", level: "neutral" },
    { hba1c: "7.0", glucosa: "154", interp: "Meta en DM", level: "success" },
    { hba1c: "7.1 - 8.0", glucosa: "155 - 183", interp: "Por encima de meta", level: "neutral" },
    { hba1c: "8.1 - 9.0", glucosa: "184 - 212", interp: "Control deficiente", level: "danger" },
    { hba1c: "9.1 - 10.0", glucosa: "213 - 240", interp: "Control muy malo", level: "danger" },
    { hba1c: "> 10.0", glucosa: "> 240", interp: "Control peligroso", level: "danger" },
  ];

  return (
    <div className="border rounded-xl overflow-hidden mt-8 shadow-sm bg-card">
      <div className="bg-muted/50 p-4 border-b">
        <h3 className="font-display font-semibold text-lg text-foreground">Tabla de Referencia ADA 2026</h3>
        <p className="text-sm text-muted-foreground">Interpretación clínica de los valores.</p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>HbA1c (%)</TableHead>
              <TableHead>Glucosa promedio (mg/dL)</TableHead>
              <TableHead>Interpretación clínica</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {referencias.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{item.hba1c}</TableCell>
                <TableCell>{item.glucosa}</TableCell>
                <TableCell>
                  <span className={cn("px-2.5 py-1 rounded-md text-xs font-semibold", statusBadgeClasses(item.level))}>
                    {item.interp}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
