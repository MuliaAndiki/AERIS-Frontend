'use client';

import { BarChart3, CheckCircle2 } from 'lucide-react';

const highlights = [
  'Proyeksi Temporal 4D',
  'Rencana Restorasi yang Dihasilkan oleh AI',
  'Pemantauan Kepatuhan Global',
];

export default function MapPreviewSection() {
  return (
    <section id="map" className="w-full py-24 px-6 md:px-12 lg:px-20 bg-background">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left — content */}
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            Jelajahi Kanvas
            <br />
            Atmosfer
          </h2>

          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Antarmuka Luminous Pavilion kami memungkinkan navigasi yang mulus melalui dataset
            lingkungan yang berlapis-lapis. Beralih dengan mudah antara aliran udara, distribusi
            termal, dan kesehatan vegetasi.
          </p>

          <ul className="flex flex-col gap-3 mt-2">
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — map mockup */}
        <div className="relative hover-lift">
          <div className="rounded-2xl overflow-hidden shadow-enhanced aspect-[4/3] bg-gradient-to-br from-primary/10 via-accent/8 to-secondary relative">
            {/* Grid lines mimicking a map */}
            <MapMockup />

            {/* Live node badge */}
            <div className="absolute bottom-4 left-4 card-glass rounded-xl px-4 py-3 flex flex-col gap-2 min-w-[180px]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
                  Live Node / Banda Aceh
                </span>
              </div>
              {/* Mini bar chart */}
              <div className="flex items-end gap-1 h-8">
                {[3, 5, 4, 7, 6, 8, 5, 9, 7, 6].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-primary/70"
                    style={{ height: `${h * 10}%` }}
                  />
                ))}
              </div>
              <p className="text-[9px] text-muted-foreground leading-tight">
                Vegetation density increased by 4.2% following green-roof implementation
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MapMockup() {
  return (
    <div className="absolute inset-0">
      {/* Background tint */}
      <div className="absolute inset-0 bg-primary/5" />

      {/* Horizontal lines */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={`h-${i}`}
          className="absolute w-full h-px bg-primary/15"
          style={{ top: `${(i + 1) * (100 / 13)}%` }}
        />
      ))}

      {/* Vertical lines */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={`v-${i}`}
          className="absolute h-full w-px bg-primary/15"
          style={{ left: `${(i + 1) * (100 / 11)}%` }}
        />
      ))}

      {/* Diagonal road-like paths */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 300"
        preserveAspectRatio="none"
      >
        <path
          d="M 0 150 Q 100 100 200 130 T 400 110"
          stroke="rgba(63,134,42,0.3)"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M 50 0 Q 120 80 100 150 T 150 300"
          stroke="rgba(63,134,42,0.25)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M 200 0 Q 250 100 220 200 T 280 300"
          stroke="rgba(63,134,42,0.2)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M 0 80 Q 150 60 300 90 T 400 70"
          stroke="rgba(63,134,42,0.2)"
          strokeWidth="1"
          fill="none"
        />
        {/* Node dots */}
        <circle cx="200" cy="130" r="4" fill="rgba(63,134,42,0.6)" />
        <circle cx="100" cy="150" r="3" fill="rgba(63,134,42,0.4)" />
        <circle cx="300" cy="90" r="3" fill="rgba(63,134,42,0.4)" />
        <circle cx="150" cy="200" r="2.5" fill="rgba(63,134,42,0.35)" />
      </svg>
    </div>
  );
}
