"use client";

import { cn } from "@/shared/utils";
import { GlucoseReadingType } from "@/types/daily-record";

interface MealTimeSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

// ── SVG Icons ──────────────────────────────────────────────────────

function CrescentMoonIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Thin crescent — fasted, pre-dawn */}
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunriseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Upward rays */}
      <path d="M12 3v2" />
      <path d="M5.64 5.64l1.41 1.41" />
      <path d="M18.36 5.64l-1.41 1.41" />
      {/* Half-sun arc at horizon */}
      <path d="M5 15a7 7 0 0 1 14 0" />
      {/* Horizon line */}
      <line x1="2" y1="15" x2="22" y2="15" />
    </svg>
  );
}

function HighNoonSunIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M4.93 4.93l1.41 1.41" />
      <path d="M17.66 17.66l1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M4.93 19.07l1.41-1.41" />
      <path d="M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function CoffeeCupIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Cup body */}
      <path d="M17 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
      {/* Steam wisps */}
      <path d="M6 2c0 2-2 2-2 4" />
      <path d="M10 2c0 2-2 2-2 4" />
      <path d="M14 2c0 2-2 2-2 4" />
    </svg>
  );
}

function SunsetIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Downward arrow on sun */}
      <path d="M12 14v3" />
      <path d="M10 15.5l2 2 2-2" />
      {/* Half-sun arc sitting on horizon */}
      <path d="M5 11a7 7 0 0 1 14 0" />
      {/* Horizon lines */}
      <line x1="2" y1="11" x2="22" y2="11" />
      <line x1="5" y1="14" x2="19" y2="14" />
    </svg>
  );
}

function MoonNightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Fuller moon for post-dinner night */}
      <circle cx="12" cy="13" r="7" />
      {/* Subtle crater suggestion */}
      <circle cx="10" cy="11" r="2" />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06z" />
      <path d="M10 2c1 .5 2 2 2 5" />
    </svg>
  );
}

function UtensilsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Fork: tines + handle */}
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      {/* Knife: blade + handle */}
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z" />
      <path d="M21 15v7" />
    </svg>
  );
}

function DeepNightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Large 4-pointed star */}
      <path d="M12 2l1.5 7.5L21 11l-7.5 1.5L12 20l-1.5-7.5L3 11l7.5-1.5z" />
      {/* Small accent stars */}
      <path d="M20 3l.4 1.2 1.2.4-1.2.4L20 6.2l-.4-1.2-1.2-.4 1.2-.4z" />
      <path d="M4 17l.3.9.9.3-.9.3-.3.9-.3-.9-.9-.3.9-.3z" />
    </svg>
  );
}

// ── Option map ─────────────────────────────────────────────────────

interface MealOption {
  value: GlucoseReadingType;
  label: string;
  Icon: React.FC<{ className?: string }>;
}

const MEAL_OPTIONS: MealOption[] = [
  { value: GlucoseReadingType.Fasting,       label: "En ayuno",       Icon: CrescentMoonIcon },
  { value: GlucoseReadingType.PostBreakfast, label: "Post desayuno",  Icon: CoffeeCupIcon    },
  { value: GlucoseReadingType.PreLunch,      label: "Pre comida",     Icon: HighNoonSunIcon  },
  { value: GlucoseReadingType.PostLunch,     label: "Post comida",    Icon: UtensilsIcon     },
  { value: GlucoseReadingType.PreDinner,     label: "Pre cena",       Icon: SunsetIcon       },
  { value: GlucoseReadingType.PostDinner,    label: "Post cena",      Icon: MoonNightIcon    },
  { value: GlucoseReadingType.Snack,         label: "Colación",       Icon: AppleIcon        },
  { value: GlucoseReadingType.Overnight,     label: "Madrugada",      Icon: DeepNightIcon    },
];

// ── Component ──────────────────────────────────────────────────────

export function MealTimeSelector({ value, onChange }: MealTimeSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {MEAL_OPTIONS.map((option) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition-all duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
              isSelected
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-accent hover:text-foreground"
            )}
          >
            <option.Icon className="size-6 shrink-0" />
            <span className="text-[10px] font-medium leading-tight">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
