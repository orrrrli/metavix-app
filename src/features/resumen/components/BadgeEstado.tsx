import { cn } from "@/shared/utils/index";
import { Badge } from "@/shared/components/ui/badge";

interface BadgeEstadoProps {
  estado: "en_meta" | "revisar" | "fuera_de_meta";
  className?: string;
}

export function BadgeEstado({ estado, className }: BadgeEstadoProps) {
  let label = "";
  let variantClass = "";

  switch (estado) {
    case "en_meta":
      label = "En meta";
      variantClass = "bg-emerald-100 text-emerald-800 border-emerald-300";
      break;
    case "revisar":
      label = "Revisar";
      variantClass = "bg-orange-100 text-orange-800 border-orange-300";
      break;
    case "fuera_de_meta":
      label = "Fuera de meta";
      variantClass = "bg-red-100 text-red-800 border-red-300";
      break;
  }

  return (
    <Badge variant="outline" className={cn(variantClass, className)}>
      <div className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
      {label}
    </Badge>
  );
}
