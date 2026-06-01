'use client';

import { Wind, Thermometer, Droplets, Trees } from 'lucide-react';

// Static opacities — avoids Math.random() hydration mismatch between SSR and client
const MAP_GRID_OPACITIES = [
  0.9, 0.4, 0.7, 0.3, 0.8, 0.5, 0.6, 0.9,
  0.3, 0.8, 0.5, 0.7, 0.4, 0.9, 0.3, 0.6,
  0.7, 0.5, 0.9, 0.4, 0.6, 0.8, 0.3, 0.7,
  0.4, 0.9, 0.6, 0.3, 0.8, 0.5, 0.7, 0.4,
  0.6, 0.3, 0.9, 0.5, 0.7, 0.4, 0.8, 0.6,
];

const features = [
  {
    icon: Wind,
    title: 'Kualitas Udara',
    description:
      'Pantauan PM2.5, NO2, dan O3 secara real-time di titik koordinatmu saat ini dengan tingkat presisi mikroskopis.',
    variant: 'large' as const,
    hasImage: true,
  },
  {
    icon: Thermometer,
    title: 'Penyerapan Panas Perkotaan',
    description:
      'Mengidentifikasi anomali suhu dan peluang pendinginan di kawasan dengan kepadatan tinggi.',
    variant: 'small' as const,
    accent: true,
  },
  {
    icon: Droplets,
    title: 'Risiko Hidrology',
    description:
      'Analisis prediktif terhadap banjir dan permukaan air tanah.',
    variant: 'small' as const,
  },
  {
    icon: Trees,
    title: 'Ruang Hijau',
    description:
      'Temukan zona terbaik. Pemetaan taman dan area vegetasi untuk kesehatan mental yang lebih baik.',
    variant: 'small' as const,
    filled: true,
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="w-full py-24 px-6 md:px-12 lg:px-20 bg-secondary/30"
    >
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Analisis Presisi
            <br />
            Tanpa Batas
          </h2>
        </div>

        {/* Feature grid — mirrors the screenshot layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1 — large, with image area */}
          <FeatureCardLarge
            icon={Wind}
            title="Kualitas Udara"
            description="Pantauan PM2.5, NO2, dan O3 secara real-time di titik koordinatmu saat ini dengan tingkat presisi mikroskopis."
          />

          {/* Right column — stacked two cards */}
          <div className="flex flex-col gap-5">
            <FeatureCardSmall
              icon={Thermometer}
              title="Penyerapan Panas Perkotaan"
              description="Mengidentifikasi anomali suhu dan peluang pendinginan di kawasan dengan kepadatan tinggi."
              accent
            />
            <div className="grid grid-cols-2 gap-5 flex-1">
              <FeatureCardSmall
                icon={Droplets}
                title="Risiko Hidrology"
                description="Analisis prediktif terhadap banjir dan permukaan air tanah."
              />
              <FeatureCardSmall
                icon={Trees}
                title="Ruang Hijau"
                description="Temukan zona terbaik. Pemetaan taman dan area vegetasi untuk kesehatan mental yang lebih baik."
                filled
              />
            </div>
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

function FeatureCardLarge({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="card-glass rounded-2xl p-6 flex flex-col gap-4 shadow-enhanced hover-lift">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
      {/* Map-like image placeholder */}
      <div className="mt-auto rounded-xl overflow-hidden aspect-video bg-gradient-to-br from-primary/20 via-accent/15 to-primary/5 relative">
        <div className="absolute inset-0 map-env-shimmer opacity-30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-8 gap-0.5 opacity-20">
            {MAP_GRID_OPACITIES.map((opacity, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-sm bg-primary"
                style={{ opacity }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCardSmall({
  icon: Icon,
  title,
  description,
  accent,
  filled,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  accent?: boolean;
  filled?: boolean;
}) {
  if (filled) {
    return (
      <div className="rounded-2xl p-5 flex flex-col gap-3 gradient-primary shadow-enhanced hover-lift">
        <div className="w-9 h-9 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-primary-foreground mb-1">
            {title}
          </h3>
          <p className="text-xs text-primary-foreground/80 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-glass rounded-2xl p-5 flex flex-col gap-3 shadow-enhanced hover-lift">
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
          accent ? 'bg-info/10' : 'bg-primary/10'
        }`}
      >
        <Icon
          className={`w-4 h-4 ${accent ? 'text-info' : 'text-primary'}`}
        />
      </div>
      <div>
        <h3
          className={`text-sm font-bold mb-1 ${
            accent ? 'text-info' : 'text-foreground'
          }`}
        >
          {title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
