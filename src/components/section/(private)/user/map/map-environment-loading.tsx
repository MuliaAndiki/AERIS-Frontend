'use client';

import { Check, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { themeConfig } from '@/configs/theme.config';
import { cn } from '@/utils/classname';

/** Map / profile green palette */
const GREEN = {
  dark: themeConfig.light.primary.background,
  light: themeConfig.light.accent.background,
  muted: themeConfig.light.muted.background,
  bg: themeConfig.light.background,
  text: themeConfig.light.foreground,
  textMuted: themeConfig.light.muted.foreground,
} as const;

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
        status === 'active' && 'bg-white/80 shadow-sm',
        status === 'pending' && 'opacity-40',
      )}
      style={
        status === 'active'
          ? { boxShadow: `0 0 0 1px color-mix(in srgb, ${GREEN.dark} 18%, transparent)` }
          : undefined
      }
    >
      <div
        className={cn(
          'flex size-7 shrink-0 items-center justify-center rounded-full transition-all duration-300',
          status === 'pending' && 'bg-[#D8EFE5]',
        )}
        style={
          status === 'done'
            ? { backgroundColor: `${GREEN.light}33`, color: GREEN.dark }
            : status === 'active'
              ? { backgroundColor: `${GREEN.dark}18`, color: GREEN.dark }
              : undefined
        }
      >
        {status === 'done' && <Check className="size-3.5" strokeWidth={2.5} />}
        {status === 'active' && <Loader2 className="size-3.5 animate-spin" />}
        {status === 'pending' && (
          <span
            className="size-1.5 rounded-full"
            style={{ backgroundColor: `${GREEN.dark}40` }}
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold truncate" style={{ color: GREEN.text }}>
          {label}
        </p>
        <p className="font-mono text-[10px] truncate" style={{ color: GREEN.textMuted }}>
          GET {endpoint}
        </p>
        {status === 'active' && (
          <div
            className="mt-2 h-0.5 w-full overflow-hidden rounded-full"
            style={{ backgroundColor: `${GREEN.dark}15` }}
          >
            <div
              className="h-full w-1/3 rounded-full map-env-shimmer"
              style={{ animationDuration: '1.2s' }}
            />
          </div>
        )}
      </div>

      {status === 'active' && (
        <span
          className="text-[10px] font-medium tabular-nums animate-[api-pulse_1.5s_ease-in-out_infinite]"
          style={{ color: GREEN.dark }}
        >
          …
        </span>
      )}
      {status === 'done' && (
        <span
          className="text-[10px] font-medium tabular-nums"
          style={{ color: GREEN.dark }}
        >
          200
        </span>
      )}
    </div>
  );
}

