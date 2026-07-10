'use client';

import { format, isFuture, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent } from '@/shared/components/ui/metavix';

export interface ScheduledPregnancyBannerProps {
  isPregnant: boolean;
  pregnancyStartDate: string | null;
}

export function ScheduledPregnancyBanner({ isPregnant, pregnancyStartDate }: ScheduledPregnancyBannerProps) {
  if (!isPregnant || !pregnancyStartDate) return null;

  const startDate = parseISO(pregnancyStartDate);
  if (!isFuture(startDate)) return null;

  const formattedDate = format(startDate, "d 'de' MMMM, yyyy", { locale: es });

  return (
    <Card style={{ borderColor: 'var(--info)' }}>
      <CardContent>
        <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
          Embarazo programado para el {formattedDate}. Las metas se activarán en esa fecha.
        </p>
      </CardContent>
    </Card>
  );
}
