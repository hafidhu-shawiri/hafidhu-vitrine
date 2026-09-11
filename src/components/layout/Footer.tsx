/**
 * Pied de page.
 *
 * Le mot-symbole du logo officiel est en bleu nuit — exactement la
 * couleur du pied de page. Aucune version claire n'étant fournie dans
 * les assets, le logo est posé sur une plaque blanche : le contraste
 * est garanti et le logo reste strictement inchangé.
 */

import Image from 'next/image';
import Link from 'next/link';
import { footerColumns, routes } from '@/content/navigation';
import { contact, socials } from '@/content/contact';
import { site } from '@/lib/site';
import { Icon } from '@/components/ui/Icon';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy">
      <div className="mx-auto w-full max-w-[1180px] px-5 pb-8 pt-12 sm:px-6 sm:pt-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          {/* ── Identité & coordonnées ─────────────────────────── */}
          <div>
            <Link
              href={routes.home}
              aria-label="HAFIDHU — retour à l'accueil"
              className="inline-flex rounded-[12px] bg-white px-4 py-3"
            >
              <Image
                src="/brand/logo-horizontal.png"
                alt="HAFIDHU"
                width={1981}
                height={577}
                sizes="150px"
                className="h-[34px] w-auto"
              />
            </Link>

            <p className="mt-4 max-w-[32ch] text-[0.875rem] leading-[1.65] text-white/70">
              {site.tagline} Plateforme en construction.
            </p>

            <address className="mt-5 flex flex-col gap-2.5 not-italic">
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex items-center gap-2.5 text-[0.875rem] text-white/80 no-underline transition-colors hover:text-white"
              >
                <Icon name="mail" size={16} className="shrink-0 text-gold" />
                {contact.email}
              </a>
              <a
                href={contact.phoneHref}
                className="inline-flex items-center gap-2.5 text-[0.875rem] text-white/80 no-underline transition-colors hover:text-white"
              >
                <Icon name="phone" size={16} className="shrink-0 text-gold" />
                {contact.phone}
              </a>
              <span className="inline-flex items-start gap-2.5 text-[0.875rem] text-white/80">
                <Icon name="map-pin" size={16} className="mt-0.5 shrink-0 text-gold" />
                <span>
                  {contact.address.line}
                  <br />
                  {contact.address.city}, {contact.address.country}
                </span>
              </span>
            </address>

            <ul className="mt-5 flex flex-wrap gap-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-white/20 text-white/75 transition-colors hover:border-gold hover:text-white"
                  >
                    <Icon name={s.icon} size={18} />
                    <span className="sr-only">{s.label} (nouvelle fenêtre)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Colonnes de liens ──────────────────────────────── */}
          {footerColumns.map((col) => (
            <nav key={col.title} aria-labelledby={`footer-${col.title}`}>
              <h2
                id={`footer-${col.title}`}
                className="mb-4 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-gold"
              >
                {col.title}
              </h2>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[0.875rem] text-white/78 no-underline transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.8125rem] text-white/55">
            © {year} HAFIDHU — Tous droits réservés. Un projet porté par{' '}
            <a
              href={contact.website.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/75 no-underline transition-colors hover:text-white"
            >
              {site.author}
            </a>
            .
          </p>
          <p className="text-[0.8125rem] text-white/55">
            Les interfaces présentées sont des aperçus de fonctionnalités en construction.
          </p>
        </div>
      </div>
    </footer>
  );
}
