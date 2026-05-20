import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/utils/index";

interface SemaforoGlucosaProps {
  valor: number;
  className?: string;
}

export function SemaforoGlucosa({ valor, className }: SemaforoGlucosaProps) {
  let label = "Desconocido";
  let variantClass = "bg-gray-100 text-gray-800 border-gray-200";

  if (valor < 70) {
    label = "Baja";
    variantClass = "bg-amber-100 text-amber-800 border-amber-300";
  } else if (valor >= 70 && valor <= 130) {
    label = "En meta";
    variantClass = "bg-emerald-100 text-emerald-800 border-emerald-300";
  } else if (valor >= 131 && valor <= 180) {
    label = "Alta";
    variantClass = "bg-orange-100 text-orange-800 border-orange-300";
  } else if (valor > 180) {
    label = "Muy alta";
    variantClass = "bg-red-100 text-red-800 border-red-300";
  }

  return (
    <Badge variant="outline" className={cn(variantClass, className)}>
      <div className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
      {label} ({valor})
    </Badge>
  );
}
