import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

/**
 * Enveloppe des pages publiques.
 *
 * L'espace d'administration vit hors de ce groupe : il n'hérite donc
 * ni de l'en-tête, ni du pied de page du site vitrine.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-ivory">
      <a href="#contenu" className="skip-link">
        Aller au contenu principal
      </a>
      <Header />
      <main id="contenu" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
