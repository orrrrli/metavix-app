import * as React from "react";
import { cn } from "@/shared/utils/index";

/**
 * MetavixBadge — pill/badge con la identidad visual Metavix.
 * Reemplaza al shadcn Badge dentro del dashboard.
 *
 * Variants: default, ok, warn, bad, info, neutral.
 * Usa los pares `--ok/--ok-bg`, `--warn/--warn-bg`, etc.
 */

type Variant = "default" | "ok" | "warn" | "bad" | "info" | "neutral";

function variantStyle(v: Variant): React.CSSProperties {
  switch (v) {
    case "ok":
      return { color: "var(--ok)", background: "var(--ok-bg)" };
    case "warn":
      return { color: "var(--warn)", background: "var(--warn-bg)" };
    case "bad":
      return { color: "var(--bad)", background: "var(--bad-bg)" };
    case "info":
      return { color: "var(--info)", background: "var(--info-bg)" };
    case "neutral":
      return { color: "var(--mut)", background: "var(--ph)" };
    case "default":
    default:
      return { color: "var(--nav-active)", background: "var(--nav-active-bg)" };
  }
}

export interface MetavixBadgeProps extends React.ComponentProps<"span"> {
  variant?: Variant;
}

export const MetavixBadge = React.forwardRef<HTMLSpanElement, MetavixBadgeProps>(
  ({ className, variant = "default", style, ...props }, ref) => {
    return (
      <span
        ref={ref}
        data-slot="badge"
        data-variant={variant}
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
          className
        )}
        style={{ ...variantStyle(variant), fontFamily: "'Sora', sans-serif", ...style }}
        {...props}
      />
    );
  }
);
MetavixBadge.displayName = "MetavixBadge";
