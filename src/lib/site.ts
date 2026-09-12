/**
 * Configuration globale du site.
 *
 * L'URL publique n'est JAMAIS écrite en dur : elle est résolue à
 * l'exécution. Passer de l'URL Vercel au domaine définitif ne demande
 * que de modifier NEXT_PUBLIC_SITE_URL — aucune reconstruction du code.
 */

/** Ordre de résolution : variable explicite → Vercel → développement local. */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, '');

  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/\/+$/, '')}`;

  return 'http://localhost:3000';
}

export const SITE_URL = resolveSiteUrl();

/**
 * Le domaine définitif n'est considéré comme canonique que lorsqu'il est
 * réellement configuré. Tant que le site vit sur une URL Vercel, on évite
 * de déclarer hafidhu.com comme domaine actif.
 */
export const IS_FINAL_DOMAIN = SITE_URL.includes('hafidhu.com');

/** Un aperçu de déploiement ne doit jamais être indexé. */
export const IS_PREVIEW =
  process.env.VERCEL_ENV === 'preview' || process.env.VERCEL_ENV === 'development';

export const SHOULD_INDEX = !IS_PREVIEW;

export const site = {
  name: 'HAFIDHU',
  signature: 'HAFIDHU — Le Gardien',
  tagline: 'Le Gardien des traces qui comptent.',
  description:
    'HAFIDHU est une plateforme conçue pour organiser et conserver les cotisations, ' +
    'contributions, événements et engagements collectifs des familles et des communautés.',
  locale: 'fr_FR',
  lang: 'fr',
  author: 'MORA Shawiri',
  url: SITE_URL,
} as const;

/**
 * Vignette de partage social commune à toutes les pages.
 *
 * Le chemin reste relatif : `metadataBase` le rend absolu, si bien que la
 * vignette suit automatiquement le domaine configuré — URL Vercel
 * aujourd'hui, hafidhu.com demain, sans modification du code.
 *
 * Régénération : `npm run assets:og`.
 */
export const ogImage = {
  url: '/brand/og-image.jpg',
  width: 1200,
  height: 630,
  alt: `${site.name} — ${site.tagline}`,
  type: 'image/jpeg',
} as const;

export function absoluteUrl(pathname = '/'): string {
  return `${SITE_URL}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
}
