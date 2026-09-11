/**
 * Primitives d'interface HAFIDHU.
 *
 * Chaque composant respecte les tokens du design system :
 * espacements multiples de 4, rayons 8/12/16, ombres discrètes,
 * zones tactiles d'au moins 44 px.
 */

import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}

/* ═══════════════════════════════════════════════════════════════════
   CONTENEUR & SECTION
   ═══════════════════════════════════════════════════════════════════ */

type ContainerWidth = 'site' | 'prose' | 'narrow';

const widthClass: Record<ContainerWidth, string> = {
  site: 'max-w-[1180px]',
  prose: 'max-w-[920px]',
  narrow: 'max-w-[860px]',
};

export function Container({
  children,
  width = 'site',
  className,
}: {
  children: ReactNode;
  width?: ContainerWidth;
  className?: string;
}) {
  return (
    <div className={cx('mx-auto w-full px-5 sm:px-6', widthClass[width], className)}>{children}</div>
  );
}

type SectionTone = 'ivory' | 'white' | 'navy';

const toneClass: Record<SectionTone, string> = {
  ivory: 'bg-ivory',
  white: 'bg-surface border-y border-border',
  navy: 'bg-navy',
};

export function Section({
  children,
  tone = 'ivory',
  className,
  id,
  spacing = 'normal',
}: {
  children: ReactNode;
  tone?: SectionTone;
  className?: string;
  id?: string;
  spacing?: 'normal' | 'tight' | 'loose';
}) {
  const pad =
    spacing === 'tight'
      ? 'py-10 sm:py-12 lg:py-14'
      : spacing === 'loose'
        ? 'py-14 sm:py-20 lg:py-24'
        : 'py-12 sm:py-16 lg:py-20';

  return (
    <section id={id} className={cx(toneClass[tone], pad, className)}>
      {children}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TITRES
   ═══════════════════════════════════════════════════════════════════ */

/** Sur-titre avec filet or — signature visuelle récurrente du site. */
export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-teal',
        className
      )}
    >
      <span aria-hidden="true" className="block h-px w-[22px] shrink-0 bg-gold" />
      {children}
    </span>
  );
}

export function SectionTitle({
  children,
  as: Tag = 'h2',
  className,
}: {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}) {
  const size =
    Tag === 'h1'
      ? 'text-[1.75rem] sm:text-[2.125rem] lg:text-[2.5rem] leading-[1.15]'
      : Tag === 'h2'
        ? 'text-[1.5rem] sm:text-[1.75rem] lg:text-[2rem] leading-[1.2]'
        : 'text-[1.25rem] sm:text-[1.375rem] leading-[1.3]';

  return <Tag className={cx('font-bold text-navy', size, className)}>{children}</Tag>;
}

export function Lead({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cx('text-[1.0625rem] leading-[1.7] text-muted', className)}>{children}</p>
  );
}

/** Séparateur or centré, utilisé avant les sections d'accroche. */
export function GoldRule({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cx('block h-0.5 w-10 bg-gold', className)} />;
}

/* ═══════════════════════════════════════════════════════════════════
   BOUTONS & LIENS D'ACTION
   ═══════════════════════════════════════════════════════════════════ */

type Variant = 'primary' | 'secondary' | 'ghost' | 'onDark' | 'onDarkOutline';

const variantClass: Record<Variant, string> = {
  primary:
    'bg-teal text-white border border-teal hover:bg-teal-hover hover:text-white active:bg-teal-hover',
  secondary:
    'bg-surface text-teal border border-teal hover:bg-surface-subtle hover:text-teal-hover',
  ghost: 'bg-transparent text-teal border border-transparent hover:bg-surface-subtle',
  onDark: 'bg-white text-teal border border-white hover:bg-surface-subtle hover:text-teal',
  onDarkOutline:
    'bg-transparent text-white border border-white/45 hover:border-gold hover:text-white',
};

