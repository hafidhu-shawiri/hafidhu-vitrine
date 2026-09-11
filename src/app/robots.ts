import type { MetadataRoute } from 'next';
import { absoluteUrl, SHOULD_INDEX } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  // Tant que le site vit sur un déploiement d'aperçu, rien n'est indexé.
  if (!SHOULD_INDEX) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // L'administration et les routes d'API n'ont rien à faire dans l'index.
        disallow: ['/admin', '/admin/', '/api/'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  };
}
