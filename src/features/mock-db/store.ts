import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PatientProfileDto, HealthRecordDto } from '../patient/types';
import { initialPatients, initialRecords } from './seed';

interface MockDbState {
  patients: PatientProfileDto[];
  records: HealthRecordDto[];
  
  // Records Mutations
  addRecord: (record: HealthRecordDto) => void;
  updateRecord: (id: string, record: Partial<HealthRecordDto>) => void;
  deleteRecord: (id: string) => void;
  
  // Patient Mutations
  updatePatient: (id: string, profile: Partial<PatientProfileDto>) => void;
  
  // Diagnostics
  resetDb: () => void;
}

export const useMockDb = create<MockDbState>()(
  persist(
    (set) => ({
      patients: initialPatients,
      records: initialRecords,
      
      addRecord: (record) => set((state) => ({ records: [record, ...state.records] })),
      
      updateRecord: (id, recordUpdates) => set((state) => ({
        records: state.records.map((r) => r.id === id ? { ...r, ...recordUpdates } : r)
      })),
      
      deleteRecord: (id) => set((state) => ({
        records: state.records.filter((r) => r.id !== id)
      })),
      
      updatePatient: (id, profileUpdates) => set((state) => ({
        patients: state.patients.map((p) => p.id === id ? { ...p, ...profileUpdates } : p)
      })),
      
      resetDb: () => set({ patients: initialPatients, records: initialRecords }),
    }),
    {
      name: 'ram-med-mock-db',
      version: 1,
    }
  )
);
