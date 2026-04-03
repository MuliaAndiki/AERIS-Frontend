'use client';
import ComingSoon from '@/components/coming-soon/commingSoon';
import ThemeToggle from '@/core/components/theme-toggle';

export default function ContainerHome() {
  return (
    <main className="flex w-full flex-col items-center justify-center h-screen">
      <ComingSoon />
    </main>
  );
}
