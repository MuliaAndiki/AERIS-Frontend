'use client';

import AboutSection from '@/components/section/public/about-section';
import CtaSection from '@/components/section/public/cta-section';
import FeaturesSection from '@/components/section/public/features-section';
import HeroSection from '@/components/section/public/hero-section';
import MapPreviewSection from '@/components/section/public/map-preview-section';

export default function ContainerHome() {
  return (
    <main className="w-full">
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <MapPreviewSection />
      <CtaSection />
    </main>
  );
}
