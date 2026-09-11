import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getModule, modules } from '@/content/modules';
import { primaryCta, routes } from '@/content/navigation';
import { altFor, heroImages, keyImages, themeImages, type ManagedImage } from '@/content/images';
import { ProductPreview } from '@/components/sections/ProductPreview';
import { Breadcrumb, FinalCta } from '@/components/sections/shared';
import {
  ButtonLink,
  Card,
  CardBody,
  CardTitle,
  Container,
  Section,
  SectionTitle,
} from '@/components/ui/primitives';
import { Icon } from '@/components/ui/Icon';
import { breadcrumbJsonLd, JsonLd, pageMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return modules.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const mod = getModule(slug);
  if (!mod) return {};

  return pageMetadata({
    title: mod.seo.title,
    description: mod.seo.description,
    path: `${routes.solutions}/${mod.slug}`,
  });
}

/**
 * Affectation des visuels par module.
 *
 * « Zone Hero » ne contient que deux images. Seul Anda reçoit une image
 * de hero — les parures d'or y sont un élément central du Grand Mariage.
 * Les autres modules s'appuient sur leur aperçu produit, et sur les
 * images thématiques en section lorsqu'elles sont pertinentes.
 */
type Visuals = {
  hero?: { src: string; width: number; height: number; blurDataURL: string; alt: string };
  heroCaption?: string;
  section?: { src: string; width: number; height: number; blurDataURL: string; alt: string };
  strip?: ManagedImage[];
  stripTitle?: string;
};

