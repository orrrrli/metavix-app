'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, ChevronDown, ChevronRight, Pencil, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { useClinicalGoals, useSaveClinicalGoal } from '../hooks/use-clinical-goals';
import { CustomGoalForm } from './CustomGoalForm';
import { PARAMETROS_META } from '@/features/metas/data/parametros';
import type { ClinicalGoal, ClinicalGoalPayload } from '@/types/clinical-goal';

interface ClinicalGoalsEditorProps {
  doctorId: string;
  patientId: string;
  /** `true` si la paciente está activa en embarazo. Sólo afecta al copy
   *  del banner de presión arterial — la edición funciona igual en todos
   *  los casos. */
  isPregnant?: boolean;
}

/**
 * Lista de metas clínicas personalizadas del paciente con edición inline
 * por parámetro. Cada parámetro se renderiza como un card colapsable que
 * muestra la meta del catálogo ADA 2026 y, si existe una meta
 * personalizada, los umbrales activos del doctor.
 *
 * Al pulsar "Personalizar" o "Editar" se despliega el `CustomGoalForm`.
 * Al guardar, la mutación decide POST (no existe meta) o PUT (existe) y
 * muestra un toast recordando al paciente que vuelva a evaluar para ver
 * los nuevos colores del semáforo.
 */
export function ClinicalGoalsEditor({
  doctorId,
  patientId,
  isPregnant = false,
}: ClinicalGoalsEditorProps) {
  const { data: goals = [], isLoading } = useClinicalGoals(doctorId, patientId);
  const { mutateAsync: saveGoal, isPending: isSaving } = useSaveClinicalGoal(doctorId, patientId);

  const [openParamId, setOpenParamId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Cargando metas…
      </div>
    );
  }

  const goalsByParam = new Map<string, ClinicalGoal>(
    goals.map((g) => [g.parameterId, g]),
  );

  const handleSave = async (
    parameterId: string,
    existing: ClinicalGoal | null,
    payload: ClinicalGoalPayload,
  ) => {
    try {
      await saveGoal({ goalId: existing?.id ?? null, parameterId, payload });
      toast.success(
        existing
          ? 'Meta actualizada. Pide al paciente que vuelva a evaluar para ver los nuevos colores.'
          : 'Meta creada. Pide al paciente que vuelva a evaluar para ver los nuevos colores.',
      );
      setOpenParamId(null);
    } catch {
      toast.error('No se pudo guardar la meta. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="space-y-4">
      {isPregnant && (
        <div
          role="status"
          className="flex items-start gap-3 p-4 rounded-lg border-2"
          style={{ background: 'var(--info-bg)', borderColor: 'var(--info)' }}
        >
          <div
            className="flex items-center justify-center size-9 rounded-full shrink-0"
            style={{ background: 'var(--info)' }}
          >
            <Info className="size-5" style={{ color: '#fff' }} aria-hidden="true" />
          </div>
          <div className="flex-1 pt-0.5">
            <p className="text-base font-semibold" style={{ color: 'var(--text)' }}>
              Paciente en modo embarazo
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--text)' }}>
              Para presión arterial y parámetros sin default de embarazo, la meta personalizada
              que definas aquí es la que se usa en la evaluación.
            </p>
          </div>
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        Define umbrales personalizados por parámetro. Una meta vacía usa el default del catálogo
        ADA 2026. Los cambios se aplican en la siguiente evaluación de metas del paciente.
      </p>

      {PARAMETROS_META.map((param) => {
        const existing = goalsByParam.get(param.id) ?? null;
        const isOpen = openParamId === param.id;
        return (
          <Card key={param.id} className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <CardTitle className="text-base flex items-center gap-2">
                    {param.nombre}
                    {existing && (
                      <Badge variant="secondary" className="text-[10px] uppercase">
                        Personalizada
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Default catálogo: <span className="font-medium">{param.metaMostrada}</span>
                    {param.fuente && <> · {param.fuente}</>}
                  </CardDescription>
                  {existing && <CustomGoalSummary goal={existing} unit={param.unidad} />}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOpenParamId(isOpen ? null : param.id)}
                  aria-expanded={isOpen}
                  aria-controls={`form-${param.id}`}
                >
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 mr-1" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-1" />
                  )}
                  {existing ? 'Editar' : 'Personalizar'}
                  {!isOpen && existing && <Pencil className="h-3 w-3 ml-1" />}
                </Button>
              </div>
            </CardHeader>
            {isOpen && (
              <CardContent id={`form-${param.id}`}>
                <CustomGoalForm
                  existing={existing}
                  unit={param.unidad}
                  step={param.step}
                  isSaving={isSaving}
                  onSubmit={(payload) => handleSave(param.id, existing, payload)}
                  onCancel={() => setOpenParamId(null)}
                />
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function CustomGoalSummary({ goal, unit }: { goal: ClinicalGoal; unit: string }) {
  const items: string[] = [];
  if (goal.customOutOfRangeLow !== null) items.push(`Fuera < ${goal.customOutOfRangeLow}${unit ? ` ${unit}` : ''}`);
  if (goal.customAtRiskLow !== null) items.push(`Revisar ≥ ${goal.customAtRiskLow}${unit ? ` ${unit}` : ''}`);
  if (goal.customAtRiskHigh !== null) items.push(`Revisar > ${goal.customAtRiskHigh}${unit ? ` ${unit}` : ''}`);
  if (goal.customOutOfRangeHigh !== null) items.push(`Fuera ≥ ${goal.customOutOfRangeHigh}${unit ? ` ${unit}` : ''}`);

  if (items.length === 0) return null;

  return (
    <p className="mt-2 text-xs text-muted-foreground">
      Actual: {items.join(' · ')}
    </p>
  );
}
