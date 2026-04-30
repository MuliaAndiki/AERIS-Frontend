'use client';

import { store, persistor } from '@/stores/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
// import { Toaster } from '@/components/ui/sonner';
import { AlertProvider } from '@/hooks/useAlert/costum-alert';
import { ReactQueryClientProvider } from '@/pkg/react-query/query-client.pkg';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '@/core/providers/theme.provider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { composeProviders } from './composeProvinders';
import { AuthProvider } from '@/core/providers/auth.provider';
import { PWAUpdatePrompt } from '@/components/pwa/PWAUpdatePrompt';
import NextTopLoader from 'nextjs-toploader';

const Providers = composeProviders([
  ({ children }) => <SidebarProvider defaultOpen={false}>{children}</SidebarProvider>,
  ({ children }) => <Provider store={store}>{children}</Provider>,
  ({ children }) => <PersistGate persistor={persistor}>{children}</PersistGate>,
  AuthProvider,
  ThemeProvider,
  AlertProvider,
  ReactQueryClientProvider,
]);

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <NextTopLoader
        color="#c269da"
        initialPosition={0.08}
        crawlSpeed={200}
        height={3}
        crawl={true}
        showSpinner={false}
        easing="ease"
        speed={200}
        zIndex={99999}
      />
      {children}
      <PWAUpdatePrompt />
      <ReactQueryDevtools initialIsOpen={false} />
      {/* <Toaster position="top-center" richColors duration={900} /> */}
    </Providers>
  );
}
