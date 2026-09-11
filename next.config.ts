import type { NextConfig } from 'next';

/**
 * En-têtes de sécurité appliqués à toutes les réponses.
 * Volontairement conservateurs : le site ne charge aucune ressource tierce
 * (polices auto-hébergées via next/font, aucune bibliothèque externe).
 */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Les images sont toutes locales : aucun domaine distant n'est autorisé.
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 420, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [80, 128, 192, 256, 384, 512],
    remotePatterns: [],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        // L'espace d'administration ne doit jamais être indexé ni mis en cache.
        source: '/admin/:path*',
        headers: [
          ...securityHeaders,
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
          { key: 'Cache-Control', value: 'no-store, max-age=0, must-revalidate' },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          ...securityHeaders,
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // L'ancien prototype utilisait /liste-attente : on préserve le lien.
      {
        source: '/liste-attente',
        destination: '/rejoindre-la-liste-d-attente',
        permanent: true,
      },
      { source: '/vision', destination: '/notre-vision', permanent: true },
      { source: '/securite', destination: '/securite-confidentialite', permanent: true },
      { source: '/confidentialite', destination: '/politique-de-confidentialite', permanent: true },
      { source: '/conditions', destination: '/conditions-d-utilisation', permanent: true },
      {
        source: '/solutions/historique',
        destination: '/solutions/historique-memoire-familiale',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
