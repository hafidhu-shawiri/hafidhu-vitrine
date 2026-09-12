'use client';

/**
 * Accordéon FAQ.
 *
 * Le prototype posait aria-expanded mais ne reliait pas le bouton à sa
 * réponse. Ici, chaque bouton contrôle explicitement son panneau
 * (aria-controls / id) et le panneau référence son bouton.
 */

import { useId, useState } from 'react';
import type { FaqEntry } from '@/content/faq';
import { Icon } from '@/components/ui/Icon';
import { cx } from '@/components/ui/primitives';

export function FaqAccordion({ entries }: { entries: readonly FaqEntry[] }) {
  const baseId = useId();
  const [open, setOpen] = useState<Set<number>>(new Set());

  function toggle(index: number) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <div className="overflow-hidden rounded-[16px] border border-border bg-surface">
      {entries.map((entry, i) => {
        const isOpen = open.has(i);
        const buttonId = `${baseId}-q-${i}`;
        const panelId = `${baseId}-a-${i}`;

        return (
          <div
            key={entry.q}
            className={cx(i < entries.length - 1 && 'border-b border-surface-subtle')}
          >
            <h3 className="m-0">
              <button
                id={buttonId}
                type="button"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent px-5 py-4 text-left text-[0.9375rem] font-semibold text-navy transition-colors duration-200 hover:bg-ivory sm:px-6 sm:py-5 sm:text-[1rem]"
              >
                <span>{entry.q}</span>
                <Icon
                  name="chevron-down"
                  size={18}
                  className={cx(
                    'shrink-0 text-teal transition-transform duration-300 ease-out',
                    isOpen && 'rotate-180'
                  )}
                />
              </button>
            </h3>

            {/*
              Le panneau reste dans le DOM et sa hauteur est animée par la
              grille (0fr → 1fr) : c'est le seul moyen d'ouvrir en douceur
              une hauteur inconnue, sans mesurer le contenu en JavaScript.

              « inert » retire le panneau fermé du parcours clavier et de
              la restitution vocale — indispensable puisqu'il n'est plus
              démonté.
            */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!isOpen}
              className={cx(
                'grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none',
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-[0.9375rem] leading-[1.7] text-muted sm:px-6 sm:pb-6">
                  {entry.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
