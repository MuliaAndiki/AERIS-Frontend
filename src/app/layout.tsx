import '@/styles/globals.css';

import { Instrument_Sans, Instrument_Serif,Poppins } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';

import { metadata, siteConfig } from './metadata';
import { AppProviders } from './providers';

export { metadata };

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

const instrumentSans = Instrument_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-instrument-sans',
});

const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-instrument-serif',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${instrumentSans.variable} ${instrumentSerif.variable}`}>
      <body className={`${poppins.className} antialiased`}>
        <NextTopLoader
          color="#3F862A"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          zIndex={99999}
        />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
