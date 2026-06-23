"use client";

import { useState } from 'react';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { refreshToken } from '@/lib/api/auth';
import { useAuthStore } from '@/features/auth/store';

interface ProvidersProps {
  children: React.ReactNode;
}

function makeQueryClient(): QueryClient {
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: async (error) => {
        if (!(error instanceof Error && error.message.includes('401'))) return;

        try {
          await refreshToken();
          document.cookie = '_session=1; path=/; secure; samesite=lax; max-age=900';
          await queryClient.invalidateQueries();
        } catch {
          useAuthStore.getState().logout();
          window.location.href = '/login';
        }
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
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
