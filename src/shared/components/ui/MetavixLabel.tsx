import * as React from "react";
import { cn } from "@/shared/utils/index";

/**
 * MetavixLabel — label con la tipografía Metavix (Sora).
 * Reemplaza al shadcn Label dentro del dashboard.
 */

export const MetavixLabel = React.forwardRef<HTMLLabelElement, React.ComponentProps<"label">>(
  ({ className, style, ...props }, ref) => {
    return (
      <label
        ref={ref}
        data-slot="label"
        className={cn("text-sm font-medium", className)}
        style={{ color: "var(--text)", fontFamily: "'Sora', sans-serif", ...style }}
        {...props}
      />
    );
  }
);
MetavixLabel.displayName = "MetavixLabel";
