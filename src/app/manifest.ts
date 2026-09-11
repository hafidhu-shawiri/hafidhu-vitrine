import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.tagline}`,
    short_name: site.name,
    description: site.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#F8F7F2',
    theme_color: '#0F4C5C',
    lang: 'fr',
    dir: 'ltr',
    categories: ['productivity', 'finance', 'social'],
    icons: [
      { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/brand/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
