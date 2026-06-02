'use client';

import dynamic from 'next/dynamic';

import { SidebarProvider } from '@/components/ui/sidebar';
import { AuthProvider } from '@/core/providers/auth.provider';
import { LenisProvider } from '@/core/providers/lenis.provinder';
import { AlertProvider } from '@/hooks/useAlert/costum-alert';
import { ReactQueryClientProvider } from '@/pkg/react-query/query-client.pkg';
import { AuthStoreProvider } from '@/stores/auth.provider';

import { composeProviders } from './composeProvinders';

const PWAUpdatePrompt = dynamic(
  () => import('@/components/pwa/PWAUpdatePrompt').then((m) => m.PWAUpdatePrompt),
  { ssr: false }
);

const ReactQueryDevtoolsProduction = dynamic(
  () =>
    import('@tanstack/react-query-devtools').then((d) => ({
      default: d.ReactQueryDevtools,
    })),
  { ssr: false }
);

const Providers = composeProviders([
  ({ children }) => <SidebarProvider defaultOpen={false}>{children}</SidebarProvider>,
  AuthStoreProvider,
  AuthProvider,
  AlertProvider,
  LenisProvider,
  ReactQueryClientProvider,
]);

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      {children}
      <PWAUpdatePrompt />
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtoolsProduction initialIsOpen={false} />
      )}
    </Providers>
  );
}
