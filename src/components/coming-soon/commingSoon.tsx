export default function ComingSoon() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground relative overflow-hidden">
      <div className="coming-soon-gradient absolute inset-0 pointer-events-none" />

      <div
        className="animate-blob-1 absolute -top-24 -left-24 w-72 h-72 rounded-full opacity-30 blur-[120px] pointer-events-none"
        style={{ background: 'var(--primary)' }}
      />
      <div
        className="animate-blob-2 absolute top-1/3 -right-16 w-64 h-64 rounded-full opacity-30 blur-[120px] pointer-events-none"
        style={{ background: 'var(--info)' }}
      />
      <div
        className="animate-blob-3 absolute -bottom-20 left-1/3 w-80 h-80 rounded-full opacity-30 blur-[120px] pointer-events-none"
        style={{ background: 'var(--success)' }}
      />

      <div className="card-glass shadow-enhanced rounded-xl p-10 max-w-xl w-full text-center animate-enter relative z-10 mx-4">
        <span className="inline-block px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm mb-6 animate-pulse">
          Launching Soon
        </span>

        <h1 className="text-4xl md:text-5xl font-bold text-gradient-primary mb-4">
          Something Awesome is Coming
        </h1>

        <p className="text-muted-foreground mb-8">
          We&apos;re crafting something beautiful. Stay tuned for the launch and be the first to
          experience it.
        </p>

        <div className="absolute -inset-1 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none animate-[glow_2s_infinite_alternate]" />
      </div>

      <footer className="absolute bottom-6 text-xs text-muted-foreground">
        © 2026 AERIS. All rights reserved.
      </footer>
    </div>
  );
}
