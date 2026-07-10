'use client';

import { format, isFuture } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent } from '@/shared/components/ui/metavix';
import { parseApiDate } from '@/features/patient/utils/parse-api-date';

export interface ScheduledPregnancyBannerProps {
  isPregnant: boolean;
  pregnancyStartDate: string | null;
}

export function ScheduledPregnancyBanner({ isPregnant, pregnancyStartDate }: ScheduledPregnancyBannerProps) {
  if (!isPregnant || !pregnancyStartDate) return null;

  // La API envía la fecha como "dd/MM/yyyy"; usamos el parser robusto en lugar
  // de parseISO (que devuelve Invalid Date para ese formato).
  const startDate = parseApiDate(pregnancyStartDate);
  if (!startDate || !isFuture(startDate)) return null;

  const formattedDate = format(startDate, "d 'de' MMMM, yyyy", { locale: es });

  return (
    <Card style={{ borderColor: 'var(--info)' }}>
      <CardContent className="py-3">
        <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
          Embarazo programado para el {formattedDate}. Las metas se activarán en esa fecha.
        </p>
      </CardContent>
    </Card>
  );
}
