/**
 * Assistance au référencement.
 *
 * Aucune URL absolue n'est écrite en dur : tout dérive de SITE_URL,
 * lui-même piloté par NEXT_PUBLIC_SITE_URL. Basculer de l'URL Vercel
 * vers hafidhu.com ne demande qu'un changement de variable.
 */

import type { Metadata } from 'next';
import { absoluteUrl, SHOULD_INDEX, site, SITE_URL } from './site';

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  /** Image de partage propre à la page (chemin relatif). */
  image?: string;
  /** Certaines pages ne doivent pas être indexées (administration). */
  noIndex?: boolean;
};

export function pageMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const indexable = SHOULD_INDEX && !noIndex;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: indexable
      ? { index: true, follow: true, googleBot: { index: true, follow: true } }
      : { index: false, follow: false, nocache: true },
    openGraph: {
      type: 'website',
      locale: site.locale,
      siteName: site.name,
      title,
      description,
      url,
      ...(image ? { images: [{ url: absoluteUrl(image) }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(image ? { images: [absoluteUrl(image)] } : {}),
    },
  };
}

/* ═══════════════════════════════════════════════════════════════════
   DONNÉES STRUCTURÉES
   Uniquement des faits vérifiables : aucune note, aucun avis,
   aucun effectif, aucune date inventée.
   ═══════════════════════════════════════════════════════════════════ */

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    alternateName: site.signature,
    description: site.description,
    url: SITE_URL,
    logo: absoluteUrl('/brand/logo-horizontal.png'),
    founder: { '@type': 'Person', name: site.author },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Moroni Oasis, route les puffins',
      addressLocality: 'Moroni',
      addressCountry: 'KM',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'contact@morashawiri.com',
      telephone: '+269-430-63-06',
      availableLanguage: ['French'],
    },
  };
}

export function webSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    description: site.description,
    url: SITE_URL,
    inLanguage: 'fr-FR',
    publisher: { '@type': 'Organization', name: site.name },
  };
}

export function faqJsonLd(entries: readonly { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((e) => ({
      '@type': 'Question',
      name: e.q,
      acceptedAnswer: { '@type': 'Answer', text: e.a },
    })),
  };
}

export function breadcrumbJsonLd(trail: readonly { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Insère un bloc JSON-LD. Les données sont construites côté serveur. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Contenu généré par l'application, jamais saisi par un visiteur.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
