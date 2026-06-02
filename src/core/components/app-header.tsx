'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { appConfig, navigationMenuConfig } from '@/configs/app.config';
import { cn } from '@/utils/classname';

import LanguageDropdown from './language.dropdown';
import NotificationDropdown from './notification.dropdown';

export default function AppHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm px-6 md:px-12 lg:px-20 py-4 border-b transition-all duration-200',
        isScrolled ? 'border-b-border shadow-md' : 'border-b-transparent'
      )}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left — logo + nav */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={appConfig.logo}
              alt={appConfig.name}
              width={36}
              height={36}
              className="rounded-lg"
            />
            <span className="text-sm font-bold tracking-widest text-foreground hidden sm:block">
              {appConfig.name}
            </span>
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              {navigationMenuConfig?.items?.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuLink href={item.href} className={navigationMenuTriggerStyle()}>
                    {item.title}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right — actions */}
        <div className="flex items-center gap-3">
          {/* <LanguageDropdown /> */}
          <NotificationDropdown />
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-semibold hover-lift shadow-enhanced transition-all"
          >
            Masuk
          </Link>
        </div>
      </div>
    </nav>
  );
}
