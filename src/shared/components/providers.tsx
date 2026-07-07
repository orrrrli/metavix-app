"use client";

import { useState } from 'react';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster, toast } from 'sonner';
import { refreshToken } from '@/lib/api/auth';
import { useAuthStore } from '@/features/auth/store';

interface ProvidersProps {
  children: React.ReactNode;
}

// Shared promise so concurrent 401s don't each fire a separate refresh.
let refreshInFlight: Promise<void> | null = null;
let sessionExpired = false;

function makeQueryClient(): QueryClient {
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: async (error) => {
        if (!(error instanceof Error && error.message.includes('401'))) return;
        if (sessionExpired) return;

        if (!refreshInFlight) {
          refreshInFlight = refreshToken()
            .then(async () => {
              document.cookie = '_session=1; path=/; samesite=lax; max-age=604800';
              await queryClient.refetchQueries({ type: 'active' });
            })
            .catch(() => {
              if (sessionExpired) return;
              sessionExpired = true;
              useAuthStore.getState().logout();
              toast.error('Tu sesión expiró. Vuelve a iniciar sesión.');
              window.location.href = '/login?reason=expired';
            })
            .finally(() => {
              refreshInFlight = null;
            });
        }

        await refreshInFlight;
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          if (error instanceof Error && error.message.includes('401')) return false;
          return failureCount < 1;
        },
      },
    },
  });

  return queryClient;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(makeQueryClient);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
