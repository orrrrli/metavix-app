import * as React from "react";
import { cn } from "@/shared/utils/index";

/**
 * MetavixCard — superficie con la identidad visual Metavix.
 * Reemplaza al shadcn Card dentro del dashboard (`.mvx-dash`).
 * Usa las variables de tema Metavix (`--card`, `--card-bd`, `--text`).
 *
 * API: igual que shadcn Card, así que las migraciones son
 * search-and-replace del import path.
 */

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn("rounded-2xl border", className)}
      style={{
        background: "var(--card)",
        borderColor: "var(--card-bd)",
        color: "var(--text)",
        fontFamily: "'Sora', sans-serif",
        padding: 20,
      }}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("mb-3 flex flex-col gap-1", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("text-base font-semibold leading-snug", className)}
      style={{ color: "var(--text)", letterSpacing: "-0.01em" }}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm", className)}
      style={{ color: "var(--mut)" }}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("self-start justify-self-end", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={className}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("mt-4 flex items-center gap-2", className)}
      style={{ borderTop: "1px solid var(--bd)", paddingTop: 14 }}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
