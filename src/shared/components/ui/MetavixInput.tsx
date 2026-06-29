import * as React from "react";
import { cn } from "@/shared/utils/index";

/**
 * MetavixInput — input con la identidad visual Metavix.
 * Reemplaza al shadcn Input dentro del dashboard (`.mvx-dash`).
 */

export const MetavixInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, style, ...props }, ref) => {
    return (
      <input
        ref={ref}
        data-slot="input"
        className={cn(
          "h-10 w-full rounded-xl px-3 text-sm outline-none transition-colors placeholder:text-[color:var(--soft)] focus:border-[color:var(--accent)] disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        style={{
          background: "var(--canvas)",
          border: "1px solid var(--input, var(--bd))",
          color: "var(--text)",
          fontFamily: "'Sora', sans-serif",
          ...style,
        }}
        {...props}
      />
    );
  }
);
MetavixInput.displayName = "MetavixInput";
