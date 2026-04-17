'use client';

import { Layers, Search } from 'lucide-react';
import { useState } from 'react';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { themeConfig } from '@/configs/theme.config';
import { AppSidebar } from '@/core/components/app-sidebar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useApi } from '@/hooks/useApi/props.api';
import ThemeToggle from '../components/theme-toggle';

interface AppLayoutProps {
  children: React.ReactNode;
  onSearch?: (query: string) => void;
}

export function SidebarLayout({ children, onSearch }: AppLayoutProps) {
  const service = useApi();

  const logoutMutate = service.auth.mutation.logout();

  const [localSearchQuery, setLocalSearchQuery] = useState('');

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    const query = localSearchQuery.trim();
    if (!query) return;
    onSearch?.(query);
  };
  const theme = themeConfig.light;

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full">
        <SidebarInset>
          <div className="flex h-full flex-col w-full">
            <div className="flex items-center justify-between px-6 py-4 border-b gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  A
                </div>
                <span className="text-[13px] font-bold tracking-widest">AERIS</span>
              </div>

              <div className="flex-1 max-w-md flex items-center gap-2 px-3 py-2 rounded-lg border">
                <Search size={16} className="bg-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search location (press Enter)..."
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="flex-1 outline-none text-[13px]"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                  style={{ backgroundColor: theme.background }}
                >
                  <Layers size={18} style={{ color: theme.primary.background }} />
                </button>

                <Link href={'/user/map/profile'} className="">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: theme.secondary.background }}
                  >
                    MA
                  </div>
                </Link>

                <ThemeToggle />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden w-full">
              <div className=" h-full container max-w-full w-full ">{children}</div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
