import { useAuthStore } from '@/features/auth/store';
import { useMockDb } from '@/features/mock-db/store';
import { useGuestStore } from '@/features/guest/store';
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
  const { role, userId } = useAuthStore();

  const mockDb = useMockDb();
  const guestStore = useGuestStore();

  if (role === 'GUEST') {
    return {
      profile: guestStore.profile,
      records: guestStore.records,
      addRecord: guestStore.addRecord,
      updateRecord: guestStore.updateRecord,
      deleteRecord: guestStore.deleteRecord,
      updateProfile: guestStore.updateProfile,
    };
  }

  const profile = mockDb.patients.find((p) => p.id === userId) ?? null;
  const records = mockDb.records
    .filter((r) => r.patientId === userId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return {
    profile,
    records,
    addRecord: mockDb.addRecord,
    updateRecord: mockDb.updateRecord,
    deleteRecord: mockDb.deleteRecord,
    updateProfile: (updates) => {
      if (userId) mockDb.updatePatient(userId, updates);
    },
  };
}
