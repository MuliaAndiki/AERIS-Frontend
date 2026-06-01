import React from 'react';

interface AppConfig {
  name: string;
  description: string;
  logo: string;
  metadata: {
    title: string;
    description: string;
    keywords: string[];
    author: string;
    image: string;
  };
  social_media: {
    twitter: {
      url: string;
      icon: string;
    };
    instagram: {
      url: string;
      icon: string;
    };
    linkedin: {
      url: string;
      icon: string;
    };
    youtube: {
      url: string;
      icon: string;
    };
    tiktok: {
      url: string;
      icon: string;
    };
  };
}

export const appConfig: AppConfig = {
  name: 'AERIS',
  description: 'Platform pemantauan kualitas udara, risiko panas, dan kondisi lingkungan secara real-time.',
  logo: '/images/logo.png',
  metadata: {
    title: 'AERIS — Luminous Intelligence Platform',
    description: 'Pahami lingkunganmu dengan AERIS. Pantau kualitas udara, risiko panas, dan kondisi lingkungan secara real-time.',
    keywords: ['kualitas udara', 'lingkungan', 'AQI', 'pemantauan', 'AERIS', 'smart city'],
    author: 'AERIS Team',
    image: '/images/og-image.png',
  },
  social_media: {
    twitter: {
      url: 'https://twitter.com/aeris_id',
      icon: 'hugeicons:new-twitter-rectangle',
    },
    instagram: {
      url: 'https://instagram.com/aeris_id',
      icon: 'basil:instagram-outline',
    },
    linkedin: {
      url: 'https://linkedin.com/company/aeris-id',
      icon: 'tabler:brand-linkedin',
    },
    youtube: {
      url: 'https://youtube.com/@aeris_id',
      icon: 'mingcute:youtube-line',
    },
    tiktok: {
      url: 'https://tiktok.com/@aeris_id',
      icon: 'hugeicons:tiktok',
    },
  },
};

interface NavigationMenuConfig {
  items: {
    title: string;
    href: string;
    icon?: React.ReactNode;
    description?: string;
    children?: NavigationMenuConfig['items'];
  }[];
}

export const navigationMenuConfig: NavigationMenuConfig = {
  items: [
    {
      title: 'Beranda',
      href: '/',
      description: 'Halaman utama AERIS',
    },
    {
      title: 'Fitur',
      href: '/#features',
      description: 'Fitur pemantauan lingkungan',
    },
    {
      title: 'Peta',
      href: '/#map',
      description: 'Jelajahi kanvas atmosfer',
    },
  ],
};
