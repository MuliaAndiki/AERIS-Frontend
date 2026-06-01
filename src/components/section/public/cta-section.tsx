'use client';

import Link from 'next/link';

export default function CtaSection() {
  return (
    <section className="w-full py-24 px-6 md:px-12 lg:px-20 bg-secondary/30">
      <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">
          Mulai Sekarang
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
          Siap Memantau
          <br />
          Lingkunganmu?
        </h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-md leading-relaxed">
          Bergabunglah dengan ribuan pengguna yang sudah menggunakan AERIS untuk
          membuat keputusan berbasis data lingkungan yang lebih baik.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg gradient-primary text-primary-foreground font-semibold text-sm hover-lift shadow-enhanced transition-all"
          >
            Masuk ke AERIS
          </Link>
          <Link
            href="#features"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg border border-border text-foreground font-semibold text-sm hover:bg-secondary transition-all"
          >
            Lihat Fitur
          </Link>
        </div>
      </div>
    </section>
  );
}
