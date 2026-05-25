import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { logoutUser } from '@/lib/api/auth';

export type UserRole = 'PATIENT' | 'DOCTOR' | 'ADMIN' | null;

interface SessionData {
  userId: string;
  patientId: string | null;
  doctorId: string | null;
  role: UserRole;
  fullName: string;
  email: string;
}

interface AuthState {
  _hasHydrated: boolean;
  role: UserRole;
  userId: string | null;
  patientId: string | null;
  doctorId: string | null;
  fullName: string | null;
  email: string | null;
  token: string | null;

  setHasHydrated: (value: boolean) => void;
  setSession: (session: SessionData) => void;
  loginAsPatient: (userId: string) => void;
  loginAsDoctor: (doctorId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      _hasHydrated: false,
      role: null,
      userId: null,
      patientId: null,
      doctorId: null,
      fullName: null,
      email: null,
      token: null,

      setHasHydrated: (value) => set({ _hasHydrated: value }),

      setSession: ({ userId, patientId, doctorId, role, fullName, email }) =>
        set({ role, userId, patientId, doctorId, fullName, email, token: role === 'PATIENT' ? `mock-jwt-patient-${userId}` : null }),

      loginAsPatient: (userId) =>
        set({ role: 'PATIENT', userId, fullName: 'Demo Paciente', email: null, token: `mock-jwt-patient-${userId}` }),

      loginAsDoctor: (doctorId) =>
        set({ role: 'DOCTOR', userId: doctorId, fullName: 'Demo Médico', email: null, token: null }),

      logout: () => {
        logoutUser().catch(() => {});
        set({ role: null, userId: null, patientId: null, doctorId: null, fullName: null, email: null, token: null });
      },
    }),
    {
      name: 'ram-med-auth',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
