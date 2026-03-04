import type { Metadata } from 'next';

export const siteConfig = {
  name: 'AERIS',
  shortName: 'AERIS',
  description:
    'A location-aware environmental insight application delivering real-time air quality, heat risk, flood potential, noise estimation, and green proximity intelligence.',
  url: 'https://aeris-app.com',
  locale: 'en_US',
  themeColor: '#0EA5A4',
  backgroundColor: '#0F172A',
  keywords: [
    'AERIS',
    'environmental dashboard',
    'air quality monitoring',
    'heat risk analysis',
    'urban climate intelligence',
    'flood risk detection',
    'green space proximity',
    'location based environmental app',
  ],
};
export const metadata: Metadata = {
  title: {
    default: 'AERIS - Environmental Intelligence Platform',
    template: '%s | AERIS',
  },

  description: siteConfig.description,
  keywords: siteConfig.keywords,
  metadataBase: new URL(siteConfig.url),

  applicationName: 'AERIS',
  authors: [{ name: 'AERIS Team' }],
  creator: 'AERIS',
  publisher: 'AERIS',

  manifest: '/favicon/site.webmanifest',
  themeColor: siteConfig.themeColor,

  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },

  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [{ url: '/favicon/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: '/favicon/favicon.ico',
  },

  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: 'AERIS - Environmental Intelligence Platform',
    description: siteConfig.description,
    siteName: 'AERIS',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AERIS Environmental Dashboard',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'AERIS - Environmental Intelligence Platform',
    description: siteConfig.description,
    creator: '@aerisapp',
    images: ['/images/og-image.png'],
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AERIS',
  },

  formatDetection: {
    telephone: false,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  other: {
    'msapplication-TileColor': siteConfig.themeColor,
    'msapplication-config': '/favicon/browserconfig.xml',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
};
