import Image from 'next/image';
import type { Metadata } from 'next';
import {
  coBuildSection,
  diasporaSection,
  ecosystemSection,
  hero,
  homePreview,
  problemSection,
  stepsSection,
  traditionSection,
  trustSection,
  valueSection,
} from '@/content/home';
import { faqHome, faq } from '@/content/faq';
import { heroImages, keyImages } from '@/content/images';
import { primaryCta, routes } from '@/content/navigation';
import { FaqAccordion } from '@/components/sections/FaqAccordion';
import { ProductPreview } from '@/components/sections/ProductPreview';
import { FinalCta, ModuleGrid } from '@/components/sections/shared';
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
} from '@/components/ui/primitives';
import { Icon } from '@/components/ui/Icon';
import { faqJsonLd, JsonLd, pageMetadata } from '@/lib/seo';
import { site } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  path: '/',
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faq)} />

      {/* ═══ HERO ═══════════════════════════════════════════════ */}
      <Section spacing="loose" className="pb-10! sm:pb-14!">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div>
              <p>
                <span className="inline-flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-teal">
                  <span aria-hidden="true" className="block h-px w-[22px] shrink-0 bg-gold" />
                  {hero.kicker}
                </span>
              </p>

              <h1 className="mt-5 text-[1.875rem] font-bold leading-[1.14] tracking-[-0.02em] text-navy sm:text-[2.375rem] lg:text-[2.75rem]">
                {hero.title}
              </h1>

              <p className="mt-5 max-w-[52ch] text-[1.0625rem] leading-[1.65] text-muted sm:text-[1.125rem]">
                {hero.lead}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href={primaryCta.href}>{primaryCta.label}</ButtonLink>
                <ButtonLink href={routes.solutions} variant="secondary">
                  Découvrir HAFIDHU
                </ButtonLink>
              </div>

              <p className="mt-7 inline-flex items-center gap-2.5 rounded-[999px] border border-border bg-surface px-3.5 py-2 text-[0.8125rem] text-muted-strong">
                <span aria-hidden="true" className="h-[7px] w-[7px] shrink-0 rounded-full bg-gold" />
                {hero.statusNote}
              </p>
            </div>

            {/* L'image de Zone Hero est en portrait. Sur grand écran, sa
                hauteur naturelle déséquilibrerait le hero : elle est donc
                plafonnée, le cadrage restant centré sur les visages.
                Sur mobile, elle est affichée dans ses proportions natives. */}
            <figure className="m-0 min-w-0">
              <div className="relative overflow-hidden rounded-[16px] border border-border bg-surface-subtle">
                <Image
                  src={heroImages.couple.src}
                  alt={heroImages.couple.alt}
                  width={heroImages.couple.width}
                  height={heroImages.couple.height}
                  placeholder="blur"
                  blurDataURL={heroImages.couple.blurDataURL}
                  priority
                  sizes="(max-width: 1023px) 100vw, 46vw"
                  className="h-auto w-full object-cover object-[center_22%] sm:max-h-[520px] lg:max-h-[560px]"
                />
              </div>
              <figcaption className="mt-2.5 text-[0.75rem] text-muted">
                Grand Mariage comorien — les grands moments qui mobilisent familles et communautés.
              </figcaption>
            </figure>
          </div>
        </Container>
      </Section>

      {/* ═══ PROBLÈME ═══════════════════════════════════════════ */}
      <Section tone="white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-start lg:gap-14">
            <div>
              <SectionTitle>{problemSection.title}</SectionTitle>
              <p className="mt-4 max-w-[62ch] text-[1.0625rem] leading-[1.65] text-muted">
                {problemSection.lead}
              </p>
            </div>
            <figure className="m-0 min-w-0">
              <div className="overflow-hidden rounded-[16px] border border-border">
                <Image
                  src={keyImages.mafunvu.src}
                  alt={keyImages.mafunvu.alt}
                  width={keyImages.mafunvu.width}
                  height={keyImages.mafunvu.height}
                  placeholder="blur"
                  blurDataURL={keyImages.mafunvu.blurDataURL}
                  sizes="(max-width: 1023px) 100vw, 38vw"
                  className="h-auto w-full"
                />
              </div>
              <figcaption className="mt-2.5 text-[0.75rem] text-muted">
                Le carnet, la table, les enveloppes : l’organisation existe déjà.
              </figcaption>
            </figure>
          </div>

          <ul className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {problemSection.items.map((item) => (
              <li key={item.title}>
                <Card tone="ivory" className="h-full">
                  <CardTitle>{item.title}</CardTitle>
                  <CardBody className="mt-2">{item.body}</CardBody>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ═══ PROPOSITION DE VALEUR ══════════════════════════════ */}
      <Section spacing="loose">
        <Container width="narrow" className="text-center">
          <GoldRule className="mx-auto mb-6" />
          <SectionTitle className="leading-[1.3]">{valueSection.title}</SectionTitle>
          <p className="mt-5 text-[1.0625rem] leading-[1.7] text-muted">{valueSection.body}</p>
        </Container>
      </Section>

      {/* ═══ APERÇU PRODUIT ════════════════════════════════════ */}
      <Section tone="white" id="apercu">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <div>
              <SectionTitle>Ce que HAFIDHU rend lisible.</SectionTitle>
              <p className="mt-4 max-w-[52ch] text-[1rem] leading-[1.7] text-muted">
                Un groupe, ses membres, une échéance. Ce qui a été reçu, ce qui reste attendu, ce qui
                est en retard : l’information est écrite au même endroit et lisible par ceux qui
                doivent la voir.
              </p>
              <p className="mt-4 max-w-[52ch] text-[1rem] leading-[1.7] text-muted">
                Chaque statut associe un libellé explicite à une couleur — jamais une couleur seule.
              </p>
              <div className="mt-7">
                <ArrowLink href={`${routes.solutions}/mtsango`}>Découvrir Mtsango</ArrowLink>
              </div>
            </div>

            <div className="min-w-0">
              <ProductPreview
                title={homePreview.title}
                sub={homePreview.sub}
                rows={homePreview.rows}
                stats={homePreview.stats}
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* ═══ ÉCOSYSTÈME ════════════════════════════════════════ */}
      <Section spacing="loose" id="solutions">
        <Container>
          <SectionTitle>{ecosystemSection.title}</SectionTitle>
          <p className="mt-3 max-w-[58ch] text-[1rem] text-muted">{ecosystemSection.lead}</p>
          <div className="mt-8">
            <ModuleGrid />
          </div>
        </Container>
      </Section>

      {/* ═══ TRADITION + TECHNOLOGIE ═══════════════════════════ */}
      <Section tone="white">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <SectionTitle>{traditionSection.title}</SectionTitle>
              {traditionSection.paragraphs.map((p) => (
                <p key={p} className="mt-4 text-[1rem] leading-[1.7] text-muted">
                  {p}
                </p>
              ))}
              <div className="mt-7">
                <ArrowLink href={routes.vision}>Notre vision</ArrowLink>
              </div>
            </div>

            <figure className="m-0 min-w-0">
              <div className="overflow-hidden rounded-[16px] border border-border">
                <Image
                  src={keyImages.famille.src}
                  alt={keyImages.famille.alt}
                  width={keyImages.famille.width}
                  height={keyImages.famille.height}
                  placeholder="blur"
                  blurDataURL={keyImages.famille.blurDataURL}
                  sizes="(max-width: 1023px) 100vw, 46vw"
                  className="h-auto w-full"
                />
              </div>
            </figure>
          </div>
        </Container>
      </Section>

      {/* ═══ DIASPORA ══════════════════════════════════════════ */}
      <Section spacing="loose">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <SectionTitle>{diasporaSection.title}</SectionTitle>
              {diasporaSection.paragraphs.map((p) => (
                <p key={p} className="mt-4 text-[1rem] leading-[1.7] text-muted">
                  {p}
                </p>
              ))}
              <div className="mt-7">
                <ArrowLink href={`${routes.solutions}/diaspora`}>Diaspora</ArrowLink>
              </div>
            </div>

            <div className="min-w-0">
              <figure className="m-0 overflow-hidden rounded-[16px] border border-border">
                <Image
                  src={keyImages.diaspora.src}
                  alt={keyImages.diaspora.alt}
                  width={keyImages.diaspora.width}
                  height={keyImages.diaspora.height}
                  placeholder="blur"
                  blurDataURL={keyImages.diaspora.blurDataURL}
                  sizes="(max-width: 1023px) 100vw, 46vw"
                  className="h-auto w-full"
                />
              </figure>

              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {diasporaSection.steps.map((step) => (
                  <li
                    key={step.title}
                    className="rounded-[12px] border border-border bg-surface p-4"
                  >
                    <p className="flex items-start gap-2 text-[0.9375rem] font-semibold text-navy">
                      <Icon name="check" size={16} className="mt-0.5 shrink-0 text-teal" />
                      {step.title}
                    </p>
                    <p className="mt-1.5 text-[0.8125rem] leading-[1.6] text-muted">{step.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* ═══ CONFIANCE ═════════════════════════════════════════ */}
      <Section tone="white">
        <Container>
          <SectionTitle>{trustSection.title}</SectionTitle>
          <p className="mt-3 max-w-[62ch] text-[1rem] text-muted">{trustSection.lead}</p>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trustSection.items.map((item) => (
              <li key={item.title}>
                <Card tone="ivory" className="h-full">
                  <CardTitle>{item.title}</CardTitle>
                  <CardBody className="mt-2">{item.body}</CardBody>
                </Card>
              </li>
            ))}
          </ul>

          <p className="mt-6 flex flex-wrap items-center gap-2 text-[0.8125rem] text-muted">
            <Icon name="shield" size={16} className="text-teal" />
            {trustSection.disclaimer}
            <ArrowLink href={routes.security} className="text-[0.8125rem]">
              Voir nos principes de sécurité
            </ArrowLink>
          </p>
        </Container>
      </Section>

      {/* ═══ COMMENT ÇA MARCHE ═════════════════════════════════ */}
      <Section spacing="loose">
        <Container>
          <SectionTitle>{stepsSection.title}</SectionTitle>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stepsSection.items.map((step) => (
              <li key={step.n}>
                <Card className="h-full">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] bg-navy text-[0.9375rem] font-semibold text-white">
                    {step.n}
                  </span>
                  <CardTitle className="mt-4">{step.title}</CardTitle>
                  <CardBody className="mt-2">{step.body}</CardBody>
                </Card>
              </li>
            ))}
          </ul>
          <div className="mt-7">
            <ArrowLink href={routes.howItWorks}>Voir le parcours complet</ArrowLink>
          </div>
        </Container>
      </Section>

      {/* ═══ CO-CONSTRUCTION ═══════════════════════════════════ */}
      <Section tone="white" spacing="tight">
        <Container>
          <div className="grid items-center gap-8 rounded-[16px] border border-border bg-ivory p-6 sm:p-9 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <SectionTitle as="h2">{coBuildSection.title}</SectionTitle>
              <p className="mt-4 text-[1rem] leading-[1.7] text-muted">{coBuildSection.body}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={primaryCta.href}>{primaryCta.label}</ButtonLink>
              <ButtonLink href={routes.contact} variant="secondary">
                Participer à la validation
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>

      {/* ═══ FAQ ═══════════════════════════════════════════════ */}
      <Section spacing="loose">
        <Container width="narrow">
          <SectionTitle>Questions fréquentes</SectionTitle>
          <div className="mt-7">
            <FaqAccordion entries={faqHome} />
          </div>
          <div className="mt-6">
            <ArrowLink href={routes.faq}>Voir toutes les questions</ArrowLink>
          </div>
        </Container>
      </Section>

      <FinalCta />
    </>
  );
}
