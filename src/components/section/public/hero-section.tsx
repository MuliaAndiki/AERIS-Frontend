'use client';

import { Leaf, TrendingUp, Wind } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden bg-background px-6 md:px-12 lg:px-20 pt-20">
      {/* Background subtle gradient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-24">
        {/* Left — headline */}
        <div className="flex flex-col gap-6">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">
            Luminous Intelligence Platform
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
            Pahami
            <br />
            Lingkunganmu
            <br />
            dengan
            <br />
            <span className="text-gradient-primary">AERIS.</span>
          </h1>

          <p className="text-muted-foreground text-base md:text-lg max-w-md leading-relaxed">
            AERIS membantu kamu memantau kualitas udara, risiko panas, dan kondisi lingkungan secara
            real-time.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg gradient-primary text-primary-foreground font-semibold text-sm hover-lift shadow-enhanced transition-all"
            >
              Mulai Sekarang
            </Link>
            <Link
              href="#about"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border text-foreground font-semibold text-sm hover:bg-secondary transition-all"
            >
              Pelajari Lebih Lanjut
            </Link>
          </div>
        </div>

        {/* Right — AQI card */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative w-full max-w-sm">
            {/* Plant image placeholder */}
            <div className="absolute top-4 left-4 w-28 h-28 rounded-xl overflow-hidden shadow-enhanced z-10">
              <div className="w-full h-full gradient-primary opacity-80 flex items-center justify-center">
                <Leaf className="w-12 h-12 text-primary-foreground" />
              </div>
            </div>

            {/* AQI card */}
            <div className="card-glass rounded-2xl shadow-enhanced p-6 ml-16 mt-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">98</span>
                    <span className="text-muted-foreground text-sm">/100</span>
                  </div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mt-0.5">
                    AQI Resilience Index
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Wind className="w-5 h-5 text-primary" />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <AqiRow label="Oxygen Saturation" value="+12% YoY" positive />
                <AqiRow label="Heat Island Mitigation" value="Optimized" positive />
                <AqiRow label="Species Diversity" value="High Growth" positive />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float">
        <div className="w-px h-10 bg-gradient-to-b from-transparent to-primary/50" />
        <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
      </div>
    </section>
  );
}

function AqiRow({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-t border-border/50">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-xs font-semibold ${positive ? 'text-primary' : 'text-destructive'}`}>
        {value}
      </span>
    </div>
  );
}
