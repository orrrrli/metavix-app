import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/metavix';
import { GoalChip } from './GoalChip';
import type { GoalStatus } from '@/types/goal-evaluation';

/**
 * Vista pre-formateada que el caller (T3) ensambla a partir de la respuesta
 * cruda de la API + el catálogo de parámetros. La card no conoce la API ni
 * el catálogo — sólo recibe la lista lista para renderizar.
 */
export interface GoalEvaluationItemView {
  parameterId: string;
  name: string;
  unit: string;
  value: number | null;
  status: GoalStatus;
  reason?: string | null;
  /** Nota clínica contextual (ej. advertencias por embarazo). Ver clinical-notes.ts. */
  note?: string | null;
  /** Alerta crítica urgente (ej. TG ≥ 500). Ver clinical-notes.ts. */
  criticalAlert?: string | null;
}

export interface GoalEvaluationCardProps {
  items: GoalEvaluationItemView[];
  title?: string;
  evaluatedAt?: string;
}

export function formatEvaluatedAt(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function GoalEvaluationCard({
  items,
  title = 'Evaluación de metas',
  evaluatedAt,
}: GoalEvaluationCardProps) {
  const sorted = [...items].sort((a, b) => a.parameterId.localeCompare(b.parameterId));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {evaluatedAt && (
          <p className="text-xs mt-1" style={{ color: 'var(--mut)' }}>
            Evaluación: {formatEvaluatedAt(evaluatedAt)}
          </p>
        )}
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <p className="text-sm italic" style={{ color: 'var(--mut)' }}>
            Sin parámetros evaluados.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sorted.map((item) => (
              <GoalChip
                key={item.parameterId}
                status={item.status}
                name={item.name}
                value={item.value}
                unit={item.unit}
                reason={item.reason}
                note={item.note}
                criticalAlert={item.criticalAlert}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
