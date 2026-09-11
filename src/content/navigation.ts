/**
 * Navigation du site.
 *
 * « Galerie » figure dans le menu PRINCIPAL, et non uniquement
 * dans le pied de page.
 */

import { modules } from './modules';

export type NavLink = { label: string; href: string };

export const routes = {
  home: '/',
  vision: '/notre-vision',
  solutions: '/solutions',
  howItWorks: '/comment-ca-marche',
  audiences: '/pour-qui',
  security: '/securite-confidentialite',
  faq: '/faq',
  resources: '/ressources',
  gallery: '/galerie',
  contact: '/contact',
  waitlist: '/rejoindre-la-liste-d-attente',
  legal: '/mentions-legales',
  privacy: '/politique-de-confidentialite',
  terms: '/conditions-d-utilisation',
  admin: '/admin',
} as const;

/** Entrées du menu déroulant « Solutions ». */
export const solutionsMenu: readonly (NavLink & { description: string })[] = modules.map((m) => ({
  label: m.name,
  href: `${routes.solutions}/${m.slug}`,
  description: m.tag,
}));

/** Menu principal — ordre imposé par le cahier des charges. */
export const mainNav: readonly NavLink[] = [
  { label: 'Solutions', href: routes.solutions },
  { label: 'Comment ça marche', href: routes.howItWorks },
  { label: 'Pour qui ?', href: routes.audiences },
  { label: 'Notre vision', href: routes.vision },
  { label: 'Ressources', href: routes.resources },
  { label: 'FAQ', href: routes.faq },
  { label: 'Galerie', href: routes.gallery },
];

export const primaryCta = {
  label: "Rejoindre la liste d'attente",
  href: routes.waitlist,
} as const;

export const footerColumns: readonly { title: string; links: readonly NavLink[] }[] = [
  {
    title: 'Produit',
    links: [
      { label: 'Solutions', href: routes.solutions },
      ...solutionsMenu.map(({ label, href }) => ({ label, href })),
    ],
  },
  {
    title: 'Découvrir',
    links: [
      { label: 'Notre vision', href: routes.vision },
      { label: 'Comment ça marche', href: routes.howItWorks },
      { label: 'Pour qui ?', href: routes.audiences },
      { label: 'Sécurité & confidentialité', href: routes.security },
      { label: 'Galerie', href: routes.gallery },
      { label: 'Ressources', href: routes.resources },
      { label: 'FAQ', href: routes.faq },
    ],
  },
  {
    title: 'Contact & légal',
    links: [
      { label: 'Contact', href: routes.contact },
      { label: "Rejoindre la liste d'attente", href: routes.waitlist },
      { label: 'Mentions légales', href: routes.legal },
      { label: 'Politique de confidentialité', href: routes.privacy },
      { label: "Conditions d'utilisation", href: routes.terms },
    ],
  },
];

/** Toutes les routes publiques, pour le sitemap et la recette. */
export const publicRoutes: readonly string[] = [
  routes.home,
  routes.vision,
  routes.solutions,
  ...solutionsMenu.map((s) => s.href),
  routes.howItWorks,
  routes.audiences,
  routes.security,
  routes.faq,
  routes.resources,
  routes.gallery,
  routes.contact,
  routes.waitlist,
  routes.legal,
  routes.privacy,
  routes.terms,
];
