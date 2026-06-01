import { Icon } from '@iconify/react';
import Image from 'next/image';
import Link from 'next/link';

import { appConfig, navigationMenuConfig } from '@/configs/app.config';

export default function AppFooter() {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image
                src={appConfig.logo}
                alt={appConfig.name}
                width={36}
                height={36}
                className="rounded-lg"
              />
              <span className="text-lg font-bold text-foreground tracking-tight">
                {appConfig.name}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {appConfig.description}
            </p>
            {/* Social media */}
            <div className="flex items-center gap-3 mt-1">
              {Object.entries(appConfig.social_media).map(([key, value]) => (
                <Link
                  key={key}
                  href={value.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                  aria-label={key}
                >
                  <Icon icon={value.icon} width={18} height={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-widest">
              Navigasi
            </h3>
            <ul className="flex flex-col gap-2">
              {navigationMenuConfig.items.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / info */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-widest">
              Platform
            </h3>
            <ul className="flex flex-col gap-2">
              {[
                { label: 'Masuk', href: '/login' },
                { label: 'Kebijakan Privasi', href: '/privacy' },
                { label: 'Syarat & Ketentuan', href: '/terms' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {appConfig.name}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Luminous Intelligence Platform
          </p>
        </div>
      </div>
    </footer>
  );
}
