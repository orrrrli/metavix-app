import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PatientProfileDto, HealthRecordDto } from '../patient/types';

interface GuestState {
  profile: PatientProfileDto | null;
  records: HealthRecordDto[];

  setProfile: (profile: PatientProfileDto) => void;
  addRecord: (record: HealthRecordDto) => void;
  updateRecord: (id: string, updates: Partial<HealthRecordDto>) => void;
  deleteRecord: (id: string) => void;
  updateProfile: (updates: Partial<PatientProfileDto>) => void;
  clearGuestData: () => void;
}

export const useGuestStore = create<GuestState>()(
  persist(
    (set) => ({
      profile: null,
      records: [],

      setProfile: (profile) => set({ profile }),

      addRecord: (record) => set((state) => ({ records: [record, ...state.records] })),

      updateRecord: (id, updates) => set((state) => ({
        records: state.records.map((r) => r.id === id ? { ...r, ...updates } : r),
      })),

      deleteRecord: (id) => set((state) => ({
        records: state.records.filter((r) => r.id !== id),
      })),

      updateProfile: (updates) => set((state) => ({
        profile: state.profile ? { ...state.profile, ...updates } : null,
      })),

      clearGuestData: () => set({ profile: null, records: [] }),
    }),
    {
      name: 'ram-med-guest',
    }
  )
);
