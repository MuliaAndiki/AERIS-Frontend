'use client';

import { Check, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn } from '@/utils/classname';

const API_LOAD_STEPS = [
  { id: 'location', label: 'Location', endpoint: '/api/location' },
  { id: 'air', label: 'Air quality', endpoint: '/api/environment/air-quality' },
  { id: 'weather', label: 'Weather & heat', endpoint: '/api/environment/weather' },
  { id: 'disaster', label: 'Disaster risk', endpoint: '/api/environment/disaster-risk' },
  { id: 'noise', label: 'Noise estimation', endpoint: '/api/environment/noise' },
  { id: 'green', label: 'Green spaces', endpoint: '/api/environment/green-space' },
  { id: 'score', label: 'Environmental score', endpoint: '/api/environment/score' },
  { id: 'insights', label: 'Insights', endpoint: '/api/insights' },
] as const;

function ShimmerBlock({ className }: { className?: string }) {
  return <div className={cn('map-env-shimmer rounded-lg', className)} />;
}

function ApiStepRow({
  label,
  endpoint,
  status,
}: {
  label: string;
  endpoint: string;
  status: 'done' | 'active' | 'pending';
}) {
  return (
    <div
      className={cn(
        'relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-500',
        status === 'active' && 'bg-card shadow-sm ring-1 ring-primary/15',
        status === 'pending' && 'opacity-40'
      )}
    >
      <div
        className={cn(
          'flex size-7 shrink-0 items-center justify-center rounded-full transition-all duration-300',
          status === 'done' && 'bg-accent/20 text-primary',
          status === 'active' && 'bg-primary/15 text-primary',
          status === 'pending' && 'bg-muted'
        )}
      >
        {status === 'done' && <Check className="size-3.5" strokeWidth={2.5} />}
        {status === 'active' && <Loader2 className="size-3.5 animate-spin" />}
        {status === 'pending' && <span className="size-1.5 rounded-full bg-muted-foreground/30" />}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-foreground">{label}</p>
        <p className="truncate font-mono text-[10px] text-muted-foreground">GET {endpoint}</p>
        {status === 'active' && (
          <div className="mt-2 h-0.5 w-full overflow-hidden rounded-full bg-primary/10">
            <div
              className="h-full w-1/3 rounded-full map-env-shimmer"
              style={{ animationDuration: '1.2s' }}
            />
          </div>
        )}
      </div>

      {status === 'active' && (
        <span className="animate-[api-pulse_1.5s_ease-in-out_infinite] text-[10px] font-medium tabular-nums text-primary">
          …
        </span>
      )}
      {status === 'done' && (
        <span className="text-[10px] font-medium tabular-nums text-primary">200</span>
      )}
    </div>
  );
}

export function MapEnvironmentLoading() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev >= API_LOAD_STEPS.length - 1 ? prev : prev + 1));
    }, 850);
    return () => clearInterval(interval);
  }, []);

  const progress = ((activeStep + 1) / API_LOAD_STEPS.length) * 100;

  return (
    <section
      className="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-background"
      aria-busy
      aria-label="Memuat data lingkungan"
    >
      <div className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-primary/25 opacity-25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full bg-accent/30 opacity-30 blur-3xl" />

      <div className="relative z-10 flex flex-1 flex-col lg:flex-row lg:overflow-hidden">
        <div className="hidden lg:flex lg:w-80 lg:flex-col lg:gap-4 lg:border-r lg:border-border lg:bg-card/50 lg:p-5">
          <ShimmerBlock className="h-4 w-2/3" />
          <ShimmerBlock className="h-12 w-full rounded-2xl" />
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <ShimmerBlock key={i} className="h-16" />
            ))}
          </div>
          <ShimmerBlock className="mt-auto h-24 w-full" />
        </div>

        <div className="relative flex min-h-[40vh] flex-1 flex-col lg:min-h-0">
          <div className="relative m-3 flex-1 overflow-hidden rounded-2xl border border-accent/50 bg-card shadow-inner lg:m-4">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: `
                  linear-gradient(color-mix(in srgb, var(--primary) 15%, transparent) 1px, transparent 1px),
                  linear-gradient(90deg, color-mix(in srgb, var(--primary) 15%, transparent) 1px, transparent 1px)
                `,
                backgroundSize: '28px 28px',
              }}
            />
            <div className="api-scan-line pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-primary/25 via-accent/10 to-transparent" />

            <div className="absolute left-[22%] top-[38%] size-3 rounded-full map-env-shimmer shadow-[0_0_12px_color-mix(in_srgb,var(--accent)_50%,transparent)] ring-4 ring-white/80" />
            <div className="absolute left-[58%] top-[52%] size-2.5 rounded-full map-env-shimmer shadow-[0_0_10px_color-mix(in_srgb,var(--accent)_40%,transparent)] ring-4 ring-white/80 [animation-delay:200ms]" />
            <div className="absolute right-[28%] top-[30%] size-2 rounded-full map-env-shimmer shadow-[0_0_8px_color-mix(in_srgb,var(--accent)_35%,transparent)] ring-4 ring-white/80 [animation-delay:400ms]" />

            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 rounded-xl bg-card/90 px-3 py-2 shadow-lg backdrop-blur-md lg:hidden">
              <Loader2 className="size-4 shrink-0 animate-spin text-primary" />
              <p className="text-xs font-medium text-foreground">Mengambil data lingkungan…</p>
              <span className="ml-auto text-[10px] font-semibold tabular-nums text-primary">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex lg:w-80 lg:flex-col lg:gap-3 lg:border-l lg:border-border lg:bg-card/50 lg:p-5">
          <ShimmerBlock className="h-4 w-1/2" />
          {Array.from({ length: 3 }).map((_, i) => (
            <ShimmerBlock key={i} className="h-14 w-full" />
          ))}
        </div>
      </div>

      <div className="relative z-20 border-t border-border bg-card/70 px-4 py-4 backdrop-blur-xl lg:px-8">
        <div className="mx-auto flex max-w-2xl flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Sinkronisasi data</p>
              <p className="text-xs text-muted-foreground">
                {API_LOAD_STEPS[activeStep]?.label ?? 'Menyelesaikan…'}
              </p>
            </div>
            <span className="rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-primary">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="h-1 overflow-hidden rounded-full bg-primary/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="grid max-h-[min(28vh,220px)] gap-1 overflow-y-auto pr-1 sm:grid-cols-2">
            {API_LOAD_STEPS.map((step, index) => (
              <ApiStepRow
                key={step.id}
                label={step.label}
                endpoint={step.endpoint}
                status={index < activeStep ? 'done' : index === activeStep ? 'active' : 'pending'}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
