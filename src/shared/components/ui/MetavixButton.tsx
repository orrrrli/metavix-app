import * as React from "react";
import { cn } from "@/shared/utils/index";

/**
 * MetavixButton — botón con la identidad visual Metavix.
 * Reemplaza al shadcn Button dentro del dashboard (`.mvx-dash`).
 *
 * Variants:
 * - primary: teal sólido (--accent)
 * - secondary: superficie neutra
 * - ghost: transparente, hover muestra fondo
 * - destructive: rojo (--bad)
 *
 * Sizes: sm, default, lg.
 */

type Variant = "primary" | "secondary" | "ghost" | "destructive";
type Size = "sm" | "default" | "lg";

const SIZE: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  default: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

function variantStyle(v: Variant): React.CSSProperties {
  switch (v) {
    case "primary":
      return { background: "var(--accent)", color: "#03251d", border: "1px solid var(--accent)" };
    case "secondary":
      return { background: "var(--card)", color: "var(--text)", border: "1px solid var(--card-bd)" };
    case "ghost":
      return { background: "transparent", color: "var(--text)", border: "1px solid transparent" };
    case "destructive":
      return { background: "var(--bad)", color: "#fff", border: "1px solid var(--bad)" };
  }
}

export interface MetavixButtonProps extends React.ComponentProps<"button"> {
  variant?: Variant;
  size?: Size;
}

export const MetavixButton = React.forwardRef<HTMLButtonElement, MetavixButtonProps>(
  ({ className, variant = "primary", size = "default", style, ...props }, ref) => {
    return (
      <button
        ref={ref}
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-[transform,background-color,border-color,color] duration-200 disabled:pointer-events-none disabled:opacity-50",
          SIZE[size],
          className
        )}
        style={{ ...variantStyle(variant), fontFamily: "'Sora', sans-serif", ...style }}
        {...props}
      />
    );
  }
);
MetavixButton.displayName = "MetavixButton";
