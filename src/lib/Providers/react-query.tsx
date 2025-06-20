
"use client";

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode} from 'react';
import { queryClient } from '@/lib/api/queryClient'; // ← import your client

export const ReactQueryProvider = ({ children }: { children: ReactNode }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
