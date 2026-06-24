import { useAuthStore } from '@/features/auth/store';
import { useMockDb } from '@/features/mock-db/store';
import { PatientProfileDto, HealthRecordDto } from '../types';

interface PatientDataHook {
  profile: PatientProfileDto | null;
  records: HealthRecordDto[];
  addRecord: (record: HealthRecordDto) => void;
  updateRecord: (id: string, updates: Partial<HealthRecordDto>) => void;
  deleteRecord: (id: string) => void;
  updateProfile: (updates: Partial<PatientProfileDto>) => void;
}

export function usePatientData(): PatientDataHook {
  const { userId, patientId } = useAuthStore();
  const id = patientId ?? userId;

  const mockDb = useMockDb();

  const profile = mockDb.patients.find((p) => p.id === id) ?? null;
  const records = mockDb.records
    .filter((r) => r.patientId === id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return {
    profile,
    records,
    addRecord: mockDb.addRecord,
    updateRecord: mockDb.updateRecord,
    deleteRecord: mockDb.deleteRecord,
    updateProfile: (updates) => {
      if (id) mockDb.updatePatient(id, updates);
    },
  };
}
