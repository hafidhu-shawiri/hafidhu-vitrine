'use client';

/**
 * Apparition au défilement.
 *
 * Un seul IntersectionObserver est partagé par toute la page : ouvrir un
 * observateur par carte serait coûteux sur la galerie, qui en compte
 * plusieurs dizaines.
 *
 * Trois garanties tenues ici :
 *   • l'élément n'est observé qu'une fois — l'animation ne rejoue jamais
 *     au défilement inverse, le site ne « clignote » pas ;
 *   • si IntersectionObserver n'existe pas, le contenu s'affiche
 *     immédiatement plutôt que de rester masqué ;
 *   • l'état masqué lui-même est posé par la feuille de style sous
 *     « @media (scripting: enabled) » : sans JavaScript, aucun contenu
 *     n'est caché.
 */

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { cx } from '@/components/ui/primitives';

type RevealTag = 'div' | 'li' | 'section' | 'article' | 'figure' | 'span' | 'ul' | 'ol';

type RevealProps = {
  children: ReactNode;
  /** Décalage d'entrée, en millisecondes. Sert aux apparitions séquentielles. */
  delay?: number;
  /** « rise » monte de 16 px, « fade » se contente de l'opacité. */
  variant?: 'rise' | 'fade' | 'left' | 'right';
  as?: RevealTag;
  className?: string;
};

const callbacks = new WeakMap<Element, () => void>();
let shared: IntersectionObserver | null = null;

function observer(): IntersectionObserver | null {
  if (typeof IntersectionObserver === 'undefined') return null;

  shared ??= new IntersectionObserver(
    (entries, io) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        callbacks.get(entry.target)?.();
        callbacks.delete(entry.target);
        io.unobserve(entry.target);
      }
    },
    {
      /*
       * Deux réglages choisis pour qu'AUCUN élément ne puisse rester
       * masqué — le seul vrai risque d'une apparition au défilement.
       *
       * threshold: 0 — le déclenchement suit le premier pixel visible,
       *   jamais une fraction de l'élément. Un seuil de 8 % laisserait
       *   un bloc très haut (une page juridique, la galerie) sous la
       *   barre : 8 % de sa hauteur peut dépasser celle de l'écran, et
       *   il ne se révélerait jamais.
       *
       * rootMargin en PIXELS, pas en pourcentage — une marge de -10 %
       *   crée une zone morte proportionnelle en bas de page : un
       *   élément qui n'y entre jamais assez haut reste invisible. 32 px
       *   suffisent à éviter un déclenchement trop précoce, sans créer
       *   de zone où un contenu pourrait se perdre.
       */
      rootMargin: '0px 0px -32px 0px',
      threshold: 0,
    }
  );

  return shared;
}

export function Reveal({
  children,
  delay = 0,
  variant = 'rise',
  as: Tag = 'div',
  className,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const io = observer();
    if (!io) {
      setVisible(true);
      return;
    }

    callbacks.set(node, () => setVisible(true));
    io.observe(node);

    return () => {
      callbacks.delete(node);
      io.unobserve(node);
    };
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={cx('hfd-reveal', `hfd-reveal--${variant}`, visible && 'is-visible', className)}
      style={delay ? ({ '--hfd-delay': `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
