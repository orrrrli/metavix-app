import { type ReactNode } from "react";

export function Muted({ children }: { children: ReactNode }) {
  return (
    <span style={{ color: "var(--mut)" }} className="italic">
      {children}
    </span>
  );
}

export function ProfileRow({
  icon,
  label,
  value,
  last,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between py-2.5"
      style={last ? undefined : { borderBottom: "1px solid var(--bd)" }}
    >
      <dt className="flex items-center gap-2 text-sm" style={{ color: "var(--mut)" }}>
        {icon}
        {label}
      </dt>
      <dd className="text-sm font-medium text-right" style={{ color: "var(--text)" }}>
        {value}
      </dd>
    </div>
  );
}
