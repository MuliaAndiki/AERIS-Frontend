'use client';

import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('./_container/map'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[50dvh] w-full items-center justify-center bg-background">
      <p className="text-sm text-muted-foreground">Memuat peta…</p>
    </div>
  ),
});

export function MapPageClient() {
  return <MapContainer />;
}
