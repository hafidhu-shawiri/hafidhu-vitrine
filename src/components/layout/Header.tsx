'use client';

/**
 * En-tête du site.
 *
 * Le prototype de référence ouvrait son menu « Solutions » au clic sans
 * aucune gestion clavier : ni Échap, ni fermeture au clic extérieur,
 * ni aria-expanded. Tout cela est traité ici.
 */

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { mainNav, primaryCta, routes, solutionsMenu } from '@/content/navigation';
import { Icon } from '@/components/ui/Icon';
import { cx } from '@/components/ui/primitives';

/**
 * Bascule bureau / mobile à 1120 px : en dessous, les sept entrées du
 * menu et le bouton d'action ne tiennent plus sans se tasser.
 *
 * Les variantes Tailwind sont écrites littéralement — une classe
 * construite par concaténation ne serait pas détectée à la compilation.
 */
export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  const dropdownId = useId();
  const mobilePanelId = useId();
  const solutionsRef = useRef<HTMLDivElement>(null);
  const solutionsButtonRef = useRef<HTMLButtonElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  const isActive = useCallback(
    (href: string) =>
      href === routes.home ? pathname === href : pathname === href || pathname.startsWith(`${href}/`),
    [pathname]
  );

  // Toute navigation referme les menus.
  useEffect(() => {
    setMobileOpen(false);
    setSolutionsOpen(false);
  }, [pathname]);

  // Échap referme le menu ouvert et rend le focus au déclencheur.
  useEffect(() => {
    if (!solutionsOpen && !mobileOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Escape') return;
      if (solutionsOpen) {
        setSolutionsOpen(false);
        solutionsButtonRef.current?.focus();
      } else if (mobileOpen) {
        setMobileOpen(false);
        mobileButtonRef.current?.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [solutionsOpen, mobileOpen]);

  // Clic ou focus hors du menu déroulant : fermeture.
  useEffect(() => {
    if (!solutionsOpen) return;

    function onOutside(e: Event) {
      if (!solutionsRef.current?.contains(e.target as Node)) setSolutionsOpen(false);
    }

    document.addEventListener('pointerdown', onOutside);
    document.addEventListener('focusin', onOutside);
    return () => {
      document.removeEventListener('pointerdown', onOutside);
      document.removeEventListener('focusin', onOutside);
    };
  }, [solutionsOpen]);

  // Menu mobile ouvert : l'arrière-plan ne défile plus.
  useEffect(() => {
    if (!mobileOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [mobileOpen]);

  // Le focus reste dans le panneau mobile tant qu'il est ouvert.
  useEffect(() => {
    if (!mobileOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      const panel = mobilePanelRef.current;
      if (!panel) return;

      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;

      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  const navLinkClass = (active: boolean) =>
    cx(
      'rounded-[8px] px-3 py-2.5 text-[0.9375rem] font-medium no-underline transition-colors',
      active ? 'bg-surface-subtle text-teal' : 'text-ink hover:bg-surface-subtle hover:text-ink'
    );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur-[8px]">
      <div className="mx-auto flex h-[72px] w-full max-w-[1180px] items-center gap-4 px-5 sm:px-6">
        {/* Logo — horizontal dès que la place le permet, carré sinon. */}
        <Link
          href={routes.home}
          aria-label="HAFIDHU — retour à l'accueil"
          className="flex shrink-0 items-center"
        >
          <Image
            src="/brand/logo-horizontal.png"
            alt="HAFIDHU"
            width={1981}
            height={577}
            priority
            sizes="160px"
            className="hidden h-[38px] w-auto sm:block"
          />
          <Image
            src="/brand/logo-square.png"
            alt="HAFIDHU"
            width={426}
            height={473}
            priority
            sizes="40px"
            className="block h-[40px] w-auto sm:hidden"
          />
        </Link>

        {/* ── Navigation bureau ─────────────────────────────────── */}
        <nav
          aria-label="Navigation principale"
          className="ml-auto hidden items-center gap-0.5 min-[1120px]:flex"
        >
          <div ref={solutionsRef} className="relative">
            <button
              ref={solutionsButtonRef}
              type="button"
              onClick={() => setSolutionsOpen((v) => !v)}
              aria-expanded={solutionsOpen}
              aria-controls={dropdownId}
              aria-haspopup="true"
              className={cx(
                navLinkClass(isActive(routes.solutions)),
                'flex cursor-pointer items-center gap-1.5 border-0 bg-transparent'
              )}
            >
              Solutions
              <Icon
                name="chevron-down"
                size={14}
                className={cx('text-muted transition-transform', solutionsOpen && 'rotate-180')}
              />
            </button>

            {solutionsOpen && (
              <div
                id={dropdownId}
                className="animate-rise absolute left-0 top-[calc(100%+8px)] w-[300px] rounded-[16px] border border-border bg-surface p-2 shadow-[0_12px_32px_rgba(16,42,67,0.1)]"
              >
                <Link
                  href={routes.solutions}
                  className="block rounded-[8px] px-3 py-2.5 no-underline hover:bg-ivory"
                >
                  <span className="block text-[0.875rem] font-semibold text-navy">
                    Tout l’écosystème
                  </span>
                  <span className="mt-0.5 block text-[0.8125rem] text-muted">
                    Vue d’ensemble des six modules
                  </span>
                </Link>
                <span aria-hidden="true" className="my-1.5 block h-px bg-border" />
                {solutionsMenu.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-[8px] px-3 py-2.5 no-underline hover:bg-ivory"
                  >
                    <span className="block text-[0.875rem] font-semibold text-navy">
                      {item.label}
                    </span>
                    <span className="mt-0.5 block text-[0.8125rem] text-muted">
                      {item.description}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {mainNav
            .filter((l) => l.href !== routes.solutions)
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={navLinkClass(isActive(link.href))}
                aria-current={isActive(link.href) ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}

          <Link
            href={primaryCta.href}
            className="ml-3 inline-flex min-h-[44px] items-center rounded-[12px] border border-teal bg-teal px-4 text-[0.9375rem] font-semibold text-white no-underline transition-colors hover:bg-teal-hover hover:text-white"
          >
            {primaryCta.label}
          </Link>
        </nav>

        {/* ── Déclencheur mobile ────────────────────────────────── */}
        <button
          ref={mobileButtonRef}
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls={mobilePanelId}
          className="ml-auto flex h-11 w-11 cursor-pointer items-center justify-center rounded-[12px] border border-border bg-surface text-navy min-[1120px]:hidden"
        >
          <Icon name={mobileOpen ? 'close' : 'menu'} size={22} />
          <span className="sr-only">{mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}</span>
        </button>
      </div>

      {/* ── Panneau mobile ──────────────────────────────────────── */}
      {mobileOpen && (
        <div
          id={mobilePanelId}
          ref={mobilePanelRef}
          className="animate-rise max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-border bg-surface px-5 pb-8 pt-3 min-[1120px]:hidden"
        >
          <nav aria-label="Navigation principale (mobile)" className="flex flex-col">
            <Link
              href={routes.home}
              className="border-b border-surface-subtle py-3.5 text-[1rem] font-semibold text-navy no-underline"
            >
              Accueil
            </Link>

            <p className="px-0.5 pb-2 pt-4 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-muted">
              Solutions
            </p>
            <Link
              href={routes.solutions}
              className="border-b border-surface-subtle py-3 text-[0.9375rem] font-semibold text-teal no-underline"
            >
              Tout l’écosystème
            </Link>
            {solutionsMenu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col gap-0.5 border-b border-surface-subtle py-3 no-underline"
              >
                <span className="text-[0.9375rem] text-ink">{item.label}</span>
                <span className="text-[0.8125rem] text-muted">{item.description}</span>
              </Link>
            ))}

            <p className="px-0.5 pb-2 pt-5 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-muted">
              Découvrir
            </p>
            {mainNav
              .filter((l) => l.href !== routes.solutions)
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className="border-b border-surface-subtle py-3.5 text-[1rem] font-semibold text-navy no-underline"
                >
                  {link.label}
                </Link>
              ))}
            <Link
              href={routes.security}
              className="border-b border-surface-subtle py-3.5 text-[1rem] font-semibold text-navy no-underline"
            >
              Sécurité &amp; confidentialité
            </Link>
            <Link
              href={routes.contact}
              className="border-b border-surface-subtle py-3.5 text-[1rem] font-semibold text-navy no-underline"
            >
              Contact
            </Link>

            <Link
              href={primaryCta.href}
              className="mt-5 inline-flex min-h-[48px] items-center justify-center rounded-[12px] bg-teal px-5 text-[1rem] font-semibold text-white no-underline"
            >
              {primaryCta.label}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