const baseButton =
  'inline-flex items-center justify-center gap-2 rounded-[12px] px-5 min-h-[44px] ' +
  'text-[0.9375rem] font-semibold no-underline transition-colors duration-150 ' +
  'disabled:opacity-60 disabled:cursor-not-allowed';

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  className,
  icon,
  ...rest
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  icon?: IconName;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className'>) {
  const external = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');

  if (external) {
    return (
      <a
        href={href}
        className={cx(baseButton, variantClass[variant], className)}
        rel="noopener noreferrer"
        {...rest}
      >
        {children}
        {icon ? <Icon name={icon} size={18} /> : null}
      </a>
    );
  }

  return (
    <Link href={href} className={cx(baseButton, variantClass[variant], className)} {...rest}>
      {children}
      {icon ? <Icon name={icon} size={18} /> : null}
    </Link>
  );
}

export function Button({
  children,
  variant = 'primary',
  className,
  ...rest
}: { children: ReactNode; variant?: Variant; className?: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cx(baseButton, 'cursor-pointer', variantClass[variant], className)} {...rest}>
      {children}
    </button>
  );
}

/** Lien texte avec flèche — usage discret en fin de section. */
export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cx(
        'group inline-flex items-center gap-1.5 border-b border-teal/30 pb-0.5 text-[0.9375rem] ' +
          'font-semibold text-teal no-underline transition-colors hover:border-teal hover:text-teal-hover',
        className
      )}
    >
      {children}
      <Icon
        name="arrow-right"
        size={16}
        className="transition-transform duration-150 group-hover:translate-x-0.5"
      />
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CARTES
   ═══════════════════════════════════════════════════════════════════ */

export function Card({
  children,
  className,
  tone = 'white',
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  tone?: 'white' | 'ivory';
  interactive?: boolean;
}) {
  return (
    <div
      className={cx(
        'rounded-[16px] border border-border p-5 sm:p-6',
        tone === 'white' ? 'bg-surface' : 'bg-ivory',
        interactive && 'transition-colors duration-150 hover:border-teal',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cx('text-[1rem] font-semibold text-navy', className)}>{children}</p>;
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cx('text-[0.875rem] leading-[1.65] text-muted', className)}>{children}</p>;
}

/* ═══════════════════════════════════════════════════════════════════
   STATUTS
   L'information ne dépend jamais de la seule couleur :
   chaque statut associe une icône, un libellé et une couleur.
   ═══════════════════════════════════════════════════════════════════ */

export function StatusBadge({ state, label }: { state: 'ok' | 'wait' | 'late'; label: string }) {
  const config = {
    ok: { icon: 'check' as const, cls: 'text-success bg-success-bg' },
    late: { icon: 'alert' as const, cls: 'text-warning-text bg-warning-bg' },
    wait: { icon: 'clock' as const, cls: 'text-muted-strong bg-surface-subtle' },
  }[state];

  return (
    <span
      className={cx(
        'inline-flex shrink-0 items-center gap-1.5 rounded-[8px] px-2 py-1 text-[0.75rem] font-semibold',
        config.cls
      )}
    >
      <Icon name={config.icon} size={13} strokeWidth={2.25} />
      {label}
    </span>
  );
}

/** Marqueur « Aperçu » — obligatoire sur toute maquette d'interface. */
export function PreviewBadge({ className }: { className?: string }) {
  return (
    <span
      className={cx(
        'inline-flex shrink-0 items-center rounded-[8px] border border-border bg-surface px-2.5 py-1 ' +
          'text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-teal',
        className
      )}
    >
      Aperçu
    </span>
  );
}

/** Encadré d'avertissement honnête (information manquante, contenu de démonstration). */
export function NoticeBox({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cx(
        'flex items-start gap-2.5 rounded-[12px] border border-warning-border bg-warning-bg ' +
          'px-3.5 py-3 text-[0.8125rem] leading-[1.55] text-warning-text',
        className
      )}
    >
      <Icon name="alert" size={16} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}
