import { cn } from "@/shared/utils/index";

export function SemaforoIndicador({ color }: { color: string }) {
  return (
    <div className={cn(
      "w-[14px] h-[14px] rounded-full shrink-0 shadow-sm transition-colors duration-500",
      color
    )} />
  );
}
