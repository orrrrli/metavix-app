'use client';

import { differenceInCalendarDays, parseISO } from 'date-fns';
import { Card, CardContent, MetavixButton } from '@/shared/components/ui/metavix';

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

  const daysUntilDue = differenceInCalendarDays(parseISO(pregnancyDueDate), new Date());
  if (daysUntilDue > 14) return null;

  return (
    <Card style={{ borderColor: 'var(--warn)' }}>
      <CardContent>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
            Embarazo probablemente finalizado. ¿Confirmar desactivación?
          </p>
          <div className="flex gap-2">
            <MetavixButton variant="ghost" size="sm" onClick={onDismiss} disabled={isConfirming}>
              Mantener activo
            </MetavixButton>
            <MetavixButton variant="primary" size="sm" onClick={onConfirmDeactivation} disabled={isConfirming}>
              Confirmar desactivación
            </MetavixButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
