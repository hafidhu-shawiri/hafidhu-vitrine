import type { NextConfig } from 'next';
import { modules } from './src/content/modules';

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

  /**
   * Redirections permanentes.
   *
   * L'arborescence canonique reste inchangée : une page de module vit
   * sous /solutions/<slug>, et c'est cette URL que déclarent le sitemap,
   * les liens internes et les balises canoniques.
   *
   * Les alias courts existent parce qu'un nom de module se cite seul —
   * à l'oral, sur une affiche, dans un message. Une redirection 301 est
   * sans risque pour le référencement : elle ne crée pas de contenu
   * dupliqué, elle transmet l'autorité vers l'URL canonique.
   */
  async redirects() {
    /* Générés depuis la liste des modules : ajouter un module crée son
       alias, sans qu'on ait à y penser ici. */
    const moduleAliases = modules.map((m) => ({
      source: `/${m.slug}`,
      destination: `/solutions/${m.slug}`,
      permanent: true,
    }));

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

      /* Variantes sans particule : ce sont les formes que l'on tape
         spontanément, et celles qui reviennent le plus souvent dans les
         liens écrits à la main. */
      {
        source: '/politique-confidentialite',
        destination: '/politique-de-confidentialite',
        permanent: true,
      },
      {
        source: '/conditions-utilisation',
        destination: '/conditions-d-utilisation',
        permanent: true,
      },
      { source: '/mentions', destination: '/mentions-legales', permanent: true },
      { source: '/cgu', destination: '/conditions-d-utilisation', permanent: true },

      {
        source: '/solutions/historique',
        destination: '/solutions/historique-memoire-familiale',
        permanent: true,
      },
      { source: '/historique', destination: '/solutions/historique-memoire-familiale', permanent: true },

      ...moduleAliases,
    ];
  },
};

export default nextConfig;
