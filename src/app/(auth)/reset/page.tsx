import { Suspense } from 'react';

import ResetContainer from './_container/reset';

function ResetPageFallback() {
  return (
    <main
      className="min-h-screen w-full bg-background"
      aria-busy
      aria-label="Memuat halaman reset"
    />
  );
}

export default function ResetPage() {
  return (
    <Suspense fallback={<ResetPageFallback />}>
      <ResetContainer />
    </Suspense>
  );
}
