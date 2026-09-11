import type { Metadata } from 'next';

/**
 * Enveloppe de l'espace d'administration.
 *
 * Volontairement hors du groupe (site) : pas d'en-tête public,
 * pas de pied de page, aucune indexation.
 */
export const metadata: Metadata = {
  title: 'Dashboard MORA Shawiri — Site HAFIDHU',
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-ivory">{children}</div>;
}
