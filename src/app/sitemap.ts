import type { MetadataRoute } from 'next';
import { publicRoutes, routes } from '@/content/navigation';
import { absoluteUrl, SHOULD_INDEX } from '@/lib/site';

/**
 * Sitemap généré dynamiquement à partir de la liste des routes publiques.
 * Aucune URL n'est écrite en dur : le passage au domaine définitif se fait
 * par la seule variable NEXT_PUBLIC_SITE_URL.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Un déploiement d'aperçu ne publie pas de sitemap indexable.
  if (!SHOULD_INDEX) return [];

  const now = new Date();

  const priority = (path: string): number => {
    if (path === routes.home) return 1;
    if (path === routes.solutions || path.startsWith(`${routes.solutions}/`)) return 0.9;
    if (path === routes.waitlist) return 0.9;
    if ([routes.legal, routes.privacy, routes.terms].includes(path as never)) return 0.3;
    return 0.7;
  };

  return publicRoutes.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === routes.home ? ('weekly' as const) : ('monthly' as const),
    priority: priority(path),
  }));
}
