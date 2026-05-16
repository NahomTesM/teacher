'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }));

  useEffect(() => {
    const handleError = (e: ErrorEvent | PromiseRejectionEvent) => {
      const message = 'message' in e ? e.message : (e as any).reason?.message;
      if (message?.includes('Loading chunk') || message?.includes('ChunkLoadError')) {
        console.warn('ChunkLoadError detected, reloading page...');
        window.location.reload();
      }
    };
    window.addEventListener('error', handleError as any);
    window.addEventListener('unhandledrejection', handleError as any);
    return () => {
      window.removeEventListener('error', handleError as any);
      window.removeEventListener('unhandledrejection', handleError as any);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}
