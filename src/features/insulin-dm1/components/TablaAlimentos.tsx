import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";

export function TablaAlimentos() {
  const alimentos = [
    { alimento: "Manzana", porcion: "1 pieza mediana", hc: 15, raciones: 1, u_ejemplo: "1 U" },
    { alimento: "Tortilla de maíz", porcion: "1 pieza", hc: 15, raciones: 1, u_ejemplo: "1 U" },
    { alimento: "Arroz cocido", porcion: "1/3 taza", hc: 15, raciones: 1, u_ejemplo: "1 U" },
    { alimento: "Leche entera", porcion: "1 taza (240ml)", hc: 12, raciones: 1, u_ejemplo: "~1 U" },
    { alimento: "Pan de caja", porcion: "1 rebanada", hc: 15, raciones: 1, u_ejemplo: "1 U" },
    { alimento: "Avena cocida", porcion: "1/2 taza", hc: 15, raciones: 1, u_ejemplo: "1 U" },
    { alimento: "Frijoles cocidos", porcion: "1/2 taza", hc: 20, raciones: "1.3", u_ejemplo: "1.5 U" },
    { alimento: "Plátano", porcion: "1/2 pieza", hc: 15, raciones: 1, u_ejemplo: "1 U" },
  ];

  return (
    <div className="border rounded-md mt-6">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Alimento</TableHead>
            <TableHead>Porción</TableHead>
            <TableHead className="text-right">Gramos de HC</TableHead>
            <TableHead className="text-right">Porciones</TableHead>
            <TableHead className="text-right">Unidades aprox.*</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alimentos.map((item, idx) => (
            <TableRow key={idx}>
              <TableCell className="font-medium">{item.alimento}</TableCell>
              <TableCell>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:hover:bg-blue-900/50 border-transparent font-normal">
                  {item.porcion}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-semibold">{item.hc} g</TableCell>
              <TableCell className="text-right text-muted-foreground">{item.raciones}</TableCell>
              <TableCell className="text-right font-medium text-primary">{item.u_ejemplo}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="p-3 text-xs text-muted-foreground bg-muted/20 border-t">
        * Las unidades aproximadas asumen un RIC de 15g por unidad. Tu médico te indicará tu RIC personal.
      </div>
    </div>
  );
}
