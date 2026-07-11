import { cn } from "@/shared/utils/index";
import { Badge } from "@/shared/components/ui/badge";
import { statusBadgeClasses, type ClinicalLevel } from "@/shared/utils/status-colors";

interface BadgeEstadoProps {
  estado: "en_meta" | "revisar" | "fuera_de_meta";
  className?: string;
}

export function BadgeEstado({ estado, className }: BadgeEstadoProps) {
  let label = "";
  let level: ClinicalLevel = "muted";

  switch (estado) {
    case "en_meta":
      label = "En meta";
      level = "success";
      break;
    case "revisar":
      label = "Revisar";
      level = "neutral";
      break;
    case "fuera_de_meta":
      label = "Fuera de meta";
      level = "danger";
      break;
  }

  return (
    <Badge variant="outline" className={cn(statusBadgeClasses(level), className)}>
      <div className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
      {label}
    </Badge>
  );
}