export function MapEnvironmentLoading() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) =>
        prev >= API_LOAD_STEPS.length - 1 ? prev : prev + 1,
      );
    }, 850);
    return () => clearInterval(interval);
  }, []);

  const progress = ((activeStep + 1) / API_LOAD_STEPS.length) * 100;

  return (
    <section
      className="relative flex h-full min-h-0 w-full flex-col overflow-hidden"
      style={{ backgroundColor: GREEN.bg }}
      aria-busy
      aria-label="Memuat data lingkungan"
    >
      {/* Ambient gradient */}
      <div
        className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full opacity-25 blur-3xl"
        style={{ background: GREEN.dark }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full opacity-30 blur-3xl"
        style={{ background: GREEN.light }}
      />

      <div className="relative z-10 flex flex-1 flex-col lg:flex-row lg:overflow-hidden">
        {/* Left panel skeleton */}
        <div
          className="hidden lg:flex lg:w-80 lg:flex-col lg:border-r lg:p-5 lg:gap-4 bg-white/50"
          style={{ borderColor: `${GREEN.dark}25` }}
        >
          <ShimmerBlock className="h-4 w-2/3" />
          <ShimmerBlock className="h-12 w-full rounded-2xl" />
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <ShimmerBlock key={i} className="h-16" />
            ))}
          </div>
          <ShimmerBlock className="mt-auto h-24 w-full" />
        </div>

        {/* Map area skeleton */}
        <div className="relative flex flex-1 flex-col min-h-[40vh] lg:min-h-0">
          <div
            className="relative flex-1 overflow-hidden m-3 lg:m-4 rounded-2xl border shadow-inner"
            style={{
              backgroundColor: themeConfig.light.card.background,
              borderColor: `${GREEN.light}80`,
            }}
          >
            <div
              className="absolute inset-0 opacity-[0.4]"
              style={{
                backgroundImage: `
                  linear-gradient(${GREEN.dark}22 1px, transparent 1px),
                  linear-gradient(90deg, ${GREEN.dark}22 1px, transparent 1px)
                `,
                backgroundSize: '28px 28px',
              }}
            />
            <div
              className="absolute inset-x-0 top-0 h-1/3 api-scan-line pointer-events-none bg-gradient-to-b to-transparent"
              style={{
                backgroundImage: `linear-gradient(to bottom, ${GREEN.dark}30, ${GREEN.light}12, transparent)`,
              }}
            />

            {/* Fake map markers */}
            <div
              className="absolute left-[22%] top-[38%] size-3 rounded-full map-env-shimmer ring-4 ring-white/80"
              style={{ boxShadow: `0 0 12px ${GREEN.light}80` }}
            />
            <div
              className="absolute left-[58%] top-[52%] size-2.5 rounded-full map-env-shimmer ring-4 ring-white/80 [animation-delay:200ms]"
              style={{ boxShadow: `0 0 10px ${GREEN.light}60` }}
            />
            <div
              className="absolute right-[28%] top-[30%] size-2 rounded-full map-env-shimmer ring-4 ring-white/80 [animation-delay:400ms]"
              style={{ boxShadow: `0 0 8px ${GREEN.light}50` }}
            />

            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 rounded-xl bg-white/90 px-3 py-2 shadow-lg backdrop-blur-md lg:hidden">
              <Loader2
                className="size-4 shrink-0 animate-spin"
                style={{ color: GREEN.dark }}
              />
              <p className="text-xs font-medium" style={{ color: GREEN.text }}>
                Mengambil data lingkungan…
              </p>
              <span
                className="ml-auto text-[10px] font-semibold tabular-nums"
                style={{ color: GREEN.dark }}
              >
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>

        {/* Right panel skeleton — desktop */}
        <div
          className="hidden lg:flex lg:w-80 lg:flex-col lg:border-l lg:p-5 lg:gap-3 bg-white/50"
          style={{ borderColor: `${GREEN.dark}25` }}
        >
          <ShimmerBlock className="h-4 w-1/2" />
          {Array.from({ length: 3 }).map((_, i) => (
            <ShimmerBlock key={i} className="h-14 w-full" />
          ))}
        </div>
      </div>

      {/* API fetch panel */}
      <div
        className="relative z-20 border-t bg-white/70 px-4 py-4 backdrop-blur-xl lg:px-8"
        style={{ borderColor: `${GREEN.dark}20` }}
      >
        <div className="mx-auto flex max-w-2xl flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold" style={{ color: GREEN.text }}>
                Sinkronisasi data
              </p>
              <p className="text-xs" style={{ color: GREEN.textMuted }}>
                {API_LOAD_STEPS[activeStep]?.label ?? 'Menyelesaikan…'}
              </p>
            </div>
            <span
              className="rounded-full px-2.5 py-1 text-[11px] font-semibold tabular-nums"
              style={{
                backgroundColor: `${GREEN.dark}15`,
                color: GREEN.dark,
              }}
            >
              {Math.round(progress)}%
            </span>
          </div>

          <div
            className="h-1 overflow-hidden rounded-full"
            style={{ backgroundColor: `${GREEN.dark}12` }}
          >
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${GREEN.dark}, ${GREEN.light})`,
              }}
            />
          </div>

          <div className="grid gap-1 sm:grid-cols-2 max-h-[min(28vh,220px)] overflow-y-auto pr-1">
            {API_LOAD_STEPS.map((step, index) => (
              <ApiStepRow
                key={step.id}
                label={step.label}
                endpoint={step.endpoint}
                status={
                  index < activeStep
                    ? 'done'
                    : index === activeStep
                      ? 'active'
                      : 'pending'
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
