import Link from 'next/link';
import type { Metadata } from 'next';
import { mainNav, routes } from '@/content/navigation';

export const metadata: Metadata = {
  title: 'Page introuvable',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-ivory px-5 py-16 text-center">
      <span
        aria-hidden="true"
        className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-teal"
      >
        Erreur 404
      </span>

      <h1 className="mt-4 max-w-[22ch] text-[1.75rem] font-bold leading-[1.2] text-navy sm:text-[2.125rem]">
        Cette page n’existe pas ou a été déplacée.
      </h1>

      <p className="mt-4 max-w-[52ch] text-[1rem] leading-[1.7] text-muted">
        Le lien que vous avez suivi ne correspond à aucune page du site. Vous pouvez revenir à
        l’accueil ou rejoindre directement l’une des sections ci-dessous.
      </p>

      <Link
        href={routes.home}
        className="mt-8 inline-flex min-h-[48px] items-center rounded-[12px] border border-teal bg-teal px-5 text-[0.9375rem] font-semibold text-white no-underline transition-colors hover:bg-teal-hover hover:text-white"
      >
        Retour à l’accueil
      </Link>

      <nav aria-label="Sections principales" className="mt-10">
        <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          {mainNav.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[0.875rem] font-medium text-teal no-underline hover:underline"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
