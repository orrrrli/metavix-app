import { DailyRecordResponse, GlucoseReadingResponse } from "@/types/daily-record";

export interface AggregatedDay {
  dateKey: string;
  glucoseReadings: GlucoseReadingResponse[];
}

export function aggregateGlucoseCurvesByDate(records: DailyRecordResponse[]): AggregatedDay[] {
  const grouped = new Map<string, DailyRecordResponse[]>();

  for (const record of records) {
    if (record.glucoseReadings.length === 0) continue;
    const bucket = grouped.get(record.recordDate) ?? [];
    bucket.push(record);
    grouped.set(record.recordDate, bucket);
  }

  return Array.from(grouped.entries()).map(([dateKey, dayRecords]) => {
    const sorted = [...dayRecords].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
    return { dateKey, glucoseReadings: sorted.flatMap(r => r.glucoseReadings) };
  });
}
