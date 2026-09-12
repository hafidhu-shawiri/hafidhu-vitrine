/**
 * Aperçu d'interface.
 *
 * Ces maquettes illustrent une intention produit. HAFIDHU étant en
 * construction, elles sont TOUJOURS accompagnées d'un marqueur « Aperçu »
 * et d'une mention rappelant que les données sont illustratives.
 * Aucune ne doit pouvoir être prise pour une fonctionnalité livrée.
 */

import type { PreviewRow } from '@/content/modules';
import { Reveal } from '@/components/motion/Reveal';
import { stagger } from '@/components/motion/stagger';
import { PreviewBadge, StatusBadge, cx } from '@/components/ui/primitives';

export function ProductPreview({
  title,
  sub,
  rows,
  stats,
  note = "Exemple d'interface — données illustratives.",
  tone = 'white',
  className,
}: {
  title: string;
  sub: string;
  rows: readonly PreviewRow[];
  stats?: readonly { label: string; value: string }[];
  note?: string;
  tone?: 'white' | 'ivory';
  className?: string;
}) {
  return (
    <figure
      className={cx(
        'm-0 rounded-[16px] border border-border p-4 sm:p-5',
        tone === 'white' ? 'bg-surface shadow-[0_18px_40px_rgba(16,42,67,0.07)]' : 'bg-ivory',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 border-b border-surface-subtle pb-3.5">
        <div className="min-w-0">
          <p className="truncate text-[0.9375rem] font-semibold text-navy">{title}</p>
          <p className="mt-0.5 text-[0.8125rem] text-muted">{sub}</p>
        </div>
        <PreviewBadge />
      </div>

      {/*
        La maquette se compose ligne à ligne plutôt que d'apparaître d'un
        bloc : c'est le seul endroit du site où l'animation raconte
        quelque chose — l'information se pose, elle ne surgit pas.
      */}
      {stats ? (
        <ul className="grid grid-cols-3 gap-2.5 border-b border-surface-subtle py-3.5">
          {stats.map((s, i) => (
            <Reveal
              as="li"
              key={s.label}
              variant="fade"
              delay={stagger(i, 90, 270)}
              className="rounded-[8px] bg-ivory px-3 py-2.5"
            >
              <span className="block text-[0.75rem] text-muted">{s.label}</span>
              <span className="mt-1 block text-[1.0625rem] font-semibold text-ink">{s.value}</span>
            </Reveal>
          ))}
        </ul>
      ) : null}

      <ul className={cx(stats ? 'pt-1' : 'pt-2')}>
        {rows.map((row, i) => (
          <Reveal
            as="li"
            key={`${row.label}-${i}`}
            delay={(stats ? 240 : 60) + stagger(i, 85, 425)}
            className={cx(
              'flex items-center justify-between gap-3 py-3',
              i < rows.length - 1 && 'border-b border-surface-subtle'
            )}
          >
            <div className="min-w-0">
              <p className="truncate text-[0.875rem] font-medium text-ink">{row.label}</p>
              <p className="mt-0.5 text-[0.75rem] text-muted">{row.meta}</p>
            </div>
            <StatusBadge state={row.state} label={row.tag} />
          </Reveal>
        ))}
      </ul>

      <figcaption className="mt-3 text-[0.75rem] text-muted">{note}</figcaption>
    </figure>
  );
}