function visualsFor(slug: string): Visuals {
  switch (slug) {
    case 'anda':
      return {
        hero: heroImages.parures,
        heroCaption:
          'Parures de cérémonie — les engagements du Grand Mariage se préparent longtemps à l’avance.',
        strip: [...themeImages.ceremonies.slice(0, 2), ...themeImages.mariees.slice(0, 1), ...themeImages.mari.slice(0, 1)],
        stripTitle: 'Les moments que Anda accompagne',
      };
    case 'mafunvu':
      return { section: keyImages.mafunvu };
    case 'diaspora':
      return { section: keyImages.diaspora };
    case 'mtsango':
      return { section: keyImages.famille };
    case 'historique-memoire-familiale':
      return {
        strip: [...themeImages.accessoires.slice(0, 2), ...themeImages.notables.slice(0, 2)],
        stripTitle: 'Ce que l’on transmet',
      };
    default:
      return {};
  }
}

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mod = getModule(slug);
  if (!mod) notFound();

  const visuals = visualsFor(slug);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Accueil', path: '/' },
          { name: 'Solutions', path: routes.solutions },
          { name: mod.name, path: `${routes.solutions}/${mod.slug}` },
        ])}
      />

      {/* ═══ HERO ═══════════════════════════════════════════════ */}
      <Section tone="white" spacing="tight">
        <Container>
          <Breadcrumb
            trail={[{ name: 'Solutions', path: routes.solutions }, { name: mod.name }]}
          />

          <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_0.92fr] lg:gap-14">
            <div>
              <p>
                <span className="inline-flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-teal">
                  <span aria-hidden="true" className="block h-px w-[22px] shrink-0 bg-gold" />
                  {mod.tag}
                </span>
              </p>

              <SectionTitle as="h1" className="mt-4">
                {mod.title}
              </SectionTitle>

              <p className="mt-5 max-w-[56ch] text-[1.0625rem] leading-[1.7] text-muted">
                {mod.lead}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink href={primaryCta.href}>{primaryCta.label}</ButtonLink>
                <ButtonLink href={routes.solutions} variant="secondary">
                  Tous les modules
                </ButtonLink>
              </div>
            </div>

            <div className="min-w-0">
              {visuals.hero ? (
                <figure className="m-0">
                  <div className="overflow-hidden rounded-[16px] border border-border">
                    <Image
                      src={visuals.hero.src}
                      alt={visuals.hero.alt}
                      width={visuals.hero.width}
                      height={visuals.hero.height}
                      placeholder="blur"
                      blurDataURL={visuals.hero.blurDataURL}
                      priority
                      sizes="(max-width: 1023px) 100vw, 44vw"
                      className="h-auto w-full"
                    />
                  </div>
                  {visuals.heroCaption ? (
                    <figcaption className="mt-2.5 text-[0.75rem] text-muted">
                      {visuals.heroCaption}
                    </figcaption>
                  ) : null}
                </figure>
              ) : (
                <ProductPreview
                  title={mod.preview.title}
                  sub={mod.preview.sub}
                  rows={mod.preview.rows}
                  tone="ivory"
                  note="Exemple d’interface — fonctionnalité en cours de construction."
                />
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* ═══ PROBLÈME / MÉCANISME ══════════════════════════════ */}
      <Section spacing="loose">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
            <div>
              <SectionTitle as="h2" className="text-[1.3125rem]! sm:text-[1.5rem]!">
                Le problème
              </SectionTitle>
              <ul className="mt-5 flex flex-col gap-3">
                {mod.problem.map((p) => (
                  <li
                    key={p}
                    className="border-l-2 border-border pl-4 text-[0.9375rem] leading-[1.65] text-muted"
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <SectionTitle as="h2" className="text-[1.3125rem]! sm:text-[1.5rem]!">
                Ce que HAFIDHU permet d’imaginer
              </SectionTitle>
              <ul className="mt-5 flex flex-col gap-3.5">
                {mod.how.map((h) => (
                  <li key={h.title}>
                    <Card className="p-4! sm:p-5!">
                      <CardTitle className="text-[0.9375rem]!">{h.title}</CardTitle>
                      <CardBody className="mt-1.5">{h.body}</CardBody>
                    </Card>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* ═══ ILLUSTRATION + APERÇU ═════════════════════════════ */}
      {(visuals.section || visuals.hero) && (
        <Section tone="white">
          <Container>
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              {visuals.section ? (
                <figure className="m-0 min-w-0 overflow-hidden rounded-[16px] border border-border">
                  <Image
                    src={visuals.section.src}
                    alt={visuals.section.alt}
                    width={visuals.section.width}
                    height={visuals.section.height}
                    placeholder="blur"
                    blurDataURL={visuals.section.blurDataURL}
                    sizes="(max-width: 1023px) 100vw, 46vw"
                    className="h-auto w-full"
                  />
                </figure>
              ) : null}

              <div className="min-w-0">
                <ProductPreview
                  title={mod.preview.title}
                  sub={mod.preview.sub}
                  rows={mod.preview.rows}
                  tone="ivory"
                  note="Exemple d’interface — fonctionnalité en cours de construction."
                />
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* ═══ BÉNÉFICES ═════════════════════════════════════════ */}
      <Section spacing="loose">
        <Container>
          <SectionTitle as="h2" className="text-[1.3125rem]! sm:text-[1.5rem]!">
            Bénéfices attendus
          </SectionTitle>

          <ul className="mt-6 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {mod.benefits.map((b) => (
              <li key={b}>
                <Card className="h-full">
                  <span aria-hidden="true" className="mb-3.5 block h-0.5 w-6 bg-gold" />
                  <p className="text-[0.9375rem] leading-[1.6] text-ink">{b}</p>
                </Card>
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-[16px] border border-border bg-surface p-5 sm:p-6">
            <p className="flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-muted">
              <Icon name={mod.icon} size={16} className="text-teal" />
              Exemple d’usage
            </p>
            <p className="mt-3 max-w-[70ch] text-[1rem] leading-[1.7] text-ink">{mod.example}</p>
          </div>
        </Container>
      </Section>

      {/* ═══ BANDEAU D'IMAGES ══════════════════════════════════ */}
      {visuals.strip && visuals.strip.length > 0 && (
        <Section tone="white">
          <Container>
            <SectionTitle as="h2" className="text-[1.3125rem]! sm:text-[1.5rem]!">
              {visuals.stripTitle}
            </SectionTitle>
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {visuals.strip.map((img) => (
                <li key={img.id} className="overflow-hidden rounded-[12px] border border-border">
                  <Image
                    src={img.src}
                    alt={altFor(img)}
                    width={img.width}
                    height={img.height}
                    placeholder="blur"
                    blurDataURL={img.blurDataURL}
                    sizes="(max-width: 639px) 50vw, (max-width: 1023px) 50vw, 24vw"
                    className="aspect-[3/4] w-full object-cover"
                  />
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[0.75rem] text-muted">
              Photographies documentant des cérémonies comoriennes.{' '}
              <a href={routes.gallery} className="font-semibold no-underline hover:underline">
                Voir la galerie
              </a>
            </p>
          </Container>
        </Section>
      )}

      <FinalCta />
    </>
  );
}
