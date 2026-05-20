import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/shared/utils/index";

type CalloutVariant = "info" | "success" | "warning" | "danger";

interface CalloutProps {
  variant: CalloutVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<CalloutVariant, { container: string; icon: React.ReactNode; iconClass: string }> = {
  info: {
    container: "border-blue-500 bg-blue-50 text-blue-900",
    icon: <Info className="h-4 w-4" />,
    iconClass: "text-blue-500",
  },
  success: {
    container: "border-emerald-500 bg-emerald-50 text-emerald-900",
    icon: <CheckCircle2 className="h-4 w-4" />,
    iconClass: "text-emerald-500",
  },
  warning: {
    container: "border-amber-500 bg-amber-50 text-amber-900",
    icon: <AlertTriangle className="h-4 w-4" />,
    iconClass: "text-amber-500",
  },
  danger: {
    container: "border-red-500 bg-red-50 text-red-900",
    icon: <AlertCircle className="h-4 w-4" />,
    iconClass: "text-red-500",
  },
};

export function Callout({ variant, title, children, className }: CalloutProps) {
  const styles = variantStyles[variant];

  return (
    <div className={cn("relative w-full rounded-md border-l-4 p-4 shadow-sm", styles.container, className)}>
      <div className={cn("absolute left-4 top-4", styles.iconClass)}>
        {styles.icon}
      </div>
      {title && <h5 className="mb-1 font-display font-bold leading-none tracking-tight ml-7">{title}</h5>}
      <div className={cn("text-sm [&_p]:leading-relaxed", title ? "ml-7" : "ml-7")}>
        {children}
      </div>
    </div>
  );
}
