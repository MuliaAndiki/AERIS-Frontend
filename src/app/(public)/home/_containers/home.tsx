'use client';
import { Button } from '@/components/ui/button';
import { themeConfig } from '@/configs/theme.config';
import { ArrowRight, MapPin, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ContainerHome() {
  const theme = themeConfig.light;
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col font-sans" style={{ backgroundColor: theme.background }}>
      {/* ─── Navigation ─── */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 ${
          isScrolled ? 'bg-white/70 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: theme.primary.background }}>
            A
          </div>
          <span className="font-bold tracking-widest text-[14px]" style={{ color: theme.foreground }}>AERIS</span>
        </div>
        <Link href="/login">
          <Button variant="ghost" className="text-[13px] font-semibold" style={{ color: theme.primary.background }}>
            Sign In
          </Button>
        </Link>
      </nav>

      {/* ─── Hero Section ─── */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-20 text-center relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div 
          className="absolute top-[-10%] right-[-10%] w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none"
          style={{ backgroundColor: theme.primary.background }}
        />
        <div 
          className="absolute bottom-[-10%] left-[-10%] w-80 h-80 rounded-full blur-[120px] opacity-20 pointer-events-none"
          style={{ backgroundColor: theme.secondary.background }}
        />

        {/* Hero Content */}
        <div className="z-10 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 border mb-6 backdrop-blur-sm">
            <Zap size={14} style={{ color: theme.primary.background }} />
            <span className="text-[11px] font-bold tracking-wide uppercase" style={{ color: theme.primary.background }}>
              Environmental Intelligence Platform
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1]" style={{ color: theme.foreground }}>
            Breathe <span className="text-transparent bg-clip-text bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, ${theme.primary.background}, ${theme.accent.background})` }}>Smarter</span>,<br /> 
            Live Better.
          </h1>

          <p className="text-[15px] md:text-[17px] mb-10 max-w-lg mx-auto leading-relaxed" style={{ color: theme.muted.foreground }}>
            AERIS provides real-time environmental insights, heat risk tracking, and green space monitoring to help you navigate your city safely and healthily.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto h-12 px-8 rounded-full text-[15px] font-bold shadow-lg shadow-emerald-500/20 group hover:scale-105 transition-transform"
                style={{ backgroundColor: theme.primary.background, color: theme.primary.foreground }}
              >
                Get Started
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto h-12 px-8 rounded-full text-[15px] font-semibold border-2"
              style={{ borderColor: theme.border, color: theme.foreground }}
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Floating Features (Mobile Friendly) */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl z-10">
          {[
            { icon: MapPin, title: 'Real-time Tracking', desc: 'Monitor air quality and noise at your current location.' },
            { icon: Shield, title: 'Heat Risk', desc: 'Get alerts when temperatures reach dangerous levels.' },
            { icon: Zap, title: 'AI Insights', desc: 'Personalized health recommendations based on your environment.' },
          ].map((feature, i) => (
            <div 
              key={i} 
              className="p-6 rounded-2xl border bg-white/40 backdrop-blur-md text-left transition-all hover:translate-y-[-4px]"
              style={{ borderColor: theme.border }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-sm" style={{ backgroundColor: theme.secondary.background }}>
                <feature.icon size={20} style={{ color: theme.primary.background }} />
              </div>
              <h3 className="text-[15px] font-bold mb-2" style={{ color: theme.foreground }}>{feature.title}</h3>
              <p className="text-[13px] leading-snug" style={{ color: theme.muted.foreground }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 text-center border-t mt-20" style={{ borderColor: theme.border }}>
        <p className="text-[11px] font-medium tracking-widest" style={{ color: theme.muted.foreground }}>
          © 2026 AERIS ENVIRONMENTAL INTELLIGENCE. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
}
