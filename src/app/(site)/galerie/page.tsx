import type { Metadata } from 'next';
import { altFor, galleryImages } from '@/content/images';
import { routes } from '@/content/navigation';
import { Gallery, type GalleryItem } from '@/components/gallery/Gallery';
import { Breadcrumb, FinalCta } from '@/components/sections/shared';
import { Container, Section, SectionTitle } from '@/components/ui/primitives';
import { breadcrumbJsonLd, JsonLd, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Galerie — Cérémonies et grands moments comoriens',
  description:
    'Une galerie de photographies documentant les cérémonies, le Grand Mariage et les grands moments collectifs comoriens — le contexte dans lequel HAFIDHU prend son sens.',
  path: routes.gallery,
});

/**
 * Catégorie retenue pour les images dont le dossier d'origine ne donne
 * pas d'indication. L'inspection du fonds montre qu'il documente
 * uniformément des cérémonies et grands moments comoriens : le libellé
 * décrit ce qui est visible, sans rien affirmer sur les personnes.
 */
const DEFAULT_CATEGORY = 'Cérémonies & grands moments';

const items: GalleryItem[] = galleryImages.map((image) => ({
  ...image,
  alt: altFor(image),
  displayCategory: image.category ?? DEFAULT_CATEGORY,
}));

export default function GalleryPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Accueil', path: '/' },
          { name: 'Galerie', path: routes.gallery },
        ])}
      />

      <Section spacing="tight" className="pb-0!">
        <Container>
          <Breadcrumb trail={[{ name: 'Galerie' }]} />

          <p className="mt-5">
            <span className="inline-flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-teal">
              <span aria-hidden="true" className="block h-px w-[22px] shrink-0 bg-gold" />
              Galerie
            </span>
          </p>

          <SectionTitle as="h1" className="mt-4">
            Les moments que HAFIDHU cherche à préserver.
          </SectionTitle>

          <p className="mt-5 max-w-[64ch] text-[1.0625rem] leading-[1.7] text-muted">
            Cérémonies, Grand Mariage, assemblées, parures : ces images montrent le contexte dans
            lequel s’organisent les contributions, les engagements et les participations. Elles
            rappellent ce que HAFIDHU cherche à soutenir — une organisation collective qui existe
            déjà, et qui mérite de laisser une trace.
          </p>

          <p className="mt-4 max-w-[64ch] text-[0.8125rem] leading-[1.6] text-muted">
            Aucune personne n’est identifiée et aucune information n’est attribuée aux personnes
            représentées. Les légendes décrivent uniquement le type de moment photographié.
          </p>
        </Container>
      </Section>

      <Section spacing="loose" className="pt-8! sm:pt-10!">
        <Container>
          <h2 className="sr-only">Photographies</h2>
          <Gallery items={items} />
        </Container>
      </Section>

      <FinalCta />
    </>
  );
}
