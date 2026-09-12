import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { JsonLd, organizationJsonLd, webSiteJsonLd } from '@/lib/seo';
import { SHOULD_INDEX, site, SITE_URL } from '@/lib/site';

/**
 * Inter est auto-hébergée par next/font : aucune requête vers un domaine
 * tiers, aucun décalage de mise en page au chargement.
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

/**
 * Vignette de partage social, commune à toutes les pages.
 *
 * Le chemin est relatif : `metadataBase` le rend absolu, si bien que la
 * vignette suit automatiquement le domaine configuré — URL Vercel
 * aujourd'hui, hafidhu.com demain, sans modification du code.
 *
 * Régénération : `npm run assets:og`.
 */
const OG_IMAGE = {
  url: '/brand/og-image.jpg',
  width: 1200,
  height: 630,
  alt: 'HAFIDHU — Le Gardien des traces qui comptent.',
  type: 'image/jpeg',
} as const;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.author }],
  creator: site.author,
  publisher: site.name,
  formatDetection: { telephone: false, address: false, email: false },
  robots: SHOULD_INDEX
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
  icons: {
    icon: [
      { url: '/brand/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/brand/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    locale: site.locale,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: SITE_URL,
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [OG_IMAGE.url],
  },
};

export const viewport: Viewport = {
  themeColor: '#0F4C5C',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
  // Le zoom reste autorisé : le brider nuirait à l'accessibilité.
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body>
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={webSiteJsonLd()} />
        {children}
      </body>
    </html>
  );
}
