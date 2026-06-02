'use client';

import { Building2 } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="w-full py-24 px-6 md:px-12 lg:px-20 bg-background">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left — image placeholder */}
        <div className="relative rounded-2xl overflow-hidden shadow-enhanced hover-lift">
          <div className="aspect-[4/3] w-full bg-gradient-to-br from-primary/20 via-accent/15 to-primary/10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-primary/40">
              <Building2 className="w-24 h-24" />
              <span className="text-sm font-medium tracking-wide">Green Urban Architecture</span>
            </div>
          </div>
          {/* Decorative overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none" />
        </div>

        {/* Right — content */}
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-foreground leading-tight">
            Hidup Lebih Cerdas
            <br />
            dengan Data
            <br />
            Lingkungan
          </h2>

          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            AERIS lahir dari satu visi utama: menjembatani kesenjangan antara data iklim yang
            abstrak dan informasi lokal yang dapat ditindaklanjuti. Kami percaya bahwa dengan
            membuat hal-hal yang tak terlihat menjadi terlihat—baik itu partikel mikroskopis maupun
            perbedaan suhu—kami dapat memberdayakan masyarakat untuk membangun masa depan yang lebih
            tangguh.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6 mt-2">
            <StatCard value="2.4k" label="Cities Monitored" />
            <StatCard value="150ms" label="Sensor Latency" />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-6xl mx-auto mt-20">
        <div className="h-px bg-border" />
      </div>
    </section>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-3xl font-bold text-primary">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
