import { cn } from "@/shared/utils/index";

/**
 * Acepta tanto clases Tailwind (`bg-emerald-500`) como CSS variables (`var(--ok)`)
 * para que el semáforo respete dark mode cuando se pasa una variable de tema.
 */
export function SemaforoIndicador({ color }: { color: string }) {
  const isVar = color.startsWith("var(");
  return (
    <div
      className={cn(
        "w-[14px] h-[14px] rounded-full shrink-0 shadow-sm transition-colors duration-500",
        !isVar && color,
      )}
      style={isVar ? { background: color } : undefined}
    />
  );
}
