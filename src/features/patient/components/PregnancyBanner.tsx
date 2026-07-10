'use client';

import { differenceInCalendarDays } from 'date-fns';
import { Card, CardContent, MetavixButton } from '@/shared/components/ui/metavix';
import { parseApiDate } from '@/features/patient/utils/parse-api-date';

export interface PregnancyBannerProps {
  isPregnant: boolean;
  pregnancyDueDate: string | null;
  onConfirmDeactivation?: () => void;
  onDismiss?: () => void;
  isConfirming?: boolean;
}

export function PregnancyBanner({
  isPregnant,
  pregnancyDueDate,
  onConfirmDeactivation,
  onDismiss,
  isConfirming,
}: PregnancyBannerProps) {
  if (!isPregnant || !pregnancyDueDate) return null;

  // La API envía la fecha como "dd/MM/yyyy"; parseISO no la resolvía → NaN y el
  // banner se mostraba siempre. Si no podemos parsear la fecha, no mostramos nada.
  const dueDate = parseApiDate(pregnancyDueDate);
  if (!dueDate) return null;

  // Sólo cuando la fecha de parto ya pasó (daysUntilDue < 0).
  const daysUntilDue = differenceInCalendarDays(dueDate, new Date());
  if (daysUntilDue >= 0) return null;

  return (
    <Card style={{ borderColor: 'var(--warn)', padding: 20 }}>
      <CardContent className="py-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
            Embarazo probablemente finalizado. ¿Confirmar desactivación?
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-2 sm:flex-none w-full sm:w-auto">
            <MetavixButton
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              disabled={isConfirming}
              className="w-full sm:w-auto whitespace-nowrap"
            >
              Mantener activo
            </MetavixButton>
            <MetavixButton
              variant="primary"
              size="sm"
              onClick={onConfirmDeactivation}
              disabled={isConfirming}
              className="w-full sm:w-auto whitespace-nowrap"
            >
              Confirmar desactivación
            </MetavixButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
