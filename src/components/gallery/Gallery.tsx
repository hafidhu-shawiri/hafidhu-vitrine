'use client';

/**
 * Galerie HAFIDHU.
 *
 * Choix de conception :
 *  - 62 % des images sont en portrait → disposition en maçonnerie
 *    (colonnes CSS), qui évite le recadrage massif d'une grille à
 *    ratio fixe ;
 *  - aucune personne n'est nommée : les légendes restent thématiques ;
 *  - visionneuse pilotable entièrement au clavier ;
 *  - chargement différé et vignettes floutées pour éviter tout
 *    décalage de mise en page.
 */

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ManagedImage } from '@/content/images';
import { Reveal } from '@/components/motion/Reveal';
import { stagger } from '@/components/motion/stagger';
import { Icon } from '@/components/ui/Icon';
import { cx } from '@/components/ui/primitives';

export type GalleryItem = ManagedImage & { alt: string; displayCategory: string };

export function Gallery({ items }: { items: readonly GalleryItem[] }) {
  const [filter, setFilter] = useState<string>('Toutes');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of items) {
      counts.set(item.displayCategory, (counts.get(item.displayCategory) ?? 0) + 1);
    }
    return [
      { label: 'Toutes', count: items.length },
      ...[...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([label, count]) => ({ label, count })),
    ];
  }, [items]);

  const visible = useMemo(
    () => (filter === 'Toutes' ? items : items.filter((i) => i.displayCategory === filter)),
    [items, filter]
  );

  const close = useCallback(() => {
    setOpenIndex(null);
    lastFocused.current?.focus();
  }, []);

  const go = useCallback(
    (delta: number) => {
      setOpenIndex((current) => {
        if (current === null) return current;
        const next = current + delta;
        if (next < 0) return visible.length - 1;
        if (next >= visible.length) return 0;
        return next;
      });
    },
    [visible.length]
  );

  // Clavier : Échap ferme, flèches naviguent.
  useEffect(() => {
    if (openIndex === null) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      } else if (e.key === 'Tab') {
        // Le focus ne sort pas de la visionneuse.
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>('button');
        if (!focusables || focusables.length === 0) return;
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
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [openIndex, close, go]);

  // Défilement de l'arrière-plan bloqué pendant l'ouverture.
  useEffect(() => {
    if (openIndex === null) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.querySelector('button')?.focus();
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [openIndex]);

  const current = openIndex !== null ? visible[openIndex] : null;

  return (
    <>
      {/* ── Filtres ──────────────────────────────────────────── */}
      <div role="group" aria-label="Filtrer la galerie par thème" className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const active = filter === cat.label;
          return (
            <button
              key={cat.label}
              type="button"
              onClick={() => {
                setFilter(cat.label);
                setOpenIndex(null);
              }}
              aria-pressed={active}
              className={cx(
                'inline-flex min-h-[40px] cursor-pointer items-center gap-2 rounded-[999px] border px-4 text-[0.875rem] font-medium transition-colors',
                active
                  ? 'border-teal bg-teal text-white'
                  : 'border-border bg-surface text-ink hover:border-teal hover:text-teal'
              )}
            >
              {cat.label}
              <span className={cx('text-[0.75rem]', active ? 'text-white/75' : 'text-muted')}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="mt-4 text-[0.8125rem] text-muted">
        {visible.length} image{visible.length > 1 ? 's' : ''} affichée
        {visible.length > 1 ? 's' : ''}
        {filter !== 'Toutes' ? ` — ${filter}` : ''}.
      </p>

      {/* ── Maçonnerie ───────────────────────────────────────── */}
      <ul className="mt-6 columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4 [&>li]:mb-3 sm:[&>li]:mb-4">
        {/*
          Le décalage suit la position dans la rangée, pas l'index global :
          sur 77 images, un décalage cumulatif ferait attendre les
          dernières plusieurs secondes. Ici, chaque rangée se pose en
          moins de 200 ms, et seules les images entrant réellement dans le
          champ sont animées.
        */}
        {visible.map((item, index) => (
          <Reveal
            as="li"
            key={item.id}
            variant="fade"
            delay={stagger(index % 4, 60, 180)}
            className="break-inside-avoid"
          >
            <button
              type="button"
              onClick={(e) => {
                lastFocused.current = e.currentTarget;
                setOpenIndex(index);
              }}
              className="group relative block w-full cursor-pointer overflow-hidden rounded-[12px] border border-border bg-surface-subtle p-0"
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                placeholder="blur"
                blurDataURL={item.blurDataURL}
                loading={index < 8 ? 'eager' : 'lazy'}
                sizes="(max-width: 639px) 50vw, (max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
                className="h-auto w-full transition-transform duration-300 ease-out group-hover:scale-[1.02] motion-reduce:group-hover:scale-100"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 flex items-end justify-end bg-navy/0 p-2 opacity-0 transition-opacity duration-200 group-hover:bg-navy/15 group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-white text-navy">
                  <Icon name="expand" size={16} />
                </span>
              </span>
              <span className="sr-only">Agrandir : {item.alt}</span>
            </button>
          </Reveal>
        ))}
      </ul>

      {/* ── Visionneuse ──────────────────────────────────────── */}
      {current && openIndex !== null ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Image ${openIndex + 1} sur ${visible.length}`}
          className="hfd-enter fixed inset-0 z-50 flex flex-col bg-navy/95 p-3 sm:p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.8125rem] text-white/75">
              {openIndex + 1} / {visible.length} — {current.displayCategory}
            </p>
            <button
              type="button"
              onClick={close}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-[12px] border border-white/25 text-white transition-colors hover:border-gold"
            >
              <Icon name="close" size={20} />
              <span className="sr-only">Fermer la visionneuse</span>
            </button>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center gap-2 py-3 sm:gap-4">
            <button
              type="button"
              onClick={() => go(-1)}
              className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-[12px] border border-white/25 text-white transition-colors hover:border-gold"
            >
              <Icon name="chevron-left" size={20} />
              <span className="sr-only">Image précédente</span>
            </button>

            <figure className="m-0 flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center">
              <Image
                key={current.id}
                src={current.src}
                alt={current.alt}
                width={current.width}
                height={current.height}
                placeholder="blur"
                blurDataURL={current.blurDataURL}
                sizes="(max-width: 767px) 92vw, 78vw"
                className="max-h-full w-auto max-w-full rounded-[12px] object-contain"
              />
            </figure>

            <button
              type="button"
              onClick={() => go(1)}
              className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-[12px] border border-white/25 text-white transition-colors hover:border-gold"
            >
              <Icon name="chevron-right" size={20} />
              <span className="sr-only">Image suivante</span>
            </button>
          </div>

          <p className="mx-auto max-w-[70ch] text-center text-[0.8125rem] leading-[1.6] text-white/70">
            {current.alt}
          </p>
        </div>
      ) : null}
    </>
  );
}
