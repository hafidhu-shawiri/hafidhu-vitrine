/**
 * Sections partagées entre plusieurs pages.
 */

import Link from 'next/link';
import { modules } from '@/content/modules';
import { primaryCta, routes } from '@/content/navigation';
import { finalCta } from '@/content/home';
import { Icon } from '@/components/ui/Icon';
import {
  ArrowLink,
  ButtonLink,
  Card,
  CardBody,
  CardTitle,
  Container,
  GoldRule,
  Section,
  SectionTitle,
  cx,
} from '@/components/ui/primitives';

/* ═══════════════════════════════════════════════════════════════════
   FIL D'ARIANE
   Le prototype utilisait de simples <p> avec des « / ».
   Ici : <nav> + <ol>, correctement annoncé.
   ═══════════════════════════════════════════════════════════════════ */

export function Breadcrumb({ trail }: { trail: readonly { name: string; path?: string }[] }) {
  return (
    <nav aria-label="Fil d'Ariane">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8125rem] text-muted">
        <li>
          <Link href={routes.home} className="no-underline hover:underline">
            Accueil
          </Link>
        </li>
        {trail.map((item, i) => (
          <li key={item.name} className="flex items-center gap-2">
            <span aria-hidden="true" className="text-border-strong">
              /
            </span>
            {item.path && i < trail.length - 1 ? (
              <Link href={item.path} className="no-underline hover:underline">
                {item.name}
              </Link>
            ) : (
              <span aria-current="page" className="text-muted-strong">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CARTE MODULE
   ═══════════════════════════════════════════════════════════════════ */

export function ModuleCard({
  module,
  showExample = false,
}: {
  module: (typeof modules)[number];
  showExample?: boolean;
}) {
  return (
    <Card interactive className="flex flex-col">
      <span
        aria-hidden="true"
        className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-surface-subtle text-teal"
      >
        <Icon name={module.icon} size={21} />
      </span>

      <h3 className="mt-4 text-[1.125rem] font-semibold text-navy">{module.name}</h3>
      <p className="mt-1 text-[0.8125rem] font-medium text-teal">{module.tag}</p>
      <p className="mt-3 text-[0.875rem] leading-[1.65] text-muted">{module.card}</p>

      {showExample ? (
        <p className="mt-3.5 text-[0.8125rem] leading-[1.6] text-ink">
          <span className="font-semibold">Exemple.</span> {module.example}
        </p>
      ) : (
        <p className="mt-3.5 border-l-2 border-gold pl-3 text-[0.8125rem] leading-[1.55] text-ink">
          {module.benefit}
        </p>
      )}

      <div className="mt-auto pt-5">
        <ArrowLink href={`${routes.solutions}/${module.slug}`}>
          Découvrir <span className="sr-only">{module.name}</span>
        </ArrowLink>
      </div>
    </Card>
  );
}

export function ModuleGrid({ showExample = false }: { showExample?: boolean }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {modules.map((m) => (
        <li key={m.slug} className="flex">
          <ModuleCard module={m} showExample={showExample} />
        </li>
      ))}
    </ul>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CHAÎNE CONCEPTUELLE
   Personne → Groupe → Événement → Contribution → Statut → Historique
   ═══════════════════════════════════════════════════════════════════ */

export function ChainDiagram({ items }: { items: readonly string[] }) {
  return (
    <div className="rounded-[16px] border border-border bg-surface p-4 sm:p-5">
      <ol className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
        {items.map((label, i) => (
          <li key={label} className="flex items-center gap-2.5">
            <span className="rounded-[999px] border border-border bg-ivory px-3.5 py-1.5 text-[0.8125rem] font-semibold text-navy sm:text-[0.875rem]">
              {label}
            </span>
            {i < items.length - 1 ? (
              <Icon name="arrow-right" size={14} className="text-gold" aria-hidden="true" />
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ÉTAPES NUMÉROTÉES
   ═══════════════════════════════════════════════════════════════════ */

export function StepList({
  items,
  className,
}: {
  items: readonly { title: string; body: string }[];
  className?: string;
}) {
  return (
    <ol className={cx('flex flex-col', className)}>
      {items.map((step, i) => (
        <li key={step.title} className="flex gap-4">
          <div className="flex shrink-0 flex-col items-center">
            <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-navy text-[0.875rem] font-semibold text-white">
              {i + 1}
            </span>
            {i < items.length - 1 ? (
              <span aria-hidden="true" className="my-1.5 w-px flex-1 bg-border" />
            ) : null}
          </div>
          <div className={cx(i < items.length - 1 && 'pb-6')}>
            <h3 className="text-[1.0625rem] font-semibold text-navy">{step.title}</h3>
            <p className="mt-1.5 max-w-[60ch] text-[0.9375rem] leading-[1.7] text-muted">
              {step.body}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CARTES SIMPLES
   ═══════════════════════════════════════════════════════════════════ */

export function SimpleCardGrid({
  items,
  tone = 'white',
  columns = 3,
}: {
  items: readonly { title: string; body: string }[];
  tone?: 'white' | 'ivory';
  columns?: 2 | 3;
}) {
  return (
    <ul
      className={cx(
        'grid gap-4',
        columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'
      )}
    >
      {items.map((item) => (
        <li key={item.title}>
          <Card tone={tone} className="h-full">
            <CardTitle>{item.title}</CardTitle>
            <CardBody className="mt-2">{item.body}</CardBody>
          </Card>
        </li>
      ))}
    </ul>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   APPEL À L'ACTION FINAL
   Bleu nuit, filet or, présent sur toutes les pages publiques.
   ═══════════════════════════════════════════════════════════════════ */

export function FinalCta() {
  return (
    <Section tone="navy" spacing="loose">
      <Container width="narrow" className="text-center">
        <GoldRule className="mx-auto mb-6" />
        <h2 className="text-[1.5rem] font-bold leading-[1.25] text-white sm:text-[1.875rem] lg:text-[2.125rem]">
          {finalCta.title}
          <br />
          {finalCta.subtitle}
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href={primaryCta.href} variant="onDark">
            Rejoindre HAFIDHU
          </ButtonLink>
          <ButtonLink href={routes.contact} variant="onDarkOutline">
            Nous écrire
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   BANDEAU D'ACTION EN FIN DE PAGE ÉDITORIALE
   ═══════════════════════════════════════════════════════════════════ */

export function InlineCta({ text }: { text: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-[16px] border border-border bg-surface p-5 sm:p-6">
      <p className="text-[1rem] font-semibold text-navy">{text}</p>
      <ButtonLink href={primaryCta.href}>{primaryCta.label}</ButtonLink>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   EN-TÊTE DE PAGE (hero typographique)
   ═══════════════════════════════════════════════════════════════════ */

export function PageHeader({
  crumb,
  kicker,
  title,
  lead,
  children,
}: {
  crumb: readonly { name: string; path?: string }[];
  kicker: string;
  title: string;
  lead: string;
  children?: React.ReactNode;
}) {
  return (
    <Section spacing="tight" className="pb-0!">
      <Container width="prose">
        <Breadcrumb trail={crumb} />
        <p className="mt-5">
          <span className="inline-flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-teal">
            <span aria-hidden="true" className="block h-px w-[22px] shrink-0 bg-gold" />
            {kicker}
          </span>
        </p>
        <SectionTitle as="h1" className="mt-4">
          {title}
        </SectionTitle>
        <p className="mt-5 max-w-[64ch] text-[1.0625rem] leading-[1.7] text-muted">{lead}</p>
        {children}
      </Container>
    </Section>
  );
}
