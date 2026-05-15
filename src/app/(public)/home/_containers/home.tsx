'use client';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  BarChart3,
  Globe,
  Leaf,
  MapPin,
  Shield,
  Sparkles,
  ThermometerSun,
  TreePine,
  Volume2,
  Wind,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

/* ─────────── animated counter ─────────── */
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let current = 0;
          const step = Math.ceil(target / 60);
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(current);
            }
          }, 20);
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ─────────── floating particle ─────────── */
function FloatingParticle({ delay, size, x, y }: { delay: number; size: number; x: number; y: number }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
        background: 'radial-gradient(circle, rgba(103,185,154,0.35) 0%, transparent 70%)',
        animation: `float ${6 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

export default function ContainerHome() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const particles = [
    { delay: 0, size: 120, x: 10, y: 20 },
    { delay: 1.5, size: 80, x: 80, y: 15 },
    { delay: 0.8, size: 60, x: 60, y: 65 },
    { delay: 2, size: 100, x: 25, y: 75 },
    { delay: 1.2, size: 50, x: 90, y: 50 },
    { delay: 0.5, size: 70, x: 45, y: 30 },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col font-[Poppins,sans-serif] overflow-x-hidden" style={{ background: '#080F0C' }}>
      {/* ─── Navigation ─── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-500 ${
          isScrolled ? 'bg-[#080F0C]/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.3)]' : 'bg-transparent'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #248277, #67B99A)' }}>
            <Leaf size={20} className="text-white relative z-10" />
            <div className="absolute inset-0 bg-white/10 animate-pulse" />
          </div>
          <span className="font-bold tracking-[0.2em] text-[15px] text-white/90">AERIS</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button
              className="h-10 px-6 rounded-xl text-[13px] font-semibold border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white transition-all duration-300 backdrop-blur-sm"
              variant="ghost"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/register" className="hidden sm:block">
            <Button
              className="h-10 px-6 rounded-xl text-[13px] font-semibold text-[#080F0C] shadow-lg hover:scale-105 transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #67B99A, #248277)',
                boxShadow: '0 8px 32px rgba(36,130,119,0.3)',
              }}
            >
              Get Started
              <ArrowRight size={14} className="ml-1" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 md:px-12 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          {/* Main gradient orbs */}
          <div
            className="absolute w-[800px] h-[800px] rounded-full blur-[200px] opacity-20"
            style={{
              background: 'radial-gradient(circle, #248277, transparent)',
              left: `calc(20% + ${mousePos.x * 30}px)`,
              top: `calc(10% + ${mousePos.y * 20}px)`,
              transition: 'left 0.8s ease-out, top 0.8s ease-out',
            }}
          />
          <div
            className="absolute w-[600px] h-[600px] rounded-full blur-[180px] opacity-15"
            style={{
              background: 'radial-gradient(circle, #67B99A, transparent)',
              right: `calc(10% + ${mousePos.x * -20}px)`,
              bottom: `calc(20% + ${mousePos.y * -15}px)`,
              transition: 'right 0.8s ease-out, bottom 0.8s ease-out',
            }}
          />
          <div className="absolute w-[400px] h-[400px] rounded-full blur-[150px] opacity-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ background: 'radial-gradient(circle, #88D4AB, transparent)' }} />
          
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(103,185,154,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(103,185,154,0.5) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />

          {/* Floating particles */}
          {particles.map((p, i) => (
            <FloatingParticle key={i} {...p} />
          ))}
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border border-white/10 bg-white/5 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-700">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-emerald-300/80">
              Environmental Intelligence Platform
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[1.05] animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="text-white/95">Breathe </span>
            <span
              className="relative inline-block"
              style={{
                background: 'linear-gradient(135deg, #67B99A 0%, #248277 40%, #88D4AB 80%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Smarter
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" preserveAspectRatio="none">
                <path d="M0 8 Q75 0 150 8 Q225 16 300 8" fill="none" stroke="url(#underline-gradient)" strokeWidth="3" strokeLinecap="round" />
                <defs>
                  <linearGradient id="underline-gradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#67B99A" stopOpacity="0" />
                    <stop offset="50%" stopColor="#248277" />
                    <stop offset="100%" stopColor="#67B99A" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <br />
            <span className="text-white/95">Live </span>
            <span className="text-white/60">Better.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-[16px] md:text-[18px] mb-12 max-w-2xl mx-auto leading-relaxed text-white/40 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            Real-time air quality monitoring, heat risk tracking, noise analysis, and green space intelligence — all in one powerful platform powered by AI.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto h-14 px-10 rounded-2xl text-[15px] font-bold group hover:scale-105 transition-all duration-300 text-[#080F0C] relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #67B99A, #248277)',
                  boxShadow: '0 12px 40px rgba(36,130,119,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
                }}
              >
                <span className="relative z-10 flex items-center">
                  Start Monitoring
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-14 px-10 rounded-2xl text-[15px] font-semibold border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white/90 backdrop-blur-sm transition-all duration-300"
            >
              <Globe size={18} className="mr-2" />
              View Demo
            </Button>
          </div>

          {/* Stats bar */}
          <div className="mt-20 flex flex-wrap items-center justify-center gap-8 md:gap-16 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
            {[
              { value: 5, suffix: '+', label: 'Environment Metrics' },
              { value: 99, suffix: '%', label: 'Uptime Accuracy' },
              { value: 24, suffix: '/7', label: 'Real-time Monitoring' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-4xl font-extrabold" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #67B99A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-[11px] font-medium tracking-wider uppercase text-white/30 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-white/40" />
          </div>
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section className="relative py-32 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
              <Sparkles size={12} className="text-emerald-400" />
              <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-emerald-300/80">Powerful Features</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white/90 mb-6">
              Everything You Need to<br />
              <span style={{ background: 'linear-gradient(135deg, #67B99A, #248277)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Monitor Your Environment
              </span>
            </h2>
            <p className="text-[15px] text-white/35 max-w-xl mx-auto leading-relaxed">
              Comprehensive environmental intelligence at your fingertips, powered by real-time data from multiple sources.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Wind,
                title: 'Air Quality Index',
                desc: 'Real-time AQI monitoring with detailed PM2.5, PM10, O3 and pollutant breakdown.',
                gradient: 'linear-gradient(135deg, #248277, #1a6b62)',
                glow: 'rgba(36,130,119,0.15)',
              },
              {
                icon: ThermometerSun,
                title: 'Heat Risk Analysis',
                desc: 'Advanced heat index calculation with feels-like temperature and risk scoring.',
                gradient: 'linear-gradient(135deg, #B97A24, #8B5A1A)',
                glow: 'rgba(185,122,36,0.15)',
              },
              {
                icon: Volume2,
                title: 'Noise Estimation',
                desc: 'AI-powered noise level prediction based on road density and urban analysis.',
                gradient: 'linear-gradient(135deg, #7A24B9, #5A1A8B)',
                glow: 'rgba(122,36,185,0.15)',
              },
              {
                icon: Shield,
                title: 'Disaster Risk',
                desc: 'Flood and extreme heat risk assessment from ThinkHazard global database.',
                gradient: 'linear-gradient(135deg, #B92424, #8B1A1A)',
                glow: 'rgba(185,36,36,0.15)',
              },
              {
                icon: TreePine,
                title: 'Green Space Access',
                desc: 'Nearby park discovery with community reviews and environmental impact data.',
                gradient: 'linear-gradient(135deg, #24B977, #1A8B5A)',
                glow: 'rgba(36,185,119,0.15)',
              },
              {
                icon: BarChart3,
                title: 'AI Recommendations',
                desc: 'Personalized daily health and activity recommendations via Groq LLM.',
                gradient: 'linear-gradient(135deg, #2477B9, #1A5A8B)',
                glow: 'rgba(36,119,185,0.15)',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative p-8 rounded-3xl border border-white/5 transition-all duration-500 hover:border-white/10 hover:translate-y-[-4px] cursor-default"
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005))`,
                  boxShadow: `0 0 0 0 ${feature.glow}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 20px 60px -15px ${feature.glow}, 0 0 80px -20px ${feature.glow}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 0 0 ${feature.glow}`;
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500"
                  style={{ background: feature.gradient, boxShadow: `0 8px 24px ${feature.glow}` }}
                >
                  <feature.icon size={24} className="text-white" />
                </div>
                <h3 className="text-[16px] font-bold text-white/90 mb-3">{feature.title}</h3>
                <p className="text-[13px] leading-relaxed text-white/35">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="relative py-32 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
              <Zap size={12} className="text-emerald-400" />
              <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-emerald-300/80">How It Works</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white/90">
              Three Steps to{' '}
              <span style={{ background: 'linear-gradient(135deg, #67B99A, #248277)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Safer Living
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Enable Location',
                desc: 'Allow AERIS to detect your location for hyper-local environmental data.',
                icon: MapPin,
              },
              {
                step: '02',
                title: 'Get Insights',
                desc: 'Receive real-time analysis of air quality, heat risk, noise, and more.',
                icon: BarChart3,
              },
              {
                step: '03',
                title: 'Act Smarter',
                desc: 'Follow AI-powered recommendations tailored to your environment.',
                icon: Sparkles,
              },
            ].map((item, i) => (
              <div key={i} className="relative text-center group">
                {/* Connector line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-14 left-[60%] w-[80%] h-[1px] bg-gradient-to-r from-white/10 to-transparent" />
                )}
                <div className="relative mb-8">
                  <div
                    className="w-28 h-28 rounded-3xl mx-auto flex items-center justify-center relative group-hover:scale-105 transition-all duration-500"
                    style={{
                      background: 'linear-gradient(135deg, rgba(36,130,119,0.15), rgba(103,185,154,0.05))',
                      border: '1px solid rgba(103,185,154,0.1)',
                    }}
                  >
                    <item.icon size={32} className="text-emerald-400/70" />
                    <span className="absolute -top-3 -right-3 w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-extrabold text-emerald-300/80" style={{ background: 'linear-gradient(135deg, #248277, #1a6b62)', boxShadow: '0 4px 12px rgba(36,130,119,0.3)' }}>
                      {item.step}
                    </span>
                  </div>
                </div>
                <h3 className="text-[17px] font-bold text-white/85 mb-3">{item.title}</h3>
                <p className="text-[13px] text-white/35 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="relative py-32 px-6 md:px-12">
        <div className="max-w-4xl mx-auto relative">
          <div
            className="relative rounded-[2rem] p-12 md:p-16 text-center overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(36,130,119,0.2), rgba(103,185,154,0.08))',
              border: '1px solid rgba(103,185,154,0.15)',
            }}
          >
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-[200px] opacity-20" style={{ background: '#248277' }} />
            
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-8 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #248277, #67B99A)', boxShadow: '0 12px 40px rgba(36,130,119,0.3)' }}>
                <Globe size={28} className="text-white" />
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white/90 mb-6">
                Ready to Know Your<br />Environment?
              </h2>
              <p className="text-[15px] text-white/40 max-w-lg mx-auto mb-10 leading-relaxed">
                Join AERIS and get instant access to real-time environmental intelligence for your exact location.
              </p>
              <Link href="/register">
                <Button
                  size="lg"
                  className="h-14 px-12 rounded-2xl text-[15px] font-bold group hover:scale-105 transition-all duration-300 text-[#080F0C]"
                  style={{
                    background: 'linear-gradient(135deg, #67B99A, #248277)',
                    boxShadow: '0 12px 40px rgba(36,130,119,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
                  }}
                >
                  Create Free Account
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="relative px-6 md:px-12 py-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #248277, #67B99A)' }}>
              <Leaf size={14} className="text-white" />
            </div>
            <span className="font-bold tracking-[0.15em] text-[13px] text-white/50">AERIS</span>
          </div>
          <p className="text-[11px] font-medium tracking-wider text-white/20">
            © 2026 AERIS ENVIRONMENTAL INTELLIGENCE. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy', 'Terms', 'Contact'].map((link) => (
              <span key={link} className="text-[12px] text-white/30 hover:text-white/60 cursor-pointer transition-colors">
                {link}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
