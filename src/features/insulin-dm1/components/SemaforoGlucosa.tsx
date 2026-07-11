import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/utils/index";
import { statusBadgeClasses, type ClinicalLevel } from "@/shared/utils/status-colors";

interface SemaforoGlucosaProps {
  valor: number;
  className?: string;
}

export function SemaforoGlucosa({ valor, className }: SemaforoGlucosaProps) {
  let label = "Desconocido";
  let level: ClinicalLevel = "muted";

  if (valor < 70) {
    label = "Baja";
    level = "warning";
  } else if (valor >= 70 && valor <= 130) {
    label = "En meta";
    level = "success";
  } else if (valor >= 131 && valor <= 180) {
    label = "Alta";
    level = "neutral";
  } else if (valor > 180) {
    label = "Muy alta";
    level = "danger";
  }

  return (
    <Badge variant="outline" className={cn(statusBadgeClasses(level), className)}>
      <div className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
      {label} ({valor})
    </Badge>
  );
}
