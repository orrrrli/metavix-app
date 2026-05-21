import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'PATIENT' | 'DOCTOR' | 'GUEST' | null;

interface AuthState {
  role: UserRole;
  userId: string | null;
  token: string | null;

  loginAsPatient: (userId: string) => void;
  loginAsDoctor: (doctorId: string) => void;
  loginAsGuest: (guestId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: null,
      userId: null,
      token: null,

      loginAsPatient: (userId) => set({
        role: 'PATIENT',
        userId,
        token: `mock-jwt-patient-${userId}`
      }),

      loginAsDoctor: (doctorId) => set({
        role: 'DOCTOR',
        userId: doctorId,
        token: `mock-jwt-doctor-${doctorId}`
      }),

      loginAsGuest: (guestId) => set({
        role: 'GUEST',
        userId: guestId,
        token: null,
      }),

      logout: () => set({ role: null, userId: null, token: null }),
    }),
    {
      name: 'ram-med-auth'
    }
  )
);
