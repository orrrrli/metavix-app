import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/shared/utils/index";
import { statusCalloutClasses, statusCalloutIconClasses } from "@/shared/utils/status-colors";

type CalloutVariant = "info" | "success" | "warning" | "danger";

interface CalloutProps {
  variant: CalloutVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<CalloutVariant, { container: string; icon: React.ReactNode; iconClass: string }> = {
  info: {
    container: statusCalloutClasses("info"),
    icon: <Info className="h-4 w-4" />,
    iconClass: statusCalloutIconClasses("info"),
  },
  success: {
    container: statusCalloutClasses("success"),
    icon: <CheckCircle2 className="h-4 w-4" />,
    iconClass: statusCalloutIconClasses("success"),
  },
  warning: {
    container: statusCalloutClasses("warning"),
    icon: <AlertTriangle className="h-4 w-4" />,
    iconClass: statusCalloutIconClasses("warning"),
  },
  danger: {
    container: statusCalloutClasses("danger"),
    icon: <AlertCircle className="h-4 w-4" />,
    iconClass: statusCalloutIconClasses("danger"),
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
