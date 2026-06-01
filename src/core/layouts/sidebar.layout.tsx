'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
interface AppLayoutProps {
  children: React.ReactNode;
  onSearch?: (query: string) => void;
}

export function SidebarLayout({ children, onSearch }: AppLayoutProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    const query = localSearchQuery.trim();
    if (!query) return;
    onSearch?.(query);
  };

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-dvh w-full">
        <SidebarInset className="min-h-0">
          <div className="flex h-dvh min-h-0 w-full flex-col">
            <header className="flex shrink-0 flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-4">
              <div className="flex items-center justify-between gap-2 sm:justify-start">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-full text-sm font-bold text-white">
                    A
                  </div>
                  <span className="text-xs font-bold tracking-widest sm:text-[13px]">AERIS</span>
                </div>
                <Link href="/user/map/profile" className="sm:hidden">
                  <div className="flex size-9 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                    MA
                  </div>
                </Link>
              </div>

              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border px-3 py-2 sm:max-w-md">
                <Search size={16} className="shrink-0 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cari lokasi (Enter)..."
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="min-w-0 flex-1 text-sm outline-none sm:text-[13px]"
                />
              </div>

              <div className="hidden items-center gap-3 sm:flex">
                <Link href="/user/map/profile">
                  <div className="flex size-9 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                    MA
                  </div>
                </Link>
              </div>
            </header>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden w-full">
              <div className="flex h-full min-h-0 w-full max-w-full flex-1 flex-col">
                {children}
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
